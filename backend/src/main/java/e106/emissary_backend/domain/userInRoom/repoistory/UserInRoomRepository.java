package e106.emissary_backend.domain.userInRoom.repoistory;

import e106.emissary_backend.domain.userInRoom.entity.UserInRoom;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserInRoomRepository extends JpaRepository<UserInRoom, UserInRoom.Pk> {
    int countPeopleByRoomId(long roomId);

    void deletePeopleByPk_UserIdAndRoomId(long roomId, long userId);

    Optional<UserInRoom> findByPk_UserId(long userId);
}
