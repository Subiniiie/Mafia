package e106.emissary_backend.domain.game.service.subscriber.message;

import e106.emissary_backend.domain.game.entity.Game;
import e106.emissary_backend.domain.game.enumType.GameRole;
import e106.emissary_backend.domain.game.model.GameDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.Map;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
public class DayMessage {
    private long gameId;
    private GameDTO gameDTO;
}
