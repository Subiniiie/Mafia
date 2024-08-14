package e106.emissary_backend.domain.game.service.subscriber;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import e106.emissary_backend.domain.game.service.subscriber.message.CommonMessage;
import e106.emissary_backend.domain.game.service.subscriber.message.EnterGameMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class EnterGameSubscriber {

    private final ObjectMapper objectMapper;
    private final SimpMessagingTemplate simpMessagingTemplate;

    public void sendMessage(String message){
        try {
            EnterGameMessage enterGameMessage = objectMapper.readValue(message, EnterGameMessage.class);
            long gameId = enterGameMessage.getGameId();

            simpMessagingTemplate.convertAndSend("/sub/" + gameId, enterGameMessage);
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
    }
}
