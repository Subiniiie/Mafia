package e106.emissary_backend.domain.game.service.subscriber;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import e106.emissary_backend.domain.game.enumType.GameState;
import e106.emissary_backend.domain.game.service.subscriber.message.EndVoteMessage;
import e106.emissary_backend.domain.game.service.subscriber.message.StartVoteMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EndVoteSubscriber {
    private final ObjectMapper objectMapper;
    private final SimpMessagingTemplate simpMessagingTemplate;

    public void sendMessage(String message){
        try {
            // 지금 endVoteMessage
            EndVoteMessage endVoteMessage = objectMapper.readValue(message, EndVoteMessage.class);
            // Message를 통으로 내려보내자? or 결과만 꺼내서 내려보내자

            simpMessagingTemplate.convertAndSend("/sub/" + endVoteMessage.getGameId(), endVoteMessage);
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
    }
}
