package e106.emissary_backend.domain.achievement.controller;

import e106.emissary_backend.domain.achievement.service.AchievementService;
import e106.emissary_backend.domain.user.dto.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@CrossOrigin
public class AchievementController {

    private final AchievementService achievementService;

    @PostMapping("/api/honors")
    public ResponseEntity<Map<String, Object>> addHonors(@AuthenticationPrincipal CustomUserDetails currentUser){
        Map<String, Object> map = new HashMap<>();
        try{
            System.out.println(currentUser.getUserId());
            achievementService.updateAchievement(currentUser.getUserId());
            map.put("status", "success");
            return ResponseEntity.ok(map);
        }catch(Exception e){
            map.put("status", "fail");
            map.put("message", e.getMessage());
            return ResponseEntity.ok(map);
        }
    }
}
