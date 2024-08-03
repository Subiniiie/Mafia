package e106.emissary_backend.domain.security.service;

import e106.emissary_backend.domain.security.entity.Access;
import e106.emissary_backend.domain.security.entity.Refresh;
import e106.emissary_backend.domain.security.repository.AccessRepository;
import e106.emissary_backend.domain.security.repository.RefreshRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class JwtService {
    private final RefreshRepository refreshRepository;
    private final AccessRepository  accessRepository;

    public Optional<Refresh> findByRefresh(String refresh) {
        return refreshRepository.findByRefresh(refresh);
    }

    public Optional<Access> findByAccess(String access) {
        return accessRepository.findByAccess(access);
    }

    @Transactional
    public void deleteByRefresh(String refresh){
        refreshRepository.deleteByRefresh(refresh);
    }

    @Transactional
    public void deleteByAccess(String access){
        accessRepository.deleteByAccess(access);
    }
}
