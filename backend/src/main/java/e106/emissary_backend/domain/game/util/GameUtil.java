package e106.emissary_backend.domain.game.util;

import e106.emissary_backend.domain.game.aspect.RedissonLock;
import e106.emissary_backend.domain.game.entity.Game;
import e106.emissary_backend.domain.game.enumType.CommonResult;
import e106.emissary_backend.domain.game.enumType.EndType;
import e106.emissary_backend.domain.game.enumType.GameRole;
import e106.emissary_backend.domain.game.enumType.GameState;
import e106.emissary_backend.domain.game.model.GameDTO;
import e106.emissary_backend.domain.game.model.Player;
import e106.emissary_backend.domain.game.repository.RedisGameRepository;
import e106.emissary_backend.domain.game.service.publisher.RedisPublisher;
import e106.emissary_backend.domain.game.service.subscriber.message.CommonMessage;
import e106.emissary_backend.domain.game.service.subscriber.message.EndMessage;
import e106.emissary_backend.domain.user.entity.User;
import e106.emissary_backend.domain.user.repository.UserRepository;
import e106.emissary_backend.domain.userInRoom.entity.UserInRoom;
import e106.emissary_backend.domain.userInRoom.repository.UserInRoomRepository;
import e106.emissary_backend.global.error.CommonErrorCode;
import e106.emissary_backend.global.error.exception.NotFoundGameException;
import e106.emissary_backend.global.error.exception.NotFoundRoomException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisKeyValueTemplate;
import org.springframework.data.redis.listener.ChannelTopic;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class GameUtil {
    private final RedisGameRepository redisGameRepository;
    private final RedisKeyValueTemplate redisKeyValueTemplate;
    private final UserInRoomRepository userInRoomRepository;

    private final RedisPublisher redisPublisher;

    private final ChannelTopic commonTopic;
    private final ChannelTopic endTopic;
    private final UserRepository userRepository;

    @Transactional
    @RedissonLock(value = "#gameId")
    public boolean isEnd(long gameId){
        log.info("Game is End Validation run in GameUtil.java");
        Game game = getGame(gameId);
        GameDTO gameDTO = GameDTO.toDto(game);

        Map<Long, Player> playerMap = game.getPlayerMap();

        Map<GameRole, Long> roleCounts = playerMap.values().stream().collect(Collectors.groupingBy(
                Player::getRole,
                Collectors.counting()
        ));

        long emissaryCnt = roleCounts.getOrDefault(GameRole.EMISSARY, 0L) + roleCounts.getOrDefault(GameRole.BETRAYER, 0L);
        long personCnt = roleCounts.getOrDefault(GameRole.PERSON, 0L) + roleCounts.getOrDefault(GameRole.POLICE, 0L);
        log.info("left emissary_betrayer : {} , person_police : {}", emissaryCnt, personCnt);

//        List<UserInRoom> userInRooms = userInRoomRepository.findAllByPk_RoomId(gameId).orElseThrow(
//                () -> new NotFoundRoomException(CommonErrorCode.NOT_FOUND_ROOM_EXCEPTION));

        boolean result = true;
        if(emissaryCnt == 0){
//            update(userInRooms, playerMap, -1);
            update(gameId, playerMap, -1);
            endPublish(gameId, GameRole.PERSON, gameDTO);
        }else if(emissaryCnt >= personCnt){
//            update(userInRooms, playerMap, 1);
            update(gameId, playerMap, 1);
            endPublish(gameId, GameRole.EMISSARY, gameDTO);
        }else{
            result = false;
        }

        log.info("Game isEnd? {}", result);
        return result;
    } // end of isEnd

//    public void emissaryWin(long gameId) {
//        Game game = getGame(gameId);
//
//        Map<Long, Player> playerMap = game.getPlayerMap();
//
//        List<UserInRoom> userInRooms = userInRoomRepository.findAllByPk_RoomId(gameId).orElseThrow(
//                () -> new NotFoundRoomException(CommonErrorCode.NOT_FOUND_ROOM_EXCEPTION));
//
//        update(userInRooms, playerMap, 1);
//    } // end of emissary Win

//    public void personWin(long gameId) {
//        Game game = getGame(gameId);
//
//        Map<Long, Player> playerMap = game.getPlayerMap();
//
//        List<UserInRoom> userInRooms = userInRoomRepository.findAllByPk_RoomId(gameId).orElseThrow(
//                () -> new NotFoundRoomException(CommonErrorCode.NOT_FOUND_ROOM_EXCEPTION));
//
//        update(userInRooms, playerMap, -1);
//    } // end of person Win

    private void update(long gameId, Map<Long, Player> playerMap, int value) {
        List<UserInRoom> userInRooms = userInRoomRepository.findAllByPk_RoomId(gameId).orElseThrow(
                () -> new NotFoundRoomException(CommonErrorCode.NOT_FOUND_ROOM_EXCEPTION));

        log.info("직업별 유저 리스트 뽑아서 늘려주기");
        List<User> personUsers = getUpdateUsers(userInRooms,
                getRoleList(playerMap, GameRole.PERSON),
                -1 * value,
                GameRole.PERSON);
        List<User> policeUsers = getUpdateUsers(userInRooms,
                getRoleList(playerMap, GameRole.POLICE),
                -1 * value,
                GameRole.POLICE);
        List<User> emissaryUsers = getUpdateUsers(userInRooms,
                getRoleList(playerMap, GameRole.EMISSARY),
                value,
                GameRole.EMISSARY);
        List<User> betrayerUsers = getUpdateUsers(userInRooms,
                getRoleList(playerMap, GameRole.BETRAYER),
                value,
                GameRole.BETRAYER);


        userRepository.saveAll(personUsers);
        userRepository.saveAll(policeUsers);
        userRepository.saveAll(emissaryUsers);
        userRepository.saveAll(betrayerUsers);
        log.info("DB에 반영 완료");
    } // end of update



    private static List<User> getUpdateUsers(List<UserInRoom> userInRooms, List<Long> roleList, int value, GameRole role) {
        return userInRooms.stream()
                .map(UserInRoom::getUser)
                .filter(user -> roleList.contains(user.getUserId()))
                .map(user -> {
                    switch (role) {
                        case PERSON:
                            user.setCitizenWinCnt(user.getCitizenWinCnt() + value);
                            user.setCitizenGameCnt(user.getCitizenGameCnt() + value);
                            break;
                        case POLICE:
                            user.setPoliceWinCnt(user.getPoliceWinCnt() + value);
                            user.setPolicePlayCnt(user.getPolicePlayCnt() + value);
                            break;
                        case EMISSARY:
                            user.setMafiaWinCnt(user.getMafiaWinCnt() + value);
                            user.setMafiaPlayCnt(user.getMafiaPlayCnt() + value);
                        case BETRAYER:
                            user.setTurncoatWinCnt(user.getTurncoatWinCnt() + value);
                            user.setTurncoatGameCnt(user.getTurncoatGameCnt() + value);
                    }

                    user.setMafiaWinCnt(user.getMafiaWinCnt() + value);
                    user.setMafiaPlayCnt(user.getMafiaPlayCnt() + value);

                    return user;
                })
                .collect(Collectors.toList());
    }

    private static List<Long> getRoleList(Map<Long, Player> playerMap, GameRole role) {
        return playerMap.values().stream()
                .filter(player -> player.getRole().equals(role))
                .map(Player::getId)
                .collect(Collectors.toList());
    }


    private Game getGame(long gameId) {
        Game game = redisGameRepository.findByGameId(gameId).orElseThrow(
                () -> new NotFoundGameException(CommonErrorCode.NOT_FOUND_GAME_EXCEPTION));
        return game;
    }

    @RedissonLock(value = "#gameId")
    private void endPublish(long gameId, GameRole role, GameDTO gameDTO){
        log.info("발행하기");
        // todo : 삭제 대신 정보를 초기화 하는게 맞아.
        log.info("레디스에서 게임 삭제");
        redisGameRepository.deleteById(gameId);

        redisPublisher.publish(endTopic, EndMessage.builder()
                        .gameId(gameId)
                        .gameState(GameState.END)
                        .result(CommonResult.SUCCESS)
                        .gameDto(gameDTO)
                        .winRole(role)
                        .build());
    }
}
