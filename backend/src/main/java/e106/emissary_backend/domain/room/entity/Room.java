package e106.emissary_backend.domain.room.entity;

import e106.emissary_backend.domain.room.dto.RoomRequestDto;
import e106.emissary_backend.global.common.BaseTimeEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

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

//    @Column(name = "now_player")
//    private int nowPlayer;

    @Column(name = "max_player")
    private int maxPlayer;

    @Column(name = "have_betray")
    private boolean haveBetray;

    public void update(RoomRequestDto roomRequestDto) {
        title = roomRequestDto.getTitle();
        password = roomRequestDto.getPassword();
        maxPlayer = roomRequestDto.getMaxPlayer();
        haveBetray = roomRequestDto.isHaveBetray();
    }
}
