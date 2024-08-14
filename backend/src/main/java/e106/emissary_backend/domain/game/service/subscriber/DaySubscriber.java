package e106.emissary_backend.domain.game.service.subscriber;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import e106.emissary_backend.domain.game.model.GameDTO;
import e106.emissary_backend.domain.game.service.subscriber.message.DayMessage;
import e106.emissary_backend.domain.game.service.subscriber.message.GameSetMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class DaySubscriber {

    private final ObjectMapper objectMapper;
    private final SimpMessagingTemplate simpMessagingTemplate;

    public void sendMessage(String message){
        log.info("Day Subscriber Run");
        try {
            DayMessage dayMessage = objectMapper.readValue(message, DayMessage.class);
            Long gameId = dayMessage.getGameId();

            log.info("publish gameDTO in DayMessage : {}", dayMessage);
            simpMessagingTemplate.convertAndSend("/sub/" + gameId, dayMessage);
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
    }
}
