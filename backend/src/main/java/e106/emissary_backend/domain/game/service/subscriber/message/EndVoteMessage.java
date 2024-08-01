package e106.emissary_backend.domain.game.service.subscriber.message;

import e106.emissary_backend.domain.game.enumType.VoteState;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.*;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
public class EndVoteMessage {
    private long gameId;
    private HashMap<Long, Integer> voteMap;
    private VoteState result;
    private List<Long> maxPlayerList;

    public void organizeVote() {
        if (voteMap == null || voteMap.isEmpty()) {
            result = VoteState.RE_VOTE;
            maxPlayerList = new ArrayList<>();
            return;
        }

        // 제일 많은 표 구하고
        int maxVote = Collections.max(voteMap.values());
        List<Long> maxVoteList = new ArrayList<>();
        for (Map.Entry<Long, Integer> entry : voteMap.entrySet()) {
            // 그거랑 같은 Key (userId) 를 저장
            if (entry.getValue() == maxVote) {
                maxVoteList.add(entry.getKey());
            }
        }

        if (maxVoteList.size() > 1) {
            result = VoteState.RE_VOTE;
        } else {
            result = VoteState.FINISH;
        }

        maxPlayerList = maxVoteList;
    }
}
