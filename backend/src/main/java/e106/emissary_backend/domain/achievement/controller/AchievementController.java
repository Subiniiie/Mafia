package e106.emissary_backend.domain.achievement.controller;

import e106.emissary_backend.domain.achievement.dto.AchievementListDto;
import e106.emissary_backend.domain.achievement.service.AchievementService;
import e106.emissary_backend.domain.user.dto.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

@RestController
@RequiredArgsConstructor
@CrossOrigin
public class AchievementController {

    private final AchievementService achievementService;

    @PostMapping("/api/honors")
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

    @GetMapping("/api/honors")
    public ResponseEntity<Map<String,Object>> getHonors(@AuthenticationPrincipal CustomUserDetails customUserDetails){
        System.out.println("@Controller - in");
        long userId = 1L;
        if(!Objects.isNull(customUserDetails)) {
            userId = customUserDetails.getUserId();
        }
        Map<String,Object> map = new HashMap<>();
        List<AchievementListDto> res = achievementService.getHonors(userId);
        System.out.println(res.get(0).getAcheivementDate().toString());
        map.put("status", "success");
        map.put("data", res);
        return ResponseEntity.ok(map);
    }
}
