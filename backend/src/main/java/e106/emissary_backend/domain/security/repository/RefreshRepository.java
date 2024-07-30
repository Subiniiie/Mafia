package e106.emissary_backend.domain.security.repository;

import e106.emissary_backend.domain.security.entity.Refresh;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RefreshRepository extends CrudRepository<Refresh, String> {

    Boolean existsByRefresh(String refresh);

    void deleteByRefresh(String refresh);
}
