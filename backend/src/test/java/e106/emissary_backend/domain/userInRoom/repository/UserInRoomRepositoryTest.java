package e106.emissary_backend.domain.userInRoom.repository;

import e106.emissary_backend.domain.room.entity.Room;
import e106.emissary_backend.domain.room.enumType.RoomState;
import e106.emissary_backend.domain.room.repository.RoomRepository;
import e106.emissary_backend.domain.user.entity.User;
import e106.emissary_backend.domain.user.repository.UserRepository;
import e106.emissary_backend.domain.userInRoom.entity.UserInRoom;
import jakarta.transaction.Transactional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.Rollback;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import static org.assertj.core.api.Assertions.assertThat;

@Transactional
@SpringBootTest
class UserInRoomRepositoryTest {

    @Autowired
    private UserInRoomRepository userInRoomRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoomRepository roomRepository;

    private Room testRoom;
    private User user1, user2, user3;

    @BeforeEach
    void setUp() {
        // 테스트 룸 생성
        testRoom = Room.builder()
                .title("Test Room")
                .ownerId(1L)
                .roomState(RoomState.WAIT)
                .maxPlayer(5)
                .haveBetray(false)
                .build();
        roomRepository.save(testRoom);

        // 테스트 유저 생성
        user1 = User.builder()
                .email("userTest1@test.com")
                .nickname("User1")
                .password("password")
                .gender("M")
                .birth(LocalDate.of(1990, 1, 1))
                .build();
        user2 = User.builder()
                .email("userTest2@test.com")
                .nickname("User2")
                .password("password")
                .gender("F")
                .birth(LocalDate.of(1991, 2, 2))
                .build();
        user3 = User.builder()
                .email("userTest3@test.com")
                .nickname("User3")
                .password("password")
                .gender("M")
                .birth(LocalDate.of(1992, 3, 3))
                .build();
        userRepository.saveAll(List.of(user1, user2, user3));

        // UserInRoom 엔티티 생성 및 저장
        UserInRoom userInRoom1 = UserInRoom.builder()
                .pk(new UserInRoom.Pk(testRoom.getRoomId(), user1.getUserId()))
                .room(testRoom)
                .user(user1)
                .isBlocked(false)
                .connectTime(LocalDateTime.now())
                .build();
        UserInRoom userInRoom2 = UserInRoom.builder()
                .pk(new UserInRoom.Pk(testRoom.getRoomId(), user2.getUserId()))
                .room(testRoom)
                .user(user2)
                .isBlocked(false)
                .connectTime(LocalDateTime.now())
                .build();
        UserInRoom userInRoom3 = UserInRoom.builder()
                .pk(new UserInRoom.Pk(testRoom.getRoomId(), user3.getUserId()))
                .room(testRoom)
                .user(user3)
                .isBlocked(false)
                .connectTime(LocalDateTime.now())
                .build();
        userInRoomRepository.saveAll(List.of(userInRoom1, userInRoom2, userInRoom3));
    }

    @Test
    void findAllByPk_RoomId_ShouldReturnAllUsersInRoom() {
        // When
        Optional<List<UserInRoom>> usersInRoomOptional = userInRoomRepository.findAllByPk_RoomId(testRoom.getRoomId());

        // Then
        assertThat(usersInRoomOptional).isPresent();
        List<UserInRoom> userInRooms = usersInRoomOptional.get();
        List<User> users = userInRooms.stream()
                .map(UserInRoom::getUser)
                .collect(Collectors.toList());
        assertThat(users).hasSize(3);
        assertThat(users).containsExactlyInAnyOrder(user1, user2, user3);
    }
}