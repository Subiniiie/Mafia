package e106.emissary_backend.domain.game.service.subscriber.message;

import e106.emissary_backend.domain.game.enumType.GameState;
import e106.emissary_backend.domain.game.enumType.VoteState;
import e106.emissary_backend.domain.game.model.GameDTO;
import e106.emissary_backend.domain.game.model.Player;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.HashMap;
import java.util.Map;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
public class EndConfirmMessage {
    private long gameId;
    @Builder.Default
    private GameState gameState = GameState.CONFIRM_END;
    private HashMap<Long, Integer> voteMap;
    private Long targetId;
    private String result;
    private GameDTO gameDTO;
    @Builder.Default
    private Map<Long, Player> playerMap = new HashMap<>();

    public void organizeVote() {
        if (voteMap == null || voteMap.isEmpty()) {
            result = "NO_VOTES";
            return;
        }

        int acceptCount = 0;
        int rejectCount = 0;

        for (Integer vote : voteMap.values()) {
            if (vote == 1) {
                acceptCount++;
            } else if (vote == 0) {
                rejectCount++;
            }
        }

        if (acceptCount > rejectCount) {
            result = "DEATH";
        } else {
            result = "CONTINUE";
        }
    }

    public void setPlayerMap(Map<Long, Player> playerMap) {
        this.playerMap = playerMap;
    }
}
