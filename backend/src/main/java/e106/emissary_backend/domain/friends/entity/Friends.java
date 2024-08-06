package e106.emissary_backend.domain.friends.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import e106.emissary_backend.domain.user.entity.User;
import e106.emissary_backend.global.common.BaseTimeEntity;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;


@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "friends")
@Getter
@Setter
public class Friends extends BaseTimeEntity{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JsonManagedReference
    @JoinColumn(name = "user_id_1", nullable = false)
    private User user1;

    @ManyToOne
    @JsonManagedReference
    @JoinColumn(name = "user_id_2", nullable = false)
    private User user2;

    @Column(name = "is_accepted", nullable = false, length = 1)
    private String isAccepted;

    public void acceptFriendRequest() {
        this.isAccepted = "Y"; // 친구 요청 수락
    }

    public void declineFriendRequest() {
        this.isAccepted = "R"; // 친구 요청 거절
    }

}
