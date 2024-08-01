package e106.emissary_backend.domain.achievement.repository;

import e106.emissary_backend.domain.achievement.entity.Achievement;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AchievementRepository extends JpaRepository<Achievement, Long> {
}
