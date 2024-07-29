package e106.emissary_backend.domain.game.model;

import e106.emissary_backend.domain.game.enumType.GameRole;
import e106.emissary_backend.domain.game.enumType.GameState;
import e106.emissary_backend.global.error.CommonErrorCode;
import e106.emissary_backend.global.error.exception.GameFullException;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.redis.core.RedisHash;
import org.springframework.data.redis.core.index.Indexed;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.*;
import java.util.List;

@RedisHash("game")
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Game {
    @Id
    private Long gameId;

    private String title;

    private String ownerName;

    private List<Player> emissary;

    private int maxPlayer;

    private Player police;

    private boolean isHaveBetrayer;

    private Player betrayer;

    private Map<Long, Player> playerMap;

    @Enumerated(EnumType.STRING)
    private GameState gameState;

    private int day;

    private LocalDateTime timer;

    private LocalDateTime startAt;

    private LocalDateTime finishAt;

    public void addPlayer(Player player){
        if(maxPlayer < playerMap.size()){
            throw new GameFullException(CommonErrorCode.GAME_FULL_EXCEPTION);
        }

        playerMap.put(player.getId(),
                Player.builder()
                        .id(player.getId())
                        .nickname(player.getNickname())
                        .isAlive(false)
                        .isLeft(false)
                        .role(GameRole.PERSON)
                        .build());
    }

    public Optional<Player> findPlayerByNickname(String nickname) {
        return Optional.ofNullable(playerMap.get(nickname));
    }
}
