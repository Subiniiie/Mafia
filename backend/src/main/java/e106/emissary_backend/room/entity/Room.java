package e106.emissary_backend.room.entity;

import e106.emissary_backend.common.BaseTimeEntity;
import jakarta.annotation.Nullable;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Builder
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "rooms")
public class Room extends BaseTimeEntity {

    @Id @GeneratedValue
    @Column(name = "room_id")
    private long roomId;

    @Column(length = 20,nullable = false)
    private String title;

    private int password;

    @Column(name = "owner_id", nullable = false)
    private long ownerId;

    @Column(name = "max_player")
    private long maxPlayer;

    @Column(name = "have_betray")
    private boolean haveBetray;

}
