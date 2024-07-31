package e106.emissary_backend.domain.game.model;


import e106.emissary_backend.domain.game.enumType.GameRole;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.*;

import java.io.Serializable;

import lombok.extern.slf4j.Slf4j;
import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;

@RedisHash("player")
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

    private boolean isAlive;

    public static Player createPlayer(Long id, String nickname) {
        return Player.builder()
                .id(id)
                .nickname(nickname)
                .build();
    }
}