package e106.emissary_backend.domain.openvidu.service;

import io.openvidu.java.client.OpenVidu;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class OpenViduService {

    private final OpenVidu openVidu;
    private final WebClient webClient;
    private final String openViduUrl;
    private final String openViduSecret;

    public OpenViduService(@Value("${OPENVIDU_URL}") String openviduUrl,
                           @Value("${OPENVIDU_SECRET") String openviduSecret) {
        this.openVidu = new OpenVidu(openviduUrl, openviduSecret);
        this.webClient = WebClient.builder().baseUrl(openviduUrl).build();
        this.openViduUrl = openviduUrl;
        this.openViduSecret = openviduSecret;
    }
}
