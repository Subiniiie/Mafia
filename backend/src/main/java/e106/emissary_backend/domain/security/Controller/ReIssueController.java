package e106.emissary_backend.domain.security.Controller;

import e106.emissary_backend.domain.security.entity.Access;
import e106.emissary_backend.domain.security.entity.Refresh;
import e106.emissary_backend.domain.security.repository.AccessRepository;
import e106.emissary_backend.domain.security.repository.RefreshRepository;
import e106.emissary_backend.domain.security.service.JwtService;
import e106.emissary_backend.domain.security.util.JWTUtil;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Controller
@ResponseBody
@RequiredArgsConstructor
public class ReIssueController {
    private final JWTUtil jwtUtil;
    private final JwtService jwtService;
    private final AccessRepository accessRepository;
    private final RefreshRepository refreshRepository;

    @PostMapping("/api/reissue")
    public ResponseEntity<Map<String, Object>> reissue(HttpServletRequest request, HttpServletResponse response) {
        String refresh = null;
        String access = null;
        Cookie[] cookies = request.getCookies();
        for(Cookie cookie : cookies) {
            if(cookie.getName().equals("Refresh")) {
                refresh = cookie.getValue();
            }
            if(cookie.getName().equals("Access")) {
                access = cookie.getValue();
            }
        }
        Map<String, Object> map = new HashMap<>();

        if(refresh == null || jwtUtil.validateToken(refresh)) {
            map.put("status", "fail");
            return ResponseEntity.ok(map);
        }
        String category = jwtUtil.getCategory(refresh);
        if(!category.equals("Refresh")){
            map.put("status", "fail");
            return ResponseEntity.ok(map);
        }
        if(jwtService.findByRefresh(refresh).isEmpty()){
            map.put("status", "fail");
            return ResponseEntity.ok(map);
        }

        System.out.println(access);
        System.out.println(!jwtUtil.validateToken(access));
        if(access != null && !jwtUtil.validateToken(access)) {
            jwtService.deleteByAccess(access);
            System.out.println(jwtService.findByAccess(access).isEmpty());
            System.out.println(!jwtUtil.validateToken(access));
        }
        String username = jwtUtil.getUsername(refresh);
        String userId = jwtUtil.getUserId(refresh);
        String email = jwtUtil.getEmail(refresh);
        String gender = jwtUtil.getGender(refresh);
        String role = jwtUtil.getRole(refresh);

        String newAccess = jwtUtil.createJwt("Access", Long.parseLong(userId), username, email, gender, /*birth,*/ role, 600000L);
        String newRefresh = jwtUtil.createJwt("Refresh", Long.parseLong(userId), username, email, gender, /*birth,*/ role, 86400000L);

        jwtService.deleteByRefresh(refresh);
        addAccessEntity(username, newAccess, 600000L);
        addRefreshEntity(username, newRefresh, 86400000L);

        response.addCookie(createCookie("Access",newAccess));
        response.addCookie(createCookie("Refresh",newRefresh));
        map.put("refresh", newRefresh);
        map.put("access", newAccess);
        map.put("status", "success");
        return ResponseEntity.ok(map);
    }

    private Cookie createCookie(String key, String value) {

        Cookie cookie = new Cookie(key, value);
        cookie.setMaxAge(60*60*60);
        cookie.setPath("/");
        cookie.setHttpOnly(true);

        return cookie;
    }

    private void addRefreshEntity(String username, String refresh, Long expiredMs){
        Date date = new Date(System.currentTimeMillis() + expiredMs);

        Refresh refreshEntity = new Refresh();
        refreshEntity.setUsername(username);
        refreshEntity.setRefresh(refresh);
        refreshEntity.setExpiration(date.toString());

        refreshRepository.save(refreshEntity);
    }

    private void addAccessEntity(String username, String access, Long expiredMs){

        Date date = new Date(System.currentTimeMillis() + expiredMs);

        Access accessEntity = new Access();
        accessEntity.setUsername(username);
        accessEntity.setAccess(access);
        accessEntity.setExpiration(date.toString());

        accessRepository.save(accessEntity);
    }
}
