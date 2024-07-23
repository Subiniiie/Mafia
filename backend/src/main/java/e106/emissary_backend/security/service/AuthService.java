package e106.emissary_backend.security.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import e106.emissary_backend.security.dto.AuthRequest;
import e106.emissary_backend.security.dto.AuthResponse;
import e106.emissary_backend.security.dto.TokenResponse;
import e106.emissary_backend.security.entity.Tokens;
import e106.emissary_backend.security.repository.TokenRepository;
import e106.emissary_backend.user.entity.User;
import e106.emissary_backend.user.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final TokenRepository tokenRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthResponse login(AuthRequest authRequest) {
        Optional<User> user = userRepository.findByEmail(authRequest.getEmail());
        if (user.isPresent()) {
            if(user.get().getIsDeleted()){
                throw new RuntimeException("회원 탈퇴 된 계정입니다.");
            } else {
                try{
                    authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(authRequest.getEmail(), authRequest.getPassword()));
                } catch(AuthenticationException e){
                    throw new RuntimeException("비밀번호가 일치하지 않습니다.");
                }
                String jwtToken = jwtService.generateToken(authRequest.getEmail());
                String refreshToken = jwtService.generateRefreshToken(authRequest.getEmail());
                saveToken(authRequest.getEmail(),jwtToken);

                return new AuthResponse(
                        user.get().getEmail(),
                        user.get().getNickname(),
                        user.get().getSkinImgUrl(),
                        user.get().getRole(),
                        jwtToken,refreshToken);
            }
        } else {
            throw new RuntimeException("잘못된 이메일 입니다.");
        }
    }

    public void saveToken(String email, String jwtToken) {
        Tokens token = Tokens.builder()
                .token(jwtToken)
                .expired(false)
                .revoked(false)
                .userName(email)
                .build();
        tokenRepository.save(token);
    }

    public void refreshToken(HttpServletRequest request, HttpServletResponse response) throws IOException {
        final String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
        final String refreshToken;
        final String userEmail;

        if(authHeader != null && authHeader.startsWith("Bearer ")) {
            return;
        }
        refreshToken = authHeader.substring(7);
        userEmail = jwtService.extractUsername(refreshToken);
        if(userEmail != null) {
            User user = this.userRepository.findByEmail(userEmail).get();
            if(jwtService.isTokenValid(refreshToken,user)){
                String accessToken = jwtService.generateToken(userEmail);
                TokenResponse authResponse = new TokenResponse(accessToken,refreshToken);
                new ObjectMapper().writeValue(response.getOutputStream(), authResponse);
            }
        }
    }
}
