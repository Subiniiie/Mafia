package e106.emissary_backend.domain.game.model;

import e106.emissary_backend.domain.game.enumType.GameRole;
import e106.emissary_backend.domain.game.enumType.GameState;
import e106.emissary_backend.global.error.CommonErrorCode;
import e106.emissary_backend.global.error.exception.GameFullException;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;

import java.time.LocalDateTime;
import java.util.*;
import java.util.List;

@RedisHash("game")
@Setter
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Game {
    @Id
    private Long gameId;

    private String title;

    private String ownerName;

    private int maxPlayer;

    private List<Player> emissary;

    private Player police;

    private boolean isHaveBetrayer;

    private Player betrayer;

    @Builder.Default
    private Map<Long, Player> playerMap = new HashMap<>();

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
