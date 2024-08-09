package e106.emissary_backend.domain.game.aspect;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.reflect.MethodSignature;
import org.redisson.api.RLock;
import org.redisson.api.RedissonClient;
import org.springframework.stereotype.Component;

import java.lang.reflect.Method;
import java.util.concurrent.TimeUnit;

@Slf4j
@Aspect
@Component
@RequiredArgsConstructor
public class RedissonLockAspect {
    
    private final RedissonClient redissonClient;
    
    @Around("@annotation(e106.emissary_backend.domain.game.aspect.RedissonLock)")
    public Object redissonLock(ProceedingJoinPoint joinPoint) throws Throwable {
        MethodSignature signature = (MethodSignature) joinPoint.getSignature();
        Method method = signature.getMethod();
        RedissonLock annotation = method.getAnnotation(RedissonLock.class);
//        String lockKey = method.getName() + CustomSpringParser.getDynamicValue(signature.getParameterNames(), joinPoint.getArgs(), annotation.value());
        // 메서드 + id에서
        String lockKey = "" + CustomSpringParser.getDynamicValue(signature.getParameterNames(), joinPoint.getArgs(), annotation.value());

        RLock lock = redissonClient.getLock(lockKey);
        log.info("lock키는 무엇일까요? = {}", lockKey);
        try{
            boolean lockable = lock.tryLock(annotation.waitTime(), annotation.leaseTime(), TimeUnit.MILLISECONDS);
            if(!lockable){
                log.info("Lock 획득 실패 = {}", lockKey);
                return null;
            }
            log.info("로직 수행");
            return joinPoint.proceed();
        }catch (InterruptedException e){
            log.info("에러 발생");
            throw e;
        }finally{
            log.info("락 해제");
            lock.unlock();
        }
    }
}
