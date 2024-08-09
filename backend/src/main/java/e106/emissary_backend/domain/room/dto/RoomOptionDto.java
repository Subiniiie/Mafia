package e106.emissary_backend.domain.room.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RoomOptionDto {
    private String title;
    private String password;
    private Integer maxPlayer;
    private boolean haveBetray;
    private String owner;
    private String ownerToken;
    private Long roomId;

    public static RoomOptionDto of(Long roomId, String owner, String ownerToken, RoomRequestDto roomRequestDto){
        return RoomOptionDto.builder()
                .title(roomRequestDto.getTitle())
                .password(roomRequestDto.getPassword())
                .maxPlayer(roomRequestDto.getMaxPlayer())
                .haveBetray(roomRequestDto.isHaveBetray())
                .owner(owner)
                .ownerToken(ownerToken)
                .roomId(roomId)
                .build();
    }
}
