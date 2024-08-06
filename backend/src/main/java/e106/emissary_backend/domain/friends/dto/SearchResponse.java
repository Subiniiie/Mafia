package e106.emissary_backend.domain.friends.dto;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@ToString
public class SearchResponse {
    String nickname;
    String status;
}
