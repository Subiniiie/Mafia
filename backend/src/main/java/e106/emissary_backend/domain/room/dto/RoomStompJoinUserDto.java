package e106.emissary_backend.domain.room.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RoomStompJoinUserDto {

    private String userId;
    private String nickname;
    private String roomId;

}
