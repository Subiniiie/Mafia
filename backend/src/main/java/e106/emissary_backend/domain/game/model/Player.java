package e106.emissary_backend.domain.game.model;


import e106.emissary_backend.domain.game.enumType.GameRole;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import lombok.*;

import java.io.Serializable;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Player implements Serializable {

    @Id
    private String id;

    private String nickname;

    @Enumerated(EnumType.STRING)
    private GameRole role;

    private boolean isLeft;

    private boolean isAlive;
}

