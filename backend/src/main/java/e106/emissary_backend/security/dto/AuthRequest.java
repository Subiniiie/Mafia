package e106.emissary_backend.security.dto;

import lombok.Data;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Data
public class AuthRequest {
    private String email;
    private String password;
}

