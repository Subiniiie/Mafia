package e106.emissary_backend.domain.game.service.subscriber.message;

import e106.emissary_backend.domain.game.enumType.GameState;
import lombok.*;

@Builder
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class NightEmissaryMessage {
    private Long gameId;
    private Long targetId;
    private String result;
    private GameState gameState;
}
