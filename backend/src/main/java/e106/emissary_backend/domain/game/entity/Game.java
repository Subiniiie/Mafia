package e106.emissary_backend.domain.game.entity;

import e106.emissary_backend.domain.game.enumType.GameState;
import e106.emissary_backend.domain.game.model.Player;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


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

    private int maxPlayer;

    @Builder.Default
    private List<Player> emissary = new ArrayList<>();

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
}