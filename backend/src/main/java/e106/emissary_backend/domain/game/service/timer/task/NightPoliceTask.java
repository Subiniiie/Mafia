package e106.emissary_backend.domain.game.service.timer.task;

import e106.emissary_backend.domain.game.entity.Game;
import e106.emissary_backend.domain.game.enumType.CommonResult;
import e106.emissary_backend.domain.game.enumType.GameState;
import e106.emissary_backend.domain.game.model.GameDTO;
import e106.emissary_backend.domain.game.model.Player;
import e106.emissary_backend.domain.game.repository.RedisGameRepository;
import e106.emissary_backend.domain.game.service.publisher.RedisPublisher;
import e106.emissary_backend.domain.game.service.subscriber.message.CommonMessage;
import e106.emissary_backend.domain.game.service.timer.SchedulerService;
import e106.emissary_backend.domain.game.util.GameUtil;
import e106.emissary_backend.global.error.CommonErrorCode;
import e106.emissary_backend.global.error.exception.NotFoundGameException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisKeyValueTemplate;
import org.springframework.data.redis.listener.ChannelTopic;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.concurrent.TimeUnit;

@Slf4j
@Service
@RequiredArgsConstructor
public class NightPoliceTask implements GameTask {
    private Long gameId;
    private Player police;
    private Map<Long, Player> playerMap;

    private final RedisGameRepository redisGameRepository;
    private final RedisKeyValueTemplate redisKeyValueTemplate;
    private final RedisPublisher publisher;

    private final ChannelTopic commonTopic;

    private final GameUtil gameUtil;

    @Override
    public void run() {
        execute(gameId);
    }

    @Override
    public void execute(Long gameId) {
        log.info("Night Police Task run : {}", LocalDateTime.now());

        Game game = redisGameRepository.findByGameId(gameId).orElseThrow(
                () -> new NotFoundGameException(CommonErrorCode.NOT_FOUND_GAME_EXCEPTION));

        GameDTO gameDTO = GameDTO.toDto(game);

        gameDTO.setGameState(GameState.NIGHT_POLICE);

        redisKeyValueTemplate.update(gameDTO.toDao());

        publisher.publish(commonTopic, CommonMessage.builder()
                        .gameId(gameId)
                        .gameState(GameState.NIGHT_POLICE)
                        .result(CommonResult.SUCCESS)
                        .nowPlayer(police)
                        .playerMap(playerMap)
                        .build());
    }

    public void setGameIdAndTarget(long gameId, Player police){
        this.gameId = gameId;
        this.police = police;
    }

    public void setPlayerMap(Map<Long, Player> playerMap) {
        this.playerMap = playerMap;
    }
}
