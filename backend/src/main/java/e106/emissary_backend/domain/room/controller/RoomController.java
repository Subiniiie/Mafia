package e106.emissary_backend.domain.room.controller;

import e106.emissary_backend.domain.room.dto.RoomOptionDto;
import e106.emissary_backend.domain.room.dto.RoomRequestDto;
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

    /**
     * 방 생성
     */
    @PostMapping("/rooms")
    public ResponseEntity<RoomOptionDto> makeRoom(@CookieValue("Authentication") String token,@RequestBody RoomRequestDto roomRequestDto) {
//        long userId = Long.parseLong(token);
        System.out.println(token);
        long userId = 1L;
        return ResponseEntity.ok(roomService.makeRoom(userId, roomRequestDto));
    }

    /**
     * 방 입장
     */
    // Todo : JWT 처리하는거 추가.
    @PostMapping("/rooms/{roomId}")
    public ResponseEntity<CommonResponseDto> enterRoom(@CookieValue("Authentication") String token, @PathVariable Long roomId) {
        long userId = Long.parseLong(token);
        return ResponseEntity.ok(roomService.enterRoom(roomId, userId));
    }

    /**
     * 방 떠나기
     */
    @DeleteMapping("/rooms/{roomId}")
    public ResponseEntity<CommonResponseDto> leaveRoom(@CookieValue("Authentication") String token, @PathVariable Long roomId) {
        long userId = Long.parseLong(token);
        return ResponseEntity.ok(roomService.leaveRoom(roomId, userId));
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
