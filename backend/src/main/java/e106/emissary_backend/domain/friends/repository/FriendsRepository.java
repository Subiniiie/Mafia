package e106.emissary_backend.domain.friends.repository;

import e106.emissary_backend.domain.friends.entity.Friends;
import e106.emissary_backend.domain.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface FriendsRepository extends JpaRepository<Friends,Long> {
    Optional<Friends> findByUser1AndUser2(User user1, User user2);
}
