package e106.emissary_backend.user.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collection;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "user")
@EqualsAndHashCode(callSuper=false)
public class User extends BaseEntity implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id", columnDefinition = "int UNSIGNED not null")
    private Long userId;

    @Column(name = "email", unique = true, nullable = false, length = 50)
    private String email;

    @Column(name = "nickname", unique = true, nullable = false, length = 20)
    private String nickname;

    @Column(name = "password", nullable = false, length = 200)
    private String password;

    @Column(name = "skin_img_url", length = 30)
    private String skinImgUrl; // img url 추가

    @Column(name = "modified_at")
    private LocalDateTime modifiedAt;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @ColumnDefault("0")
    @Column(name = "mafia_win_cnt")
    private Long mafiaWinCnt;

    @ColumnDefault("0")
    @Column(name = "mafia_play_cnt")
    private Long mafiaPlayCnt;

    @ColumnDefault("0")
    @Column(name = "police_win_cnt")
    private Long policeWinCnt;

    @ColumnDefault("0")
    @Column(name = "police_play_cnt")
    private Long policePlayCnt;

    @ColumnDefault("0")
    @Column(name = "turncoat_game_cnt")
    private Long turncoatGameCnt;

    @ColumnDefault("0")
    @Column(name = "turncoat_win_cnt")
    private Long turncoatWinCnt;

    @ColumnDefault("0")
    @Column(name = "citizen_game_cnt")
    private Long citizenGameCnt;

    @ColumnDefault("0")
    @Column(name = "citizen_win_cnt")
    private Long citizenWinCnt;

    @ColumnDefault("ROLE_USER")
    @Builder.Default
    @Column(name = "role", nullable = false, length = 45)
    private String role = "ROLE_USER";

    @ColumnDefault("0")
    @Column(name = "is_deleted", nullable = false)
    private Boolean isDeleted;


    @Override
    public String getUsername() {
        return getEmail();
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        Collection<GrantedAuthority> collection = new ArrayList<>();
        collection.add(new SimpleGrantedAuthority(this.getRole()));
        return collection;
    }

}