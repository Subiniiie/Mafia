package e106.emissary_backend.domain.game.service;

import e106.emissary_backend.domain.game.enumType.GameRole;
import e106.emissary_backend.domain.game.enumType.GameState;
import e106.emissary_backend.domain.game.mapper.GameDaoMapper;
import e106.emissary_backend.domain.game.model.Game;
import e106.emissary_backend.domain.game.model.GameResponseDTO;
import e106.emissary_backend.domain.game.repository.RedisGameRepository;
import e106.emissary_backend.domain.game.util.RoleUtils;
import e106.emissary_backend.domain.room.entity.Room;
import e106.emissary_backend.domain.room.enumType.RoomState;
import e106.emissary_backend.domain.room.repository.RoomRepository;
import e106.emissary_backend.global.error.CommonErrorCode;
import e106.emissary_backend.global.error.exception.NotFoundGameException;
import e106.emissary_backend.global.error.exception.NotFoundRoomException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Map;

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
        Game game = redisGameRepository.findById(roomId).orElseThrow(
                () -> new NotFoundGameException(CommonErrorCode.NOT_FOUND_GAME_EXCEPTION));

        Map<GameRole, Integer> roles = RoleUtils.getRole(game);

        game.setGameState(GameState.STARTED);
        game.setDay(0);
        game.setStartAt(LocalDateTime.now());




        Room room = roomRepository.findById(roomId).orElseThrow(
                () -> new NotFoundRoomException(CommonErrorCode.NOT_FOUND_ROOM_EXCEPTION));
        room.changeState(RoomState.STARTED);
    }
}
