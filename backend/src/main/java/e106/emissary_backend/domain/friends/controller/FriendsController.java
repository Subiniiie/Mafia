package e106.emissary_backend.domain.friends.controller;

import e106.emissary_backend.domain.friends.dto.FriendshipRequest;
import e106.emissary_backend.domain.friends.dto.SearchResponse;
import e106.emissary_backend.domain.friends.entity.Friends;
import e106.emissary_backend.domain.friends.service.FriendsService;
import e106.emissary_backend.domain.user.dto.CustomUserDetails;
import e106.emissary_backend.domain.user.entity.User;
import e106.emissary_backend.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequiredArgsConstructor
@CrossOrigin
public class FriendsController {

    private final UserRepository userRepository;
    private final FriendsService friendsService;

    @GetMapping("/api/friends")
    public List<User> getFriendsList(@AuthenticationPrincipal CustomUserDetails currentUser) {//(@RequestBody FriendsListRequest request) {
        List<User> friendsList = new ArrayList<>();
        Optional<User> user = userRepository.findByUserId(currentUser.getUserId());
        if (user.isPresent()) {
            User parent = user.get();
            List<Friends> friendsAsUser1 = friendsService.getFriendsAsUser1(parent);
            List<Friends> friendsAsUser2 = friendsService.getFriendsAsUser2(parent);
            for(Friends friendship : friendsAsUser1) {
                friendsList.add(friendship.getUser2());
            }
            for(Friends friendship : friendsAsUser2) {
                friendsList.add(friendship.getUser1());
            }
        }
        return friendsList;
    }

    @PostMapping("/api/friends/request")
    public ResponseEntity<Map<String, Object>> makeFriends(@AuthenticationPrincipal CustomUserDetails currentUser,@RequestBody FriendshipRequest request) {
        Map<String, Object> map = new HashMap<>();
        try {
            Optional<User> user1 = userRepository.findByUserId(currentUser.getUserId());
            Optional<User> user2 = userRepository.findByUserId(request.getUserId());
            if (user1.isPresent() && user2.isPresent()) {
                User parent1 = user1.get();
                User parent2 = user2.get();
                friendsService.sendFriendRequest(parent1, parent2);
                map.put("status", "success");
            } else {
                map.put("status", "fail");
            }
        }catch (Exception e) {
            map.put("status", "fail");
            map.put("message", e.getMessage());
        }
        return ResponseEntity.ok(map);
    }

    @PatchMapping("/api/friends/accept")
    public ResponseEntity<Map<String, Object>> acceptFriends(@AuthenticationPrincipal CustomUserDetails currentUser, @RequestBody FriendshipRequest request){
        Map<String, Object> map = new HashMap<>();
        try {
            Friends friendship = friendsService.getFriendRequest(request.getUserId(), currentUser.getUserId());
            friendsService.acceptFriendRequest(friendship);
            map.put("status", "success");
        } catch (Exception e){
            map.put("status", "fail");
            map.put("message", e.getMessage());
        }
        return ResponseEntity.ok(map);
    }

    @PatchMapping("/api/friends/reject")
    public ResponseEntity<Map<String, Object>> rejectFriends(@AuthenticationPrincipal CustomUserDetails currentUser, @RequestBody FriendshipRequest request){
        Map<String, Object> map = new HashMap<>();
        try {
            Friends friendship = friendsService.getFriendRequest(request.getUserId(), currentUser.getUserId());
            friendsService.declineFriendRequest(friendship);
            map.put("status", "success");
        } catch (Exception e){
            map.put("status", "fail");
            map.put("message", e.getMessage());
        }
        return ResponseEntity.ok(map);
    }

    @PatchMapping("/api/friends/delete")
    public ResponseEntity<Map<String, Object>> deleteFriends(@AuthenticationPrincipal CustomUserDetails currentUser, @RequestBody FriendshipRequest request){
        Map<String, Object> map = new HashMap<>();
        try{
            Friends friendship = friendsService.getFriend(currentUser.getUserId(), request.getUserId());
            friendsService.declineFriendRequest(friendship);
            map.put("status","success");
        } catch (Exception e){
            map.put("status", "fail");
            map.put("message", e.getMessage());
        }
        return ResponseEntity.ok(map);
    }

    @GetMapping("/api/friends/search")
    public List<SearchResponse> searchUsers(@AuthenticationPrincipal CustomUserDetails currentUser, @RequestParam String keyword){//(@RequestBody SearchRequest request){
        List<User> userList = userRepository.findByNicknameContaining(keyword);
        List<SearchResponse> searchResponseList = new ArrayList<>();
        for (User user : userList) {
            if(user.getNickname().equals(currentUser.getUsername()))continue; // 나를 검색했을 경우
            SearchResponse searchResponse = new SearchResponse();
            searchResponse.setUserId(user.getUserId());
            searchResponse.setNickname(user.getNickname());
            Friends friendship = friendsService.getFriend(user.getUserId(), currentUser.getUserId());
            if(friendship != null){
                searchResponse.setStatus("Y"); // 이미 친구임
                searchResponseList.add(searchResponse);
                continue;
            }
            friendship = friendsService.getFriendRequest(user.getUserId(), currentUser.getUserId());
            if(friendship != null){
                searchResponse.setStatus("N"); // 내가 받은 상태
                searchResponseList.add(searchResponse);
                continue;
            }
            friendship = friendsService.getFriendRequest(currentUser.getUserId(), user.getUserId());
            if(friendship != null){
                searchResponse.setStatus("A"); // 내가 보낸 상태
                searchResponseList.add(searchResponse);
                continue;
            }
            searchResponse.setStatus("R"); // 친구가 아님
            searchResponseList.add(searchResponse);
        }
        return searchResponseList;
    }

    // 받은 신청목록 보여주는

    @GetMapping("/api/friends/recieve")
    public List<User> recieveFriends(@AuthenticationPrincipal CustomUserDetails currentUser) {
        return friendsService.getReceiveFriends(currentUser.getUserId());
    }
}
