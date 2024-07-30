package e106.emissary_backend.domain.game.util;


import e106.emissary_backend.domain.game.enumType.GameRole;
import e106.emissary_backend.domain.game.model.Game;
import e106.emissary_backend.domain.game.model.Player;

import java.util.*;

public class RoleUtils {

    public static Map<GameRole, Integer> getRole(Game game){
        Map<GameRole, Integer> roles = new HashMap<GameRole, Integer>();

        int playerNum = game.getPlayerMap().size();

        int emissary = 2;
        int betray = game.isHaveBetrayer() ? 1 : 0;
        int police = 1;

        if(playerNum < 6){
            emissary = 1;
        }

        roles.put(GameRole.BETRAYER, betray);
        roles.put(GameRole.EMISSARY, emissary);
        roles.put(GameRole.POLICE, police);

        return roles;
    }

    public static List<Player> grantRole(Map<GameRole, Integer> roles, Game game) {
        List<Player> emissary = new ArrayList<>();
        int playerNum = game.getPlayerMap().size();
        Map<Long, Player> playerMap = game.getPlayerMap();
        List<Player> players = new ArrayList<>(playerMap.values());
        Collections.shuffle(players);  // 플레이어 리스트를 섞습니다.

        int index = 0;
        for (Map.Entry<GameRole, Integer> entry : roles.entrySet()) {
            GameRole role = entry.getKey();
            int count = entry.getValue();

            for (int i = 0; i < count && index < playerNum; i++) {
                Player player = players.get(index);
                player.setRole(role);
                player.setAlive(true);

                if (role == GameRole.EMISSARY) {
                    emissary.add(player);
                } else if (role == GameRole.POLICE) {
                    game.setPolice(player);
                } else if (role == GameRole.BETRAYER) {
                    game.setBetrayer(player);
                    game.setHaveBetrayer(true);
                }

                index++;
            }
        }

        // 남은 플레이어들에게 PERSON 역할 부여
        for (; index < playerNum; index++) {
            Player player = players.get(index);
            player.setRole(GameRole.PERSON);
            player.setAlive(true);
        }

        game.setEmissary(emissary);
        return emissary;
    }
}
