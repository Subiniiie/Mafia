package e106.emissary_backend.domain.room.dto;

import e106.emissary_backend.domain.room.entity.Room;
import e106.emissary_backend.domain.room.enumType.RoomState;
import io.jsonwebtoken.lang.Objects;
import lombok.*;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Setter
public class RoomRequestDto {
    private String title;
    private String password;
    private int maxPlayer;
    @JsonProperty("haveBetray")
    private boolean haveBetray;

    public Room toEntity(long userId){
        boolean isPrivate = false;
        if(Objects.isEmpty(getPassword())){
            isPrivate = true;
        }

        return Room.builder()
                .title(getTitle())
                .password(getPassword())
                .haveBetray(isHaveBetrayer())
                .maxPlayer(getMaxPlayer())
                .ownerId(userId)
                .isPrivate(isPrivate)
                .roomState(RoomState.WAIT)
                .build();
    }
}
