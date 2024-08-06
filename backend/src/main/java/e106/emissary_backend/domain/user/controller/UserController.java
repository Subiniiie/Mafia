package e106.emissary_backend.domain.user.controller;

import e106.emissary_backend.domain.user.dto.CheckRequest;
import e106.emissary_backend.domain.user.dto.EditRequest;
import e106.emissary_backend.domain.user.dto.RegisterRequest;
import e106.emissary_backend.domain.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@CrossOrigin
public class UserController {

    private final UserService userService;

    @GetMapping("/api/checkemail")
    public ResponseEntity<Map<String, Object>> checkEmail(@RequestParam String email){//(@RequestBody CheckRequest request){
        Map<String, Object> map = new HashMap<>();
        try{
            String ret = userService.emailExists(email);
            map.put("status", "success");
            map.put("message", ret);
            return ResponseEntity.ok(map);
        }catch (Exception e){
            map.put("status", "fail");
            map.put("message", e.getMessage());
            return ResponseEntity.ok(map);
        }
    }

    @GetMapping("/api/checknick")
    public ResponseEntity<Map<String, Object>> checkNick(@RequestParam String nickname){//(@RequestBody CheckRequest request) {
        Map<String, Object> map = new HashMap<>();
        try{
            String ret = userService.nicknameExists(nickname);
            map.put("status", "success");
            map.put("message", ret);
            return ResponseEntity.ok(map);
        }catch(Exception e){
            map.put("status", "fail");
            map.put("message", e.getMessage());
            return ResponseEntity.ok(map);
        }
    }

    // registerUser(Create)
    @PostMapping("/api/user")
    public ResponseEntity<Map<String,Object>> registerUser(@RequestBody RegisterRequest request) {
        Map<String, Object> map = new HashMap<>();
        int ret = userService.registerUser(request);
        if (ret > 0) {
            map.put("status", "success");
            userService.firstHonor(request);
        } else {
            map.put("status", "fail");
        }
        return ResponseEntity.ok(map);
    }

    // detailsUser(Read)
    @GetMapping(value = {"/api/users", "/api/honors"})
    @PreAuthorize("hasAnyAuthority('ROLE_USER','ROLE_ADMIN')")
    public ResponseEntity<Map<String, Object>> detailsUser(Authentication authentication) {
        UserDetails res = userService.loadUserByUsername(authentication.getName());
        Map<String, Object> map = new HashMap<>();
        if(res == null) {
            map.put("status", "fail");
        } else{
            map.put("status", "success");
            map.put("data", res);
        }
        return ResponseEntity.ok(map);
    }

    // updateUser(Update)
    @PatchMapping("/api/users")
    @PreAuthorize("hasAnyAuthority('ROLE_USER','ROLE_ADMIN')")
    public ResponseEntity<Map<String,Object>> updateUser(@RequestBody EditRequest request, Authentication authentication) {
        Map<String,Object> map = new HashMap<>();
        // 비밀번호를 받아서 처리하는 경우(정상적인 로그인 후 변경처리) 와 비밀번호를 안받아서 처리하는 경우(잃어버렸을때 변경처리)
        try{
            userService.updateUser(request, authentication.getName());
            map.put("status", "success");
            return ResponseEntity.ok(map);
        } catch(Exception e){
            map.put("status", "fail");
            map.put("message", e.getMessage());
            return ResponseEntity.ok(map);
        }
    }

    @PatchMapping("/api/updatelostpw")
    public ResponseEntity<Map<String, Object>> findpw(@RequestBody EditRequest request) {
        Map<String, Object> map = new HashMap<>();
        try {
            userService.updateLostPw(request, request.getPassword());
            map.put("status", "success");
            return ResponseEntity.ok(map);
        } catch (Exception e) {
            map.put("status", "fail");
            map.put("msg", "해당 정보에 해당하는 데이터가 없습니다");
            return ResponseEntity.ok(map);
        }
    }

    @DeleteMapping("/api/users")
    @PreAuthorize("hasAnyAuthority('ROLE_USER','ROLE_ADMIN')")
    public ResponseEntity<Map<String, Object>> deleteUser(Authentication authentication) {
        Map<String, Object> map = new HashMap<>();
        // 이 경우도 비밀번호 확인로직이 필요하지 않을까...
        try {
            userService.deleteUser(authentication.getName());
            map.put("status", "success");
            return ResponseEntity.ok(map);
        } catch (Exception e) {
            map.put("status", "fail");
            map.put("message", e.getMessage());
            return ResponseEntity.ok(map);
        }
    }

}
