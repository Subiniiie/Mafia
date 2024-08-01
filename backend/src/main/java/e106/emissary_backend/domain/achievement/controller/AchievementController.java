package e106.emissary_backend.domain.achievement.controller;

import e106.emissary_backend.domain.achievement.service.AchievementService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
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

    @PostMapping("api/honors")
    public ResponseEntity<Map<String, Object>> addHonors(String email){
        Map<String, Object> map = new HashMap<>();
        try{
            achievementService.updateAchievement(email);
            map.put("status", "success");
            return ResponseEntity.ok(map);
        }catch(Exception e){
            map.put("status", "fail");
            map.put("message", e.getMessage());
            return ResponseEntity.ok(map);
        }
    }
}
