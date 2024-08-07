package e106.emissary_backend.domain.game.service.subscriber.message;

import e106.emissary_backend.domain.game.model.GameDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
public class GameSetMessage {
    private long gameId;
    private GameDTO gameDTO;
}
