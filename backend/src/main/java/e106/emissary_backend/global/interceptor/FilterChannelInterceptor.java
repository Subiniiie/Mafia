package e106.emissary_backend.global.interceptor;


import e106.emissary_backend.domain.security.util.JWTUtil;
import e106.emissary_backend.domain.user.dto.CustomUserDetails;
import e106.emissary_backend.domain.user.entity.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.security.Principal;
import java.util.Collections;
import java.util.List;

// Spring Security보다 인터셉터의 우선순위 올리기
@Slf4j
@Order(Ordered.HIGHEST_PRECEDENCE * 99)
@Component
@RequiredArgsConstructor
public class FilterChannelInterceptor implements ChannelInterceptor {

    private final JWTUtil jwtUtil;

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);
        log.info("accessor = {}", accessor.getCommand().toString());

        if (StompCommand.SEND.equals(accessor.getCommand())) {
            log.info("Stomp connected");
//             log.info(accessor.getMessage());
            String jwtToken = extractJwtFromHeader(accessor);
            log.info("jwtToken = {} ", jwtToken);
            if (jwtToken != null) {
                try {
                    log.info("jwtUtil = {} ", jwtUtil);
                    log.info("try jwt validation");
                    if (!jwtUtil.validateToken(jwtToken)) {
//                         String username = jwtUtil.getUsername(jwtToken);
//                         Long userId = Long.parseLong(jwtUtil.getUserId(jwtToken));
//                         String role = jwtUtil.getRole(jwtToken);
                        log.info("jwt validation in");
                        User user = User.builder()
                                .userId(Long.parseLong(jwtUtil.getUserId(jwtToken)))
                                .email(jwtUtil.getEmail(jwtToken))
                                .nickname(jwtUtil.getUsername(jwtToken))
                                .role(jwtUtil.getRole(jwtToken))
                                .build();

                        log.info("getUserId = {}", user.getUserId());

                        CustomUserDetails customUserDetails = new CustomUserDetails(user);

                        accessor.setSessionAttributes(Collections.singletonMap("user", customUserDetails));
                        log.info("저장완료");

                    } else {
                        log.info("jwt token invalid");
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
    private String extractJwtFromHeader(StompHeaderAccessor accessor) {
        List<String> authorization = accessor.getNativeHeader("Authorization");
        if (authorization != null && !authorization.isEmpty()) {
            String bearerToken = authorization.get(0);
            if (bearerToken.startsWith("Bearer ")) {
                return bearerToken.substring(7);
            }
        }

        return null;
    }
}
