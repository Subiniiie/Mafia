package e106.emissary_backend.domain.game.repository;

import e106.emissary_backend.domain.game.model.Game;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.data.redis.DataRedisTest;
import org.springframework.data.redis.core.RedisTemplate;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@DataRedisTest
class RedisGameRepositoryTest {
    @Autowired
    private RedisGameRepository redisGameRepository;


    private Game game;

    @BeforeEach
    void setUp() {
        game = Game.builder()
                .gameId(1L)
                .title("테스트 게임")
                .ownerName("방장")
                .maxPlayer(5)
                .isHaveBetrayer(true)
                .build();

        // Redis에 게임 저장
        redisGameRepository.save(game);
    }

    @Test
    void findByGameId() {
        // given
        Long gameId = game.getGameId();

        // when
        Optional<Game> foundGame = redisGameRepository.findByGameId(gameId);

        // then
        assertTrue(foundGame.isPresent());
        assertEquals(game.getTitle(), foundGame.get().getTitle());
        assertEquals(game.getOwnerName(), foundGame.get().getOwnerName());
        assertEquals(game.getMaxPlayer(), foundGame.get().getMaxPlayer());
        assertEquals(game.isHaveBetrayer(), foundGame.get().isHaveBetrayer());
    }
}