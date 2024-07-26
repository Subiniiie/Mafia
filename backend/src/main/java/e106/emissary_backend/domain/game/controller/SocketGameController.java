package e106.emissary_backend.domain.game.controller;


import e106.emissary_backend.domain.game.model.GameResponseDTO;
import e106.emissary_backend.domain.game.service.RedisGameService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
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

    private final RedisGameService redisGameService;

//    @EventListener
//    public void onConnect(SessionConnectedEvent event) {
//        StompHeaderAccessor sha = StompHeaderAccessor.wrap(event.getMessage());
//        String sessionId = sha.getSessionId();
//        // 인터셉터로 설정한 데이터 가져오기
//        String userId = sha.getFirstNativeHeader("User");
//
//        // 여기서 HashMap으로 넣을게 아니라 Service를 통해서 Redis 내부 저장소에 넣자.
//        // 그리고 그걸 꺼내쓰는거지 ㅇㅋ?
////        if (sessionId != null && userId != null) {
////            sessions.put(sessionId, Integer.valueOf(userId));
////        }
//    }

    // 위에 방법을 Redis에 맞게 바꾼게 아래 코드임
    // PathVariable 사용시 오류 생김
    @MessageMapping("/{roomId}/enter")
    public void enterGameRoom(@DestinationVariable Long roomId,
                              SimpMessageHeaderAccessor headerAccessor) {
        String userId = headerAccessor.getFirstNativeHeader("User");
        
        if(userId != null) {
            // Todo : DB에 접근하는 코드로 인원늘리고
            // Todo : redis에 현재 세션 정보 저장
            GameResponseDTO gameResponseDTO = redisGameService.findGameById(roomId);


            // 전체적으로 보내야하는 경우 publisher를 사용해서 하자
            // 서비스로 가서 publish가 필요한경우 하자,,
            // to front : key : /sub/roomId , value : gameResponseDTO(JSON)
            messagingTemplate.convertAndSend("/sub/" + roomId, gameResponseDTO);
        }
    }
}
