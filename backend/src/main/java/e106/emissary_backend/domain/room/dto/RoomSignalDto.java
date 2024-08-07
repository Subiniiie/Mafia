package e106.emissary_backend.domain.room.dto;

import e106.emissary_backend.domain.room.entity.Room;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RoomSignalDto {
    private String session;
    private String type;
    private String data;
    private List<Object> to;
}
