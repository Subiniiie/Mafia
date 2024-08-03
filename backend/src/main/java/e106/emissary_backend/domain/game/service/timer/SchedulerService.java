package e106.emissary_backend.domain.game.service.timer;

import jakarta.annotation.PreDestroy;
import org.springframework.stereotype.Service;

import java.util.concurrent.*;

@Service
public class SchedulerService {
    private final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);


    public ScheduledFuture<?> schedule(Runnable task, long delay, TimeUnit timeUnit) {
        return scheduler.schedule(task, delay, timeUnit);
    }

    public ScheduledFuture<?> scheduleAtFixedRate(Runnable task, long initialDelay, long period, TimeUnit timeUnit) {
        return scheduler.scheduleAtFixedRate(task, initialDelay, period, timeUnit);
    }

    @PreDestroy
    public void shutdown() {
        scheduler.shutdown();
        try {
            if (!scheduler.awaitTermination(60, TimeUnit.SECONDS)) {
                scheduler.shutdownNow();
            }
        } catch (InterruptedException e) {
            scheduler.shutdownNow();
        }
    }
}
