package e106.emissary_backend.domain.game.service.timer.task;

import e106.emissary_backend.domain.game.enumType.GameState;
import e106.emissary_backend.domain.game.model.GameDTO;
import e106.emissary_backend.domain.game.service.publisher.RedisPublisher;
import e106.emissary_backend.domain.game.service.subscriber.message.StartConfirmMessage;
import e106.emissary_backend.domain.game.service.timer.SchedulerService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisKeyValueTemplate;
import org.springframework.data.redis.listener.ChannelTopic;
import org.springframework.stereotype.Service;

import java.util.concurrent.ScheduledFuture;
import java.util.concurrent.TimeUnit;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class StartConfirmTask implements GameTask {
    private Long gameId;
    private GameDTO gameDTO;
    private long targetId;

    private final RedisPublisher publisher;

    private final ChannelTopic startConfirmTopic;
    private final SchedulerService scheduler;

    private final EndConfirmTask endConfirmTask;

    private final RedisKeyValueTemplate redisKeyValueTemplate;

    @Override
    public void run() {
        execute(gameId);
    }

    @Override
    public void execute(Long gameId) {
        log.info("start Confirm task run");
        //todo : vote 시작했다고 publish -> sub에서 프론트에게 알림
        gameDTO.setGameState(GameState.CONFIRM_START);

        redisKeyValueTemplate.update(gameDTO.toDao());

        publisher.publish(startConfirmTopic, StartConfirmMessage.builder()
                        .gameState(GameState.CONFIRM_START)
                        .gameDTO(gameDTO)
                        .gameId(gameId)
                        .build());
        
        // 2분뒤 투표종료 안내
        endConfirmTask.setGameId(gameId);
        endConfirmTask.setTargetId(targetId);
        scheduler.scheduleTask(gameId, TaskName.END_CONFIRM_TASK, endConfirmTask, 30, TimeUnit.SECONDS);
    }

    public void setGameId(long gameId){
        this.gameId = gameId;
    }

    public void setTargetId(long targetId){this.targetId = targetId;}

    public void setGameDTO(GameDTO gameDTO) {
        this.gameDTO = gameDTO;
    }
}
