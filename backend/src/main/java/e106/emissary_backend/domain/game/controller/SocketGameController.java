package e106.emissary_backend.domain.game.controller;


import e106.emissary_backend.domain.game.enumType.GameRole;
import e106.emissary_backend.domain.game.model.ConfirmVoteRequestDTO;
import e106.emissary_backend.domain.game.model.VoteRequestDTO;
import e106.emissary_backend.domain.game.service.GameService;
import e106.emissary_backend.domain.game.service.subscriber.message.ConnectMessage;
import e106.emissary_backend.domain.user.dto.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * MessageMapping request : /ws-stomp/....
 */
@Slf4j
@RequiredArgsConstructor
@Controller
public class SocketGameController {

    // 혹시나 연결이 끊어지면 의미없는 데이터 응답용..
//    private final SimpMessagingTemplate messagingTemplate;

    private final GameService gameService;

    @MessageMapping("/connect/{roomId}")
    @SendTo("/sub/{roomId}")
    public ConnectMessage connect(@DestinationVariable long roomId){
        return ConnectMessage.builder().build();
    }

    @MessageMapping("/enter/{roomId}")
    public void enter(@DestinationVariable Long roomId, SimpMessageHeaderAccessor headerAccessor) {
        long userId = getUserIdIAccessor(headerAccessor);

        gameService.enter(roomId, userId);
    }
    @MessageMapping("/ready/{roomId}")
    public void ready(@DestinationVariable Long roomId, SimpMessageHeaderAccessor headerAccessor) {
        long userId = getUserIdIAccessor(headerAccessor);

        gameService.ready(roomId, userId);
    }

    @MessageMapping("/ready/cancel/{roomId}")
    public void readyCancel(@DestinationVariable Long roomId, SimpMessageHeaderAccessor headerAccessor) {
        long userId = getUserIdIAccessor(headerAccessor);

        gameService.readyCancel(roomId, userId);
    }

    @MessageMapping("/start/{roomId}")
    public void start( @DestinationVariable Long roomId, SimpMessageHeaderAccessor headerAccessor) {
        log.info("game Started");
        long userId = getUserIdIAccessor(headerAccessor);

        gameService.setGame(roomId, userId);
    }


    @MessageMapping("/kill/{roomId}/{targetId}")
    public void kill(@DestinationVariable Long roomId, @DestinationVariable Long targetId) {
        gameService.kill(roomId, targetId);
    }

    // 변절자 만들기
    @MessageMapping("/appease/{roomId}/{targetId}")
    public void appease(@DestinationVariable Long roomId, @DestinationVariable Long targetId) {
        gameService.appease(roomId, targetId);
    }

    @MessageMapping("/detect/{roomId}/{targetId}")
    public void detect(SimpMessageHeaderAccessor headerAccessor, @DestinationVariable Long roomId, @DestinationVariable Long targetId) {
        long userId = getUserIdIAccessor(headerAccessor);
        gameService.detect(roomId, targetId, userId);
    }

    @GetMapping("/api/games/roles/{roomId}")
    @ResponseBody
    public ResponseEntity<GameRole> getRole(@AuthenticationPrincipal CustomUserDetails userDetails, @PathVariable long roomId){
        long userId = userDetails.getUserId();
        return ResponseEntity.ok(gameService.getRole(userId, roomId));
    }

    @MessageMapping("/day/{roomId}")
    public void day(@DestinationVariable Long roomId) {
        log.info("day run");
        gameService.day(roomId);
    }

    @MessageMapping("/vote/{roomId}")
    public void vote(SimpMessageHeaderAccessor headerAccessor,
                     @DestinationVariable Long roomId,
                     @Payload VoteRequestDTO request) {
        long userId = getUserIdIAccessor(headerAccessor);

        long targetId = request.getTargetId();

        gameService.startVote(roomId, userId, targetId);
    }

    @MessageMapping("/confirm/{roomId}")
    public void confirmVote(SimpMessageHeaderAccessor headerAccessor,
                            @DestinationVariable Long roomId,
                            @Payload ConfirmVoteRequestDTO request) {
        long userId = getUserIdIAccessor(headerAccessor);

        gameService.startConfirm(roomId, userId, request.isConfirm());
    }

    // 나가는거는 이걸로 처리
    @MessageMapping("/remove/{roomId}/{targetId}")
    public void removeUser(@DestinationVariable Long roomId, @DestinationVariable Long targetId) {
        gameService.removeUser(roomId, targetId);
    }

    private long getUserIdIAccessor(SimpMessageHeaderAccessor headerAccessor) {
        CustomUserDetails userDetails = (CustomUserDetails) headerAccessor.getSessionAttributes().get("user");
        long userId;
        if (userDetails != null) {
            log.info("in Accessor userId = {}", userDetails.getUserId());
            userId = userDetails.getUserId();
        } else {
            throw new IllegalStateException("우리 모두 header에 토큰을 추가했는지 확인해요!!");
        }
        return userId;
    }
}
