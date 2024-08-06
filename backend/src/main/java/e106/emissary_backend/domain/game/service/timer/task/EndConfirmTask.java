package e106.emissary_backend.domain.game.service.timer.task;

import e106.emissary_backend.domain.game.GameConstant;
import e106.emissary_backend.domain.game.aspect.RedissonLock;
import e106.emissary_backend.domain.game.service.GameService;
import e106.emissary_backend.domain.game.service.publisher.RedisPublisher;
import e106.emissary_backend.domain.game.service.subscriber.message.EndConfirmMessage;
import e106.emissary_backend.domain.game.service.subscriber.message.EndVoteMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.listener.ChannelTopic;
import org.springframework.stereotype.Service;

import java.util.HashMap;

@Service
@RequiredArgsConstructor
public class EndConfirmTask implements GameTask {
    private Long gameId;

    private final RedisTemplate<String, HashMap<Long, Integer>> voteRedisTemplate;

    private final RedisPublisher publisher;
    private final ChannelTopic endConfirmTopic;


    @Override
    public void run() {
        execute(gameId);
    }

    @RedissonLock(value = "#gameId")
    @Override
    public void execute(Long gameId) {
        // todo : vote 종료 로직 구현
        // todo : 투표 결과를 EndVoteMessage에 담아서 내려보내야함.
        // todo : 이거 그냥 바로 service로 넘길까? 그래야 publish를 한번에 처리하기가 좋고 schedule 예약하기가 좋음
        // todo : 게임 상태도 confirm으로 바꿔줘야함

        // todo : endConfirmMessage에 결과를 담아서 프론트로 보내자.
        String voteKey = GameConstant.VOTE_KEY_PREFIX + gameId;
        HashMap<Long, Integer> voteMap = voteRedisTemplate.opsForValue().get(voteKey);
        if (voteMap == null) {
            voteMap = new HashMap<>();
        }

        EndConfirmMessage endConfirmMessage = EndConfirmMessage.builder().gameId(gameId).voteMap(voteMap).build();

        // 여기서 플레이어를 하나 죽이는게 좋나? remove 메서드를 하나 만들자 <- 이건 마피아 능력으로도 쓸수있으니까!
        endConfirmMessage.organizeVote();

        publisher.publish(endConfirmTopic, endConfirmMessage);

        // 레디스에 결과 삭제
        voteRedisTemplate.delete(voteKey);
//        gameService.endConfirm(EndConfirmMessage.builder().gameId(gameId).build());
    }

    public void setGameId(long gameId){
        this.gameId = gameId;
    }

}
