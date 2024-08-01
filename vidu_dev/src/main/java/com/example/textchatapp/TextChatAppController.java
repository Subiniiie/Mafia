package com.example.textchatapp;

import com.google.gson.JsonObject;
import io.openvidu.java.client.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@CrossOrigin("*")
@RequestMapping("/text-chat/api")
public class TextChatAppController {

    private final OpenVidu openVidu;

    // <sessionNo, Session>
    private final Map<String, Session> mapSessions = new ConcurrentHashMap<>();
    // <sessionId, <token, role>>
    private final Map<String, Map<String, SessionRole>> mapSessionNamesTokens = new ConcurrentHashMap<>();

    public TextChatAppController(@Value("${OPENVIDU_URL}") String OPENVIDU_URL,
                                 @Value("${OPENVIDU_SECRET}") String OPENVIDU_SECRET) {
        this.openVidu = new OpenVidu(OPENVIDU_URL, OPENVIDU_SECRET);
    }

    // params => { 'sessionId':'~', 'userId':'~' }
    @PostMapping("/session/join")
    public ResponseEntity<JsonObject> joinSession(@RequestBody Map<String, Object> params) {
        String sessionNo = params.get("sessionNo").toString();
        String userId = params.get("userId").toString();

        System.out.println("[/get-token] 토큰 발급: sessionId=" + sessionNo + ", userId=" + userId);

        boolean isSessionAlreadyExisting = mapSessions.containsKey(sessionNo);
        SessionRole role = null;

        if (isSessionAlreadyExisting) {
            System.out.println("[/get-token] 세션 " + sessionNo + "이 이미 존재합니다. 유저로 접속합니다.");
            role = SessionRole.USER;
        } else {
            System.out.println("[/get-token] 새로운 세션 " + sessionNo + "을 생성합니다. 방장으로 접속합니다.");
            role = SessionRole.HOST;
        }

        ConnectionProperties connectionProperties = new ConnectionProperties.Builder().type(ConnectionType.WEBRTC)
                .role(OpenViduRole.PUBLISHER).data(userId).build();

        JsonObject json = new JsonObject();

        if (isSessionAlreadyExisting) {
            try {
                Session session = mapSessions.get(sessionNo);
                String token = session.createConnection(connectionProperties).getToken();

                // Update our collection storing the new token
                this.mapSessionNamesTokens.get(session.getSessionId()).put(token, role);

                json.addProperty("token", token);

                // Return the response to the client
                return ResponseEntity.ok(json);
            } catch (OpenViduJavaClientException e1) {
                // If internal error generate an error message and return it to client
                return getErrorResponse(e1);
            } catch (OpenViduHttpException e2) {
                if (404 == e2.getStatus()) {
                    // Invalid sessionId (user left unexpectedly). Session object is not valid
                    // anymore. Clean collections and continue as new session
                    this.mapSessionNamesTokens.remove(sessionNo);
                }
            }
        }

        try {
            // Create a new OpenVidu Session
            Session session = this.openVidu.createSession();

            mapSessions.put(sessionNo, session);
            // Generate a new token with the recently created connectionProperties
            String token = session.createConnection(connectionProperties).getToken();

            // Store the session and the token in our collections
            this.mapSessionNamesTokens.put(session.getSessionId(), new ConcurrentHashMap<>());
            this.mapSessionNamesTokens.get(session.getSessionId()).put(token, role);

            // Prepare the response with the sessionId and the token
            json.addProperty("token", token);

            // Return the response to the client
            return ResponseEntity.ok(json);
        } catch (Exception e) {
            // If error generate an error message and return it to client
            return getErrorResponse(e);
        }
    }

    @PostMapping("/users/roles")
    public ResponseEntity<JsonObject> getRoles(@RequestBody Map<String, Object> params) {
        String sessionId = params.get("sessionId").toString();
        String token = params.get("token").toString();

        SessionRole role = mapSessionNamesTokens.get(sessionId).get(token);

        JsonObject json = new JsonObject();
        json.addProperty("role", role.name());

        return ResponseEntity.ok(json);
    }


    // 유저가 세션에서 나가고 서버에 요청을 하면
    // mapSessions와 mapSessionNamesTokens을 업데이트 하고
    // 만약 나간 유저가 방장이고 유저가 남아있을 경우, creationTime이 가장 작은 사람에게 방장 권한을 넘겨주고
    // 유저가 남아있지 않은 경우, 세션을 제거한다
    @PostMapping("/session/leave")
    public ResponseEntity<JsonObject> leaveSession(@RequestBody Map<String, Object> params)
            throws OpenViduJavaClientException, OpenViduHttpException {
        String sessionNo = params.get("sessionNo").toString();
        String token = params.get("token").toString();

        // 세션 찾기
        Session session = mapSessions.get(sessionNo);

        JsonObject json = new JsonObject();

        if (session == null) {
            json.addProperty("error", "Session does not exist");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(json);
        }

        mapSessionNamesTokens.get(sessionNo).remove(token);

        if (session.getConnections().isEmpty()) {
            mapSessions.remove(session.getSessionId());
            mapSessionNamesTokens.remove(session.getSessionId());
            session.close();
        }

        json.addProperty("response", "세션을 성공적으로 떠났습니다");

        return ResponseEntity.ok(json);
    }

    // TODO: 코드 갈아엎고 다시 짜야함
    @PostMapping("/session/changeOwner")
    public ResponseEntity<JsonObject> changeSessionOwner(@RequestBody Map<String, Object> params) throws OpenViduJavaClientException, OpenViduHttpException {
        String sessionNo = params.get("sessionNo").toString();
        Session session = mapSessions.get(sessionNo);

        session.fetch();
        Connection nextOwner =
                session.getActiveConnections()
                        .stream()
                        .min((a, b) -> Long.compare(a.createdAt(), b.createdAt()))
                        .get();

        ConnectionProperties nextOwnerCP = new ConnectionProperties.Builder().role(OpenViduRole.MODERATOR).build();

        // updateConnection => pro 버전 기능이다
        // session.updateConnection(nextOwner.getConnectionId(), nextOwnerCP);

        JsonObject json = new JsonObject();
        json.addProperty("response", "방장이 성공적으로 변경되었습니다");

        return ResponseEntity.ok(json);
    }

    public void closeSession(Session session) throws OpenViduJavaClientException, OpenViduHttpException {
        session.close();
    }

    public ResponseEntity<JsonObject> getErrorResponse(Exception e) {
        JsonObject json = new JsonObject();
        json.addProperty("cause", e.getCause().toString());
        json.addProperty("error", e.getMessage());
        json.addProperty("exception", e.getClass().getCanonicalName());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(json);
    }
}
