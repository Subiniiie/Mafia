package e106.emissary_backend.domain.room.service.subscriber.message;


import e106.emissary_backend.domain.game.enumType.GameState;
import e106.emissary_backend.domain.room.dto.RoomDetailDto;
import e106.emissary_backend.domain.room.dto.RoomRequestDto;
import e106.emissary_backend.domain.room.dto.RoomStompJoinUserDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Builder
public class EnterRoomMessage {
    GameState gameState;
    RoomDetailDto roomDetailDto;
}
