package e106.emissary_backend.domain.game.service.subscriber.message;

import e106.emissary_backend.domain.game.enumType.GameState;
import e106.emissary_backend.domain.game.model.GameDTO;
import lombok.*;

@Builder
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class NightEmissaryMessage {
    private Long gameId;
    private GameDTO gameDTO;
    private Long targetId;
    private String result;
    private GameState gameState;
}
