package e106.emissary_backend.security.repository;

import e106.emissary_backend.security.entity.Tokens;
import e106.emissary_backend.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;

import java.util.List;
import java.util.Optional;

public interface TokenRepository extends JpaRepository<Tokens, Long> {
    Optional<Tokens> findByToken(String token);

    List<Tokens> findAllValidTokenByUser(User user);

    Optional<Tokens> findByUserAndTokenTypeAndRevoked(User user, Tokens.TokenType tokenType, boolean revoked);
}

