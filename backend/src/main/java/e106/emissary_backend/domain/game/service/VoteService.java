package e106.emissary_backend.domain.game.service;

import e106.emissary_backend.domain.game.repository.RedisGameRepository;
import e106.emissary_backend.domain.game.service.publisher.RedisPublisher;
import e106.emissary_backend.domain.game.service.subscriber.message.StartVoteMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisKeyValueTemplate;
import org.springframework.data.redis.listener.ChannelTopic;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class VoteService {

    private final RedisGameRepository redisGameRepository;
    private final RedisKeyValueTemplate redisKeyValueTemplate;

    private final RedisPublisher publisher;
    private final ChannelTopic startVoteTopic;


    public void startVote(Long gameId) {
        publisher.publish(startVoteTopic, StartVoteMessage.builder()
                .gameId(gameId)
                .build());
    }

}
