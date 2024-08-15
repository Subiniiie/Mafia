package e106.emissary_backend.domain.game.service.timer;

import jakarta.annotation.PreDestroy;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.concurrent.*;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Slf4j
@Service
public class SchedulerService {
    private final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(20);
    private final Map<Long, Map<String, ScheduledFuture<?>>> gameTasks = new ConcurrentHashMap<>();

    public ScheduledFuture<?> scheduleTask(Long gameId, String taskName, Runnable task, long delay, TimeUnit timeUnit) {
        ScheduledFuture<?> future = scheduler.schedule(task, delay, timeUnit);
        gameTasks.computeIfAbsent(gameId, k -> new ConcurrentHashMap<>()).put(taskName, future);
        return future;
    }

    public ScheduledFuture<?> scheduleAtFixedRate(Long gameId, String taskName, Runnable task, long initialDelay, long period, TimeUnit timeUnit) {
        ScheduledFuture<?> future = scheduler.scheduleAtFixedRate(task, initialDelay, period, timeUnit);
        gameTasks.computeIfAbsent(gameId, k -> new ConcurrentHashMap<>()).put(taskName, future);
        return future;
    }

    public boolean cancelTask(Long gameId, String taskName) {
        Map<String, ScheduledFuture<?>> tasks = gameTasks.get(gameId);
        log.info("취소할 스케줄러 : {}",tasks.toString());
        if (tasks != null) {
            ScheduledFuture<?> future = tasks.remove(taskName);
            log.info("삭제 완료");
            if (future != null && !future.isDone()) {
                return future.cancel(false);
            }
        }
        return false;
    }

    public void cancelAllTasksForGame(Long gameId) {
        Map<String, ScheduledFuture<?>> tasks = gameTasks.remove(gameId);
        if (tasks != null) {
            tasks.values().forEach(future -> future.cancel(false));
        }
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