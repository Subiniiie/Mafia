package e106.emissary_backend.security.repository;

import e106.emissary_backend.security.entity.Tokens;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TokenRepository extends JpaRepository<Tokens, Long> {
    Optional<Tokens> findByToken(String token);
}

