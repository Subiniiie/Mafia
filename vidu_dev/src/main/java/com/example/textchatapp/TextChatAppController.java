package com.example.textchatapp;

import com.google.gson.JsonObject;
import io.openvidu.java.client.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.Base64;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@CrossOrigin("*")
@RequestMapping("/text-chat/api")
public class TextChatAppController {

    private static final String SESSION_NO = "sessionNo";
    private static final String USER_ID = "userId";
    private static final String TOKEN = "token";
    private static final String SESSION_ID = "sessionId";

    private final OpenVidu openVidu;
    private final WebClient webClient;
    private final String openviduUrl;
    private final String openviduSecret;

    private final Map<String, Session> mapSessions = new ConcurrentHashMap<>();
    private final Map<String, Map<String, SessionRole>> mapSessionNamesTokens = new ConcurrentHashMap<>();

    public TextChatAppController(@Value("${OPENVIDU_URL}") String openviduUrl,
                                 @Value("${OPENVIDU_SECRET}") String openviduSecret) {
        this.openVidu = new OpenVidu(openviduUrl, openviduSecret);
        this.webClient = WebClient.builder().baseUrl(openviduUrl).build();
        this.openviduUrl = openviduUrl;
        this.openviduSecret = openviduSecret;
    }

    @PostMapping("/session/join")
    public ResponseEntity<JsonObject> joinSession(@RequestBody Map<String, Object> params) {
        String sessionNo = params.get(SESSION_NO).toString();
        String userId = params.get(USER_ID).toString();

        System.out.println("[/get-token] 토큰 발급: sessionNo=" + sessionNo + ", userId=" + userId);

        SessionRole role = mapSessions.containsKey(sessionNo) ? SessionRole.USER : SessionRole.HOST;
        System.out.println("[/get-token] " + (role == SessionRole.HOST ? "새로운 세션 " : "세션 ") + sessionNo + (role == SessionRole.HOST ? "을 생성합니다. 방장으로 접속합니다." : "이 이미 존재합니다. 유저로 접속합니다."));

        ConnectionProperties connectionProperties = createConnectionProperties(userId);

        try {
            Session session = getOrCreateSession(sessionNo);
            String token = session.createConnection(connectionProperties).getToken();
            updateSessionTokens(session.getSessionId(), token, role);

            JsonObject response = new JsonObject();
            response.addProperty(TOKEN, token);
            return ResponseEntity.ok(response);
        } catch (OpenViduJavaClientException | OpenViduHttpException e) {
            return handleOpenViduException(e, sessionNo);
        }
    }

    @PostMapping("/users/session-roles")
    public ResponseEntity<JsonObject> getSessionRoles(@RequestBody Map<String, Object> params) {
        String sessionId = params.get(SESSION_ID).toString();
        String token = params.get(TOKEN).toString();

        SessionRole role = mapSessionNamesTokens.get(sessionId).get(token);

        JsonObject response = new JsonObject();
        response.addProperty("role", role.name());

        return ResponseEntity.ok(response);
    }

    @PostMapping("/session/leave")
    public ResponseEntity<JsonObject> leaveSession(@RequestBody Map<String, Object> params) {
        String sessionNo = params.get(SESSION_NO).toString();
        String token = params.get(TOKEN).toString();

        Session session = mapSessions.get(sessionNo);

        if (session == null) {
            return createErrorResponse("Session does not exist", HttpStatus.NOT_FOUND);
        }

        mapSessionNamesTokens.get(sessionNo).remove(token);

        if (session.getConnections().isEmpty()) {
            removeSession(session);
        }

        return createSuccessResponse("세션을 성공적으로 떠났습니다");
    }

    @PostMapping("/session/time/night")
    public ResponseEntity<JsonObject> changeTimeToNight(@RequestBody Map<String, Object> params) {
        return changeTime(params, "signal:night", "It's night");
    }

    @PostMapping("/session/time/day")
    public ResponseEntity<JsonObject> changeTimeToDay(@RequestBody Map<String, Object> params) {
        return changeTime(params, "signal:day", "It's day");
    }

    @PostMapping("/session/change-owner")
    public ResponseEntity<JsonObject> changeSessionOwner(@RequestBody Map<String, Object> params) {
        String sessionNo = params.get(SESSION_NO).toString();
        Session session = mapSessions.get(sessionNo);

        try {
            session.fetch();
            Connection nextOwner = session.getActiveConnections().stream()
                    .min((a, b) -> Long.compare(a.createdAt(), b.createdAt()))
                    .orElseThrow(() -> new IllegalStateException("No active connections found"));

            // Note: updateConnection is a pro version feature
            // ConnectionProperties nextOwnerCP = new ConnectionProperties.Builder().role(OpenViduRole.MODERATOR).build();
            // session.updateConnection(nextOwner.getConnectionId(), nextOwnerCP);

            return createSuccessResponse("방장이 성공적으로 변경되었습니다");
        } catch (OpenViduJavaClientException | OpenViduHttpException e) {
            return handleOpenViduException(e, sessionNo);
        }
    }

    private ConnectionProperties createConnectionProperties(String userId) {
        return new ConnectionProperties.Builder()
                .type(ConnectionType.WEBRTC)
                .role(OpenViduRole.PUBLISHER)
                .data(userId)
                .build();
    }

    private Session getOrCreateSession(String sessionNo) throws OpenViduJavaClientException, OpenViduHttpException {
        Session session = mapSessions.get(sessionNo);
        if (session == null) {
            session = openVidu.createSession();
            mapSessions.put(sessionNo, session);
            mapSessionNamesTokens.put(session.getSessionId(), new ConcurrentHashMap<>());
        }
        return session;
    }

    private void updateSessionTokens(String sessionId, String token, SessionRole role) {
        mapSessionNamesTokens.get(sessionId).put(token, role);
    }

    private ResponseEntity<JsonObject> handleOpenViduException(Exception e, String sessionNo) {
        if (e instanceof OpenViduHttpException && ((OpenViduHttpException) e).getStatus() == 404) {
            mapSessionNamesTokens.remove(sessionNo);
        }
        return getErrorResponse(e);
    }

    private void removeSession(Session session) {
        try {
            session.close();
            mapSessions.remove(session.getSessionId());
            mapSessionNamesTokens.remove(session.getSessionId());
        } catch (OpenViduJavaClientException | OpenViduHttpException e) {
            e.printStackTrace();
        }
    }

    private ResponseEntity<JsonObject> changeTime(Map<String, Object> params, String type, String body) {
        String sessionNo = params.get(SESSION_NO).toString();
        Session session = mapSessions.get(sessionNo);

        Mono<String> sendRes = sendSignalToSession(session.getSessionId(), type, body);
        sendRes.block();

        return createSuccessResponse("success");
    }

    private Mono<String> sendSignalToSession(String sessionId, String type, String data) {
        String url = openviduUrl + "/openvidu/api/signal";
        String authHeader = "Basic " + Base64.getEncoder().encodeToString(("OPENVIDUAPP:" + openviduSecret).getBytes());

        Map<String, Object> body = new HashMap<>();
        body.put("session", sessionId);
        body.put("type", type);
        body.put("data", data);
        body.put("to", Collections.emptyList());

        return webClient.post()
                .uri(url)
                .header("Authorization", authHeader)
                .header("Content-Type", "application/json")
                .bodyValue(body)
                .retrieve()
                .bodyToMono(String.class)
                .doOnSuccess(response -> System.out.println("Signal sent successfully"))
                .doOnError(error -> System.err.println("Failed to send signal: " + error.getMessage()));
    }

    private ResponseEntity<JsonObject> getErrorResponse(Exception e) {
        JsonObject json = new JsonObject();
        json.addProperty("cause", e.getCause() != null ? e.getCause().toString() : "Unknown");
        json.addProperty("error", e.getMessage());
        json.addProperty("exception", e.getClass().getCanonicalName());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(json);
    }

    private ResponseEntity<JsonObject> createErrorResponse(String message, HttpStatus status) {
        JsonObject json = new JsonObject();
        json.addProperty("error", message);
        return ResponseEntity.status(status).body(json);
    }

    private ResponseEntity<JsonObject> createSuccessResponse(String message) {
        JsonObject json = new JsonObject();
        json.addProperty("response", message);
        return ResponseEntity.ok(json);
    }
}