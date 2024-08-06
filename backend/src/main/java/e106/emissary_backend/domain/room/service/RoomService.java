package e106.emissary_backend.domain.room.service;

import e106.emissary_backend.domain.game.entity.Game;
import e106.emissary_backend.domain.game.enumType.GameState;
import e106.emissary_backend.domain.game.model.GameDTO;
import e106.emissary_backend.domain.game.model.Player;
import e106.emissary_backend.domain.game.repository.RedisGameRepository;
import e106.emissary_backend.domain.room.dto.RoomJoinDto;
import e106.emissary_backend.domain.room.dto.RoomOptionDto;
import e106.emissary_backend.domain.room.dto.RoomRequestDto;
import e106.emissary_backend.domain.room.entity.Room;
import e106.emissary_backend.domain.room.dto.RoomListDto;
import e106.emissary_backend.domain.room.enumType.RoomState;
import e106.emissary_backend.domain.room.enumType.SessionRole;
import e106.emissary_backend.domain.room.repository.RoomRepository;
import e106.emissary_backend.domain.user.entity.User;
import e106.emissary_backend.domain.user.repository.UserRepository;
import e106.emissary_backend.domain.userInRoom.entity.UserInRoom;
import e106.emissary_backend.domain.userInRoom.repository.UserInRoomRepository;
import e106.emissary_backend.global.common.CommonResponseDto;
import e106.emissary_backend.global.error.CommonErrorCode;
import e106.emissary_backend.global.error.exception.*;
import io.jsonwebtoken.lang.Objects;
import io.openvidu.java.client.*;
import jakarta.annotation.PostConstruct;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class RoomService {

    private final RoomRepository roomRepository;
    private final UserInRoomRepository userInRoomRepository;
    private final UserRepository userRepository;
    private final RedisGameRepository redisGameRepository;
//    private final RedisTemplate<Long, GameDTO> redisGameTemplate;

    @Value("${OPENVIDU_URL}")
    private String openviduUrl;
    @Value("${OPENVIDU_SECRET}")
    private String openviduSecret;
    private OpenVidu openVidu;
    private WebClient webClient;

    @PostConstruct
    public void init() {
        openVidu = new OpenVidu(openviduUrl, openviduSecret);
        webClient = WebClient.builder().baseUrl(openviduUrl).build();
    }

    private ConnectionProperties createConnectionProperties(String userNickname){
        return new ConnectionProperties.Builder()
                .type(ConnectionType.WEBRTC)
                .role(OpenViduRole.PUBLISHER)
                .data(userNickname)
                .build();
    }

    private void updateSessionTokens(String sessionId, String token, SessionRole role){
        mapSessionNamesTokens.get(sessionId).put(token, role);
    }

    private final Map<String, Session> mapSessions = new ConcurrentHashMap<>();
    private final Map<String, Map<String, SessionRole>> mapSessionNamesTokens = new ConcurrentHashMap<>();

    public List<RoomListDto> getRooms(Pageable pageable) {
        Slice<Room> roomList = roomRepository.findAllBy(pageable).orElseThrow(()-> new NotFoundRoomException(CommonErrorCode.NOT_FOUND_ROOM_EXCEPTION));
        return roomList.stream().map(room -> RoomListDto.builder()
                        .title(room.getTitle())
                        .ownerName(userRepository.findNicknameByUserId(room.getOwnerId()).orElseThrow(
                                () -> new NotFoundUserException(CommonErrorCode.NOT_FOUND_USER_EXCEPTION)))
                        .maxPlayer(room.getMaxPlayer())
                        .nowPlayer(userInRoomRepository.countPeopleByRoom_RoomId(room.getRoomId()))
                        .build())
                .collect(Collectors.toList());
    }

    public RoomOptionDto getOption(Long roomId) {
        Room room = roomRepository.findByRoomId(roomId).orElseThrow(() -> new NotFoundRoomException(CommonErrorCode.NOT_FOUND_ROOM_EXCEPTION));
        return RoomOptionDto.builder()
                .title(room.getTitle())
                .password(room.getPassword())
                .haveBetray(room.isHaveBetray())
                .maxPlayer(room.getMaxPlayer())
                .owner(userRepository.findNicknameByUserId(room.getOwnerId()).orElseThrow(
                        () -> new NotFoundUserException(CommonErrorCode.NOT_FOUND_USER_EXCEPTION)
                ))
                .build();
    }


    public CommonResponseDto updateOption(Long roomId, RoomRequestDto roomRequestDto) {
        Room room = roomRepository.findByRoomId(roomId).orElseThrow(() -> new NotFoundRoomException(CommonErrorCode.NOT_FOUND_ROOM_EXCEPTION));
        room.update(roomRequestDto);
        return new CommonResponseDto("ok");
    }

    public CommonResponseDto deleteRoom(Long roomId) {
        roomRepository.findByRoomId(roomId).orElseThrow(() -> new NotFoundRoomException(CommonErrorCode.NOT_FOUND_ROOM_EXCEPTION));
        roomRepository.deleteById(roomId);
        return new CommonResponseDto("ok");
    }

    public CommonResponseDto deleteUser(Long roomId, Long userId) {
        roomRepository.findByRoomId(roomId).orElseThrow(() -> new NotFoundRoomException(CommonErrorCode.NOT_FOUND_ROOM_EXCEPTION));
        userInRoomRepository.findByPk_UserId(userId).orElseThrow(() -> new NotFoundUserException(CommonErrorCode.NOT_FOUND_USER_EXCEPTION));
        userInRoomRepository.deletePeopleByPk_UserIdAndRoom_RoomId(roomId, userId);

        return new CommonResponseDto("ok");
    }


    public RoomOptionDto makeRoom(long userId, RoomRequestDto roomRequestDto) throws OpenViduJavaClientException, OpenViduHttpException{
        if(!userInRoomRepository.findByPk_UserId(userId).isEmpty())
            throw new AlreadyUserInRoomException(CommonErrorCode.ALREADY_USER_IN_ROOM_EXCEPTION);

        Room room = Room.builder()
                .title(roomRequestDto.getTitle())
                .password(roomRequestDto.getPassword())
                .haveBetray(roomRequestDto.isHaveBetray())
                .maxPlayer(roomRequestDto.getMaxPlayer())
                .ownerId(userId)
                .roomState(RoomState.WAIT)
                .build();
        User user = userRepository.findByUserId(userId).orElseThrow(() -> new NotFoundUserException(CommonErrorCode.NOT_FOUND_USER_EXCEPTION));
        log.info("user = {}",user.getNickname());

        Room savedRoom = roomRepository.save(room);
        // Make OpenVidu Session
        Session session = getOrCreateSession(String.valueOf(savedRoom.getRoomId()));
        session.fetch();

        ConnectionProperties connectionProperties = createConnectionProperties(user.getNickname());

        String token = session.createConnection(connectionProperties).getToken();
        updateSessionTokens(session.getSessionId(), token, SessionRole.HOST);

        UserInRoom userInRoom = UserInRoom.builder()
                .pk(new UserInRoom.Pk(savedRoom.getRoomId(), userId))
                .room(savedRoom)
                .user(user)
                .isBlocked(false)
                .connectTime(LocalDateTime.now())
                .viduToken(token)
                .build();

        userInRoomRepository.save(userInRoom);
        // Redis 저장로직
        GameDTO gameDTO = GameDTO.builder()
                .gameId(savedRoom.getRoomId())
                .title(savedRoom.getTitle())
                .ownerName(user.getNickname())
                .maxPlayer(savedRoom.getMaxPlayer())
                .isHaveBetrayer(savedRoom.isHaveBetray())
                .gameState(GameState.WAIT)
                .build();
        Player player = Player.createPlayer(user.getUserId(), user.getNickname());
        gameDTO.addPlayer(player);

        Game game = gameDTO.toDao();

        redisGameRepository.save(game);

        return RoomOptionDto.of(user.getNickname(), token, roomRequestDto);
    }// end of makeRoom

    private Session getOrCreateSession(String sessionNo) throws OpenViduJavaClientException, OpenViduHttpException {
        Session session = mapSessions.get(sessionNo);
        if(session == null){
            session = openVidu.createSession();
            mapSessions.put(sessionNo, session);
            mapSessionNamesTokens.put(session.getSessionId(), new ConcurrentHashMap<>());
        }
        return session;
    }

    // Todo : 분산 트랜잭션 처리 해줘야함.
    public RoomJoinDto enterRoom(Long roomId, long userId) throws OpenViduJavaClientException, OpenViduHttpException {
        Room room = roomRepository.findByRoomId(roomId).orElseThrow(() -> new NotFoundRoomException(CommonErrorCode.NOT_FOUND_ROOM_EXCEPTION));
        if(userInRoomRepository.countPeopleByRoom_RoomId(roomId) > room.getMaxPlayer()) {
            throw new GameFullException(CommonErrorCode.GAME_FULL_EXCEPTION);
        }

        User user = userRepository.findByUserId(userId).orElseThrow(() -> new NotFoundUserException(CommonErrorCode.NOT_FOUND_USER_EXCEPTION));

        // Join OpenVidu Session
        Session session = getOrCreateSession(String.valueOf(roomId));
        session.fetch();

        ConnectionProperties connectionProperties = createConnectionProperties(user.getNickname());

        String token = session.createConnection(connectionProperties).getToken();
        updateSessionTokens(session.getSessionId(), token, SessionRole.USER);

        log.info("user : " + user.getUserId());
        if(userInRoomRepository.findByPk_UserId(userId).isPresent()){
            throw new AlreadyExistUserException(CommonErrorCode.ALREADY_EXIST_USER_EXCEPTION);
        }

        UserInRoom userInRoom = UserInRoom.builder()
                .pk(new UserInRoom.Pk(roomId, userId))
                .room(room)
                .user(user)
                .isBlocked(false)
                .connectTime(LocalDateTime.now())
                .build();

        userInRoomRepository.save(userInRoom);

        // Redis 저장 로직
        Player player = Player.createPlayer(userId, user.getNickname());
        Game game = redisGameRepository.findByGameId(roomId).orElseThrow(
                () -> new NotFoundGameException(CommonErrorCode.NOT_FOUND_GAME_EXCEPTION));

        GameDTO gameDTO = GameDTO.toDto(game);
        gameDTO.addPlayer(player);

        Game updateGame = gameDTO.toDao();

        redisGameRepository.save(updateGame);

        return new RoomJoinDto(String.valueOf(room.getRoomId()), token);
    }

    public CommonResponseDto leaveRoom(Long roomId, long userId) {
        Session session = mapSessions.get(String.valueOf(roomId));

        if (session == null){
            throw new NotFoundRoomException(CommonErrorCode.NOT_FOUND_ROOM_EXCEPTION);
        }

        Map<String, SessionRole> users = mapSessionNamesTokens.get(session.getSessionId());
        Optional<UserInRoom> userInRoom = userInRoomRepository.findByPk_UserId(userId);
        if (userInRoom.isPresent()){
            String token = userInRoom.get().getViduToken();
            if (users.get(token) == SessionRole.USER){
                // 나가기 처리
            } else if (users.get(token) == SessionRole.HOST){
                // 방장 위임
            }

            // users empty 되면 방 삭제
            users.remove(token);
        } else {
            throw new NotFoundUserException(CommonErrorCode.NOT_FOUND_USER_EXCEPTION);
        }

        roomRepository.deleteById(roomId);
        userInRoomRepository.deletePeopleByPk_UserIdAndRoom_RoomId(roomId, userId);

        return new CommonResponseDto("ok");
    }
}
