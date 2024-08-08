package e106.emissary_backend.domain.room.dto;

import e106.emissary_backend.domain.room.entity.Room;
import e106.emissary_backend.global.error.CommonErrorCode;
import e106.emissary_backend.global.error.exception.NotFoundUserException;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RoomListDto {
    private String title;
    private long roomId;
    private String ownerName;
    private int nowPlayer;
    private int maxPlayer;
    private String password;
    private boolean isPrivate;
}
