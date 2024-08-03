//package e106.emissary_backend.domain.game.service;
//
//import e106.emissary_backend.domain.game.GameConstant;
//import e106.emissary_backend.domain.game.service.publisher.RedisPublisher;
//import e106.emissary_backend.domain.game.service.subscriber.message.EndConfirmMessage;
//import e106.emissary_backend.domain.game.service.subscriber.message.EndVoteMessage;
//import e106.emissary_backend.domain.game.service.timer.SchedulerService;
//import e106.emissary_backend.domain.game.service.timer.task.StartConfirmTask;
//import lombok.RequiredArgsConstructor;
//import lombok.extern.slf4j.Slf4j;
//import org.springframework.data.redis.core.RedisTemplate;
//import org.springframework.data.redis.listener.ChannelTopic;
//import org.springframework.stereotype.Service;
//
//import java.util.HashMap;
//import java.util.concurrent.TimeUnit;
//
//@Slf4j
//@Service
//@RequiredArgsConstructor
//public class VoteService {
//
//    private final RedisTemplate<String, HashMap<Long, Integer>> voteRedisTemplate;
//
//    private final RedisPublisher publisher;
//    private final ChannelTopic endVoteTopic;
//    private final ChannelTopic endConfirmTopic;
//
//    private final SchedulerService scheduler;
//    private final StartConfirmTask startConfirmTask;
//
//    public void endVote(long gameId){
//        String voteKey = GameConstant.VOTE_KEY_PREFIX + gameId;
//        HashMap<Long, Integer> voteMap = voteRedisTemplate.opsForValue().get(voteKey);
//        if (voteMap == null) {
//            voteMap = new HashMap<>();
//        }
//        EndVoteMessage endVoteMessage = EndVoteMessage.builder().gameId(gameId).voteMap(voteMap).build();
//
//        endVoteMessage.organizeVote();
//
//        // todo : 게임상태 변경 해야함
//        // 타이머 - 최후변론 시간 주고 최종투표 안내.
//        startConfirmTask.setGameId(gameId);
//        scheduler.schedule(startConfirmTask, 2, TimeUnit.MINUTES);
//
//        // subscriber에게 메시지 발행
//        publisher.publish(endVoteTopic, endVoteMessage);
//
//        // 투표 결과 처리 후 Redis에서 해당 게임의 투표 데이터 삭제
//        voteRedisTemplate.delete(voteKey);
//    }
//
//
//    public void endConfirm(long gameId){
//        String voteKey = GameConstant.VOTE_KEY_PREFIX + gameId;
//        HashMap<Long, Integer> voteMap = voteRedisTemplate.opsForValue().get(voteKey);
//        if (voteMap == null) {
//            voteMap = new HashMap<>();
//        }
//
//        EndConfirmMessage endConfirmMessage = EndConfirmMessage.builder().gameId(gameId).voteMap(voteMap).build();
//
//        // 여기서 플레이어를 하나 죽이는게 좋나? remove 메서드를 하나 만들자 <- 이건 마피아 능력으로도 쓸수있으니까!
//        endConfirmMessage.organizeVote();
//
//        publisher.publish(endConfirmTopic, endConfirmMessage);
//
//        // 레디스에 결과 삭제
//        voteRedisTemplate.delete(voteKey);
//    }
//}
