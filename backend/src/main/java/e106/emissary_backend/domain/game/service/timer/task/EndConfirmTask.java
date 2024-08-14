package e106.emissary_backend.domain.game.service.timer.task;

import e106.emissary_backend.domain.game.GameConstant;
import e106.emissary_backend.domain.game.aspect.RedissonLock;
import e106.emissary_backend.domain.game.entity.Game;
import e106.emissary_backend.domain.game.enumType.GameState;
import e106.emissary_backend.domain.game.model.GameDTO;
import e106.emissary_backend.domain.game.model.Player;
import e106.emissary_backend.domain.game.repository.RedisGameRepository;
import e106.emissary_backend.domain.game.service.publisher.RedisPublisher;
import e106.emissary_backend.domain.game.service.subscriber.message.EndConfirmMessage;
import e106.emissary_backend.domain.game.service.timer.SchedulerService;
import e106.emissary_backend.domain.game.util.GameUtil;
import e106.emissary_backend.global.error.CommonErrorCode;
import e106.emissary_backend.global.error.exception.NotFoundGameException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisKeyValueTemplate;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.listener.ChannelTopic;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.TimeUnit;

@Slf4j
@Service
@Transactional
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
        log.info("end confirm task run");
        Game game = redisGameRepository.findById(gameId).orElseThrow(
                () -> new NotFoundGameException(CommonErrorCode.NOT_FOUND_GAME_EXCEPTION));
        GameDTO gameDTO = GameDTO.toDto(game);
        gameDTO.setGameState(GameState.CONFIRM_END);

        Map<Long, Player> playerMap = gameDTO.getPlayerMap();
        playerMap.values().forEach(player -> {player.setVoted(false);});

//        redisKeyValueTemplate.update(gameDTO.toDao());

        String voteKey = GameConstant.VOTE_KEY_PREFIX + gameId;
        HashMap<Long, Integer> voteMap = voteRedisTemplate.opsForValue().get(voteKey);
        if (voteMap == null) {
            voteMap = new HashMap<>();
        }

        EndConfirmMessage endConfirmMessage = EndConfirmMessage.builder()
                .gameId(gameId)
                .gameDTO(gameDTO)
                .voteMap(voteMap)
                .build();

        endConfirmMessage.organizeVote();

        // 죽이기`
        if(endConfirmMessage.getResult().equals("DEATH")){
            playerMap.get(endConfirmMessage.getTargetId()).setAlive(false);
        }

        endConfirmMessage.setPlayerMap(playerMap);

        // 레디스에 업데이트
        redisKeyValueTemplate.update(gameDTO.toDao());

        publisher.publish(endConfirmTopic, endConfirmMessage);



        // 레디스에 결과 삭제
        voteRedisTemplate.delete(voteKey);


        if(!gameUtil.isEnd(gameId)){
            log.info("game is not end in endConfirm ended");
            Player police = gameDTO.getPolice();
            Player emissary = gameDTO.getEmissary();
            nightEmissaryTask.setGameIdAndTargets(gameId, emissary, police);
            nightEmissaryTask.setPlayerMap(playerMap);
            schedulerService.scheduleTask(gameId, TaskName.NIGHT_EMISSARY, nightEmissaryTask, 15, TimeUnit.SECONDS);
        }
//        gameService.endConfirm(EndConfirmMessage.builder().gameId(gameId).build());
    }

    public void setGameId(long gameId){
        this.gameId = gameId;
    }

}
