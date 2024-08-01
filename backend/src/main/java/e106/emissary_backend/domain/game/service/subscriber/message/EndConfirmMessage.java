package e106.emissary_backend.domain.game.service.subscriber.message;

import e106.emissary_backend.domain.game.enumType.VoteState;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.HashMap;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
public class EndConfirmMessage {
    private long gameId;
    private HashMap<Long, Integer> voteMap;
    private String result;

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
}
