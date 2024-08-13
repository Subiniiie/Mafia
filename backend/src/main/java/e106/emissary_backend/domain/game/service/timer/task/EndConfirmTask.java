package e106.emissary_backend.domain.game.service.timer.task;

import e106.emissary_backend.domain.game.GameConstant;
import e106.emissary_backend.domain.game.aspect.RedissonLock;
import e106.emissary_backend.domain.game.entity.Game;
import e106.emissary_backend.domain.game.enumType.EndType;
import e106.emissary_backend.domain.game.model.GameDTO;
import e106.emissary_backend.domain.game.model.Player;
import e106.emissary_backend.domain.game.repository.RedisGameRepository;
import e106.emissary_backend.domain.game.service.GameService;
import e106.emissary_backend.domain.game.service.publisher.RedisPublisher;
import e106.emissary_backend.domain.game.service.subscriber.message.EndConfirmMessage;
import e106.emissary_backend.domain.game.service.subscriber.message.EndVoteMessage;
import e106.emissary_backend.domain.game.service.timer.SchedulerService;
import e106.emissary_backend.domain.game.util.GameUtil;
import e106.emissary_backend.global.error.CommonErrorCode;
import e106.emissary_backend.global.error.exception.NotFoundGameException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisKeyValueTemplate;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.listener.ChannelTopic;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class EndConfirmTask implements GameTask {
    private final SchedulerService schedulerService;
    private Long gameId;

    private final RedisTemplate<String, HashMap<Long, Integer>> voteRedisTemplate;
    private final RedisKeyValueTemplate redisKeyValueTemplate;
    private final RedisGameRepository redisGameRepository;


    private final RedisPublisher publisher;
    private final ChannelTopic endConfirmTopic;

    private final NightEmissaryTask nightEmissaryTask;

    private final GameUtil gameUtil;

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

        Map<Long, Player> playerMap = gameDTO.getPlayerMap();
        playerMap.values().forEach(player -> {player.setVoted(false);});

        redisKeyValueTemplate.update(gameDTO.toDao());

        String voteKey = GameConstant.VOTE_KEY_PREFIX + gameId;
        HashMap<Long, Integer> voteMap = voteRedisTemplate.opsForValue().get(voteKey);
        if (voteMap == null) {
            voteMap = new HashMap<>();
        }

        EndConfirmMessage endConfirmMessage = EndConfirmMessage.builder().gameId(gameId).voteMap(voteMap).build();

        endConfirmMessage.organizeVote();

        // 죽이기`
        if(endConfirmMessage.getResult().equals("DEATH")){
            playerMap.get(endConfirmMessage.getTargetId()).setAlive(false);
        }

        publisher.publish(endConfirmTopic, endConfirmMessage);

        // 레디스에 결과 삭제
        voteRedisTemplate.delete(voteKey);


        if(!gameUtil.isEnd(gameId)){
            Long policeId = gameDTO.getPolice().getId();
            Long emissaryId = gameDTO.getEmissary().getId();
            nightEmissaryTask.setGameIdAndTargets(gameId, emissaryId, policeId);
            schedulerService.scheduleTask(gameId, TaskName.NIGHT_EMISSARY, nightEmissaryTask, 15, TimeUnit.SECONDS);
        }
//        gameService.endConfirm(EndConfirmMessage.builder().gameId(gameId).build());
    }

    public void setGameId(long gameId){
        this.gameId = gameId;
    }

}
