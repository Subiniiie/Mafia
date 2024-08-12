package e106.emissary_backend.domain.room.service.subscriber.message;


import e106.emissary_backend.domain.game.enumType.GameState;
import e106.emissary_backend.domain.room.dto.RoomDetailDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Builder
public class KickUserMessage {
    GameState gameState;
    long roomId;
    long targetId;
}
