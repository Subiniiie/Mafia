package e106.emissary_backend.domain.game.service.timer.task;

public interface GameTask extends Runnable {
    void execute(Long gameId);
}
