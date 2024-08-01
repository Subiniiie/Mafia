package e106.emissary_backend.domain.game.model;

import e106.emissary_backend.domain.game.enumType.GameState;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GameResponseDTO {

    private Long gameId;
    private Long gameId;

    private String title;

    private String ownerName;

    private List<Player> emissary;

    private Player police;

    private Player betrayer;

    //    private List<Player> playerList;
    // ID, player객체
    private Map<Long, Player> playerMap;

    private GameState gameState;

    private int day;

    private LocalDateTime timer;

    private LocalDateTime startAt;

    private LocalDateTime finishAt;

    public static GameResponseDTO toDto(Game game) {
        return GameResponseDTO.builder()
                .gameId(game.getGameId())
                .title(game.getTitle())
                .ownerName(game.getOwnerName())
                .emissary(game.getEmissary())
                .police(game.getPolice())
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
