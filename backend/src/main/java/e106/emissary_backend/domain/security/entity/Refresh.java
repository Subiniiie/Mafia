package e106.emissary_backend.domain.security.entity;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;

@RedisHash(value="refresh", timeToLive = 604800)
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class Refresh {

    @Id
    private Long userId;
    private String username;
    private String refresh;
    private String expiration;
}
