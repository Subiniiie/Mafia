package e106.emissary_backend.domain.security.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@AllArgsConstructor
@RequiredArgsConstructor
public class TokenResponse {
    private String accessToken;
    private String refreshToken;
}
