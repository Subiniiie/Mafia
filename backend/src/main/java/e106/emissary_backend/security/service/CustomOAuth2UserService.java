package e106.emissary_backend.security.service;

import ch.qos.logback.core.CoreConstants;
import e106.emissary_backend.security.dto.CustomOAuth2User;
import e106.emissary_backend.security.dto.GoogleResponse;
import e106.emissary_backend.security.dto.OAuth2Response;
import e106.emissary_backend.user.entity.User;
import e106.emissary_backend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class  CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {

        OAuth2User oAuth2User = super.loadUser(userRequest);
        String registrationId = userRequest.getClientRegistration().getRegistrationId();
        OAuth2Response oAuth2Response = null;
        if(registrationId.equals("google")){
            oAuth2Response = new GoogleResponse(oAuth2User.getAttributes());
        } else{
            return null;
        }
        String userEmail = oAuth2Response.getEmail();
        Optional<User> existUser = userRepository.findByEmail(userEmail);
        if(existUser.isPresent()){
            return new CustomOAuth2User(existUser.get(), oAuth2User.getAttributes());
        }
        String username = oAuth2Response.getProvider()+" "+oAuth2Response.getProviderId();
        User user = setUserInfo(userEmail,username);
        userRepository.save(user);
        return new CustomOAuth2User(user, oAuth2User.getAttributes());
    }

    private User setUserInfo(String userEmail,String username) {
        return User.builder()
                .email(userEmail)
                .nickname(username)
                .password(passwordEncoder.encode("qkrtnqls"))
                .build();
    }

}
