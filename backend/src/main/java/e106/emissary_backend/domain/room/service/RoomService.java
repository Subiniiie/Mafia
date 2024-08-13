package e106.emissary_backend.domain.room.service;

import e106.emissary_backend.domain.game.aspect.RedissonLock;
import e106.emissary_backend.domain.game.entity.Game;
import e106.emissary_backend.domain.game.enumType.GameState;
import e106.emissary_backend.domain.game.model.GameDTO;
import e106.emissary_backend.domain.game.model.Player;
import e106.emissary_backend.domain.game.repository.RedisGameRepository;
import e106.emissary_backend.domain.game.service.publisher.RedisPublisher;
import e106.emissary_backend.domain.room.dto.*;
import e106.emissary_backend.domain.room.entity.Room;
import e106.emissary_backend.domain.room.enumType.RoomState;
import e106.emissary_backend.domain.room.enumType.SessionRole;
import e106.emissary_backend.domain.room.repository.RoomRepository;
import e106.emissary_backend.domain.room.service.subscriber.message.EnterRoomMessage;
import e106.emissary_backend.domain.room.service.subscriber.message.KickUserMessage;
import e106.emissary_backend.domain.user.dto.RoomDetailUserDto;
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
import jakarta.persistence.criteria.Predicate;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.task.TaskExecutor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.redis.core.RedisKeyValueTemplate;
import org.springframework.data.redis.listener.ChannelTopic;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.time.LocalDateTime;
import java.util.*;
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
    private final RedisKeyValueTemplate redisKeyValueTemplate;
    private final TaskExecutor brokerChannelExecutor;
//    private final RedisTemplate<Long, GameDTO> redisGameTemplate;

    private final RedisPublisher redisPublisher;
    private final ChannelTopic enterRoomTopic;
    private final ChannelTopic kickUserTopic;

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

    public void update(GameDTO gameDTO){
        Game dao = gameDTO.toDao();
        redisGameRepository.save(dao);
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
                        .roomId(room.getRoomId())
                        .ownerName(userRepository.findNicknameByUserId(room.getOwnerId()).orElseThrow(
                                () -> new NotFoundUserException(CommonErrorCode.NOT_FOUND_USER_EXCEPTION)))
                        .maxPlayer(room.getMaxPlayer())
                        .nowPlayer(userInRoomRepository.countPeopleByRoom_RoomId(room.getRoomId()))
                        .password(room.getPassword())
                        .isPrivate(room.isPrivate())
                        .build())
                .collect(Collectors.toList());
    }

    public List<RoomListDto> getFilteredRooms(Pageable pageable, Boolean isPublic, Boolean isPrivate, Boolean isWaiting, String search) {
        Specification<Room> spec = (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (isPublic != null && isPublic) {
                predicates.add(criteriaBuilder.isFalse(root.get("isPrivate")));
            }

            if (isPrivate != null && isPrivate) {
                predicates.add(criteriaBuilder.isTrue(root.get("isPrivate")));
            }

            if (isWaiting != null && isWaiting) {
                predicates.add(criteriaBuilder.equal(root.get("roomState"), RoomState.WAIT));
            }

            if (search != null && !search.isEmpty()) {
                predicates.add(criteriaBuilder.like(root.get("title"), "%" + search + "%"));
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };

        Page<Room> roomList = roomRepository.findAll(spec, pageable);

        return roomList.stream().map(room -> RoomListDto.builder()
                        .title(room.getTitle())
                        .roomId(room.getRoomId())
                        .ownerName(userRepository.findNicknameByUserId(room.getOwnerId()).orElseThrow(
                                () -> new NotFoundUserException(CommonErrorCode.NOT_FOUND_USER_EXCEPTION)))
                        .maxPlayer(room.getMaxPlayer())
                        .nowPlayer(userInRoomRepository.countPeopleByRoom_RoomId(room.getRoomId()))
                        .password(room.getPassword())
                        .isPrivate(room.isPrivate())
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
        Room room = roomRepository.findByRoomId(roomId).orElseThrow(
                () -> new NotFoundRoomException(CommonErrorCode.NOT_FOUND_ROOM_EXCEPTION));

        room.update(roomRequestDto);
        return new CommonResponseDto("ok");
    }

    public CommonResponseDto deleteRoom(Long roomId) {
        roomRepository.findByRoomId(roomId).orElseThrow(() -> new NotFoundRoomException(CommonErrorCode.NOT_FOUND_ROOM_EXCEPTION));
        roomRepository.deleteById(roomId);

        redisGameRepository.deleteById(roomId);
        return new CommonResponseDto("ok");
    }

    @RedissonLock(value = "#roomId")
    public CommonResponseDto deleteUser(Long roomId, Long userId) {
        roomRepository.findByRoomId(roomId).orElseThrow(() -> new NotFoundRoomException(CommonErrorCode.NOT_FOUND_ROOM_EXCEPTION));
        userInRoomRepository.findByPk_UserId(userId).orElseThrow(() -> new NotFoundUserException(CommonErrorCode.NOT_FOUND_USER_EXCEPTION));
        userInRoomRepository.deletePeopleByPk_UserIdAndRoom_RoomId(userId, roomId);

        Game game = redisGameRepository.findByGameId(roomId).orElseThrow(() -> new NotFoundGameException(CommonErrorCode.NOT_FOUND_GAME_EXCEPTION));
        GameDTO gameDTO = GameDTO.toDto(game);
        Map<Long, Player> playerMap = gameDTO.getPlayerMap();

        if(!playerMap.containsKey(userId)){
            throw new NoUserInRoomException(CommonErrorCode.NO_USER_IN_ROOM_EXCEPTION);
        }

        playerMap.remove(userId);
        update(gameDTO);

        redisKeyValueTemplate.update(gameDTO.toDao());

        return new CommonResponseDto("ok");
    }


    public RoomOptionDto makeRoom(long userId, RoomRequestDto roomRequestDto) throws OpenViduJavaClientException, OpenViduHttpException{
        if(!userInRoomRepository.findByPk_UserId(userId).isEmpty())
            throw new AlreadyUserInRoomException(CommonErrorCode.ALREADY_USER_IN_ROOM_EXCEPTION);

        Room room = roomRequestDto.toEntity(userId);

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
        Player player = Player.createPlayer(user.getUserId(), user.getNickname(), userInRoom.getConnectTime());
        player.setReady(true);

        gameDTO.addPlayer(player);

        Game game = gameDTO.toDao();

        redisGameRepository.save(game);

        return RoomOptionDto.of(savedRoom.getRoomId(), user.getNickname(), token, roomRequestDto);
    }// end of makeRoom

    private Session getOrCreateSession(String sessionNo) throws OpenViduJavaClientException, OpenViduHttpException {
        Session session = mapSessions.get(sessionNo);
        if(session == null){
            session = openVidu.createSession();
            mapSessions.put(sessionNo, session);
            mapSessionNamesTokens.put(session.getSessionId(), new ConcurrentHashMap<>());
        }
        return session;
    } // end of getOrCreateSession

    // Todo : 분산 트랜잭션 처리 해줘야함.
        @RedissonLock(value = "#roomId")
        public RoomJoinDto enterRoom(Long roomId, long userId) throws OpenViduJavaClientException, OpenViduHttpException {
            List<UserInRoom> userInRoomList = userInRoomRepository.findAllByPk_RoomId(roomId).orElseThrow(
                    () -> new NotFoundRoomException(CommonErrorCode.NOT_FOUND_ROOM_EXCEPTION));

            Room room = userInRoomList.get(0).getRoom();

            if(userInRoomList.size() > room.getMaxPlayer()) {
                throw new GameFullException(CommonErrorCode.GAME_FULL_EXCEPTION);
            }

            User user = userRepository.findByUserId(userId).orElseThrow(() -> new NotFoundUserException(CommonErrorCode.NOT_FOUND_USER_EXCEPTION));

            // Join OpenVidu Session
            Session session = getOrCreateSession(String.valueOf(roomId));
            log.info("session열었어");
            session.fetch();
            log.info("Fetch했어");

            ConnectionProperties connectionProperties = createConnectionProperties(user.getNickname());
            log.info("connection어쩌고 저쩌고 성공");

            String token = session.createConnection(connectionProperties).getToken();
            updateSessionTokens(session.getSessionId(), token, SessionRole.USER);

            log.info("user : " + user.getUserId());
            userInRoomList.stream()
                    .filter(userInRoom -> userInRoom.getUser().getUserId().equals(userId))
                    .findAny()
                    .ifPresent(userInRoom -> {
                        log.info("userInRoom에 있다요");
                        userInRoomRepository.deleteByPk_UserId(userId);
                        log.info("삭제까지 했따요");
    //                    throw new AlreadyUserInRoomException(CommonErrorCode.ALREADY_USER_IN_ROOM_EXCEPTION);
                    });

            UserInRoom userInRoom = UserInRoom.builder()
                    .pk(new UserInRoom.Pk(roomId, userId))
                    .room(room)
                    .user(user)
                    .isBlocked(false)
                    .connectTime(LocalDateTime.now())
                    .viduToken(token)
                    .build();

            userInRoomRepository.save(userInRoom);
            log.info("씨발 save했짢아!!!");

            // Redis 저장 로직
            Player player = Player.createPlayer(userId, user.getNickname(), userInRoom.getConnectTime());
            Game game = redisGameRepository.findByGameId(roomId).orElseThrow(
                    () -> new NotFoundGameException(CommonErrorCode.NOT_FOUND_GAME_EXCEPTION));
            GameDTO gameDTO = GameDTO.toDto(game);
            gameDTO.addPlayer(player);
            Game updateGame = gameDTO.toDao();

            redisKeyValueTemplate.update(updateGame);
            log.info("레디스에 저장했따요 {}", redisGameRepository.findByGameId(game.getGameId()));

            // Redis 발행 로직
            List<RoomDetailUserDto> userList = userInRoomList.stream()
                    .map(UserInRoom::getUser)
                    .map(nowUser -> RoomDetailUserDto.of(nowUser, room.getOwnerId(), userId))
                    .collect(Collectors.toList());
            RoomDetailUserDto dto = RoomDetailUserDto.of(user, room.getOwnerId(), userId);
            userList.add(dto);

            RoomDetailDto roomDetailDto = RoomDetailDto.toDTO(room, userList);

            redisPublisher.publish(enterRoomTopic, EnterRoomMessage.builder()
                            .gameState(GameState.ENTER)
                            .roomDetailDto(roomDetailDto)
                            .build());
            // 다했으면 leave나 kick할시에 발행하는것도 해야해
            log.info("발행완료");

            RoomJoinDto roomJoinDto = new RoomJoinDto(String.valueOf(room.getRoomId()), token);
            return roomJoinDto;
        } // end of EnterRoom

    @RedissonLock(value = "#roomId")
    public CommonResponseDto leaveRoom(Long roomId, long userId) {
        Session session = mapSessions.get(String.valueOf(roomId));

        if (session == null){
            throw new NotFoundRoomException(CommonErrorCode.NOT_FOUND_ROOM_EXCEPTION);
        }
        System.out.println("check get session");
        System.out.println(session.toString());
        System.out.println(String.valueOf(roomId));

        // 레디스에서 삭제
        deleteUserInRedis(roomId, userId);
        System.out.println("redis delete complete");
        
        // Vidu와 DB에서 삭제
        Map<String, SessionRole> users = mapSessionNamesTokens.get(session.getSessionId());
        UserInRoom userInRoom = userInRoomRepository.findByPk_UserId(userId).orElseThrow(
                () -> new NotFoundUserInRoomException(CommonErrorCode.NOT_FOUND_USER_IN_ROOM_EXCEPTION));
        System.out.println("get User In Room Complete");

        String token = userInRoom.getViduToken();
        if (users.get(token) == SessionRole.USER){
            System.out.println("He is user");
            // 유저일 경우 나가기 처리
            users.remove(token);
            System.out.println("remove session @vidu complete");
            userInRoomRepository.deletePeopleByPk_UserIdAndRoom_RoomId(userId, roomId);
            System.out.println("remove session @mysql complete");
            //remove user @redis
            publishRemoveUser(roomId, userId);
        } else if (users.get(token) == SessionRole.HOST){
            // 방장 위임
            users.remove(token);
            System.out.println("remove current user complete");
            // 여기서 방 삭제 할지 찾는게 맞지 않나..?
            if(users.isEmpty()){
                mapSessions.remove(session.getSessionId());
                mapSessionNamesTokens.remove(session.getSessionId());
                roomRepository.deleteById(roomId);
            } else {
                System.out.println("next owner founded");
                String nextOwnerToken = changeSessionOwner(session);
                System.out.println("He is user");

                User owner = userInRoomRepository.findUserByViduToken(nextOwnerToken).orElseThrow(
                        () -> new NotFoundUserException(CommonErrorCode.NOT_FOUND_USER_EXCEPTION));
                Long ownerId = owner.getUserId();
                Room room = userInRoom.getRoom();
                room.changeOwner(ownerId);

                userInRoomRepository.deletePeopleByPk_UserIdAndRoom_RoomId(userId, roomId);
                System.out.println("remove session @mysql complete");
                //remove user @redis
                publishRemoveUser(roomId, userId);
            }
        }

        return new CommonResponseDto("ok");
    }

    // 방장 변경 기능... 완성 안된거 같은데 ..?
    public String changeSessionOwner(Session session){
        try{
            session.fetch();
            // 다음 먼저 들어온 유처 확인
            Connection nextOwner = session.getActiveConnections().stream()
                    .min((a,b) -> Long.compare(a.createdAt(), b.createdAt()))
                    .orElseThrow(() -> new IllegalStateException("No active connections found"));

            Map<String, SessionRole> users = mapSessionNamesTokens.get(session.getSessionId());
            users.put(nextOwner.getToken(), SessionRole.HOST);

            return nextOwner.getToken();
        } catch (OpenViduJavaClientException | OpenViduHttpException e) {
            return null;
        }
    }

    public boolean kickUser(RoomKickDto roomKickDto, long userId) throws OpenViduJavaClientException, OpenViduHttpException {
        log.info("11");
        Session session = mapSessions.get(String.valueOf(roomKickDto.getRoomId()));
        log.info("22 ,{}", session);
        String connectionId = roomKickDto.getConnectionId();
        log.info("33, {}", connectionId);

        session.fetch();
        log.info("Fetch");

        if (session == null){
            throw new NotFoundRoomException(CommonErrorCode.NOT_FOUND_ROOM_EXCEPTION);
        }
        log.info("눌아님");
        Optional<UserInRoom> userInRoom = userInRoomRepository.findByPk_UserId(userId);
        String token = "";
        if (userInRoom.isPresent()){
            token = userInRoom.get().getViduToken();
        } else {
            throw new NotFoundUserException(CommonErrorCode.NOT_FOUND_USER_EXCEPTION);
        }
        log.info("usr {}", userInRoom.get().getRoom().getRoomId());
        log.info("token = {}", token);
        SessionRole role = mapSessionNamesTokens.get(session.getSessionId()).get(token);

        if (role != SessionRole.HOST){
            // 권한 부족 exception 전송
            log.info("권한없어");
            return false;
        }

        String targetToken = session.getConnection(connectionId).getToken();
        log.info("targetToken = {}", targetToken);
        User targetUser = userInRoomRepository.findUserByViduToken(targetToken).orElseThrow(
                () -> new NotFoundUserInRoomException(CommonErrorCode.NOT_FOUND_USER_IN_ROOM_EXCEPTION));
        long targetId = targetUser.getUserId();
        log.info("targetId = {}", targetId);

        log.info("권한대신에 connection으로 token {}", session);
        // UserInRooM 처리하고
        String nickname = session.getConnection(connectionId).getClientData();
        log.info("kickedUser {}", nickname);
        if (userInRoom.get().getViduToken().equals(targetToken)){
            // 호스트가 스스로 강퇴할 때 exception
            log.info("방장이 스스로를 강퇴하면 안돼.");
            return false;
        }
        userInRoomRepository.deletePeopleByPk_UserIdAndRoom_RoomId(targetId, roomKickDto.getRoomId());
        log.info("여긴가");

        // 레디스 처리하고
        deleteUserInRedis(roomKickDto.getRoomId(), targetId);
        publishRemoveUser(roomKickDto.getRoomId(), userId);
        log.info("레디스 처리 완료");

        // Map 삭제하고
        Map<String, SessionRole> users = mapSessionNamesTokens.get(session.getSessionId());
        users.remove(targetToken);
        log.info("Map 삭제완료");

        // 강퇴 ㄱ
        session.forceDisconnect(connectionId);

        // 강퇴당한 유저 알리기
        KickUserMessage kickUserMessage = KickUserMessage.builder().targetId(targetId).roomId(roomKickDto.getRoomId()).gameState(GameState.KICK).build();
        redisPublisher.publish(kickUserTopic, kickUserMessage);
        return true;
    }

    private Mono<String> sendSignalToSession(String sessionId, String type, String data){
        String url = openviduUrl + "/openvidu/api/signal";
        String authHeader = "Basic" + Base64.getEncoder().encodeToString(("OPENVIDUAPP:"+openviduSecret).getBytes());

        RoomSignalDto body = RoomSignalDto.builder()
                .session(sessionId)
                .type(type)
                .data(data)
                .to(Collections.emptyList())
                .build();

        return webClient.post()
                .uri(url)
                .header("Authorization", authHeader)
                .header("Content-Type", "application/json")
                .bodyValue(body)
                .retrieve()
                .bodyToMono(String.class)
                .doOnSuccess(response -> System.out.println("Signal Sent Successfully"))
                .doOnError(error -> System.out.println("Fail to Send Signal: " + error.getMessage()));
    }

    @RedissonLock(value = "#roomId")
    public RoomDetailDto detailRoom (long roomId, long userId){
        log.info("detail Room run");
        List<UserInRoom> userInRoom = userInRoomRepository.findAllByPk_RoomId(roomId).orElseThrow(
                () -> new NotFoundRoomException(CommonErrorCode.NOT_FOUND_ROOM_EXCEPTION));


        if(Objects.isEmpty(userInRoom)){
            log.info("userInRoom이 비어있어요");
            throw new NotFoundRoomException(CommonErrorCode.NOT_FOUND_ROOM_EXCEPTION);
        }

        Room room = userInRoom.get(0).getRoom();

        List<RoomDetailUserDto> roomDetailUserDtoList = userInRoom.stream()
                .map(UserInRoom::getUser)
                .map(user -> RoomDetailUserDto.of(user, room.getOwnerId(), userId))
                .toList();

        return RoomDetailDto.toDTO(room, roomDetailUserDtoList);
    }

    private void deleteUserInRedis(long roomId, long userId){
        Game game = redisGameRepository.findByGameId(roomId).orElseThrow(
                () -> new NotFoundGameException(CommonErrorCode.NOT_FOUND_GAME_EXCEPTION));

        GameDTO gameDTO = GameDTO.toDto(game);
        gameDTO.getPlayerMap().remove(userId);
        Game updateGame = gameDTO.toDao();

        redisKeyValueTemplate.update(updateGame);
    }

    private void publishRemoveUser(Long roomId, long userId) {
        List<UserInRoom> userInRoomList = userInRoomRepository.findAllByPk_RoomId(roomId).orElseThrow(
                () -> new NotFoundRoomException(CommonErrorCode.NOT_FOUND_ROOM_EXCEPTION));
        Room room = userInRoomList.get(0).getRoom();
        List<RoomDetailUserDto> userList = userInRoomList.stream()
                .map(UserInRoom::getUser)
                .map(nowUser -> RoomDetailUserDto.of(nowUser, room.getOwnerId(), userId))
                .toList();

        for (RoomDetailUserDto roomDetailUserDto : userList) {
            log.info(roomDetailUserDto.toString());
        }

        RoomDetailDto roomDetailDto = RoomDetailDto.builder()
                .roomId(roomId)
                .roomState(RoomState.WAIT)
                .title(room.getTitle())
                .ownerId(room.getOwnerId())
                .maxPlayer(room.getMaxPlayer())
                .haveBetray(room.isHaveBetray())
                .userList(userList)
                .build();

        redisPublisher.publish(enterRoomTopic, EnterRoomMessage.builder()
                        .gameState(GameState.ENTER)
                        .roomDetailDto(roomDetailDto)
                        .build());
    }
}
