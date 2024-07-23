package e106.emissary_backend.security.entity;

import e106.emissary_backend.user.entity.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.oauth2.core.OAuth2AccessToken;

import java.time.Instant;

@Entity
@Table(name="tokens")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Tokens {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "token_generator")
    @SequenceGenerator(name="token_generator", sequenceName = "tokens_seq", allocationSize = 1)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Enumerated(EnumType.STRING)
    private OAuth2AccessToken.TokenType tokenType;

    @Column(unique=true)
    private String token;

    @Column(unique=false)
    private Instant expiryDate;

    private boolean revoked;

    public enum TokenType {
        ACCESS,
        REFRESH
    }

    public boolean isExpired() {
        return expiryDate.isBefore(Instant.now());
    }
}
