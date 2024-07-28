package e106.emissary_backend.domain.game.service;

import e106.emissary_backend.domain.game.entity.Game;
import e106.emissary_backend.domain.game.model.GameResponseDTO;
import e106.emissary_backend.domain.game.model.Player;
import e106.emissary_backend.domain.game.repository.RedisGameRepository;
import e106.emissary_backend.domain.room.entity.Room;
import e106.emissary_backend.domain.room.repository.RoomRepository;
import e106.emissary_backend.global.error.CommonErrorCode;
import e106.emissary_backend.global.error.exception.NotFoundGameException;
import e106.emissary_backend.global.error.exception.NotFoundRoomException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class RedisGameService {

    private final RedisTemplate<String, String> redisTemplate;
    private final RedisGameRepository redisGameRepository;
    private final RoomRepository roomRepository;

    /**
     Redis에서만 꺼내는거임.
     */
    public GameResponseDTO findGameById(Long roomId) {
        Game game = redisGameRepository.findById(roomId).orElseThrow(
                () -> new NotFoundGameException(CommonErrorCode.NOT_FOUND_GAME_EXCEPTION));
        return GameResponseDTO.toDto(game);
    }

//    public GameResponseDTO addPlayer(Long roomId, String nickname) {
//        Game game = redisGameRepository.findById(roomId).orElseThrow(
//                () -> new NotFoundGameException(CommonErrorCode.NOT_FOUND_GAME_EXCEPTION));
//        game.addPlayer(nickname);
//    }
}
