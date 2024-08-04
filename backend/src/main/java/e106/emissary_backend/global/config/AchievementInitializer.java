package e106.emissary_backend.global.config;

import e106.emissary_backend.domain.achievement.entity.Achievement;
import e106.emissary_backend.domain.achievement.repository.AchievementRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AchievementInitializer {

    @Bean
    public CommandLineRunner initAchievements(AchievementRepository achievementRepository) {
        return args -> {
            Achievement a = new Achievement(1L,"첫 입단", "1.png");
            Achievement b = new Achievement(2L,"게임 50회 플레이", "2.png");
            Achievement c = new Achievement(3L,"게임 100회 플레이", "3.png");
            Achievement d = new Achievement(4L,"첫 밀정", "4.png");
            Achievement e = new Achievement(5L,"첫 첩보원", "5.png");
            Achievement f = new Achievement(6L,"첩보원 10회 승리", "6.png");
            Achievement g = new Achievement(7L,"동지 10명 달성", "7.png");
            Achievement h = new Achievement(8L,"변절자로 단독 승리", "8.png");
            Achievement i = new Achievement(9L,"밀정 진영에서 30회 승리 달성", "9.png");
            Achievement j = new Achievement(10L,"모든 업적 달성", "10.png");

            achievementRepository.save(a);
            achievementRepository.save(b);
            achievementRepository.save(c);
            achievementRepository.save(d);
            achievementRepository.save(e);
            achievementRepository.save(f);
            achievementRepository.save(g);
            achievementRepository.save(h);
            achievementRepository.save(i);
            achievementRepository.save(j);
        };
    }
}
