package e106.emissary_backend.domain.userInRoom.repository;

import e106.emissary_backend.domain.room.entity.Room;
import e106.emissary_backend.domain.user.entity.User;
import e106.emissary_backend.domain.userInRoom.entity.UserInRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UserInRoomRepository extends JpaRepository<UserInRoom, UserInRoom.Pk> {
    int countPeopleByRoom_RoomId(long roomId);

    void deletePeopleByPk_UserIdAndRoom_RoomId(long userId, long roomId);

    void deleteByPk_UserId(long userId);

    Optional<UserInRoom> findByPk_UserId(long userId);

    Optional<List<UserInRoom>> findAllByPk_RoomId(long roomId);

    @Query("SELECT uir.user FROM UserInRoom uir WHERE uir.viduToken = :viduToken")
    Optional<User> findUserByViduToken(@Param("viduToken") String viduToken);

    @Query("SELECT uir.room FROM UserInRoom uir WHERE uir.user.userId =: userId")
    Optional<Room> findRoomByPk_UserId(@Param("userId") long userId);
}
