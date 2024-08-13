package e106.emissary_backend.domain.game.service.subscriber;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import e106.emissary_backend.domain.game.model.GameDTO;
import e106.emissary_backend.domain.game.service.subscriber.message.GameSetMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class GameSetSubscriber {

    private final ObjectMapper objectMapper;
    private final SimpMessagingTemplate simpMessagingTemplate;

    public void sendMessage(String message){
        //Todo : 프론트로 webSocket을 통해 데이터 내리기
        try {
            GameSetMessage gameSetMessage = objectMapper.readValue(message, GameSetMessage.class);
            Long gameId = gameSetMessage.getGameId();

            gameSetMessage.getGameDTO().getPlayerMap().get(gameSetMessage.getUserId()).setMe(true);

            GameDTO gameDTO = gameSetMessage.getGameDTO();

            simpMessagingTemplate.convertAndSend("/sub/" + gameId, gameDTO);
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
    }
}
