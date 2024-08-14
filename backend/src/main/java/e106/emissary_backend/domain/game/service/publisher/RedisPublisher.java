package e106.emissary_backend.domain.game.service.publisher;

import e106.emissary_backend.domain.game.entity.Game;
import e106.emissary_backend.domain.game.service.subscriber.message.*;
import e106.emissary_backend.domain.room.service.subscriber.message.EnterRoomMessage;
import e106.emissary_backend.domain.room.service.subscriber.message.KickUserMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.listener.ChannelTopic;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class RedisPublisher {
    private final RedisTemplate<Long, Game> redisTemplate;

    // 구독한 채널로 메시지 발송 -> 발송시 메시지 규격 맞추기
    public void publish(ChannelTopic topic, CommonMessage message) {
        redisTemplate.convertAndSend(topic.getTopic(), message);
    }

    public void publish(ChannelTopic topic, ReadyCompleteMessage message) {
        redisTemplate.convertAndSend(topic.getTopic(), message);
    }

    public void publish(ChannelTopic topic, GameSetMessage message) {
        redisTemplate.convertAndSend(topic.getTopic(), message);
    }

    public void publish(ChannelTopic topic, StartVoteMessage message) {
        redisTemplate.convertAndSend(topic.getTopic(), message);
    }

    public void publish(ChannelTopic topic, EndVoteMessage message) {
        redisTemplate.convertAndSend(topic.getTopic(), message);
    }

    public void publish(ChannelTopic topic, StartConfirmMessage message) {
        redisTemplate.convertAndSend(topic.getTopic(), message);
    }

    public void publish(ChannelTopic topic, EndConfirmMessage message) {
        redisTemplate.convertAndSend(topic.getTopic(), message);
    }

    public void publish(ChannelTopic topic, NightPoliceMessage message) {
        redisTemplate.convertAndSend(topic.getTopic(), message);
    }

    public void publish(ChannelTopic topic, NightEmissaryMessage message) {
        redisTemplate.convertAndSend(topic.getTopic(), message);
    }


    public void publish(ChannelTopic topic, EnterGameMessage message) {
        redisTemplate.convertAndSend(topic.getTopic(), message);
    }

    public void publish(ChannelTopic topic, EnterRoomMessage message) {
        redisTemplate.convertAndSend(topic.getTopic(), message);
    }

    public void publish(ChannelTopic topic, KickUserMessage message) {
        redisTemplate.convertAndSend(topic.getTopic(), message);
    }

    public void publish(ChannelTopic topic, EndMessage message) {
        redisTemplate.convertAndSend(topic.getTopic(), message);
    }
    public void publish(ChannelTopic topic, DayMessage message) {
        redisTemplate.convertAndSend(topic.getTopic(), message);
    }
}
