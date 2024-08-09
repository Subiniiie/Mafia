package e106.emissary_backend.domain.security.config;

import e106.emissary_backend.domain.security.dto.ReissueRequest;
import e106.emissary_backend.domain.security.repository.AccessRepository;
import e106.emissary_backend.domain.security.repository.RefreshRepository;
import e106.emissary_backend.domain.security.service.JwtService;
import e106.emissary_backend.domain.security.util.JWTUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.springframework.util.StreamUtils;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.filter.GenericFilterBean;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;

@RequiredArgsConstructor
public class CustomLogoutFilter extends GenericFilterBean {

    private final JWTUtil jwtUtil;
    private final JwtService jwtService;

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
        try{
            doFilter((HttpServletRequest) servletRequest, (HttpServletResponse) servletResponse, filterChain);
        } catch (ParseException e) {
            System.out.println(e);
        }
    }

    private void doFilter(HttpServletRequest request, HttpServletResponse response, FilterChain chain) throws IOException, ServletException, ParseException {

        String requestURI = request.getRequestURI();
        String requestMethod = request.getMethod();

        if(!requestURI.matches("^\\/api\\/logout$") || !Objects.equals(requestMethod, "POST")) {
            chain.doFilter(request, response);
            return;
        }

//        String refresh = Optional.ofNullable(request.getCookies())
//                .flatMap(cookies -> Arrays.stream(cookies)
//                        .filter(cookie -> Objects.equals("Refresh", cookie.getName()))
//                        .map(Cookie::getValue)
//                        .findAny())
//                .orElse(null);

//        String access = Optional.ofNullable(request.getCookies())
//                .flatMap(cookies -> Arrays.stream(cookies)
//                        .filter(cookie -> Objects.equals("Access", cookie.getName()))
//                        .map(Cookie::getValue)
//                        .findAny())
//                .orElse(null);

        String tokens = StreamUtils.copyToString(request.getInputStream(), StandardCharsets.UTF_8);
//        System.out.println(tokens);

        JSONParser jsonParser = new JSONParser();
        JSONObject jsonObject = (JSONObject) jsonParser.parse(tokens);

//        System.out.println(jsonObject.get("access").toString());
//        System.out.println(jsonObject.get("refresh").toString());

        String refresh = jsonObject.get("refresh").toString();
        String access = jsonObject.get("access").toString();

        if(refresh == null || access == null){
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            return;
        }

        if(jwtUtil.validateToken(refresh) || jwtUtil.validateToken(access)) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            return;
        }

        String category1 = jwtUtil.getCategory(refresh);
        String category2 = jwtUtil.getCategory(access);
        if(!category1.equals("Refresh") || !category2.equals("Access")){
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            return;
        }

        if(jwtService.findByRefresh(refresh).isEmpty() || jwtService.findByAccess(access).isEmpty()){
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            return;
        }

        jwtService.deleteByRefresh(refresh);
        jwtService.deleteByAccess(access);

        System.out.println(refresh);
        System.out.println(access);

//        Cookie cookie1 = new Cookie("Refresh", null);
//        Cookie cookie2 = new Cookie("Access", null);
//        cookie1.setMaxAge(0);
//        cookie1.setPath("/");
//        cookie2.setMaxAge(0);
//        cookie2.setPath("/");

//        response.addCookie(cookie1);
//        response.addCookie(cookie2);
        response.setStatus(HttpServletResponse.SC_OK);
    }
}
