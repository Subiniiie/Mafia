//package e106.emissary_backend.domain.game.repository;
//
//import e106.emissary_backend.domain.game.model.Game;
//import e106.emissary_backend.domain.game.service.subscriber.RedisSubscriber;
//import lombok.RequiredArgsConstructor;
//import org.springframework.data.redis.core.HashOperations;
//import org.springframework.data.redis.core.RedisTemplate;
//import org.springframework.data.redis.listener.ChannelTopic;
//import org.springframework.data.redis.listener.RedisMessageListenerContainer;
//import org.springframework.stereotype.Repository;
//
//import java.util.HashMap;
//import java.util.List;
//import java.util.Map;
//
//@Repository
//@RequiredArgsConstructor
//public class RedisTemplateGameRepository {
//    // 채널별 리스너 넣어주기 위해서
//    private final RedisMessageListenerContainer redisMessageListenerContainer;
//    // 구독 처리용
//    private final RedisSubscriber redisSubscriber;
//
//    private static final String CHAT_ROOMS = "GAME_ROOM";
//    private final RedisTemplate<String, Object> redisTemplate;
//    private HashOperations<String, String, Game> opsHashGameRoom = redisTemplate.opsForHash();
//    // 채팅방(Topic)을 roomID로 찾기위해서 만든 Map
//    private Map<String, ChannelTopic> topics = new HashMap<>();
//
//    public List<Game> findAllRooms() {
//        return opsHashGameRoom.values(CHAT_ROOMS);
//    }
//
//    public Game findRoomById(String id) {
//        return opsHashGameRoom.get(CHAT_ROOMS, id);
//    }
//
////    public Game createChatRoom(String name) {
////        Game game = Game.create(name);
////        opsHashGameRoom.put(CHAT_ROOMS, game.getGameId(), game);
////        return game;
////    }
//
//    public void enterChatRoom(String roomId){
//        ChannelTopic topic = topics.get(roomId);
//        if(topic == null){
//            topic = new ChannelTopic(roomId);
//            redisMessageListenerContainer.addMessageListener(redisSubscriber, topic);
//            topics.put(roomId, topic);
//        }
//    }
//
//    public ChannelTopic getTopic(String roomId){
//        return topics.get(roomId);
//    }
//
//}
