package e106.emissary_backend.domain.friends.dto;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Builder
@ToString
public class SearchRequest {
    String nickname;
    String keyword;
}
