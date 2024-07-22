package e106.emissary_backend.user.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class RegisterRequest {
    private String nickname;
    private String email;
    private String emailVerify;
    private String password;
}
