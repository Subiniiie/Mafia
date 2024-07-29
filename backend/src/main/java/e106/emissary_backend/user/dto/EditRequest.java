package e106.emissary_backend.user.dto;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
@ToString
public class EditRequest {
    private String nickname;
    private String password;
    private String skinImgUrl;
}
