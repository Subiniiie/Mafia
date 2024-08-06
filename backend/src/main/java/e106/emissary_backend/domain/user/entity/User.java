package e106.emissary_backend.domain.user.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import e106.emissary_backend.domain.achievement.entity.AchievementUsers;
import e106.emissary_backend.domain.friends.entity.Friends;
import e106.emissary_backend.global.common.BaseTimeEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "users")
@EqualsAndHashCode(callSuper=false)
public class User extends BaseTimeEntity{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long userId;

    @Column(name = "email", unique = true, nullable = false, length = 50)
    private String email;

    @Column(name = "nickname", unique = true, nullable = false, length = 200)
    private String nickname;

    @Column(name = "password", nullable = false, length = 200)
    private String password;

    @Column(name = "gender", length = 1)
    private String gender;

    @Column(name = "birth")
    private LocalDate birth;

    @Column(name = "skin_img_url", length = 30)
    private String skinImgUrl; // img url 추가

    @Builder.Default
    @Column(name = "mafia_win_cnt")
    private Long mafiaWinCnt = 0L;

    @Builder.Default
    @Column(name = "mafia_play_cnt")
    private Long mafiaPlayCnt = 0L;

    @Builder.Default
    @Column(name = "police_win_cnt")
    private Long policeWinCnt = 0L;

    @Builder.Default
    @Column(name = "police_play_cnt")
    private Long policePlayCnt = 0L;

    @Builder.Default
    @Column(name = "turncoat_game_cnt")
    private Long turncoatGameCnt = 0L;

    @Builder.Default
    @Column(name = "turncoat_win_cnt")
    private Long turncoatWinCnt = 0L;

    @Builder.Default
    @Column(name = "turncoat_single_win_cnt")
    private Long turncoatSingleWinCnt = 0L;

    @Builder.Default
    @Column(name = "citizen_game_cnt")
    private Long citizenGameCnt = 0L;

    @Builder.Default
    @Column(name = "citizen_win_cnt")
    private Long citizenWinCnt = 0L;

    @Builder.Default
    @Column(name = "role", nullable = false, length = 45)
    private String role = "ROLE_USER";

    @Builder.Default
    @Column(name = "is_deleted", nullable = false)
    private Boolean isDeleted = false;

    @Builder.Default
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<AchievementUsers> achievementUsers = new ArrayList<>();

    @Builder.Default
    @JsonIgnore
    @OneToMany(mappedBy = "user1", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Friends> friendsAsUser1 = new ArrayList<>();

    @Builder.Default
    @JsonIgnore
    @OneToMany(mappedBy = "user2", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Friends> friendsAsUser2 = new ArrayList<>();

}