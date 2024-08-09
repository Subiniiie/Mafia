package e106.emissary_backend.domain.room.controller;

import e106.emissary_backend.domain.room.dto.*;
import e106.emissary_backend.domain.room.service.RoomService;
import e106.emissary_backend.domain.user.dto.CustomUserDetails;
import e106.emissary_backend.global.common.CommonResponseDto;
import io.openvidu.java.client.OpenViduHttpException;
import io.openvidu.java.client.OpenViduJavaClientException;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Objects;

@Slf4j
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

    @GetMapping("/rooms/{roomId}")
    public ResponseEntity<RoomDetailDto> detailRoom(@PathVariable Long roomId){
        return ResponseEntity.ok(roomService.detailRoom(roomId));
    }

    /**
     * 방 생성
     */
    @PostMapping("/rooms")
    public ResponseEntity<RoomOptionDto> makeRoom(@AuthenticationPrincipal CustomUserDetails customUserDetails, @RequestBody RoomRequestDto roomRequestDto) {
        // 테스트용으로
        long userId = 1L;
        if(!Objects.isNull(customUserDetails)){
            userId = customUserDetails.getUserId();
        }
        try{
            // 방이 성공적으로 생성되었을 시, Room Option Dto에 Token 실어서 전송
            RoomOptionDto res = roomService.makeRoom(userId, roomRequestDto);
            return ResponseEntity.ok(res);
        } catch (OpenViduJavaClientException | OpenViduHttpException e){
            // 방이 생성 실패 되었을 시, 500 error 전송
            RoomOptionDto res = new RoomOptionDto();
            return ResponseEntity.internalServerError().body(res);
        }
    }

    /**
     * 방 입장
     */
    // Todo : JWT 처리하는거 추가.
    @PostMapping("/rooms/{roomId}")
    public ResponseEntity<RoomJoinDto> enterRoom(@AuthenticationPrincipal CustomUserDetails customUserDetails, @PathVariable Long roomId) {
        // 테스트용으로
        long userId = 1L;
        if(!Objects.isNull(customUserDetails)){
            userId = customUserDetails.getUserId();
        }

        try{
            // 참가 성공 시
            RoomJoinDto res = roomService.enterRoom(roomId, userId);
            return ResponseEntity.ok(res);
        } catch (OpenViduJavaClientException | OpenViduHttpException e){
            // 참가 실패 시
            return ResponseEntity.internalServerError().body(new RoomJoinDto());
        }
    }

    @DeleteMapping("/rooms/kick")
    public ResponseEntity<CommonResponseDto> kickRoom(@AuthenticationPrincipal CustomUserDetails customUserDetails, @RequestBody RoomKickDto roomKickDto) {

        long userId = 1L;
        if (!Objects.isNull(customUserDetails)) {
            userId = customUserDetails.getUserId();
        }

        try {
            boolean res = roomService.kickUser(roomKickDto, userId);

            if (res) {
                return ResponseEntity.ok(new CommonResponseDto("ok"));
            } else {
                return ResponseEntity.internalServerError().body(new CommonResponseDto("There's an error - kicked Yourself or UnAuthorization"));
            }
        } catch (OpenViduJavaClientException | OpenViduHttpException e) {
            return ResponseEntity.internalServerError().body(new CommonResponseDto("OpenViduError"));
        }
    }

    /**
     * 방 떠나기
     */
    @DeleteMapping("/rooms/{roomId}")
    public ResponseEntity<CommonResponseDto> leaveRoom(@AuthenticationPrincipal CustomUserDetails customUserDetails, @PathVariable Long roomId) {
        // 테스트용으로
        long userId = 1L;
        String nickname = "";
        if(!Objects.isNull(customUserDetails)){
            userId = customUserDetails.getUserId();
            nickname = customUserDetails.getUsername();
        }

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
