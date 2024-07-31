package e106.emissary_backend.domain.game.service.timer.task;

import e106.emissary_backend.domain.game.service.GameService;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class StartVoteTask implements GameTask {
    private final GameService gameService;
    private final Long gameId;

    @Override
    public void run() {
        execute(gameId);
    }

    @Override
    public void execute(Long gameId) {
        //todo : vote 시작 로직 구현

    }
}
