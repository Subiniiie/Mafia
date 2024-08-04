package e106.emissary_backend.domain.friends.entity;

import e106.emissary_backend.domain.user.entity.User;
import e106.emissary_backend.global.common.BaseTimeEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "friends")
public class Friends extends BaseTimeEntity{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id_1", nullable = false)
    private User user1;

    @ManyToOne
    @JoinColumn(name = "user_id_2", nullable = false)
    private User user2;

    @Column(name = "is_accepted", nullable = false, length = 1)
    private String isAccepted;

    public User getFriends(User user){
        return this.user1.equals(user) ? this.user2 : this.user1;
    }
}
