package e106.emissary_backend.domain.security.repository;

import e106.emissary_backend.domain.security.entity.Access;
import jakarta.transaction.Transactional;
import org.springframework.data.repository.CrudRepository;

import java.util.Optional;

public interface AccessRepository extends CrudRepository<Access,String> {

    Optional<Access> findByAccess(String access);

    @Transactional
    default void deleteByAccess(String access){
        findByAccess(access).ifPresent(this::delete);
    }
}
