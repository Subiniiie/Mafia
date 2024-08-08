package e106.emissary_backend.domain.friends.repository;

import e106.emissary_backend.domain.friends.entity.Friends;
import e106.emissary_backend.domain.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;


public interface FriendsRepository extends JpaRepository<Friends,Long> {

    @Query("SELECT f FROM Friends f WHERE f.user1.userId = :user1 AND f.user2.userId = :user2 AND f.isAccepted = 'N'")
    Friends findFriendRequest(@Param("user1") Long user1, @Param("user2") Long user2);

    @Query("SELECT f FROM Friends f WHERE f.user2.userId = :user AND f.isAccepted = 'N'")
    List<Friends> receiveRequest(@Param("user") Long user);

    @Query("SELECT f FROM Friends f WHERE (f.user1.userId = :user1 AND f.user2.userId = :user2) OR (f.user1.userId = :user2 AND f.user2.userId = :user1) AND f.isAccepted = 'Y'")
    Friends findFriend(@Param("user1") Long user1, @Param("user2") Long user2);

}