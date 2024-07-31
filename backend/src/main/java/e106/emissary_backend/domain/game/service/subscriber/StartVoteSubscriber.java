package e106.emissary_backend.domain.game.service.subscriber;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import e106.emissary_backend.domain.game.enumType.GameState;
import e106.emissary_backend.domain.game.model.GameDTO;
import e106.emissary_backend.domain.game.service.subscriber.message.DayMessage;
import e106.emissary_backend.domain.game.service.subscriber.message.StartVoteMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.reactivestreams.Subscriber;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class StartVoteSubscriber {

    private final ObjectMapper objectMapper;
    private final SimpMessagingTemplate simpMessagingTemplate;

    public void sendMessage(String message){
        //Todo : 프론트로 webSocket을 통해 데이터 내리기
        try {
            StartVoteMessage startVoteMessage = objectMapper.readValue(message, StartVoteMessage.class);
            long gameId = startVoteMessage.getGameId();

            simpMessagingTemplate.convertAndSend("/sub/" + gameId, GameState.VOTE_START);
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
    }
}
