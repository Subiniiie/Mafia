package e106.emissary_backend.domain.game.service.subscriber.message;

import e106.emissary_backend.domain.game.enumType.GameRole;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.HashMap;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
public class NightPoliceMessage {
    private Long gameId;
    private Long targetId;
    private GameRole result;
}
