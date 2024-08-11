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
import org.apache.coyote.Response;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
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

    @GetMapping("/rooms/filter")
    public ResponseEntity<List<RoomListDto>> getFilteredRooms(
            @PageableDefault Pageable pageable,
            @RequestParam(required = false) Boolean filter1,
            @RequestParam(required = false) Boolean filter2,
            @RequestParam(required = false) Boolean filter3,
            @RequestParam(required = false) String search
    ) {
        return ResponseEntity.ok(roomService.getFilteredRooms(pageable, filter1, filter2, filter3, search));
    }

    @DeleteMapping("/rooms/{roomId}")
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
    public ResponseEntity<Map<String,Object>> makeRoom(@AuthenticationPrincipal CustomUserDetails customUserDetails, @RequestBody RoomRequestDto roomRequestDto) {
        // 테스트용으로
        long userId = 1L;
        if(!Objects.isNull(customUserDetails)){
            userId = customUserDetails.getUserId();
        }

        Map<String,Object> map = new HashMap<>();
        try{
            // 방이 성공적으로 생성되었을 시, Room Option Dto에 Token 실어서 전송
            RoomOptionDto res = roomService.makeRoom(userId, roomRequestDto);
            map.put("res", "success");
            map.put("option", res);
            map.put("detail", roomService.detailRoom(res.getRoomId()));
            return ResponseEntity.ok(map);
        } catch (OpenViduJavaClientException | OpenViduHttpException e){
            // 방이 생성 실패 되었을 시, 500 error 전송
            map.put("res", "fail");
            map.put("error", e.getMessage());
            return ResponseEntity.internalServerError().body(map);
        }
    }

    /**
     * 방 입장
     */
    @PostMapping("/rooms/{roomId}")
    public ResponseEntity<RoomJoinDto> enterRoom(@AuthenticationPrincipal CustomUserDetails customUserDetails, @PathVariable Long roomId) {
        log.info("enterRoom controller run");
        long userId = customUserDetails.getUserId();

        try{
            // todo : 메시지 발행하기
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
    @DeleteMapping("/rooms/users/{roomId}")
    public ResponseEntity<CommonResponseDto> leaveRoom(@AuthenticationPrincipal CustomUserDetails customUserDetails, @PathVariable Long roomId) {
        // 테스트용으로
        long userId = 1L;
        String nickname = "";
        if(!Objects.isNull(customUserDetails)){
            userId = customUserDetails.getUserId();
        }

        return ResponseEntity.ok(roomService.leaveRoom(roomId, userId));
    }

    @GetMapping("/rooms/{roomId}/options")
    public ResponseEntity<RoomOptionDto> getOption(@PathVariable Long roomId){
        return ResponseEntity.ok(roomService.getOption(roomId));
    }

    @PatchMapping("/rooms/{roomId}/options")
    public ResponseEntity<CommonResponseDto> updateOption(@PathVariable Long roomId, RoomRequestDto roomRequestDto){
        return ResponseEntity.ok(roomService.updateOption(roomId, roomRequestDto));
    }

}
