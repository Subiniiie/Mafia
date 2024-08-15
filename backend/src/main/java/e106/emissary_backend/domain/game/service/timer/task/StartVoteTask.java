package e106.emissary_backend.domain.game.service.timer.task;

import e106.emissary_backend.domain.game.entity.Game;
import e106.emissary_backend.domain.game.enumType.GameState;
import e106.emissary_backend.domain.game.model.GameDTO;
import e106.emissary_backend.domain.game.repository.RedisGameRepository;
import e106.emissary_backend.domain.game.service.GameService;
import e106.emissary_backend.domain.game.service.publisher.RedisPublisher;
import e106.emissary_backend.domain.game.service.subscriber.message.StartVoteMessage;
import e106.emissary_backend.domain.game.service.timer.SchedulerService;
import e106.emissary_backend.global.error.CommonErrorCode;
import e106.emissary_backend.global.error.exception.NotFoundGameException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisKeyValueTemplate;
import org.springframework.data.redis.listener.ChannelTopic;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.concurrent.ScheduledFuture;
import java.util.concurrent.TimeUnit;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class StartVoteTask implements GameTask {
    private Long gameId;
    private GameDTO gameDTO;

    private final RedisPublisher publisher;

    private final ChannelTopic startVoteTopic;
    private final SchedulerService scheduler;
    private final EndVoteTask endVoteTask;

    private final RedisKeyValueTemplate redisKeyValueTemplate;
    private final RedisGameRepository redisGameRepository;

    @Override
    public void run() {
        execute(gameId);
    }

    @Override
    public void execute(Long gameId) {
        log.info("StartVoteTask started : {}", LocalDateTime.now());


        gameDTO.setGameState(GameState.VOTE_START);

        redisKeyValueTemplate.update(gameDTO.toDao());
        Game game = redisGameRepository.findById(gameId).orElseThrow(() -> new NotFoundGameException(CommonErrorCode.NOT_FOUND_GAME_EXCEPTION));
        log.info("레디스에 정상적으로 저장이 되었을까? : DTO의 상태 : {}, 실제 저장 : {}", gameDTO.getGameState(), game.getGameState());

        //todo : vote 시작했다고 publish -> sub에서 프론트에게 알림
        publisher.publish(startVoteTopic, StartVoteMessage.builder()
                .gameDTO(gameDTO)
                .gameState(GameState.VOTE_START)
                .gameId(gameId)
                .build());

        // 2분뒤 투표종료 안내
        endVoteTask.setGameId(gameId);
        scheduler.scheduleTask(gameId, TaskName.END_VOTE_TASK, endVoteTask, 30, TimeUnit.SECONDS);
    }

    public void setGameId(long gameId){
        this.gameId = gameId;
    }

    public void setGameDTO(GameDTO gameDTO){
        this.gameDTO = gameDTO;
    }
}
