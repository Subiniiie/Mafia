package e106.emissary_backend.domain.achievement.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AchievementListDto {
    long achievementId;
    String acheivementDate;
}
