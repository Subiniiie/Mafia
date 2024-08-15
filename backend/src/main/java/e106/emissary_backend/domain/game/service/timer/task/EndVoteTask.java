package e106.emissary_backend.domain.game.service.timer.task;

import e106.emissary_backend.domain.game.GameConstant;
import e106.emissary_backend.domain.game.aspect.RedissonLock;
import e106.emissary_backend.domain.game.entity.Game;
import e106.emissary_backend.domain.game.enumType.GameState;
import e106.emissary_backend.domain.game.enumType.VoteState;
import e106.emissary_backend.domain.game.model.GameDTO;
import e106.emissary_backend.domain.game.repository.RedisGameRepository;
import e106.emissary_backend.domain.game.service.publisher.RedisPublisher;
import e106.emissary_backend.domain.game.service.subscriber.message.EndVoteMessage;
import e106.emissary_backend.domain.game.service.subscriber.message.StartVoteMessage;
import e106.emissary_backend.domain.game.service.timer.SchedulerService;
import e106.emissary_backend.global.error.CommonErrorCode;
import e106.emissary_backend.global.error.exception.NotFoundGameException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisKeyValueTemplate;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.listener.ChannelTopic;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ScheduledFuture;
import java.util.concurrent.TimeUnit;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class EndVoteTask implements GameTask {
    private Long gameId;

    private final RedisTemplate<String, HashMap<Long, Integer>> voteRedisTemplate;
    private final RedisKeyValueTemplate redisKeyValueTemplate;
    private final RedisGameRepository redisGameRepository;

    private final RedisPublisher publisher;
    private final ChannelTopic endVoteTopic;
    private final ChannelTopic startVoteTopic;

    private final SchedulerService scheduler;
    private final StartConfirmTask startConfirmTask;

    @Override
    public void run() {
        execute(gameId);
    }

    @RedissonLock(value = "#gameId")
    @Override
    public void execute(Long gameId) {
        log.info("EndVoteTask Started : {}", LocalDateTime.now());
        Game game = redisGameRepository.findById(gameId).orElseThrow(
                () -> new NotFoundGameException(CommonErrorCode.NOT_FOUND_GAME_EXCEPTION));
        GameDTO gameDTO = GameDTO.toDto(game);

        gameDTO.getPlayerMap().values().forEach(player -> {player.setVoted(false);});

        String voteKey = GameConstant.VOTE_KEY_PREFIX + gameId;
//        HashMap<Long, Integer> voteMap = voteRedisTemplate.opsForValue().get(voteKey);
        HashMap<Long, Integer> voteMap = getVoteMapFromRedis(voteKey);
        log.info("들고온 voteMap: {}",voteMap.toString());

        if (voteMap == null) {
            voteMap = new HashMap<>();
        }
        EndVoteMessage endVoteMessage = EndVoteMessage.builder().gameId(gameId).voteMap(voteMap).build();

        endVoteMessage.organizeVote();
        log.info("투표 결과 : {}", endVoteMessage.getResult());

        // subscriber에게 메시지 발행
        publisher.publish(endVoteTopic, endVoteMessage);

        log.info("endVoteTask publish End : {}", LocalDateTime.now());
        // 투표 결과 처리 후 Redis에서 해당 게임의 투표 데이터 삭제
        voteRedisTemplate.delete(voteKey);

//        if(VoteState.RE_VOTE.equals(endVoteMessage.getResult())){
//            // 다시 투표하세용
//            gameDTO.setGameState(GameState.VOTE_START);
//
//            publisher.publish(startVoteTopic, StartVoteMessage.builder()
//                            .gameState(GameState.VOTE_START)
//                            .gameDTO(gameDTO)
//                            .gameId(gameId)
//                            .build());
//            // 예약
//            ScheduledFuture<?> future = scheduler.scheduleTask(gameId, TaskName.END_VOTE_TASK, this, 10, TimeUnit.SECONDS);
//        }else {
            // todo : 게임상태 변경 해야함
            // 타이머 - 최후변론 시간 주고 최종투표 안내.
            gameDTO.setGameState(GameState.VOTE_END);

            startConfirmTask.setGameId(gameId);
            startConfirmTask.setGameDTO(gameDTO);
            // todo : 이거 지금은 그냥 maxPlayerList의 제일 상단에 있는놈 userId를 갖고옴
            startConfirmTask.setTargetId(endVoteMessage.getMaxPlayerList().get(0));
            scheduler.scheduleTask(gameId, TaskName.START_CONFIRM_TASK, startConfirmTask, 15, TimeUnit.SECONDS);
//        }

        redisKeyValueTemplate.update(gameDTO.toDao());
    }
    @RedissonLock(value = "#gameId")
    private HashMap<Long, Integer> getVoteMapFromRedis(String voteKey) {
        HashMap<Long, Integer> result = voteRedisTemplate.opsForValue().get(voteKey);
        if (result == null) {
            return new HashMap<>();
        }

        if (result instanceof Map) {
            Map<?, ?> map = (Map<?, ?>) result;
            return map.entrySet().stream()
                    .collect(HashMap::new,
                            (m, e) -> m.put(Long.valueOf(e.getKey().toString()), (Integer) e.getValue()),
                            HashMap::putAll);
        }
        return new HashMap<>();
    } // end of getVoteMapFromRedis

    public void setGameId(long gameId){
        this.gameId = gameId;
    }

}
