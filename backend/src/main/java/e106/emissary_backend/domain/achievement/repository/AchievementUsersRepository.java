package e106.emissary_backend.domain.achievement.repository;

import e106.emissary_backend.domain.achievement.entity.AchievementUsers;
import e106.emissary_backend.domain.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AchievementUsersRepository extends JpaRepository<AchievementUsers, Long> {
    List<AchievementUsers> findAllByUser(User user);
}
