package e106.emissary_backend.user.service;

import e106.emissary_backend.user.dto.CheckRequest;
import e106.emissary_backend.user.dto.EditRequest;
import e106.emissary_backend.user.dto.RegisterRequest;
import e106.emissary_backend.user.entity.User;
import e106.emissary_backend.user.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final char[] charSet = new char[] { '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F',
            'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'};

    @Transactional
    public int registerUser(RegisterRequest request){
        try{
            User newUser = User.builder()
                    .nickname(request.getNickname())
                    .email(request.getEmail())
                    .password(passwordEncoder.encode(request.getPassword()))
                    .build();
            userRepository.save(newUser);
            return 1;
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return -1;
        }
    }

    @Transactional
    public void updateUser(EditRequest request, String email){
        Optional<User> present = userRepository.findByEmail(email);
        //
        if(present.isPresent()){
            User user = present.get();
            user.setNickname(request.getNickname() != null ? request.getNickname() : present.get().getNickname());
            user.setPassword(request.getPassword() != null ? passwordEncoder.encode(request.getPassword()) : present.get().getPassword());
            user.setSkinImgUrl(request.getSkinImgUrl() != null ? request.getSkinImgUrl(): present.get().getSkinImgUrl());
            try{
                userRepository.save(user);
            }catch (Exception e){
                throw new RuntimeException("수정에 실패하였습니다.");
            }
        } else {
            throw new RuntimeException("수정에 실패하였습니다.");
        }
    }

    @Transactional
    public void updateLostPw(EditRequest request, String email){
        Optional<User> present = userRepository.findByEmail(email);
        if(present.isPresent()){
            User user = present.get();
            user.setPassword(request.getPassword() != null ? passwordEncoder.encode(request.getPassword()) : present.get().getPassword());
            try{
                userRepository.save(user);
            }catch (Exception e){
                throw new RuntimeException("수정에 실패하였습니다.");
            }
        } else {
            throw new RuntimeException("수정에 실패하였습니다.");
        }
    }

    public User detailsUser(String email){
        Optional<User> present = userRepository.findByEmail(email);
        if(present.isPresent()){
            return present.get();
        } else{
            throw new RuntimeException("회원정보를 다시 확인하세요");
        }
    }

    public String emailExists(CheckRequest request){
        Optional<User> res = userRepository.findByEmail(request.getData());
        if(res.isPresent()){
            throw new RuntimeException(("이미 존재하는 이메일 입니다."));
        } else {
            return "사용가능한 Email 입니다.";
        }
    }

    public String nicknameExists(CheckRequest request) {
        Optional<User> res = userRepository.findByNickname(request.getData());
        if (res.isPresent()) {
            throw new RuntimeException("이미 존재하는 닉네임 입니다.");
        } else {
            return "사용가능한 닉네임입니다.";
        }
    }

    @Transactional
    public int deleteUser(String email){
        Optional<User> present = userRepository.findByEmail(email);
        if(present.isPresent()){
            User user = present.get();
            user.setIsDeleted(true);
            try{
                userRepository.save(user);
            }catch (Exception e){
                throw new RuntimeException("회원정보를 다시 확인하세요");
            }
        } else {
            throw new RuntimeException("회원정보를 다시 확인하세요");
        }
        return 1;
    }

}
