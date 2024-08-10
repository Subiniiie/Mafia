package e106.emissary_backend.domain.achievement.service;

import e106.emissary_backend.domain.achievement.entity.Achievement;
import e106.emissary_backend.domain.achievement.entity.AchievementUsers;
import e106.emissary_backend.domain.achievement.repository.AchievementRepository;
import e106.emissary_backend.domain.achievement.repository.AchievementUsersRepository;
import e106.emissary_backend.domain.user.entity.User;
import e106.emissary_backend.domain.user.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AchievementService {
    private final UserRepository userRepository;
    private final AchievementRepository achievementRepository;
    private final AchievementUsersRepository achievementUsersRepository;

    @Transactional
    public void updateAchievement(Long id) {
        Optional<User> present = userRepository.findByUserId(id);
        if(present.isPresent()){
            User user = present.get();
            extracted(user, 2L, user.getMafiaPlayCnt() + user.getPolicePlayCnt() + user.getTurncoatGameCnt() + user.getCitizenGameCnt(), 50);
            extracted(user, 3L, user.getMafiaPlayCnt() + user.getPolicePlayCnt() + user.getTurncoatGameCnt() + user.getCitizenGameCnt(), 100);
            extracted(user, 4L, user.getMafiaPlayCnt(), 1);
            extracted(user, 5L, user.getPolicePlayCnt(), 1);
            extracted(user, 6L, user.getPoliceWinCnt(), 10);
            extracted(user, 7L, user.getMafiaWinCnt() + user.getPoliceWinCnt() + user.getTurncoatWinCnt() + user.getTurncoatSingleWinCnt() + user.getCitizenWinCnt(), 30);
            extracted(user, 8L, user.getTurncoatSingleWinCnt(), 1);
            extracted(user, 9L, user.getMafiaWinCnt() + user.getTurncoatWinCnt() + user.getTurncoatSingleWinCnt(), 30);
            extracted(user, 10L, user.getAchievementUsers().size(), 9);
        }else {
            ;
        }

    }

    private void extracted(User user, long achieveIdx, long left, long right) {
        Optional<Achievement> achievementOptional = achievementRepository.findById(achieveIdx);
        if(achievementOptional.isPresent()){
            Achievement achievement = achievementOptional.get();

            boolean hasAchievement = user.getAchievementUsers().stream()
                    .anyMatch(achievementUsers -> achievementUsers.getAchievement().getAchieveId().equals(achievement.getAchieveId()));
            if(!hasAchievement && left >= right){
                AchievementUsers achievementUsers = AchievementUsers.builder()
                        .user(user)
                        .achievement(achievement)
                        .build();
                achievementUsersRepository.save(achievementUsers);
            }
        } else {
            throw new RuntimeException("해당 업적을 찾지 못했습니다.");
        }
    }
}
