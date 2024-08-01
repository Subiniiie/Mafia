package e106.emissary_backend.domain.game.service.timer.task;

import e106.emissary_backend.domain.game.service.GameService;
import e106.emissary_backend.domain.game.service.publisher.RedisPublisher;
import e106.emissary_backend.domain.game.service.subscriber.message.StartVoteMessage;
import e106.emissary_backend.domain.game.service.timer.SchedulerService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.listener.ChannelTopic;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class StartVoteTask implements GameTask {
    private Long gameId;

    private final RedisPublisher publisher;
    private final GameService gameService;

    private final ChannelTopic startVoteTopic;
    private final SchedulerService scheduler;
    private final EndVoteTask endVoteTask;

    @Override
    public void run() {
        execute(gameId);
    }

    @Override
    public void execute(Long gameId) {
        //todo : vote 시작했다고 publish -> sub에서 프론트에게 알림
        publisher.publish(startVoteTopic, StartVoteMessage.builder()
                .gameId(gameId)
                .build());
        
        // 2분뒤 투표종료 안내
        endVoteTask.setGameId(gameId);
        scheduler.schedule(endVoteTask, 2, TimeUnit.MINUTES);
    }

    public void setGameId(long gameId){
        this.gameId = gameId;
    }
}
