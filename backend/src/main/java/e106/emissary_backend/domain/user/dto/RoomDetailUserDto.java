package e106.emissary_backend.domain.user.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import e106.emissary_backend.domain.game.enumType.GameRole;
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
    private boolean owner;

    @JsonProperty("me")
    private boolean me;

    @Builder.Default
    private GameRole gameRole = GameRole.PERSON;

    @JsonProperty("alive")
    @Builder.Default
    private boolean alive = true;

    @JsonProperty("voted")
    @Builder.Default
    private boolean voted = false;

    public static RoomDetailUserDto of(User user, long ownerId, long userId){
        RoomDetailUserDto roomDetailUserDto = RoomDetailUserDto.builder()
                .userId(user.getUserId())
                .nickname(user.getNickname())
                .owner(user.getUserId() == ownerId)
                .build();

        roomDetailUserDto.changeProperty(userId);

        return roomDetailUserDto;
    }

    private void changeProperty(long userId) {
        if(userId == this.userId) {
            this.me = true;
        }else{
            this.me = false;
        }
    }

}
