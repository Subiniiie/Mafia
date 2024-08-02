package e106.emissary_backend.domain.security.Controller;

import e106.emissary_backend.domain.security.dto.LoginRequest;
import e106.emissary_backend.domain.security.entity.Access;
import e106.emissary_backend.domain.security.entity.Refresh;
import e106.emissary_backend.domain.security.repository.AccessRepository;
import e106.emissary_backend.domain.security.repository.RefreshRepository;
import e106.emissary_backend.domain.security.util.JWTUtil;
import e106.emissary_backend.domain.user.dto.CustomUserDetails;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Controller
@RequiredArgsConstructor
public class LoginController {

    private final AuthenticationManager authenticationManager;
    private final JWTUtil jwtUtil;
    private final RefreshRepository refreshRepository;
    private final AccessRepository accessRepository;

    @PostMapping("/api/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody LoginRequest loginRequest, HttpServletResponse response) {
        Map<String, Object> map = new HashMap<>();
        try{
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword())
            );

            CustomUserDetails customUserDetails = (CustomUserDetails) authentication.getPrincipal();

            Long userId = customUserDetails.getUser().getUserId();
            String username = customUserDetails.getUsername();
            String email = customUserDetails.getEmail();
            String gender = customUserDetails.getGender();
//            String birth = customUserDetails.getBirth();

            String role = authentication.getAuthorities().iterator().next().getAuthority();

            String access = jwtUtil.createJwt("Access", userId, username, email, gender,/* birth,*/ role, 600000L);
            String refresh = jwtUtil.createJwt("Refresh", userId, username, email, gender,/* birth,*/ role, 86400000L);

            addAccess(userId, username, access, 60000L);
            addRefresh(userId, username, refresh, 86400000L);

            response.addCookie(createCookie("Access", access));
            response.addCookie(createCookie("Refresh", refresh));

            map.put("refresh", refresh);
            map.put("access", access);
            map.put("status", "success");

            return ResponseEntity.ok(map);
        }catch (AuthenticationException e){
            map.put("status", "fail");
            return ResponseEntity.ok(map);
        }
    }

    @GetMapping("/api/oauth/token")
    public ResponseEntity<Map<String, Object>> getToken(@RequestParam String access, @RequestParam String refresh) {
        Map<String, Object> map = new HashMap<>();
        map.put("Access", access);
        map.put("Refresh", refresh);

        return ResponseEntity.ok(map);
    }

    private Cookie createCookie(String key, String value) {

        Cookie cookie = new Cookie(key, value);
        cookie.setMaxAge(60*60*24);
        cookie.setPath("/");
        cookie.setHttpOnly(true);

        return cookie;
    }

    private void addRefresh(Long userId, String username, String refresh, Long expiredMs) {

        Date date = new Date(System.currentTimeMillis() + expiredMs);

        Refresh refreshEntity = Refresh
                .builder()
                .userId(userId)
                .username(username)
                .refresh(refresh)
                .expiration(date.toString())
                .build();

        refreshRepository.save(refreshEntity);

    }

    private void addAccess(Long userId, String username, String access, Long expiredMs) {

        Date date = new Date(System.currentTimeMillis() + expiredMs);

        Access accessEntity = Access
                .builder()
                .userId(userId)
                .username(username)
                .access(access)
                .expiration(date.toString())
                .build();
        new Access();

        accessRepository.save(accessEntity);
    }

}
