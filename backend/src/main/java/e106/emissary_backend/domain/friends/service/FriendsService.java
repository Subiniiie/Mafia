package e106.emissary_backend.domain.friends.service;

import e106.emissary_backend.domain.friends.entity.Friends;
import e106.emissary_backend.domain.friends.repository.FriendsRepository;
import e106.emissary_backend.domain.user.entity.User;
import e106.emissary_backend.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FriendsService {

    private final FriendsRepository friendsRepository;
    private final UserRepository userRepository;

    public Friends sendFriendRequest(User user1, User user2) {
        Friends friendship = Friends.builder()
                .user1(user1)
                .user2(user2)
                .isAccepted("N") // 요청 대기 상태
                .build();
        return friendsRepository.save(friendship);
    }

    public void acceptFriendRequest(Friends friendship) {
        friendship.acceptFriendRequest();
        friendsRepository.save(friendship);
    }

    public void declineFriendRequest(Friends friendship) {
        friendship.declineFriendRequest();
        friendsRepository.save(friendship);
    }

    public Friends getFriendRequest(String user1, String user2) {
        return friendsRepository.findFriendRequest(user1, user2);
    }

    public Friends getFriend(String user1, String user2) {
        return friendsRepository.findFriend(user1, user2);
    }

    public List<Friends> getFriendsAsUser1(User user) {
        return user.getFriendsAsUser1().stream()
                .filter(friendship -> "Y".equals(friendship.getIsAccepted()))
                .collect(Collectors.toList());
    }

    public List<Friends> getFriendsAsUser2(User user) {
        return user.getFriendsAsUser2().stream()
                .filter(friendship -> "Y".equals(friendship.getIsAccepted()))
                .collect(Collectors.toList());
    }

    public List<String> getReceiveFriends(String user) {
        List<Friends> friendship =  friendsRepository.receiveRequest(user);
        List<String> users = new ArrayList<>();
        for (Friends f : friendship) {
            users.add(f.getUser1().getNickname());
        }
        return users;
    }

}
