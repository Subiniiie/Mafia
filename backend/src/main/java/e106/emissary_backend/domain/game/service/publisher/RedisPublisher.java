package e106.emissary_backend.domain.game.service.publisher;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.listener.ChannelTopic;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class RedisPublisher {
    private final RedisTemplate<String, Object> redisTemplate;

    // 구독한 채널로 메시지 발송
    public void publish(ChannelTopic topic, Object object) {
        redisTemplate.convertAndSend(topic.getTopic(), object);
    }
}
