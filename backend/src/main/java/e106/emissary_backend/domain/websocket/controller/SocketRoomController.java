//package e106.emissary_backend.domain.websocket.controller;
//
//
//import lombok.RequiredArgsConstructor;
//import lombok.extern.slf4j.Slf4j;
//import org.springframework.context.event.EventListener;
//import org.springframework.messaging.handler.annotation.DestinationVariable;
//import org.springframework.messaging.handler.annotation.MessageMapping;
//import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
//import org.springframework.messaging.simp.SimpMessagingTemplate;
//import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
//import org.springframework.stereotype.Controller;
//import org.springframework.web.socket.messaging.SessionConnectedEvent;
//
///**
// * MessageMapping request : /ws-stomp/....
// */
//@Slf4j
//@RequiredArgsConstructor
//@Controller
//public class SocketRoomController {
//
//    private final SimpMessagingTemplate simpMessagingTemplate;
//
////    @EventListener
////    public void onConnect(SessionConnectedEvent event) {
////        StompHeaderAccessor sha = StompHeaderAccessor.wrap(event.getMessage());
////        String sessionId = sha.getSessionId();
////        // 인터셉터로 설정한 데이터 가져오기
////        String userId = sha.getFirstNativeHeader("User");
////
////        // 여기서 HashMap으로 넣을게 아니라 Service를 통해서 Redis 내부 저장소에 넣자.
////        // 그리고 그걸 꺼내쓰는거지 ㅇㅋ?
//////        if (sessionId != null && userId != null) {
//////            sessions.put(sessionId, Integer.valueOf(userId));
//////        }
////    }
//
//    // 위에 방법을 Redis에 맞게 바꾼게 아래 코드임
//    // PathVariable 사용시 오류 생김
//    @MessageMapping("/{roomId}/enter")
//    public void enterGameRoom(@DestinationVariable String roomId,
//                              SimpMessageHeaderAccessor headerAccessor) {
//        String userId = headerAccessor.getFirstNativeHeader("User");
//
//        if(userId != null) {
//            // Todo : redis에 정보 저장 및 채팅방 입장처리
//            // roomId를 찾아서 방을 찾고 -> 그 방에 입장처리하기 <- 이건 redisRepository까지 가는게 맞지않을까?
//
//            // 이렇게 하면 이제 Javascript에서 responseDTO를 JSON으로 만든 데이터를 받아서
//            // 구독중인 모든 클라이언트의 화면을 바꿀 수 있음.
//            simpMessagingTemplate.convertAndSend("/sub/" + roomId, responseDTO);
//        }
//    }
//}
