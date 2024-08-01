package e106.emissary_backend.domain.achievement.repository;

import e106.emissary_backend.domain.achievement.entity.AchievementUsers;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AchievementUsersRepository extends JpaRepository<AchievementUsers, Long> {
}
