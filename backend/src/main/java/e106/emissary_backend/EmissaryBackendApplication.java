package e106.emissary_backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@EnableJpaAuditing
@SpringBootApplication
@EnableJpaAuditing
public class EmissaryBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(EmissaryBackendApplication.class, args);
    }

}
