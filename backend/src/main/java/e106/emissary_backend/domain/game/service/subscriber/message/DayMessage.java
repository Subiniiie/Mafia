package e106.emissary_backend.domain.game.service.subscriber.message;

import e106.emissary_backend.domain.game.enumType.GameState;
import e106.emissary_backend.domain.game.model.GameDTO;
import e106.emissary_backend.domain.game.service.GameService;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
public class DayMessage {
    private GameState gameState;
    private long gameId;
    private GameDTO gameDTO;
}
