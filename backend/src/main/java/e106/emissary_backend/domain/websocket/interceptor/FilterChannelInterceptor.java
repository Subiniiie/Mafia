package e106.emissary_backend.domain.websocket.interceptor;


import e106.emissary_backend.domain.security.util.JWTUtil;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.MessageDeliveryException;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;

import static com.nimbusds.oauth2.sdk.token.TokenTypeURI.JWT;

// Spring Security보다 인터셉터의 우선순위 올리기
@Order(Ordered.HIGHEST_PRECEDENCE * 99)
@Component
public class FilterChannelInterceptor implements ChannelInterceptor {

    @Autowired
    private JWTUtil jwtUtil;

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);

        if (StompCommand.CONNECT.equals(accessor.getCommand())) {
            String jwtToken = extractJwtFromCookie(accessor);
            if (jwtToken != null) {
                try {
                    if (jwtUtil.validateToken(jwtToken)) {
//                        String username = jwtUtil.getUsername(jwtToken);
                        Long userId = jwtUtil.getUserId(jwtToken);
                        String role = jwtUtil.getRole(jwtToken);

                        accessor.setUser(new UsernamePasswordAuthenticationToken(
                                userId,
                                null,
                                Collections.singletonList(new SimpleGrantedAuthority(role)))
                        );
                    } else {
                        throw new MessageDeliveryException("Invalid JWT token");
                    }
                }catch(Exception e) {
                    throw new MessageDeliveryException("JWT processing error : " + e);
                }
            }
        }

        return message;
    }

    /**
     * Todo 쿠키 저장방식에 따라 바꾸기
     */
    private String extractJwtFromCookie(StompHeaderAccessor accessor) {
        List<String> cookieHeaders = accessor.getNativeHeader("Cookie");
        if (cookieHeaders != null && !cookieHeaders.isEmpty()) {
            for (String cookie : cookieHeaders.get(0).split("; ")) {
                if (cookie.startsWith("jwt=")) {
                    return cookie.substring(4); // "jwt=" 이후의 값
                }
            }
        }
        return null;
    }
}
