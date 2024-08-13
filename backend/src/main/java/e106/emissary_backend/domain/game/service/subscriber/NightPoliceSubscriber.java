package e106.emissary_backend.domain.game.service.subscriber;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import e106.emissary_backend.domain.game.service.subscriber.message.NightEmissaryMessage;
import e106.emissary_backend.domain.game.service.subscriber.message.NightPoliceMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class NightPoliceSubscriber {

    private final ObjectMapper objectMapper;
    private final SimpMessagingTemplate simpMessagingTemplate;

    public void sendMessage(String message){
        try {
            NightPoliceMessage nightPoliceMessage = objectMapper.readValue(message, NightPoliceMessage.class);

            log.info("NightPoliceSubscriber run : {}", nightPoliceMessage);
            simpMessagingTemplate.convertAndSend("/sub/" + nightPoliceMessage.getGameId(), nightPoliceMessage);
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
    }
}
