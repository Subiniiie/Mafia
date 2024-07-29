package e106.emissary_backend.domain.user.dto;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Builder
@ToString
public class CheckRequest {
    private String data;
}
