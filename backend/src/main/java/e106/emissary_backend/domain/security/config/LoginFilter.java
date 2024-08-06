package e106.emissary_backend.domain.security.config;

import e106.emissary_backend.domain.security.entity.Access;
import e106.emissary_backend.domain.security.entity.Refresh;
import e106.emissary_backend.domain.security.repository.AccessRepository;
import e106.emissary_backend.domain.security.repository.RefreshRepository;
import e106.emissary_backend.domain.security.util.JWTUtil;
import e106.emissary_backend.domain.user.dto.CustomUserDetails;
import jakarta.servlet.FilterChain;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import java.time.LocalDate;
import java.util.Collection;
import java.util.Date;
import java.util.Iterator;


@Slf4j
public class LoginFilter extends UsernamePasswordAuthenticationFilter {

    private final AuthenticationManager authenticationManager;
    private final JWTUtil jwtUtil;
    private final RefreshRepository refreshRepository;
    private final AccessRepository accessRepository;

    public LoginFilter(AuthenticationManager authenticationManager, JWTUtil jwtUtil, RefreshRepository refreshRepository, AccessRepository accessRepository, String loginProcessingUrl){
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
        this.refreshRepository = refreshRepository;
        this.accessRepository = accessRepository;
        setFilterProcessesUrl(loginProcessingUrl);
    }

    @Override
    public Authentication attemptAuthentication(final HttpServletRequest request, final HttpServletResponse response) throws AuthenticationException {

        String username = obtainUsername(request);
        String password = obtainPassword(request);

        UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(username, password,null);

        return authenticationManager.authenticate(authToken);
    }

    @Override
    protected void successfulAuthentication(final HttpServletRequest request, final HttpServletResponse response, final FilterChain chain,Authentication authentication){        CustomUserDetails customeUserDetails = (CustomUserDetails) authentication.getPrincipal();
        CustomUserDetails customUserDetails = (CustomUserDetails) authentication.getPrincipal();

        Long userId = customUserDetails.getUser().getUserId();
        String username = customUserDetails.getUsername();
        String email = customUserDetails.getEmail();
        String gender = customeUserDetails.getGender();
//        String birth = customeUserDetails.getBirth();

        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
        Iterator<? extends GrantedAuthority> iterator = authorities.iterator();
        GrantedAuthority auth  = iterator.next();
        String role = auth.getAuthority();

        String access = jwtUtil.createJwt("Access", userId, username, email, gender,/* birth,*/ role, 600000L);
        String refresh = jwtUtil.createJwt("Refresh", userId, username, email, gender,/* birth,*/ role, 86400000L);

        addAccess(userId,username, access, 60000L);
        addRefresh(userId,username, refresh, 86400000L);

//        HttpHeaders headers = new HttpHeaders();
//        headers.add("Authorization", "Bearer " + access);

        response.addCookie(createCookie("Access",access));
        response.addCookie(createCookie("Refresh",refresh));

        response.setStatus(HttpStatus.OK.value());
    }

    @Override
    protected void unsuccessfulAuthentication(final HttpServletRequest request, final HttpServletResponse response, final AuthenticationException failed){
        response.setStatus(401);
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
