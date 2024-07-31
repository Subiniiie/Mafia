package e106.emissary_backend.domain.game.controller;


import e106.emissary_backend.domain.game.service.GameService;
import e106.emissary_backend.domain.game.service.GameService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
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
    @MessageMapping("/rooms/start/{roomId}")
    public void start(@AuthenticationPrincipal UserDetails userDetails, @DestinationVariable Long roomId){
        long userId = Long.parseLong(userDetails.getUsername());

        gameService.setGame(roomId);
    }
}
