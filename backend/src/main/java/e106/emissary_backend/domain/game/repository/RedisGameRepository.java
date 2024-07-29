package e106.emissary_backend.domain.game.repository;


import e106.emissary_backend.domain.game.model.Game;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RedisGameRepository extends CrudRepository<Game, Long> {
    Optional<Game> findByGameId(Long gameDBId);
}
