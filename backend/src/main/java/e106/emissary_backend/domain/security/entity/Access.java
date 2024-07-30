package e106.emissary_backend.domain.security.entity;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;

@RedisHash(value="access", timeToLive = 604800)
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class Access {

    @Id
    private Long userId;
    private String username;
    private String access;
    private String expiration;
}
