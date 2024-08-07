package e106.emissary_backend.domain.game.service.timer.task;

import e106.emissary_backend.domain.game.enumType.CommonResult;
import e106.emissary_backend.domain.game.enumType.GameState;
import e106.emissary_backend.domain.game.service.publisher.RedisPublisher;
import e106.emissary_backend.domain.game.service.subscriber.message.CommonMessage;
import e106.emissary_backend.domain.game.service.timer.SchedulerService;
import e106.emissary_backend.domain.game.util.GameUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.listener.ChannelTopic;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.concurrent.TimeUnit;

@Slf4j
@Service
@RequiredArgsConstructor
public class NightPoliceTask implements GameTask {
    private Long gameId;

    private final RedisPublisher publisher;

    private final ChannelTopic commonTopic;
    private final SchedulerService scheduler;
    private final StartVoteTask startVoteTask;

    private final GameUtil gameUtil;

    @Override
    public void run() {
        execute(gameId);
    }

    @Override
    public void execute(Long gameId) {
        log.info("Night Police Task run : {}", LocalDateTime.now());

        publisher.publish(commonTopic, CommonMessage.builder()
                        .gameId(gameId)
                        .gameState(GameState.NIGHT_POLICE)
                        .result(CommonResult.SUCCESS)
                        .build());

        if(gameUtil.isEnd(gameId)){
            gameUtil.endPublish(gameId);
        }else{
            startVoteTask.setGameId(gameId);
            scheduler.scheduleTask(gameId, TaskName.START_VOTE_TASK, startVoteTask, 15, TimeUnit.SECONDS);
        }
    }

    public void setGameId(long gameId){
        this.gameId = gameId;
    }
}
