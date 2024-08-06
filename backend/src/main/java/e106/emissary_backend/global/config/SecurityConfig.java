package e106.emissary_backend.global.config;

import e106.emissary_backend.domain.security.config.CustomLogoutFilter;
import e106.emissary_backend.domain.security.config.JWTFilter;
//import e106.emissary_backend.domain.security.config.CustomSuccessHandler;
import e106.emissary_backend.domain.security.config.LoginFilter;
import e106.emissary_backend.domain.security.repository.AccessRepository;
import e106.emissary_backend.domain.security.repository.RefreshRepository;
import e106.emissary_backend.domain.security.service.JwtService;
//import e106.emissary_backend.domain.user.service.CustomOAuth2UserService;
import e106.emissary_backend.domain.security.util.JWTUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.authentication.logout.LogoutFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;


@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

//    private final CustomOAuth2UserService oAuth2UserService;
//    private final CustomSuccessHandler customSuccessHandler;
    private final JWTUtil jwtUtil;
    private final AuthenticationConfiguration authenticationConfiguration;
    private final JwtService jwtService;
    private final RefreshRepository refreshRepository;
    private final AccessRepository  accessRepository;

    private final CorsConfigurationSource corsConfigurationSource;

    // Configuring HttpSecurity
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

//        http
//                .cors(corsCustomizer -> corsCustomizer.configurationSource(new CorsConfigurationSource() {
//
//                    @Override
//                    public CorsConfiguration getCorsConfiguration(HttpServletRequest request) {
//
//                        CorsConfiguration configuration = new CorsConfiguration();
//
//                        configuration.setAllowedOrigins(Collections.singletonList("http://localhost:3000")); // 여기
//                        configuration.setAllowedMethods(Collections.singletonList("*"));
//                        configuration.setAllowCredentials(true);
//                        configuration.setAllowedHeaders(Collections.singletonList("*"));
//                        configuration.setMaxAge(3600L);
//
//                        configuration.setExposedHeaders(Collections.singletonList("Set-Cookie"));
//                        configuration.setExposedHeaders(Collections.singletonList("Authorization"));
//
//                        return configuration;
//                    }
//                }));
        //csrf disable
        http
                .csrf((auth) -> auth.disable());

        // cors config
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()));

        //From 로그인 방식 disable
        http
                .formLogin((auth) -> auth.disable());

        //HTTP Basic 인증 방식 disable
        http
                .httpBasic((auth) -> auth.disable());

        //경로별 인가 작업 (/login 페이지와 루트 페이지, 회원가입페이지는 비로그인한 사람에게 접근 허용)
        http
                .authorizeHttpRequests((auth) -> auth
                        .requestMatchers("/api/login","/", "/api/user", "/api/mail", "/api/reissue", "/api/logout", "/api/oauth2/token", "/api/oauth2/login", "/api/checkemail", "/api/checknick").permitAll()
                        .anyRequest().authenticated());

        //JWTFilter 추가
//        http
//                .addFilterBefore(new JWTFilter(jwtUtil, "OAUTH"), UsernamePasswordAuthenticationFilter.class);
        //oauth2
//        http
//                .oauth2Login((oauth2) -> oauth2
//                        .authorizationEndpoint(endpoint ->
//                                endpoint.baseUri("/api/oauth2/authorization"))
//                        .userInfoEndpoint((userInfoEndpointConfig) -> userInfoEndpointConfig
//                                .userService(oAuth2UserService))
//                        .successHandler(customSuccessHandler));
        http
                .addFilterBefore(new JWTFilter(jwtUtil, "COMMON"), UsernamePasswordAuthenticationFilter.class);

//        http
//                .addFilterAt(new LoginFilter(authenticationManager(authenticationConfiguration),jwtUtil,refreshRepository,accessRepository,"/api/login"), UsernamePasswordAuthenticationFilter.class);

        http
                .addFilterBefore(new CustomLogoutFilter(jwtUtil, jwtService), LogoutFilter.class);
        //세션 설정 : STATELESS
        http
                .sessionManagement((session) -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        return http.build();
    }

    @Bean
    public static AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception{
        return config.getAuthenticationManager();
    }

    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowCredentials(true);
        configuration.addAllowedOrigin("http://localhost:5173");
        configuration.addAllowedHeader("*");
        configuration.addAllowedMethod("*");
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:5173", "http://127.0.0.1:5500"));
//        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
