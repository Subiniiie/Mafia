package e106.emissary_backend.domain.game.service.timer.task;

import e106.emissary_backend.domain.game.service.GameService;
import e106.emissary_backend.domain.game.service.VoteService;
import e106.emissary_backend.domain.game.service.publisher.RedisPublisher;
import e106.emissary_backend.domain.game.service.subscriber.message.StartVoteMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.listener.ChannelTopic;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class StartVoteTask implements GameTask {
    private final RedisPublisher publisher;
    private final ChannelTopic startVoteTopic;
    private Long gameId;

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
    }

    public void setGameId(long gameId){
        this.gameId = gameId;
    }
}
