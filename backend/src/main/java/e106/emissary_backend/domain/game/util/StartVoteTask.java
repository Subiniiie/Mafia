package e106.emissary_backend.domain.game.util;

import e106.emissary_backend.domain.game.service.GameService;
import lombok.RequiredArgsConstructor;

import java.util.concurrent.ScheduledExecutorService;

@RequiredArgsConstructor
public class StartVoteTask implements GameTask {
    private final GameService gameService;
    private final ScheduledExecutorService scheduler;

    @Override
    public void run() {

    }

    @Override
    public void run(Long roomId) {

    }
}
