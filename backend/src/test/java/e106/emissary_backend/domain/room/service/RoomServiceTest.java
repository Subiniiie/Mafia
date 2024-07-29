package e106.emissary_backend.domain.room.service;

import e106.emissary_backend.domain.room.dto.RoomListDto;
import e106.emissary_backend.domain.room.entity.Room;
import e106.emissary_backend.domain.room.repository.RoomRepository;
import e106.emissary_backend.domain.user.repository.UserRepository;
import e106.emissary_backend.domain.userInRoom.repoistory.UserInRoomRepository;
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
import org.springframework.security.core.userdetails.User;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class RoomServiceTest {

    @Mock
    RoomRepository roomRepository;
    @Mock
    UserRepository userRepository;
    @Mock
    UserInRoomRepository userInRoomRepository;

    @InjectMocks
    RoomService roomService;
    private User user;
    private Room room;

    @BeforeEach
    public void init(){

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

}