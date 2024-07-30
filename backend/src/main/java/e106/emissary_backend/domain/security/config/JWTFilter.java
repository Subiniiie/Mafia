package e106.emissary_backend.domain.security.config;

import e106.emissary_backend.domain.security.util.JWTUtil;
import e106.emissary_backend.domain.user.dto.CustomOAuth2User;
import e106.emissary_backend.domain.user.dto.CustomUserDetails;
import e106.emissary_backend.domain.user.entity.User;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Arrays;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;

@Slf4j
@RequiredArgsConstructor
public class JWTFilter extends OncePerRequestFilter {

    private final JWTUtil jwtUtil;
    private final String IS_COME;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain) throws ServletException, IOException {

        String token = Optional.ofNullable(request.getCookies())
                .flatMap(cookies -> Arrays.stream(cookies)
                        .filter(cookie -> Objects.equals("Authorization", cookie.getName()))
                        .map(Cookie::getValue)
                        .findAny())
                .orElse(null);

        if (token != null && jwtUtil.validateToken(token)) {
            Authentication authToken = null;
            User user = User.builder()
                    .nickname(jwtUtil.getUsername(token))
                    .role(jwtUtil.getRole(token))
                    .build();
            if(Objects.equals(IS_COME, "OAUTH")) {
                CustomOAuth2User customOAuth2User = new CustomOAuth2User(user, Map.of());
                authToken = new UsernamePasswordAuthenticationToken(customOAuth2User, null, customOAuth2User.getAuthorities());
            }
            if(Objects.equals(IS_COME, "COMMON")) {
                CustomUserDetails customUserDetails = new CustomUserDetails(user);
                authToken = new UsernamePasswordAuthenticationToken(customUserDetails, null, customUserDetails.getAuthorities());
            }
            SecurityContextHolder.getContext().setAuthentication(authToken);
        }

        chain.doFilter(request, response);
    }
}
