package e106.emissary_backend.domain.game.service.subscriber.message;

import lombok.*;

@Builder
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class ConnectMessage {
    @Builder.Default
    private String message = "연결이 잘 유지되는 중입니다.";
}
