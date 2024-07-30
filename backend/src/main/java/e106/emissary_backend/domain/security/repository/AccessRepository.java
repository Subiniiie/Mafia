package e106.emissary_backend.domain.security.repository;

import e106.emissary_backend.domain.security.entity.Access;
import jakarta.transaction.Transactional;
import org.springframework.data.repository.CrudRepository;

public interface AccessRepository extends CrudRepository<Access,String> {

    Boolean existsByAccess(String access);

    void deleteByAccess(String access);
}
