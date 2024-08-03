package e106.emissary_backend.domain.game.service.subscriber;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import e106.emissary_backend.domain.game.model.GameDTO;
import e106.emissary_backend.domain.game.model.Player;
import e106.emissary_backend.domain.game.service.subscriber.message.DayMessage;
import e106.emissary_backend.domain.game.util.RoleUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class DaySubscriber {

    private final ObjectMapper objectMapper;
    private final SimpMessagingTemplate simpMessagingTemplate;

    public void sendMessage(String message){
        //Todo : 프론트로 webSocket을 통해 데이터 내리기
        try {
            DayMessage dayMessage = objectMapper.readValue(message, DayMessage.class);
            Long gameId = dayMessage.getGameId();
            GameDTO gameDTO = dayMessage.getGameDTO();

            simpMessagingTemplate.convertAndSend("/sub/" + gameId, gameDTO);
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
    }
}
