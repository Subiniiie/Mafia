package e106.emissary_backend.domain.user.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import e106.emissary_backend.domain.room.dto.RoomDetailDto;
import e106.emissary_backend.domain.user.entity.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoomDetailUserDto {
    private long userId;

    private String nickname;

    @JsonProperty("owner")
    private boolean isOwner;

    public static RoomDetailUserDto of(User user, long ownerId){
        return RoomDetailUserDto.builder()
                .userId(user.getUserId())
                .nickname(user.getNickname())
                .isOwner(user.getUserId() == ownerId)
                .build();
    }

}
