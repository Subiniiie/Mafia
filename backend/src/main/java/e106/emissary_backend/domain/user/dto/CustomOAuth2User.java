//package e106.emissary_backend.domain.user.dto;
//
//import e106.emissary_backend.domain.user.entity.User;
//import lombok.RequiredArgsConstructor;
//import org.springframework.security.core.GrantedAuthority;
//import org.springframework.security.oauth2.core.user.OAuth2User;
//
//import java.util.ArrayList;
//import java.util.Collection;
//import java.util.Map;
//
//@RequiredArgsConstructor
//public class CustomOAuth2User implements OAuth2User {
//    private final User user;
//    private final Map<String, Object> attributes;
//
//    @Override
//    public Map<String, Object> getAttributes() {
//        return attributes;
//    }
//
//    @Override
//    public Collection<? extends GrantedAuthority> getAuthorities() {
//
//        Collection<GrantedAuthority> collection = new ArrayList<>();
//        collection.add(new GrantedAuthority() {
//            @Override
//            public String getAuthority() {
//                return user.getRole();
//            }
//        });
//        return collection;
//    }
//
//    @Override
//    public String getName() {
//        return user.getNickname();
//    }
//
//    public Long getUserId() {return user.getUserId();}
//}
