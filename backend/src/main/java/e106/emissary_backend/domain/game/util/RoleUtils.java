package e106.emissary_backend.domain.game.util;


import e106.emissary_backend.domain.game.enumType.GameRole;
import e106.emissary_backend.domain.game.model.GameDTO;
import e106.emissary_backend.domain.game.model.Player;
import lombok.extern.slf4j.Slf4j;

import java.util.*;

@Slf4j
public class RoleUtils {

    public static Map<GameRole, Integer> getRole(GameDTO gameDTO){
        Map<GameRole, Integer> roles = new HashMap<GameRole, Integer>();

        int playerNum = gameDTO.getPlayerMap().size();

        int emissary = 1;
        int police = 1;

        roles.put(GameRole.EMISSARY, emissary);
        roles.put(GameRole.POLICE, police);

        return roles;
    }

    public static void grantRole(Map<GameRole, Integer> roles, GameDTO gameDTO) {
        log.info("grantRole Started");
        int playerNum = gameDTO.getPlayerMap().size();

        Map<Long, Player> playerMap = gameDTO.getPlayerMap();
        List<Player> players = new ArrayList<>(playerMap.values());
        Collections.shuffle(players);  // 플레이어 리스트를 섞습니다.

        int index = 0;
        for (Map.Entry<GameRole, Integer> entry : roles.entrySet()) {
            GameRole role = entry.getKey();
            int count = entry.getValue();

            for (int i = 0; i < count && index < playerNum; i++) {
                Player player = players.get(index);
                player.setRole(role);
                log.info("player : {} granted : {}", player.getId(), role);
                player.setAlive(true);

                if (role == GameRole.EMISSARY) {
                    gameDTO.setEmissary(player);
                } else if (role == GameRole.POLICE) {
                    gameDTO.setPolice(player);
                }

                index++;
            }
        }

        // 남은 플레이어들에게 PERSON 역할 부여
        log.info("index = {}, playerNum = {} ", index, playerNum);
        for (; index < playerNum; index++) {
            Player player = players.get(index);
            player.setRole(GameRole.PERSON);
            player.setAlive(true);
            log.info("player : {} granted : {}", player.getId(), GameRole.PERSON);
        }
    }
}
