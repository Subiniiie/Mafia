package e106.emissary_backend.security.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

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

    private String userName;
    private String token;
    private boolean expired;
    private boolean revoked;
}
