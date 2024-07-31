package e106.emissary_backend.domain.game.repository;


import e106.emissary_backend.domain.game.entity.Game;
import e106.emissary_backend.domain.game.model.GameDTO;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
@Repository
public interface RedisGameRepository extends CrudRepository<Game, Long> {
    Optional<Game> findByGameId(Long gameDBId);
    Optional<Game> findByGameId(Long gameDBId);
}
