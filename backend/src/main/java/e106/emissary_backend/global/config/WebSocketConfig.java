package e106.emissary_backend.global.config;

// import e106.emissary_backend.global.interceptor.FilterChannelInterceptor;
import e106.emissary_backend.domain.security.util.JWTUtil;
import e106.emissary_backend.global.interceptor.FilterChannelInterceptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Autowired
    private JWTUtil jwtUtil;

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        registry.setApplicationDestinationPrefixes("/ws/pub");
        registry.enableSimpleBroker("/ws/sub");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws")
//                .setAllowedOrigins("*")
                .setAllowedOriginPatterns("*");
        // 지우니까 잘돼...
//                .withSockJS();
    }

    /**
     * STOMP 연결 시도시 호출되는 메서드
     */
     @Override
     public void configureClientInboundChannel(ChannelRegistration registration) {
         registration.interceptors(new FilterChannelInterceptor(jwtUtil));
     }
}
