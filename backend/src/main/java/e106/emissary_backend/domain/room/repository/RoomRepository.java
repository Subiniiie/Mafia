package e106.emissary_backend.domain.room.repository;

import e106.emissary_backend.domain.room.entity.Room;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RoomRepository extends JpaRepository<Room, Long> {

    Optional<Slice<Room>> findAllBy(Pageable pageable);

    Optional<Room> findByRoomId(Long roomId);
}
