package e106.emissary_backend.domain.game.repository;


import e106.emissary_backend.domain.game.entity.Game;
import org.springframework.data.repository.CrudRepository;

public interface RedisGameRepository extends CrudRepository<Game, Long> {
}
