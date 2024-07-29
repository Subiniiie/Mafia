package e106.emissary_backend.global.websocket.interceptor;

import com.nimbusds.jose.Algorithm;
import com.nimbusds.jwt.JWT;
import org.springframework.core.annotation.Order;
import org.springframework.core.Ordered;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;

// Spring Security보다 인터셉터의 우선순위 올리기
@Order(Ordered.HIGHEST_PRECEDENCE * 99)
public class FilterChannelInterceptor implements ChannelInterceptor {

    /**
     preSend : 메시지가 채널로 전송되기전에 호출되는 메소드
     StompHeaderAccessor : STOMP 헤더에 접근이 가능해짐
     */
    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
//        StompHeaderAccessor headerAccessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);
//
//        assert headerAccessor != null;
//        // 첫번째 연결시에만 Header 확인하기 위해 getCommand사용 -> 이후엔 저장된 정보 사용
//        if(headerAccessor.getCommand().equals(StompCommand.CONNECT)){
//            // connectHeader에 있는 Authorization에서 토큰을 꺼내기
//            String token = String.valueOf(headerAccessor.getNativeHeader("Authorization").get(0));
//            // 토큰에서 BARER부분 지우기
//            // 수정해야함
//            token = token.replace("BARER ", " ");
//
//            try{
//                // User헤더에 JWT인증정보 넣음
//                Integer userId = JWT.require(Algorithm.HMAC512(JwtProperties.SECRET)).build().verify(token)
//                        .getClaim("id").asInt();
//
//                // User라는 네이티브 헤더 추가
//                headerAccessor.addNativeHeader("User", String.valueOf(userId));
//            } catch (TokenExpiredException e) {
//                e.printStackTrace();
//            } catch (JWTVerificationException e) {
//                e.printStackTrace();
//            }
//        }
//        // 소켓에 connect할 때, User라는 Native Header에서 유저정보를 이제 들고오면 됨.
        return message;
    }
}
