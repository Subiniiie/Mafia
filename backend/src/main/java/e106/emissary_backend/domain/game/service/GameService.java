package e106.emissary_backend.domain.game.service;

import e106.emissary_backend.domain.game.GameConstant;
import e106.emissary_backend.domain.game.entity.Game;
import e106.emissary_backend.domain.game.enumType.GameRole;
import e106.emissary_backend.domain.game.enumType.GameState;
import e106.emissary_backend.domain.game.model.GameDTO;
import e106.emissary_backend.domain.game.model.GameResponseDTO;
import e106.emissary_backend.domain.game.model.Player;
import e106.emissary_backend.domain.game.repository.RedisGameRepository;
import e106.emissary_backend.domain.game.service.publisher.RedisPublisher;
import e106.emissary_backend.domain.game.service.subscriber.message.DayMessage;
import e106.emissary_backend.domain.game.service.subscriber.message.EndConfirmMessage;
import e106.emissary_backend.domain.game.service.subscriber.message.EndVoteMessage;
import e106.emissary_backend.domain.game.service.timer.SchedulerService;
import e106.emissary_backend.domain.game.service.timer.task.StartConfirmTask;
import e106.emissary_backend.domain.game.service.timer.task.StartVoteTask;
import e106.emissary_backend.domain.game.util.RoleUtils;
import e106.emissary_backend.domain.room.entity.Room;
import e106.emissary_backend.domain.room.enumType.RoomState;
import e106.emissary_backend.domain.room.repository.RoomRepository;
import e106.emissary_backend.global.error.CommonErrorCode;
import e106.emissary_backend.global.error.exception.NotFoundGameException;
import e106.emissary_backend.global.error.exception.NotFoundRoomException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisKeyValueTemplate;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.listener.ChannelTopic;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.TimeUnit;


@Service
@RequiredArgsConstructor
public class GameService {

    private final RedisGameRepository redisGameRepository;
    private final RoomRepository roomRepository;
    private final RedisTemplate<String, HashMap<Long, Integer>> voteRedisTemplate;
    private final RedisKeyValueTemplate redisKeyValueTemplate;
    private final SchedulerService scheduler;

    private final RedisPublisher publisher;
    private final ChannelTopic dayTopic;
    private final ChannelTopic startVoteTopic;
    private final StartVoteTask startVoteTask;

    private final ChannelTopic endVoteTopic;

    private final StartConfirmTask startConfirmTask;

    public void update(GameDTO gameDTO){
        Game game = gameDTO.toDao();
        redisKeyValueTemplate.update(game);
    }

    public GameResponseDTO findGameById(Long roomId) {
        Game game = redisGameRepository.findByGameId(roomId).orElseThrow(
                () -> new NotFoundGameException(CommonErrorCode.NOT_FOUND_GAME_EXCEPTION));

        return GameResponseDTO.toDto(game);
    } // end of findGameById


    public void setGame(Long roomId) {
        Game game = redisGameRepository.findById(roomId).orElseThrow(
                () -> new NotFoundGameException(CommonErrorCode.NOT_FOUND_GAME_EXCEPTION));

        GameDTO gameDTO = GameDTO.toDto(game);

        gameDTO.setGameState(GameState.STARTED);
        gameDTO.setDay(0);
        gameDTO.setStartAt(LocalDateTime.now());
        gameDTO.setTimer(LocalDateTime.now());

        // 역할부여
        Map<GameRole, Integer> roles = RoleUtils.getRole(gameDTO);
        RoleUtils.grantRole(roles, gameDTO);

        // 레디스에 저장하기
        update(gameDTO);

        startVoteTask.setGameId(roomId);
        scheduler.schedule(startVoteTask, 2, TimeUnit.MINUTES);

        publisher.publish(dayTopic, DayMessage.builder()
                .gameId(roomId)
                .gameDTO(gameDTO)
                .build());

        // room 상태 변경해서 DB에 넣기
        Room room = roomRepository.findById(roomId).orElseThrow(
                () -> new NotFoundRoomException(CommonErrorCode.NOT_FOUND_ROOM_EXCEPTION));
        room.changeState(RoomState.STARTED);
    } // end of startGame


    public void vote(long gameId, long userId, long targetId) {
        Game game = redisGameRepository.findById(gameId).orElseThrow(
                () -> new NotFoundGameException(CommonErrorCode.NOT_FOUND_GAME_EXCEPTION));

        GameDTO gameDTO = GameDTO.toDto(game);
        Map<Long, Player> playerMap = gameDTO.getPlayerMap();


        // todo : 만약 꺼내서 결과를 넣어주는데 모두가 투표한 상황이라면 scheduler 예약한거 끄고
        // todo : 바로 내려보내줘야함.
        // Redis에 투표 결과 저장
        String voteKey = GameConstant.VOTE_KEY_PREFIX + gameId;

        // 현재 투표 상태 가져오기
        HashMap<Long, Integer> voteMap = getVoteMapFromRedis(voteKey);

        // 투표 결과 업데이트
        voteMap.put(targetId, voteMap.getOrDefault(targetId, 0) + 1);

        // 업데이트된 투표 결과 저장
        voteRedisTemplate.opsForValue().set(voteKey, voteMap);

        // 모든 플레이어가 투표했는지 확인
        if (voteMap.values().stream().mapToInt(Integer::intValue).sum() == playerMap.size()) {
            // todo : 만약 여기서 바로 이걸 타면 타이머 종료해야함.
            // 모든 투표가 완료된 경우 처리
            EndVoteMessage endVoteMessage = EndVoteMessage.builder().gameId(gameId).voteMap(voteMap).build();
            endVote(endVoteMessage);

            // 투표 결과 처리 후 Redis에서 해당 게임의 투표 데이터 삭제
            voteRedisTemplate.delete(voteKey);
        }
    }

    public HashMap<Long, Integer> getVoteMapFromRedis(String voteKey) {
        HashMap<Long, Integer> voteMap = voteRedisTemplate.opsForValue().get(voteKey);
        if (voteMap == null) {
            voteMap = new HashMap<>();
        }
        return voteMap;
    }

    public void endVote(EndVoteMessage message) {

        // todo 1: 이제 최후변론 타이머를 돌리자 및 게임상태 변경
        startConfirmTask.setGameId(message.getGameId());
        // 2분뒤 실행
        scheduler.schedule(startConfirmTask, 2, TimeUnit.MINUTES);


        // todo 2: endVoteMessage에 결과를 담아서 프론트로 보내자.
        // todo 3 : endVoteMessage를 이상한데 써버림...
        publisher.publish(endVoteTopic, message);
    }

    public void startConfirm(Long roomId, long userId, boolean confirm) {
        Game game = redisGameRepository.findById(roomId).orElseThrow(
                () -> new NotFoundGameException(CommonErrorCode.NOT_FOUND_GAME_EXCEPTION));

        GameDTO dto = GameDTO.toDto(game);

        // todo : 얘도 마찬가지. 꺼내서 결과를 넣어주다가 모두가 투표한 상황이라면 scheduler 예약한거 끄고
        // todo : 바로 내려보내줘야함.

    }

    public void endConfirm(EndConfirmMessage message) {
        // todo : endConfirmMessage에 결과를 담아서 프론트로 보내자.
        // 여기서 플레이어를 하나 죽이는게 좋나? remove 메서드를 하나 만들자 <- 이건 마피아 능력으로도 쓸수있으니까!
    }

    /**
     제거하는 로직
     */
    public void eliminate() {

    }


}
