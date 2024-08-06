package e106.emissary_backend.domain.room.dto;

import e106.emissary_backend.domain.room.entity.Room;
import e106.emissary_backend.domain.room.enumType.RoomState;
import e106.emissary_backend.domain.user.dto.RoomDetailUserDto;
import e106.emissary_backend.domain.user.entity.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RoomDetailDto {

    private long roomId;

    private String title;

    private int password;

    private long ownerId;

    private RoomState roomState;

    private int maxPlayer;

    private boolean haveBetray;

    private List<RoomDetailUserDto> userList;

    public static RoomDetailDto toDTO(Room room, List<RoomDetailUserDto> userList) {
        return RoomDetailDto.builder()
                .roomId(room.getRoomId())
                .title(room.getTitle())
                .password(room.getPassword())
                .ownerId(room.getOwnerId())
                .roomState(room.getRoomState())
                .maxPlayer(room.getMaxPlayer())
                .haveBetray(room.isHaveBetray())
                .userList(userList)
                .build();
    }
}
