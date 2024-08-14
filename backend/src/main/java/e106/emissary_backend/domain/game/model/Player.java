package e106.emissary_backend.domain.game.model;


import com.fasterxml.jackson.annotation.JsonProperty;
import e106.emissary_backend.domain.game.enumType.GameRole;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.*;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.time.ZoneId;

import lombok.extern.slf4j.Slf4j;
import org.springframework.data.annotation.Id;

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

    @JsonProperty("ready")
    private boolean ready;

    @JsonProperty("left")
    private boolean left;

    @JsonProperty("voted")
    private boolean voted;

    @Builder.Default
    @JsonProperty("alive")
    private boolean alive = true;

    @Builder.Default
    @JsonProperty("win")
    private boolean win = false;

    @Builder.Default
    @JsonProperty("me")
    private boolean me = false;

    private long creationTime;

    public static Player createPlayer(Long id, String nickname, LocalDateTime creationTime) {
        return Player.builder()
                .id(id)
                .nickname(nickname)
                .ready(false)
                .left(false)
                .voted(false)
                .creationTime(creationTime
                        .atZone(ZoneId.systemDefault())
                        .toInstant()
                        .toEpochMilli())
                .alive(true)
                .build();
    }
}