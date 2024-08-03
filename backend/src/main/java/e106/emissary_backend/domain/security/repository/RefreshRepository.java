package e106.emissary_backend.domain.security.repository;

import e106.emissary_backend.domain.security.entity.Refresh;

import jakarta.transaction.Transactional;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RefreshRepository extends CrudRepository<Refresh, String> {

    Optional<Refresh> findByRefresh(String refresh);

    @Transactional
    default void deleteByRefresh(String refresh){
        findByRefresh(refresh).ifPresent(this::delete);
    }
}
