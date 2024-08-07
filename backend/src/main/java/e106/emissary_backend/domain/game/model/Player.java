package e106.emissary_backend.domain.game.model;


import e106.emissary_backend.domain.game.enumType.GameRole;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.*;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.time.ZoneId;

import lombok.extern.slf4j.Slf4j;
import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;
import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;

//@RedisHash("player")
@Slf4j
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Player implements Serializable {

    @Id
    private Long id;

    private String nickname;

    @Enumerated(EnumType.STRING)
    private GameRole role;

    private boolean isReady;

    private boolean isLeft;

    private boolean isVoted;

    @Builder.Default
    private boolean isAlive = true;

    @Builder.Default
    private boolean isWin = false;

    private long creationTime;

    public static Player createPlayer(Long id, String nickname, LocalDateTime creationTime) {
        return Player.builder()
                .id(id)
                .nickname(nickname)
                .isReady(false)
                .isLeft(false)
                .isVoted(false)
                .creationTime(creationTime.atZone(ZoneId.systemDefault()).toEpochSecond())
                .build();
    }
}