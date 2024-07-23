package e106.emissary_backend.security.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@AllArgsConstructor
@RequiredArgsConstructor
public class AuthResponse {

    private String email;
    private String nickname;
    private String skinImgUrl;
    private String role;

    private String accessToken;
    private String refreshToken;
}
