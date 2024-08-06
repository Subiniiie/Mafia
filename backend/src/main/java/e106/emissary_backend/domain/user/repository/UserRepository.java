package e106.emissary_backend.domain.user.repository;

import e106.emissary_backend.domain.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Optional<User> findByNickname(String nickname);

    @Query("select u.nickname from User u where u.userId = :userId")
    Optional<String> findNicknameByUserId(long userId);
    Optional<User> findByUserId(long userId);

    @Query("SELECT u FROM User u WHERE u.nickname LIKE %:nickname%")
    List<User> findByNicknameContaining(@Param("nickname") String nickname);
}
