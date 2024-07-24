package e106.emissary_backend.domain.room.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RoomRequestDto {
    private String title;
    private int password;
    private int maxPlayer;
    private boolean haveBetray;
}
