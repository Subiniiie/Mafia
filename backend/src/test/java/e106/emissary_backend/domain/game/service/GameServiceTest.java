package e106.emissary_backend.domain.game.service;

import e106.emissary_backend.domain.game.entity.Game;
import e106.emissary_backend.domain.game.enumType.GameState;
import e106.emissary_backend.domain.game.model.GameDTO;
import e106.emissary_backend.domain.game.model.GameResponseDTO;
import e106.emissary_backend.domain.game.repository.RedisGameRepository;
import e106.emissary_backend.domain.room.entity.Room;
import e106.emissary_backend.domain.room.enumType.RoomState;
import e106.emissary_backend.domain.room.repository.RoomRepository;
import e106.emissary_backend.global.error.exception.NotFoundGameException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.redis.core.RedisKeyValueTemplate;
import org.springframework.data.redis.core.RedisTemplate;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class GameServiceTest {

    @Mock
    private RedisTemplate<String, String> redisTemplate;
    @Mock
    private RedisGameRepository redisGameRepository;
    @Mock
    private RoomRepository roomRepository;
    @Mock
    private RedisKeyValueTemplate redisKeyValueTemplate;

//    @Spy
//    private GameMapper gameMapper = Mappers.getMapper(GameMapper.class);

    @InjectMocks
    private GameService gameService;

    private GameDTO testGameDTO;
    private Game testGame;
    private Room testRoom;

    @BeforeEach
    void setUp() {
        testGameDTO = GameDTO.builder()
                .gameId(1L)
                .title("Test Game")
                .gameState(GameState.WAIT)
                .build();

        testGame = Game.builder()
                .gameId(1L)
                .title("Test Game")
                .gameState(GameState.WAIT)
                .build();

        testRoom = Room.builder()
                .roomId(1L)
                .title("Test Room")
                .maxPlayer(8)
                .roomState(RoomState.WAIT)
                .ownerId(1L)
                .haveBetray(true)
                .build();
    }

//    @Test
//    void updateGame() {
////        when(gameMapper.INSTANCE.toGame(any(GameDTO.class))).thenReturn(testGame);
//
//        gameService.update(testGameDTO);
//
//        verify(redisKeyValueTemplate, times(1)).update(any(Game.class));
//    }

    @Test
    void findGameById_Success() {
        when(redisGameRepository.findByGameId(1L)).thenReturn(Optional.of(testGame));

        GameResponseDTO result = gameService.findGameById(1L);

        assertNotNull(result);
        assertEquals(testGameDTO.getGameId(), result.getGameId());
        assertEquals(testGameDTO.getTitle(), result.getTitle());
    }

    @Test
    void findGameById_NotFound() {
        when(redisGameRepository.findByGameId(1L)).thenReturn(Optional.empty());

        assertThrows(NotFoundGameException.class, () -> gameService.findGameById(1L));
    }

//    @Test
//    void startGame_Success() {
//        when(redisGameRepository.findById(1L)).thenReturn(Optional.of(testGame));
//        when(roomRepository.findById(1L)).thenReturn(Optional.of(testRoom));
//
//        gameService.startGame(1L);
//
//        assertEquals(GameState.STARTED, testGameDTO.getGameState());
//        assertEquals(0, testGameDTO.getDay());
//        assertNotNull(testGameDTO.getStartAt());
//        assertEquals(RoomState.STARTED, testRoom.getRoomState());
//
//        verify(redisKeyValueTemplate, times(1)).update(any(Game.class));
//    }

    @Test
    void setGame_GameNotFound() {
        when(redisGameRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(NotFoundGameException.class, () -> gameService.setGame(1L));
    }

//    @Test
//    void startGame_RoomNotFound() {
//        when(redisGameRepository.findById(1L)).thenReturn(Optional.of(testGame));
//        when(roomRepository.findById(1L)).thenReturn(Optional.empty());
//
//        assertThrows(NotFoundRoomException.class, () -> gameService.startGame(1L));
//    }
}