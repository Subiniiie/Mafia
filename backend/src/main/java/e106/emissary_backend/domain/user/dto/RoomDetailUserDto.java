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
    private boolean isOwner;

    @JsonProperty("isMe")
    private boolean isMe;

    @Builder.Default
    private GameRole gameRole = GameRole.PERSON;

    @JsonProperty("isAlive")
    @Builder.Default
    private boolean isAlive = true;

    @JsonProperty("isVoted")
    @Builder.Default
    private boolean isVoted = false;

    public static RoomDetailUserDto of(User user, long ownerId, long userId){
        RoomDetailUserDto roomDetailUserDto = RoomDetailUserDto.builder()
                .userId(user.getUserId())
                .nickname(user.getNickname())
                .isOwner(user.getUserId() == ownerId)
                .build();

        roomDetailUserDto.changeProperty(userId);

        return roomDetailUserDto;
    }

    private void changeProperty(long userId) {
        if(userId == this.userId) {
            this.isMe = true;
        }else{
            this.isMe = false;
        }
    }

}
