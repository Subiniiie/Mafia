package e106.emissary_backend.domain.room.service.subscriber;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import e106.emissary_backend.domain.room.service.subscriber.message.EnterRoomMessage;
import e106.emissary_backend.domain.room.service.subscriber.message.KickUserMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class KickUserSubscriber {

    private final ObjectMapper objectMapper;
    private final SimpMessagingTemplate simpMessagingTemplate;

    public void sendMessage(String message){
        try {
            log.info("Kick USEr Subscriber run : {}", message);
            KickUserMessage kickUserMessage = objectMapper.readValue(message, KickUserMessage.class);
            long roomId = kickUserMessage.getRoomId();

            log.info("targetID = {}", kickUserMessage.getTargetId());
            log.info("roomId = {}", roomId);
            simpMessagingTemplate.convertAndSend("/sub/" + roomId, kickUserMessage);
            log.info("Enter/leave Room subscriber run : {}", message);
        } catch (JsonProcessingException e) {
            log.error("Json 파싱에 오류생김", e);
            throw new RuntimeException(e);
        }catch (Exception e) {
            log.error("무슨 에러일까?", e);
        }
    }
}

