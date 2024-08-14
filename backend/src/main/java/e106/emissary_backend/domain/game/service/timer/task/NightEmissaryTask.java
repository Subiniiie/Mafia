package e106.emissary_backend.domain.game.service.timer.task;

import e106.emissary_backend.domain.game.enumType.CommonResult;
import e106.emissary_backend.domain.game.enumType.GameState;
import e106.emissary_backend.domain.game.model.Player;
import e106.emissary_backend.domain.game.service.publisher.RedisPublisher;
import e106.emissary_backend.domain.game.service.subscriber.message.CommonMessage;
import e106.emissary_backend.domain.game.service.subscriber.message.StartVoteMessage;
import e106.emissary_backend.domain.game.service.timer.SchedulerService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.listener.ChannelTopic;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ScheduledFuture;
import java.util.concurrent.TimeUnit;

@Slf4j
@Service
@RequiredArgsConstructor
public class NightEmissaryTask implements GameTask {
    private Long gameId;
    private Player emissary;
    private Player police;
    private Map<Long, Player> playerMap;

    private final RedisPublisher publisher;

    private final ChannelTopic commonTopic;
    private final SchedulerService scheduler;
    private final NightPoliceTask nightPoliceTask;

    @Override
    public void run() {
        execute(gameId);
    }

    @Override
    public void execute(Long gameId) {
        log.info("Night Emissary Task run : {}", LocalDateTime.now());

        publisher.publish(commonTopic, CommonMessage.builder()
                        .gameId(gameId)
                        .gameState(GameState.NIGHT_EMISSARY)
                        .result(CommonResult.SUCCESS)
                        .nowPlayer(emissary)
                        .playerMap(playerMap)
                        .build());

        nightPoliceTask.setGameIdAndTarget(gameId, police);
        nightPoliceTask.setPlayerMap(playerMap);
        scheduler.scheduleTask(gameId, TaskName.NIGHT_POLICE, nightPoliceTask, 15, TimeUnit.SECONDS);
    }

    public void setGameIdAndTargets(long gameId, Player emissary, Player police){
        this.gameId = gameId;
        this.emissary = emissary;
        this.police = police;
    }

    public void setPlayerMap(Map<Long, Player> playerMap) {
        this.playerMap = playerMap;
    }
}
