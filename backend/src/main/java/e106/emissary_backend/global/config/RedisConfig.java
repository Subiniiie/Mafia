package e106.emissary_backend.global.config;

import e106.emissary_backend.domain.game.entity.Game;
import e106.emissary_backend.domain.game.service.subscriber.DaySubscriber;
import e106.emissary_backend.domain.game.service.subscriber.EndVoteSubscriber;
import e106.emissary_backend.domain.game.service.subscriber.StartConfirmSubscriber;
import e106.emissary_backend.domain.game.service.subscriber.StartVoteSubscriber;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.RedisKeyValueAdapter;
import org.springframework.data.redis.core.RedisKeyValueTemplate;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.mapping.RedisMappingContext;
import org.springframework.data.redis.listener.ChannelTopic;
import org.springframework.data.redis.listener.RedisMessageListenerContainer;
import org.springframework.data.redis.listener.adapter.MessageListenerAdapter;
import org.springframework.data.redis.serializer.GenericToStringSerializer;
import org.springframework.data.redis.serializer.Jackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.StringRedisSerializer;

import java.util.HashMap;

@Configuration
public class RedisConfig {

    @Bean
    public RedisMessageListenerContainer redisMessageListener(RedisConnectionFactory connectionFactory) {
        RedisMessageListenerContainer container = new RedisMessageListenerContainer();
        container.setConnectionFactory(connectionFactory);
        return container;
    }

    @Bean
    public RedisTemplate<Long, Game> redisTemplate(RedisConnectionFactory connectionFactory) {
        RedisTemplate<Long, Game> redisTemplate = new RedisTemplate<>();
        redisTemplate.setConnectionFactory(connectionFactory);
        redisTemplate.setKeySerializer(new GenericToStringSerializer<>(Long.class));
        redisTemplate.setHashKeySerializer(new GenericToStringSerializer<>(Long.class));
        redisTemplate.setValueSerializer(new Jackson2JsonRedisSerializer<>(Game.class)); // Game으로 변경
        return redisTemplate;
    }

    @Bean
    public RedisTemplate<String, HashMap<Integer, Integer>> voteRedisTemplate(RedisConnectionFactory connectionFactory) {
        RedisTemplate<String, HashMap<Integer, Integer>> template = new RedisTemplate<>();
        template.setConnectionFactory(connectionFactory);
        template.setKeySerializer(new StringRedisSerializer());
        template.setValueSerializer(new Jackson2JsonRedisSerializer<>(HashMap.class));
        return template;
    }

    @Bean
    public RedisKeyValueTemplate redisKeyValueTemplate(RedisConnectionFactory redisConnectionFactory) {
        RedisTemplate<Long, Game> redisTemplate = new RedisTemplate<>();
        redisTemplate.setConnectionFactory(redisConnectionFactory);
        redisTemplate.afterPropertiesSet();
        return new RedisKeyValueTemplate(new RedisKeyValueAdapter(redisTemplate), new RedisMappingContext());
    }

    @Bean
    public RedisMessageListenerContainer redisMessageListenerContainer(RedisConnectionFactory connectionFactory,
                                                                       MessageListenerAdapter dayListenerAdapter,
                                                                       ChannelTopic dayTopic,
                                                                       MessageListenerAdapter startVoteAdapter, ChannelTopic startVoteTopic,
                                                                       MessageListenerAdapter endVoteAdapter, ChannelTopic endVoteTopic,
                                                                       MessageListenerAdapter startConfirmAdapter, ChannelTopic startConfirmTopic,
                                                                       MessageListenerAdapter endConfirmAdapter, ChannelTopic endConfirmTopic) {
        RedisMessageListenerContainer container = new RedisMessageListenerContainer();
        container.setConnectionFactory(connectionFactory);
        // subscriber, topic
        container.addMessageListener(dayListenerAdapter, dayTopic);
        container.addMessageListener(startVoteAdapter, startVoteTopic);
        container.addMessageListener(endVoteAdapter, endVoteTopic);
        container.addMessageListener(startConfirmAdapter, startConfirmTopic);
        container.addMessageListener(endConfirmAdapter, endConfirmTopic);

        return container;
    }

    @Bean
    public MessageListenerAdapter dayListenerAdapter(DaySubscriber subscriber) {
        return new MessageListenerAdapter(subscriber, "sendMessage");
    }

    @Bean
    public ChannelTopic dayTopic() {
        return new ChannelTopic("DAY");
    }

    @Bean
    public MessageListenerAdapter startVoteAdapter(StartVoteSubscriber subscriber) {
        return new MessageListenerAdapter(subscriber, "sendMessage");
    }

    @Bean
    public ChannelTopic startVoteTopic() {
        return new ChannelTopic("START_VOTE");
    }

    @Bean
    public MessageListenerAdapter endVoteAdapter(EndVoteSubscriber subscriber) {
        return new MessageListenerAdapter(subscriber, "sendMessage");
    }

    @Bean
    public ChannelTopic endVoteTopic() {
        return new ChannelTopic("END_VOTE");
    }

    @Bean
    public MessageListenerAdapter startConfirmAdapter(StartConfirmSubscriber subscriber) {
        return new MessageListenerAdapter(subscriber, "sendMessage");
    }

    @Bean
    public ChannelTopic startConfirmTopic() {
        return new ChannelTopic("START_CONFIRM");
    }

    @Bean
    public MessageListenerAdapter endConfirmAdapter(EndVoteSubscriber subscriber) {
        return new MessageListenerAdapter(subscriber, "sendMessage");
    }

    @Bean
    public ChannelTopic endConfirmTopic() {
        return new ChannelTopic("END_CONFIRM");
    }
}
