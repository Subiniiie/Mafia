package e106.emissary_backend.domain.achievement.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name  = "achievements")
@ToString(exclude = "achievementUsers")
public class Achievement {

    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "achieve_id")
    private Long achieveId;

    @Column(name = "name", unique = true, nullable = false, length = 50)
    private String name;

    @Column(name = "achieve_img_url", unique = true, length = 30)
    private String achieveImgUrl;

}
