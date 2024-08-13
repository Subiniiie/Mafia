package e106.emissary_backend.domain.game.service.subscriber;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import e106.emissary_backend.domain.game.enumType.GameState;
import e106.emissary_backend.domain.game.service.subscriber.message.NightEmissaryMessage;
import e106.emissary_backend.domain.game.service.subscriber.message.StartVoteMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class NightEmissarySubscriber {

    private final ObjectMapper objectMapper;
    private final SimpMessagingTemplate simpMessagingTemplate;

    public void sendMessage(String message){
        try {
            NightEmissaryMessage nightEmissaryMessage = objectMapper.readValue(message, NightEmissaryMessage.class);

            log.info("NightEmissarySubscriber run : {}", nightEmissaryMessage);
            simpMessagingTemplate.convertAndSend("/sub/" + nightEmissaryMessage.getGameId(), nightEmissaryMessage);
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
    }
}
