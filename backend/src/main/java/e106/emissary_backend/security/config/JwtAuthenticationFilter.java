package e106.emissary_backend.security.config;

import e106.emissary_backend.security.repository.TokenRepository;
import e106.emissary_backend.security.service.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;
    private final TokenRepository tokenRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        final String authHeader = request.getHeader("Authorization");
        String jwt=null;
        String userEmail=null;
        try{
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                jwt = authHeader.substring(7);
                userEmail = jwtService.extractUsername(jwt);
            }

            if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null){
                UserDetails userDetails = userDetailsService.loadUserByUsername(userEmail);
                boolean isTokenValid = tokenRepository.findByToken(jwt).map(t-> !t.isExpired() && !t.isRevoked()).orElse(false);
                if (jwtService.isTokenValid(jwt, userDetails) && isTokenValid){
                    UsernamePasswordAuthenticationToken authToken  = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            }
        } catch (Exception e) {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Token Expired");
        }
        filterChain.doFilter(request, response);
    }
}
