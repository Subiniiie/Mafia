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
    private Integer password;
    private Integer maxPlayer;
    private boolean haveBetray;
    private String owner;

    public static RoomOptionDto of(String owner, RoomRequestDto roomRequestDto){
        return RoomOptionDto.builder()
                .title(roomRequestDto.getTitle())
                .password(roomRequestDto.getPassword())
                .maxPlayer(roomRequestDto.getMaxPlayer())
                .haveBetray(roomRequestDto.isHaveBetray())
                .owner(owner)
                .build();
    }
}
