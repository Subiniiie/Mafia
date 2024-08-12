package e106.emissary_backend.domain.game.service.subscriber;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import e106.emissary_backend.domain.game.service.subscriber.message.CommonMessage;
import e106.emissary_backend.domain.game.service.subscriber.message.EndMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class EndSubscriber {

    private final ObjectMapper objectMapper;
    private final SimpMessagingTemplate simpMessagingTemplate;

    public void sendMessage(String message){
        try {
            EndMessage endMessage = objectMapper.readValue(message, EndMessage.class);
            long gameId = endMessage.getGameId();

            simpMessagingTemplate.convertAndSend("/sub/" + gameId, endMessage);
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
    }
}
