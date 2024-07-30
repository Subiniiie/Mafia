package e106.emissary_backend.domain.game.service;

import e106.emissary_backend.domain.game.entity.Game;
import e106.emissary_backend.domain.game.enumType.GameRole;
import e106.emissary_backend.domain.game.enumType.GameState;
import e106.emissary_backend.domain.game.mapper.GameMapper;
import e106.emissary_backend.domain.game.model.GameDTO;
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
import org.springframework.data.redis.core.RedisKeyValueTemplate;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class GameService {

    private final RedisTemplate<String, String> redisTemplate;
    private final RedisGameRepository redisGameRepository;
    private final RoomRepository roomRepository;
    private final RedisKeyValueTemplate redisKeyValueTemplate;
    private final GameMapper gameMapper;

    public void update(GameDTO gameDTO){
        Game game = GameMapper.INSTANCE.toGame(gameDTO);
        redisKeyValueTemplate.update(game);
    }

    public GameResponseDTO findGameById(Long roomId) {
        Game game = redisGameRepository.findByGameId(roomId).orElseThrow(
                () -> new NotFoundGameException(CommonErrorCode.NOT_FOUND_GAME_EXCEPTION));

        return GameResponseDTO.toDto(game);
    } // end of findGameById


    public void startGame(Long roomId) {
        Game game = redisGameRepository.findById(roomId).orElseThrow(
                () -> new NotFoundGameException(CommonErrorCode.NOT_FOUND_GAME_EXCEPTION));

        GameDTO gameDTO = GameMapper.INSTANCE.toGameDTO(game);

        gameDTO.setGameState(GameState.STARTED);
        gameDTO.setDay(0);
        gameDTO.setStartAt(LocalDateTime.now());

        // 역할부여
        Map<GameRole, Integer> roles = RoleUtils.getRole(gameDTO);
        RoleUtils.grantRole(roles, gameDTO);

        update(gameDTO);

        Room room = roomRepository.findById(roomId).orElseThrow(
                () -> new NotFoundRoomException(CommonErrorCode.NOT_FOUND_ROOM_EXCEPTION));
        room.changeState(RoomState.STARTED);
    } // end of startGame
}
