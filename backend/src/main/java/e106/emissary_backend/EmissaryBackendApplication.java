package e106.emissary_backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.data.redis.repository.configuration.EnableRedisRepositories;

@SpringBootApplication
@EnableRedisRepositories
public class EmissaryBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(EmissaryBackendApplication.class, args);
    }

}
