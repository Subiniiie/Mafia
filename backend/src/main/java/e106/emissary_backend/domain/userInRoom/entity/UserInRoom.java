package e106.emissary_backend.domain.userInRoom.entity;

import e106.emissary_backend.global.common.BaseTimeEntity;
import e106.emissary_backend.domain.room.entity.Room;
import e106.emissary_backend.domain.user.entity.User;
import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;
import java.time.LocalDateTime;

@Entity
@Builder
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "users_in_rooms")
public class UserInRoom extends BaseTimeEntity {

    @EmbeddedId
    private Pk pk;

    @MapsId("roomId")
    @JoinColumn(name = "room_id")
    @ManyToOne(fetch = FetchType.LAZY)
    private Room room;

    @MapsId("userId")
    @JoinColumn(name = "user_id")
    @ManyToOne(fetch = FetchType.LAZY)
    private User user;

    @Column(name = "is_blocked")
    private boolean isBlocked;

    @Column(name=  "connect_time")
    private LocalDateTime connectTime;

    @Embeddable
    @Getter
    @EqualsAndHashCode
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Pk implements Serializable {
        @Column(name = "room_id")
        private Long roomId;

        @Column(name = "user_id")
        private Long userId;
    }

}
