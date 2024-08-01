package e106.emissary_backend.domain.room.dto;

import lombok.*;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Setter
public class RoomRequestDto {
    private String title;
    private int password;
    private int maxPlayer;
    private boolean haveBetray;
}
