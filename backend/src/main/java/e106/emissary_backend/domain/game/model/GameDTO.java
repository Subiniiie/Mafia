package e106.emissary_backend.domain.game.model;

import e106.emissary_backend.domain.game.entity.Game;
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

@ToString
@Setter
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class GameDTO {
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
                        .isReady(player.isReady())
                        .role(GameRole.PERSON)
                        .build());
    }

    public Optional<Player> findPlayerByNickname(String nickname) {
        return Optional.ofNullable(playerMap.get(nickname));
    }

    public Game toDao(){
        return Game.builder()
                .gameId(gameId)
                .title(title)
                .ownerName(ownerName)
                .maxPlayer(maxPlayer)
                .emissary(emissary)
                .police(police)
                .isHaveBetrayer(isHaveBetrayer)
                .betrayer(betrayer)
                .playerMap(playerMap)
                .gameState(gameState)
                .day(day)
                .timer(timer)
                .startAt(startAt)
                .finishAt(finishAt)
                .build();
    }

    public static GameDTO toDto(Game game){
        return GameDTO.builder()
                .gameId(game.getGameId())
                .title(game.getTitle())
                .ownerName(game.getOwnerName())
                .maxPlayer(game.getMaxPlayer())
                .emissary(game.getEmissary())
                .police(game.getPolice())
                .isHaveBetrayer(game.isHaveBetrayer())
                .betrayer(game.getBetrayer())
                .playerMap(game.getPlayerMap())
                .gameState(game.getGameState())
                .day(game.getDay())
                .timer(game.getTimer())
                .startAt(game.getStartAt())
                .finishAt(game.getFinishAt())
                .build();
    }
}
