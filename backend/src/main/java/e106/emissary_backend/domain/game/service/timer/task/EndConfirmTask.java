package e106.emissary_backend.domain.game.service.timer.task;

import e106.emissary_backend.domain.game.GameConstant;
import e106.emissary_backend.domain.game.aspect.RedissonLock;
import e106.emissary_backend.domain.game.entity.Game;
import e106.emissary_backend.domain.game.model.GameDTO;
import e106.emissary_backend.domain.game.repository.RedisGameRepository;
import e106.emissary_backend.domain.game.service.GameService;
import e106.emissary_backend.domain.game.service.publisher.RedisPublisher;
import e106.emissary_backend.domain.game.service.subscriber.message.EndConfirmMessage;
import e106.emissary_backend.domain.game.service.subscriber.message.EndVoteMessage;
import e106.emissary_backend.global.error.CommonErrorCode;
import e106.emissary_backend.global.error.exception.NotFoundGameException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisKeyValueTemplate;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.listener.ChannelTopic;
import org.springframework.stereotype.Service;

import java.util.HashMap;

@Service
@RequiredArgsConstructor
public class EndConfirmTask implements GameTask {
    private Long gameId;

    private final RedisTemplate<String, HashMap<Long, Integer>> voteRedisTemplate;
    private final RedisKeyValueTemplate redisKeyValueTemplate;
    private final RedisGameRepository redisGameRepository;


    private final RedisPublisher publisher;
    private final ChannelTopic endConfirmTopic;


    @Override
    public void run() {
        execute(gameId);
    }

    @RedissonLock(value = "#gameId")
    @Override
    public void execute(Long gameId) {
        Game game = redisGameRepository.findById(gameId).orElseThrow(
                () -> new NotFoundGameException(CommonErrorCode.NOT_FOUND_GAME_EXCEPTION));
        GameDTO gameDTO = GameDTO.toDto(game);

        gameDTO.getPlayerMap().values().forEach(player -> {player.setVoted(false);});

        redisKeyValueTemplate.update(gameDTO.toDao());

        String voteKey = GameConstant.VOTE_KEY_PREFIX + gameId;
        HashMap<Long, Integer> voteMap = voteRedisTemplate.opsForValue().get(voteKey);
        if (voteMap == null) {
            voteMap = new HashMap<>();
        }

        EndConfirmMessage endConfirmMessage = EndConfirmMessage.builder().gameId(gameId).voteMap(voteMap).build();

        // todo : 여기서 플레이어를 하나 죽이는게 좋나? remove 메서드를 하나 만들자 <- 이건 마피아 능력으로도 쓸수있으니까!
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
