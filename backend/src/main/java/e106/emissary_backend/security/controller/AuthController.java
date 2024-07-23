package e106.emissary_backend.security.controller;

import e106.emissary_backend.security.dto.AuthRequest;
import e106.emissary_backend.security.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@RequiredArgsConstructor
@CrossOrigin
@RestController
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<Map<String,Object>> login(@RequestBody AuthRequest authRequest) {
        Map<String,Object> response = new HashMap<>();
        try{
            response.put("status","success");
            response.put("data", authService.login(authRequest));
            return ResponseEntity.ok(response);
        } catch(Exception e){
            response.put("status","error");
            response.put("data",e.getMessage());
            return ResponseEntity.ok(response);
        }
    }

    @PostMapping("/refresh")
    public void refreshToken(HttpServletRequest request, HttpServletResponse response) throws IOException {
        authService.refreshToken(request, response);
    }
}
