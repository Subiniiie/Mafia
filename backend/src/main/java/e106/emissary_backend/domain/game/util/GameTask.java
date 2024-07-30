package e106.emissary_backend.domain.game.util;

import org.springframework.stereotype.Component;

@Component
public interface GameTask extends Runnable {
    void run(Long roomId);
}
