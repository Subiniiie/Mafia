package e106.emissary_backend.domain.game.controller;


import e106.emissary_backend.domain.game.model.ConfirmVoteRequestDTO;
import e106.emissary_backend.domain.game.model.VoteRequestDTO;
import e106.emissary_backend.domain.game.service.GameService;
import e106.emissary_backend.domain.user.dto.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;

/**
 * MessageMapping request : /ws-stomp/....
 */
@Slf4j
@RequiredArgsConstructor
@Controller
public class SocketGameController {

    // webSocket의 기능 (SimpMessageSendingOperations 써도 됨.)
    private final SimpMessagingTemplate messagingTemplate;

    private final GameService gameService;


    // Ready는 프론트에서 처리한다고 하여서 안함.
    @MessageMapping("/start/{roomId}")
    public void start(@AuthenticationPrincipal CustomUserDetails userDetails, @DestinationVariable Long roomId) {
        // todo : 한번 JWT로 요청해보고 안되면 고치기
        long userId = Long.parseLong(userDetails.getUsername());

        gameService.setGame(roomId);
    }

    @MessageMapping("/vote/{roomId}")
    public void vote(@AuthenticationPrincipal CustomUserDetails userDetails
            , @DestinationVariable Long roomId
            , @Payload VoteRequestDTO request) {
        long userId = Long.parseLong(userDetails.getUsername());
        // todo : 닉네임으로 넘어오면 roomService에서 닉네임으로 Id찾아오기
        long targetId = request.getTargetId();

        gameService.startVote(roomId, userId, targetId);
    }

    @MessageMapping("/confirm/{roomId}")
    public void confirmVote(@AuthenticationPrincipal CustomUserDetails userDetails,
                            @DestinationVariable Long roomId,
                            @Payload ConfirmVoteRequestDTO request) {
        long userId = Long.parseLong(userDetails.getUsername());

        gameService.startConfirm(roomId, userId, request.isConfirm());
    }

    @MessageMapping("/remove/{roomId}/{targetId}")
    public void removeUser(@DestinationVariable Long roomId, @DestinationVariable Long targetId) {
        gameService.removeUser(roomId, targetId);
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
    public void detect(@DestinationVariable Long roomId, @DestinationVariable Long targetId) {
        gameService.detect(roomId, targetId);
    }

    @MessageMapping("/day/{roomId}")
    public void day(@DestinationVariable Long roomId) {
        gameService.day(roomId);
    }
}
