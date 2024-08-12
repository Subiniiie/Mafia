package e106.emissary_backend.domain.game.service.subscriber.message;

import e106.emissary_backend.domain.game.enumType.CommonResult;
import e106.emissary_backend.domain.game.enumType.GameRole;
import e106.emissary_backend.domain.game.enumType.GameState;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
public class EndMessage {
    private long gameId;
    private GameState gameState;
    private CommonResult result;
    private GameRole winRole;
}
