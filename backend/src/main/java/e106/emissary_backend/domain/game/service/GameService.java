package e106.emissary_backend.domain.game.service;

import e106.emissary_backend.domain.game.mapper.GameDaoMapper;
import e106.emissary_backend.domain.game.model.Game;
import e106.emissary_backend.domain.game.model.GameResponseDTO;
import e106.emissary_backend.domain.game.repository.RedisGameRepository;
import e106.emissary_backend.domain.room.repository.RoomRepository;
import e106.emissary_backend.global.error.CommonErrorCode;
import e106.emissary_backend.global.error.exception.NotFoundGameException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class GameService {

    private final RedisTemplate<String, String> redisTemplate;
    private final RedisGameRepository redisGameRepository;
    private final RoomRepository roomRepository;
    private final GameDaoMapper gameDaoMapper;

    /**
     Redis에서만 꺼내는거임.
     */
    public GameResponseDTO findGameById(Long roomId) {
        Game game = redisGameRepository.findByGameId(roomId).orElseThrow(
                () -> new NotFoundGameException(CommonErrorCode.NOT_FOUND_GAME_EXCEPTION));

        return GameResponseDTO.toDto(game);
    }


    public void start(Long roomId) {
        redisGameRepository.findById(roomId).orElseThrow(
                ()-> new NotFoundGameException(CommonErrorCode.NOT_FOUND_GAME_EXCEPTION));

    }
}
