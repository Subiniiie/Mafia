package e106.emissary_backend.global.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jdk8.Jdk8Module;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import e106.emissary_backend.domain.game.entity.Game;
import e106.emissary_backend.domain.game.service.subscriber.*;
import org.redisson.Redisson;
import org.redisson.api.RedissonClient;
import org.redisson.config.Config;
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

    private static final String REDISSON_HOST_PREFIX = "redis://";

    @Bean
    public RedissonClient redissonClient(){
        Config config = new Config();
        config.useSingleServer()
                .setAddress(REDISSON_HOST_PREFIX + "43.202.1.100:6389");
        return Redisson.create(config);
    }

    @Bean
    public RedisMessageListenerContainer redisMessageListener(RedisConnectionFactory connectionFactory) {
        RedisMessageListenerContainer container = new RedisMessageListenerContainer();
        container.setConnectionFactory(connectionFactory);
        return container;
    }

    @Bean public ObjectMapper objectMapper() {
        ObjectMapper mapper = new ObjectMapper();
        mapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS); // timestamp 형식 안따르도록 설정
        mapper.registerModules(new JavaTimeModule(), new Jdk8Module()); // LocalDateTime 매핑을 위해 모듈 활성화
        return mapper;
    }

    @Bean
    public RedisTemplate<Long, Game> redisTemplate(RedisConnectionFactory connectionFactory, ObjectMapper objectMapper) {
        RedisTemplate<Long, Game> redisTemplate = new RedisTemplate<>();
        redisTemplate.setConnectionFactory(connectionFactory);
        redisTemplate.setKeySerializer(new GenericToStringSerializer<>(Long.class));
        redisTemplate.setHashKeySerializer(new GenericToStringSerializer<>(Long.class));

        Jackson2JsonRedisSerializer<Game> serializer = new Jackson2JsonRedisSerializer<>(objectMapper, Game.class);
        redisTemplate.setValueSerializer(serializer);
        redisTemplate.setHashValueSerializer(serializer);
        redisTemplate.afterPropertiesSet();

//        redisTemplate.setValueSerializer(new Jackson2JsonRedisSerializer<>(Game.class)); // Game으로 변경
        return redisTemplate;
    }

    @Bean
    public RedisTemplate<String, HashMap<Long, Integer>> voteRedisTemplate(RedisConnectionFactory connectionFactory) {
        RedisTemplate<String, HashMap<Long, Integer>> template = new RedisTemplate<>();
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
                                                                       MessageListenerAdapter commonAdapter, ChannelTopic commonTopic,
                                                                       MessageListenerAdapter readyCompleteAdapter, ChannelTopic readyCompleteTopic,
                                                                       MessageListenerAdapter gameSetAdapter, ChannelTopic gameSetTopic,
                                                                       MessageListenerAdapter startVoteAdapter, ChannelTopic startVoteTopic,
                                                                       MessageListenerAdapter endVoteAdapter, ChannelTopic endVoteTopic,
                                                                       MessageListenerAdapter startConfirmAdapter, ChannelTopic startConfirmTopic,
                                                                       MessageListenerAdapter endConfirmAdapter, ChannelTopic endConfirmTopic,
                                                                       MessageListenerAdapter nightEmissaryAdapter, ChannelTopic nightEmissaryTopic,
                                                                       MessageListenerAdapter nightPoliceAdapter, ChannelTopic nightPoliceTopic) {
        RedisMessageListenerContainer container = new RedisMessageListenerContainer();
        container.setConnectionFactory(connectionFactory);
        // subscriber, topic
        container.addMessageListener(commonAdapter, commonTopic);
        container.addMessageListener(readyCompleteAdapter, readyCompleteTopic);
        container.addMessageListener(gameSetAdapter, gameSetTopic);
        container.addMessageListener(startVoteAdapter, startVoteTopic);
        container.addMessageListener(endVoteAdapter, endVoteTopic);
        container.addMessageListener(startConfirmAdapter, startConfirmTopic);
        container.addMessageListener(endConfirmAdapter, endConfirmTopic);
        container.addMessageListener(nightEmissaryAdapter, nightEmissaryTopic);
        container.addMessageListener(nightPoliceAdapter, nightPoliceTopic);

        return container;
    }

    @Bean
    public MessageListenerAdapter commonAdapter(CommonSubscriber subscriber) {
        return new MessageListenerAdapter(subscriber, "sendMessage");
    }

    @Bean
    public ChannelTopic commonTopic() {
        return new ChannelTopic("COMMON");
    }

    @Bean
    public MessageListenerAdapter readyCompleteAdapter(ReadyCompleteSubscriber subscriber) {
        return new MessageListenerAdapter(subscriber, "sendMessage");
    }

    @Bean
    public ChannelTopic readyCompleteTopic() {
        return new ChannelTopic("READY_Complete");
    }

    @Bean
    public MessageListenerAdapter gameSetAdapter(GameSetSubscriber subscriber) {
        return new MessageListenerAdapter(subscriber, "sendMessage");
    }

    @Bean
    public ChannelTopic gameSetTopic() {
        return new ChannelTopic("GAME_SET");
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


    @Bean
    public MessageListenerAdapter nightEmissaryAdapter(NightEmissarySubscriber subscriber) {
        return new MessageListenerAdapter(subscriber, "sendMessage");
    }

    @Bean
    public ChannelTopic nightEmissaryTopic() {
        return new ChannelTopic("NIGHT_EMISSARY");
    }

    @Bean
    public MessageListenerAdapter nightPoliceAdapter(NightPoliceSubscriber subscriber) {
        return new MessageListenerAdapter(subscriber, "sendMessage");
    }

    @Bean
    public ChannelTopic nightPoliceTopic() {
        return new ChannelTopic("NIGHT_POLICE");
    }

}
