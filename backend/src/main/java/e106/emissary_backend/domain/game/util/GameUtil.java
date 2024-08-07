package e106.emissary_backend.domain.game.util;

import e106.emissary_backend.domain.game.aspect.RedissonLock;
import e106.emissary_backend.domain.game.entity.Game;
import e106.emissary_backend.domain.game.enumType.CommonResult;
import e106.emissary_backend.domain.game.enumType.EndType;
import e106.emissary_backend.domain.game.enumType.GameRole;
import e106.emissary_backend.domain.game.enumType.GameState;
import e106.emissary_backend.domain.game.model.Player;
import e106.emissary_backend.domain.game.repository.RedisGameRepository;
import e106.emissary_backend.domain.game.service.publisher.RedisPublisher;
import e106.emissary_backend.domain.game.service.subscriber.message.CommonMessage;
import e106.emissary_backend.global.error.CommonErrorCode;
import e106.emissary_backend.global.error.exception.NotFoundGameException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisKeyValueTemplate;
import org.springframework.data.redis.listener.ChannelTopic;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import javax.management.relation.Role;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GameUtil {
    private final RedisGameRepository redisGameRepository;
    private final RedisKeyValueTemplate redisKeyValueTemplate;


    private final RedisPublisher redisPublisher;

    private final ChannelTopic commonTopic;

    @RedissonLock(value = "#gameId")
    public EndType isEnd(long gameId){
        Game game = redisGameRepository.findByGameId(gameId).orElseThrow(
                () -> new NotFoundGameException(CommonErrorCode.NOT_FOUND_GAME_EXCEPTION));

        Map<GameRole, Long> roleCounts = game.getPlayerMap().values().stream().collect(Collectors.groupingBy(
                Player::getRole,
                Collectors.counting()
        ));

        long emissaryCnt = roleCounts.getOrDefault(GameRole.EMISSARY, 0L) + roleCounts.getOrDefault(GameRole.BETRAYER, 0L);
        long personCnt = roleCounts.getOrDefault(GameRole.PERSON, 0L) + roleCounts.getOrDefault(GameRole.POLICE, 0L);
        EndType result;

        if(emissaryCnt == 0){
            result = EndType.PERSON_WIN;
        }else if(emissaryCnt >= personCnt){
            result = EndType.EMISSARY_WIN;
        }else{
            result = EndType.NO_END;
        }

        return result;
    }

    public void endPublish(long gameId){
        // todo : 반영하기

        redisGameRepository.deleteById(gameId);

        redisPublisher.publish(commonTopic, CommonMessage.builder()
                        .gameId(gameId)
                        .gameState(GameState.END)
                        .result(CommonResult.SUCCESS)
                        .build());
    }

}
