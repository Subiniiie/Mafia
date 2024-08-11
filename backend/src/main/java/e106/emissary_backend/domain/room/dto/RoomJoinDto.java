package e106.emissary_backend.domain.room.dto;

import lombok.*;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RoomJoinDto {
    private String roomId;
    private String token;

    public static RoomJoinDto of(String roomId, String token) {
        return RoomJoinDto.builder()
                .roomId(roomId)
                .token(token).build();
    }
}
