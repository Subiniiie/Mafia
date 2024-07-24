package e106.emissary_backend.domain.room.controller;

import e106.emissary_backend.domain.room.dto.RoomOptionDto;
import e106.emissary_backend.domain.room.dto.RoomRequestDto;
import e106.emissary_backend.domain.room.entity.Room;
import e106.emissary_backend.domain.room.dto.RoomListDto;
import e106.emissary_backend.domain.room.service.RoomService;
import e106.emissary_backend.global.common.CommonResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class RoomController {

    private final RoomService roomService;

    @GetMapping("/rooms")
    public ResponseEntity<List<RoomListDto>> getAllRooms(@PageableDefault Pageable pageable) {
        return ResponseEntity.ok(roomService.getRooms(pageable));
    }

    @DeleteMapping("/api/rooms/{roomId}")
    public ResponseEntity<CommonResponseDto> deleteRoom(@PathVariable Long roomId){
        return ResponseEntity.ok(roomService.deleteRoom(roomId));
    }

    @DeleteMapping("/api/rooms/{roomId}/{userId}")
    public ResponseEntity<CommonResponseDto> deleteRoom(@PathVariable Long roomId, @PathVariable Long userId){
        return ResponseEntity.ok(roomService.deleteUser(roomId, userId));
    }

    @PostMapping("/api/options/rooms/{roomId}")
    public ResponseEntity<RoomOptionDto> getOption(@PathVariable Long roomId){
        return ResponseEntity.ok(roomService.getOption(roomId));
    }

    @PatchMapping("/api/options/rooms/{roomId}")
    public ResponseEntity<CommonResponseDto> updateOption(@PathVariable Long roomId, RoomRequestDto roomRequestDto){
        return ResponseEntity.ok(roomService.updateOption(roomId, roomRequestDto));
    }

}
