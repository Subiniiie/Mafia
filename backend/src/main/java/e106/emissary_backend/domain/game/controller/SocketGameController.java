package e106.emissary_backend.domain.game.controller;


import e106.emissary_backend.domain.game.model.GameResponseDTO;
import e106.emissary_backend.domain.game.service.RedisGameService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Controller;
import org.springframework.web.socket.messaging.SessionConnectedEvent;

/**
 * MessageMapping request : /ws-stomp/....
 */
@Slf4j
@RequiredArgsConstructor
@Controller
public class SocketGameController {

    // webSocket의 기능 (SimpMessageSendingOperations 써도 됨.)
    private final SimpMessagingTemplate messagingTemplate;

    private final RedisGameService redisGameService;

//    // PathVariable 사용시 오류 생김
//    @MessageMapping("/{roomId}/enter")
//    public void enterGameRoom(@DestinationVariable Long roomId,
//                              SimpMessageHeaderAccessor headerAccessor) {
//        String userId = headerAccessor.getFirstNativeHeader("User");
//
//        if(userId != null) {
//            // Todo : DB에 접근하는 코드로 인원늘리고
//            // Todo : redis에 현재 세션 정보 저장
//            GameResponseDTO gameResponseDTO = redisGameService.findGameById(roomId);
//
//
//            // 전체적으로 보내야하는 경우 publisher를 사용해서 하자
//            // 서비스로 가서 publish가 필요한경우 하자,,
//            // to front : key : /sub/roomId , value : gameResponseDTO(JSON)
//            messagingTemplate.convertAndSend("/sub/" + roomId, gameResponseDTO);
//        }
//    }
}
