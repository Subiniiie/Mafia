package e106.emissary_backend.domain.game.service.subscriber.message;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.HashMap;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
public class EndVoteMessage {
    private long gameId;
    private HashMap<Long, Integer> voteMap;
}
