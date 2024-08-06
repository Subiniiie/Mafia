package e106.emissary_backend.domain.game.service.subscriber;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import e106.emissary_backend.domain.game.enumType.GameState;
import e106.emissary_backend.domain.game.service.subscriber.message.ReadyMessage;
import e106.emissary_backend.domain.game.service.subscriber.message.StartVoteMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class ReadySubscriber {

    private final ObjectMapper objectMapper;
    private final SimpMessagingTemplate simpMessagingTemplate;

    public void sendMessage(String message){
        /**
        프론트로 webSocket을 통해 데이터 내리기
          */
        try {
            ReadyMessage readyMessage = objectMapper.readValue(message, ReadyMessage.class);
            long gameId = readyMessage.getGameId();

            simpMessagingTemplate.convertAndSend("/sub/" + gameId, readyMessage);
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
    }
}
