package e106.emissary_backend.domain.game.service.timer.task;

import e106.emissary_backend.domain.game.GameConstant;
import e106.emissary_backend.domain.game.service.GameService;
import e106.emissary_backend.domain.game.service.publisher.RedisPublisher;
import e106.emissary_backend.domain.game.service.subscriber.message.EndVoteMessage;
import e106.emissary_backend.domain.game.service.timer.SchedulerService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.listener.ChannelTopic;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class EndVoteTask implements GameTask {
    private Long gameId;

    private final RedisTemplate<String, HashMap<Long, Integer>> voteRedisTemplate;

    private final RedisPublisher publisher;
    private final ChannelTopic endVoteTopic;

    private final SchedulerService scheduler;
    private final StartConfirmTask startConfirmTask;

    @Override
    public void run() {
        execute(gameId);
    }

    @Override
    public void execute(Long gameId) {
        // todo : vote 종료 로직 구현
        // todo : 투표 결과를 EndVoteMessage에 담아서 내려보내야함.
        // todo : 이거 그냥 바로 service로 넘길까? 그래야 publish를 한번에 처리하기가 좋고 schedule 예약하기가 좋음
        // todo : 게임 상태도 confirm으로 바꿔줘야함
        String voteKey = GameConstant.VOTE_KEY_PREFIX + gameId;
        HashMap<Long, Integer> voteMap = voteRedisTemplate.opsForValue().get(voteKey);
        if (voteMap == null) {
            voteMap = new HashMap<>();
        }
        EndVoteMessage endVoteMessage = EndVoteMessage.builder().gameId(gameId).voteMap(voteMap).build();

        endVoteMessage.organizeVote();

        // todo : 게임상태 변경 해야함
        // 타이머 - 최후변론 시간 주고 최종투표 안내.
        startConfirmTask.setGameId(gameId);
        scheduler.scheduleTask(gameId, TaskName.START_CONFIRM_TASK, startConfirmTask, 2, TimeUnit.MINUTES);

        // subscriber에게 메시지 발행
        publisher.publish(endVoteTopic, endVoteMessage);

        // 투표 결과 처리 후 Redis에서 해당 게임의 투표 데이터 삭제
        voteRedisTemplate.delete(voteKey);
    }

    public void setGameId(long gameId){
        this.gameId = gameId;
    }

}
