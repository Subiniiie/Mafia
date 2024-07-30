package e106.emissary_backend.domain.security.service;

import e106.emissary_backend.domain.security.repository.AccessRepository;
import e106.emissary_backend.domain.security.repository.RefreshRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class JwtService {
    private final RefreshRepository refreshRepository;
    private final AccessRepository  accessRepository;

    public Boolean existsByRefresh(String refresh){
        return refreshRepository.existsByRefresh(refresh);
    }

    public Boolean existsByAccess(String access){
        return accessRepository.existsByAccess(access);
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
