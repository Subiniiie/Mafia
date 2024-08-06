package e106.emissary_backend.domain.game.service;

import e106.emissary_backend.domain.game.GameConstant;
import e106.emissary_backend.domain.game.aspect.RedissonLock;
import e106.emissary_backend.domain.game.entity.Game;
import e106.emissary_backend.domain.game.enumType.CommonResult;
import e106.emissary_backend.domain.game.enumType.GameRole;
import e106.emissary_backend.domain.game.enumType.GameState;
import e106.emissary_backend.domain.game.model.GameDTO;
import e106.emissary_backend.domain.game.model.GameResponseDTO;
import e106.emissary_backend.domain.game.model.Player;
import e106.emissary_backend.domain.game.repository.RedisGameRepository;
import e106.emissary_backend.domain.game.service.publisher.RedisPublisher;
import e106.emissary_backend.domain.game.service.subscriber.message.*;
import e106.emissary_backend.domain.game.service.timer.SchedulerService;
import e106.emissary_backend.domain.game.service.timer.task.*;
import e106.emissary_backend.domain.game.util.RoleUtils;
import e106.emissary_backend.domain.room.entity.Room;
import e106.emissary_backend.domain.room.enumType.RoomState;
import e106.emissary_backend.domain.room.repository.RoomRepository;
import e106.emissary_backend.global.error.CommonErrorCode;
import e106.emissary_backend.global.error.exception.*;
import io.jsonwebtoken.lang.Objects;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisKeyValueTemplate;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.listener.ChannelTopic;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;


@Slf4j
@Service
@RequiredArgsConstructor
public class GameService {

    private final RedisGameRepository redisGameRepository;
    private final RoomRepository roomRepository;
    private final RedisTemplate<String, HashMap<Long, Integer>> voteRedisTemplate;
    private final RedisKeyValueTemplate redisKeyValueTemplate;
    private final SchedulerService scheduler;

    private final RedisPublisher publisher;
    private final ChannelTopic readyTopic;
    private final ChannelTopic readyCompleteTopic;
    private final ChannelTopic dayTopic;
    private final ChannelTopic startVoteTopic;
    private final StartVoteTask startVoteTask;
    private final ChannelTopic endVoteTopic;

    private final EndVoteTask endVoteTask;
    private final StartConfirmTask startConfirmTask;
    private final ChannelTopic endConfirmTopic;

    private final ChannelTopic nightEmissaryTopic;
    private final ChannelTopic nightPoliceTopic;
    private final EndConfirmTask endConfirmTask;

    @RedissonLock(value = "#gameId")
    public void update(GameDTO gameDTO){
        Game game = gameDTO.toDao();
        redisKeyValueTemplate.update(game);
    } // end of update


    public GameResponseDTO findGameById(Long roomId) {
        Game game = redisGameRepository.findByGameId(roomId).orElseThrow(
                () -> new NotFoundGameException(CommonErrorCode.NOT_FOUND_GAME_EXCEPTION));

        return GameResponseDTO.toDto(game);
    } // end of findGameById

    public void ready(Long gameId, Long userId) {
        Game game = redisGameRepository.findByGameId(gameId).orElseThrow(
                () -> new NotFoundGameException(CommonErrorCode.NOT_FOUND_GAME_EXCEPTION));

        GameDTO gameDTO = GameDTO.toDto(game);
        Map<Long, Player> playerMap = gameDTO.getPlayerMap();
        Player player = playerMap.get(userId);

        player.setReady(true);

        publisher.publish(readyTopic, ReadyMessage.builder()
                .gameId(gameId)
                .gameState(GameState.WAIT)
                .result(CommonResult.SUCCESS)
                .build());

        // 모두가 준비가 끝나면 알려주기.
        if(playerMap.values().stream().allMatch(Player::isReady)){
            gameDTO.setGameState(GameState.READY_COMPLETE);

            publisher.publish(readyCompleteTopic, ReadyCompleteMessage.builder()
                    .gameId(gameId)
                    .gameState(GameState.READY_COMPLETE)
                    .result(CommonResult.SUCCESS)
                    .build());
        }

        update(gameDTO);
    } // end of ready

    public void readyCancel(Long gameId, Long userId) {
        Game game = redisGameRepository.findByGameId(gameId).orElseThrow(
                () -> new NotFoundGameException(CommonErrorCode.NOT_FOUND_GAME_EXCEPTION));

        GameDTO gameDTO = GameDTO.toDto(game);
        Map<Long, Player> playerMap = gameDTO.getPlayerMap();
        Player player = playerMap.get(userId);

        player.setReady(false);

        publisher.publish(readyTopic, ReadyMessage.builder()
                .gameId(gameId)
                .gameState(GameState.WAIT)
                .result(CommonResult.SUCCESS)
                .build());

        update(gameDTO);
    }


    public void setGame(Long roomId) {
        Game game = redisGameRepository.findById(roomId).orElseThrow(
                () -> new NotFoundGameException(CommonErrorCode.NOT_FOUND_GAME_EXCEPTION));

        GameDTO gameDTO = GameDTO.toDto(game);

        gameDTO.setGameState(GameState.STARTED);
        gameDTO.setDay(0);
        gameDTO.setStartAt(LocalDateTime.now());
        gameDTO.setTimer(LocalDateTime.now());

        log.info("gameDTO = {}", gameDTO.getTitle());

        // 역할부여
        Map<GameRole, Integer> roles = RoleUtils.getRole(gameDTO);
        RoleUtils.grantRole(roles, gameDTO);

        // 레디스에 저장하기
        update(gameDTO);

        // 타이머 - 토론시간임.
        startVoteTask.setGameId(roomId);
        scheduler.scheduleTask(roomId, TaskName.START_VOTE_TASK, startVoteTask, 15, TimeUnit.SECONDS);

        publisher.publish(dayTopic, DayMessage.builder()
                .gameId(roomId)
                .gameDTO(gameDTO)
                .build());

        // room 상태 변경해서 DB에 넣기
        Room room = roomRepository.findById(roomId).orElseThrow(
                () -> new NotFoundRoomException(CommonErrorCode.NOT_FOUND_ROOM_EXCEPTION));
        room.changeState(RoomState.STARTED);
    } // end of startGame

    @RedissonLock(value = "#gameId")
    public void startVote(long gameId, long userId, long targetId) {
        Map<Long, Player> playerMap = getAlivePlayerMap(gameId);

        String voteKey = GameConstant.VOTE_KEY_PREFIX + gameId;

        // 현재 투표 상태 가져와서 투표
        HashMap<Long, Integer> voteMap = getVoteMapFromRedis(voteKey);
        voteMap.put(targetId, voteMap.getOrDefault(targetId, 0) + 1);
        voteRedisTemplate.opsForValue().set(voteKey, voteMap);

        // 모든 플레이어가 투표했는지 확인
        if (voteMap.values().stream().mapToInt(Integer::intValue).sum() == playerMap.size()) {
            // todo : 만약 여기서 바로 이걸 타면 endVote타이머 종료해야함.
            // todo : 예약된 Task를 종료하고 Task를 직접 실행하자.
            endVoteTask.execute(gameId);
//            EndVoteMessage endVoteMessage = EndVoteMessage.builder().gameId(gameId).voteMap(voteMap).build();
//            endVote(endVoteMessage);
        }
    } // end of startVote

    @RedissonLock(value = "#gameId")
    private Map<Long, Player> getAlivePlayerMap(long gameId) {
        Game game = redisGameRepository.findById(gameId).orElseThrow(
                () -> new NotFoundGameException(CommonErrorCode.NOT_FOUND_GAME_EXCEPTION));

        GameDTO gameDTO = GameDTO.toDto(game);
        Map<Long, Player> playerMap = gameDTO.getPlayerMap().entrySet().stream()
                .filter(entry -> entry.getValue().isAlive())
                .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));

        return playerMap;
    } // end of getPlayerMap

    @RedissonLock(value = "#gameId")
    public HashMap<Long, Integer> getVoteMapFromRedis(String voteKey) {
        HashMap<Long, Integer> voteMap = voteRedisTemplate.opsForValue().get(voteKey);
        if (voteMap == null) {
            voteMap = new HashMap<>();
        }
        return voteMap;
    } // end of getVoteMapFromRedis

    public void endVote(EndVoteMessage message) {
        // 무승부의 경우 재투표로 설정
        message.organizeVote();

        // todo : 게임상태 변경 해야함
        // 타이머 - 최후변론 시간 주고 최종투표 안내.
        long gameId = message.getGameId();
        startConfirmTask.setGameId(gameId);
        scheduler.scheduleTask(gameId, TaskName.START_CONFIRM_TASK, startConfirmTask, 2, TimeUnit.MINUTES);

        // subscriber에게 메시지 발행
        publisher.publish(endVoteTopic, message);

        // 투표 결과 처리 후 Redis에서 해당 게임의 투표 데이터 삭제
        String voteKey = GameConstant.VOTE_KEY_PREFIX + gameId;
        voteRedisTemplate.delete(voteKey);
    } // end of endVote

    @RedissonLock(value = "#gameId")
    public void startConfirm(Long gameId, long userId, boolean confirm) {
        Map<Long, Player> playerMap = getAlivePlayerMap(gameId);

        String voteKey = GameConstant.VOTE_KEY_PREFIX + gameId;

        // 투표 및 저장 ( userId : 1(승낙) 0(거절) )
        HashMap<Long, Integer> voteMap = getVoteMapFromRedis(voteKey);
        voteMap.put(userId, confirm ? 1 : 0);
        voteRedisTemplate.opsForValue().set(voteKey, voteMap);

        if (voteMap.values().stream().mapToInt(Integer::intValue).sum() == playerMap.size()) {
            // todo : 얘도 이거 타면 end confirm 타이머 끄는게 필요함
            endConfirmTask.execute(gameId);
//            EndConfirmMessage endConfirmMessage = EndConfirmMessage.builder().gameId(gameId).voteMap(voteMap).build();
//            endConfirm(endConfirmMessage);
        }
    } // end of startConfirm

    public void endConfirm(EndConfirmMessage message) {
        // todo : endConfirmMessage에 결과를 담아서 프론트로 보내자.
        // 여기서 플레이어를 하나 죽이는게 좋나? remove 메서드를 하나 만들자 <- 이건 마피아 능력으로도 쓸수있으니까!
        message.organizeVote();

        publisher.publish(endConfirmTopic, message);

        // 레디스에 결과 삭제
        long gameId = message.getGameId();
        String voteKey = GameConstant.VOTE_KEY_PREFIX + gameId;
        voteRedisTemplate.delete(voteKey);
    } // end of endConfirm

    /**
     제거하는 로직
     */
    @RedissonLock(value = "#gameId")
    public void removeUser(Long gameId, Long targetId) {
        Game game = redisGameRepository.findByGameId(gameId).orElseThrow(
                () -> new NotFoundGameException(CommonErrorCode.NOT_FOUND_GAME_EXCEPTION));

        GameDTO gameDTO = GameDTO.toDto(game);

        Map<Long, Player> playerMap = gameDTO.getPlayerMap();

        playerMap.get(targetId).setAlive(false);

        update(gameDTO);
    }

    @RedissonLock(value = "#gameId")
    public void kill(Long gameId, Long targetId) {
        Game game = redisGameRepository.findByGameId(gameId).orElseThrow(
                () -> new NotFoundGameException(CommonErrorCode.NOT_FOUND_GAME_EXCEPTION));
        GameDTO gameDTO = GameDTO.toDto(game);
        Player targetPlayer = gameDTO.getPlayerMap().get(targetId);

        if(!targetPlayer.isAlive()){
            throw new AlreadyRemoveUserException(CommonErrorCode.ALREADY_REMOVE_USER_EXCEPTION);
        }

        targetPlayer.setAlive(false);

        update(gameDTO);

        // todo : Redis에 발행해야함
        publisher.publish(nightEmissaryTopic, NightEmissaryMessage.builder()
                        .gameId(gameId)
                        .targetId(targetId)
                        .result("success")
                        .build());
    }

    public void appease(Long gameId, Long targetId) {
        Game game = redisGameRepository.findByGameId(gameId).orElseThrow(
                () -> new NotFoundGameException(CommonErrorCode.NOT_FOUND_GAME_EXCEPTION));

        if(!Objects.isEmpty(game.getEmissary()))
            throw new AlreadyUseAppeaseException(CommonErrorCode.ALREADY_USE_APPEASE_EXCEPTION);

        GameDTO gameDTO = GameDTO.toDto(game);
        Map<Long, Player> playerMap = gameDTO.getPlayerMap();
        Player targetPlayer = playerMap.get(targetId);

        if(!targetPlayer.isAlive()){
            throw new AlreadyRemoveUserException(CommonErrorCode.ALREADY_REMOVE_USER_EXCEPTION);
        }

        if(targetPlayer.getRole() == GameRole.EMISSARY){
            throw new EmissaryAppeaseEmissaryException(CommonErrorCode.EMISSARY_APPEASE_EMISSARY_EXCEPTION);
        }

        // todo : game안에 Player상태 변경
        if (targetPlayer.getRole() == GameRole.POLICE) {
            targetPlayer.setRole(GameRole.BETRAYER);

            // 살아있는 PERSON 중 무작위로 한 명을 선택하여 POLICE로 변경
            List<Player> alivePerson = playerMap.values().stream()
                    .filter(player -> player.isAlive() && player.getRole() == GameRole.PERSON)
                    .collect(Collectors.toList());

            if (!alivePerson.isEmpty()) {
                Random random = new Random();
                Player newPolice = alivePerson.get(random.nextInt(alivePerson.size()));
                newPolice.setRole(GameRole.POLICE);
            }
        }else {
            targetPlayer.setRole(GameRole.BETRAYER);
        }

        update(gameDTO);

        //레디스에 발행
        publisher.publish(nightEmissaryTopic, NightEmissaryMessage.builder()
                        .gameId(gameId)
                        .targetId(targetId)
                        .result("success")
                        .build());
    }

    @RedissonLock(value = "#gameId")
    public void detect(Long gameId, Long targetId) {
        Game game = redisGameRepository.findByGameId(gameId).orElseThrow(
                () -> new NotFoundGameException(CommonErrorCode.NOT_FOUND_GAME_EXCEPTION));

        GameDTO gameDTO = GameDTO.toDto(game);
        Map<Long, Player> playerMap = gameDTO.getPlayerMap();
        Player targetPlayer = playerMap.get(targetId);

        if(!targetPlayer.isAlive()){
            throw new AlreadyRemoveUserException(CommonErrorCode.ALREADY_REMOVE_USER_EXCEPTION);
        }

        // todo : 이미 조사한 유저에 대해서 어떻게하지? -> 그냥 다 모른다 쳐!
        NightPoliceMessage nightPoliceMessage = NightPoliceMessage.builder().gameId(gameId).targetId(targetId).result(targetPlayer.getRole()).build();
        publisher.publish(nightPoliceTopic, nightPoliceMessage);
    }

    @RedissonLock(value = "#gameId")
    public void day(Long gameId) {
        Game game = redisGameRepository.findByGameId(gameId).orElseThrow(
                () -> new NotFoundGameException(CommonErrorCode.NOT_FOUND_GAME_EXCEPTION));

        GameDTO gameDTO = GameDTO.toDto(game);
        gameDTO.setGameState(GameState.DAY);
        gameDTO.setDay(game.getDay() + 1);

        // 2분뒤 다시 토론 시작
        scheduler.scheduleTask(gameId, TaskName.START_VOTE_TASK, startVoteTask, 2, TimeUnit.MINUTES);
    }
}
