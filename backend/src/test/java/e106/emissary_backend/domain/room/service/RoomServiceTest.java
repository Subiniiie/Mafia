package e106.emissary_backend.domain.room.service;


import e106.emissary_backend.domain.game.entity.Game;
import e106.emissary_backend.domain.game.mapper.GameMapper;
import e106.emissary_backend.domain.game.repository.RedisGameRepository;
import e106.emissary_backend.domain.room.dto.RoomListDto;
import e106.emissary_backend.domain.room.dto.RoomOptionDto;
import e106.emissary_backend.domain.room.dto.RoomRequestDto;
import e106.emissary_backend.domain.room.entity.Room;
import e106.emissary_backend.domain.room.repository.RoomRepository;
import e106.emissary_backend.domain.user.entity.User;
import e106.emissary_backend.domain.user.repository.UserRepository;
import e106.emissary_backend.domain.userInRoom.entity.UserInRoom;
import e106.emissary_backend.domain.userInRoom.repoistory.UserInRoomRepository;
import e106.emissary_backend.global.common.CommonResponseDto;
import e106.emissary_backend.global.error.exception.NotFoundRoomException;
import e106.emissary_backend.global.error.exception.NotFoundUserException;
import e106.emissary_backend.domain.game.model.GameDTO;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Slice;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;


@ExtendWith(MockitoExtension.class)
class RoomServiceTest {

    @Mock
    private RoomRepository roomRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    private UserInRoomRepository userInRoomRepository;
    @Mock
    private RedisGameRepository redisGameRepository;

    @InjectMocks
    private RoomService roomService;

    private User testUser;
    private Room testRoom;
    private RoomRequestDto testRoomRequestDto;

    @BeforeEach
    void setUp() {
        testUser = User.builder()
                .userId(1L)
                .nickname("TestUser")
                .build();

        testRoom = Room.builder()
                .roomId(1L)
                .title("Test Room")
                .maxPlayer(4)
                .ownerId(1L)
                .haveBetray(true)
                .build();

        testRoomRequestDto = new RoomRequestDto();
        testRoomRequestDto.setTitle("Test Room");
        testRoomRequestDto.setMaxPlayer(4);
        testRoomRequestDto.setHaveBetray(true);
    }

    @Test
    void roomList() throws Exception{
        // given
        // 페이지 결과값
        List<Room> rooms = new ArrayList<>();
        for(int i=0; i<10 ;i++) {
            Room room = Room.builder()
                    .roomId(i)
                    .title("제목 " + i)
                    .ownerId(i)
                    .maxPlayer(i+1)
                    .build();
            rooms.add(room);
            when(userInRoomRepository.countPeopleByRoomId(i)).thenReturn(i);
        }
            // 첫번째 페이지
        PageRequest firstPageRequest = PageRequest.of(0, 5);
        Slice<Room> firstPageResult = new PageImpl<>(rooms.subList(0, 5), firstPageRequest, 10);
        when(roomRepository.findAllBy(firstPageRequest)).thenReturn(Optional.of(firstPageResult));

            // 두번째 페이지
        PageRequest secondPageRequest = PageRequest.of(1, 5);
        Slice<Room> secondPageResult = new PageImpl<>(rooms.subList(5, 10), secondPageRequest, 10);
        when(roomRepository.findAllBy(secondPageRequest)).thenReturn(Optional.of(secondPageResult));


        when(userRepository.findNicknameByUserId(anyLong())).thenReturn(Optional.of("방장"));



        // when
        List<RoomListDto> firstResult = roomService.getRooms(firstPageRequest);
        List<RoomListDto> secondResult = roomService.getRooms(secondPageRequest);


        // then
        Assertions.assertThat(firstResult).hasSize(5);
        Assertions.assertThat(secondResult).hasSize(5);

        // 눈으로 찍어본거
//        for (RoomListDto result : firstResult) {
//            System.out.println("result.getMaxPlayer() = " + result.getMaxPlayer());
//        }
//        System.out.println("------");
//        for (RoomListDto result : secondResult) {
//            System.out.println("result.getMaxPlayer() = " + result.getMaxPlayer());
//        }
    }

//    @Test
//    void makeRoom_Success() {
//        when(userRepository.findByUserId(anyLong())).thenReturn(Optional.of(testUser));
//        when(roomRepository.save(any(Room.class))).thenReturn(testRoom);
//
//        RoomOptionDto result = roomService.makeRoom(1L, testRoomRequestDto);
//
//        assertNotNull(result);
//        assertEquals("TestUser", result.getOwner());
//        assertEquals("Test Room", result.getTitle());
//        assertEquals(4, result.getMaxPlayer());
//        assertTrue(result.isHaveBetray());
//
//        verify(userRepository).findByUserId(1L);
//        verify(roomRepository).save(any(Room.class));
//        verify(userInRoomRepository).save(any(UserInRoom.class));
//        verify(redisGameRepository).save(any(Game.class));
//    }

    @Test
    void makeRoom_UserNotFound() {
        when(userRepository.findByUserId(anyLong())).thenReturn(Optional.empty());

        assertThrows(NotFoundUserException.class, () -> roomService.makeRoom(1L, testRoomRequestDto));

        verify(userRepository).findByUserId(1L);
        verifyNoInteractions(roomRepository, userInRoomRepository, redisGameRepository);
    }

//    @Test
//    void enterRoom_Success() {
//        when(roomRepository.findByRoomId(anyLong())).thenReturn(Optional.of(testRoom));
//        when(userRepository.findByUserId(anyLong())).thenReturn(Optional.of(testUser));
//        when(userInRoomRepository.countPeopleByRoomId(anyLong())).thenReturn(3);
//        when(redisGameRepository.findByGameId(anyLong())).thenReturn(Optional.of(new Game()));
//
//        CommonResponseDto result = roomService.enterRoom(1L, 1L);
//
//        assertNotNull(result);
//        assertEquals("ok", result.getResult());
//
//        verify(roomRepository).findByRoomId(1L);
//        verify(userRepository).findByUserId(1L);
//        verify(userInRoomRepository).save(any(UserInRoom.class));
//        verify(redisGameRepository).save(any(Game.class));
//    }

    @Test
    void enterRoom_RoomNotFound() {
        when(roomRepository.findByRoomId(anyLong())).thenReturn(Optional.empty());

        assertThrows(NotFoundRoomException.class, () -> roomService.enterRoom(1L, 1L));

        verify(roomRepository).findByRoomId(1L);
        verifyNoInteractions(userRepository, userInRoomRepository, redisGameRepository);
    }

    @Test
    void enterRoom_UserNotFound() {
        when(roomRepository.findByRoomId(anyLong())).thenReturn(Optional.of(testRoom));
        when(userRepository.findByUserId(anyLong())).thenReturn(Optional.empty());
        when(userInRoomRepository.countPeopleByRoomId(anyLong())).thenReturn(3);

        assertThrows(NotFoundUserException.class, () -> roomService.enterRoom(1L, 1L));

        verify(roomRepository).findByRoomId(1L);
        verify(userRepository).findByUserId(1L);
        verifyNoInteractions(redisGameRepository);
    }
}