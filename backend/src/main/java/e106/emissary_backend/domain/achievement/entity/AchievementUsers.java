package e106.emissary_backend.domain.achievement.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import e106.emissary_backend.domain.user.entity.User;
import e106.emissary_backend.global.common.BaseTimeEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "achievements_users")
@ToString(exclude = "user")
public class AchievementUsers extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long achievementUserId;

    @ManyToOne
    @JoinColumn(name = "user_id")
    @JsonIgnore // 이 필드를 JSON 직렬화에서 제외
    private User user;

    @ManyToOne
    @JoinColumn(name = "achievement_id")
    private Achievement achievement;

}
