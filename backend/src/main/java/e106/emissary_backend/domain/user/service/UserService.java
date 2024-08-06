package e106.emissary_backend.domain.user.service;

import e106.emissary_backend.domain.achievement.entity.Achievement;
import e106.emissary_backend.domain.achievement.entity.AchievementUsers;
import e106.emissary_backend.domain.achievement.repository.AchievementRepository;
import e106.emissary_backend.domain.achievement.repository.AchievementUsersRepository;
import e106.emissary_backend.domain.user.dto.*;
import e106.emissary_backend.domain.user.repository.UserRepository;
import e106.emissary_backend.domain.user.entity.User;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService implements UserDetailsService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JavaMailSender javaMailSender;
    private static final String senderEmail = "emissary1931@gmail.com";
    private final AchievementRepository achievementRepository;
    private final AchievementUsersRepository achievementUsersRepository;
    private static String tmp;
    private final char[] charSet = new char[] { '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F',
            'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'};


    @Transactional
    public int registerUser(RegisterRequest request){
//        if(!request.getEmailVerify().equals(tmp))return -1;
        try{
            User newUser = User.builder()
                    .nickname(request.getNickname())
                    .email(request.getEmail())
                    .password(passwordEncoder.encode(request.getPassword()))
                    .gender(Optional.ofNullable(request.getGender()).orElse("N"))
//                    .birth(Optional.ofNullable(request.getBirth()).orElse(LocalDate.of(1945,8,15)))
                    .build();
            userRepository.save(newUser);
            return 1;
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return -1;
        }
    }

    @Transactional
    public void firstHonor(RegisterRequest request) {
        Optional<User> present = userRepository.findByEmail(request.getEmail());
        if (present.isPresent()) {
            User user = present.get();
            Optional<Achievement> achievementOptional = achievementRepository.findById(1L);
            if (achievementOptional.isPresent()) {
                Achievement achievement = achievementOptional.get();

                boolean hasAchievement = user.getAchievementUsers().stream()
                        .anyMatch(achievementUsers -> achievementUsers.getAchievement().getAchieveId().equals(achievement.getAchieveId()));
                if (!hasAchievement) {
                    AchievementUsers achievementUsers = AchievementUsers.builder()
                            .user(user)
                            .achievement(achievement)
                            .build();
                    achievementUsersRepository.save(achievementUsers);
                }
            } else {
                throw new RuntimeException("해당 업적을 찾지 못했습니다.");
            }
        }
    }

    @Transactional
    public void updateUser(EditRequest request, String email){
        Optional<User> present = userRepository.findByEmail(email);
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
        } else {
            throw new RuntimeException("회원정보를 다시 확인하세요");
        }
    }

    @Override
    public UserDetails loadUserByUsername(String nickname) throws UsernameNotFoundException {
        Optional<User> present = userRepository.findByNickname(nickname);
        System.out.println(present);
        if(present.isPresent()){
            User user = present.get();
            user.getAchievementUsers().size(); // Lazy 로딩을 강제로 트리거
            System.out.println("AchievementUsers size: " + user.getAchievementUsers().size());
            return new CustomUserDetails(present.get());
        } else{
            throw new RuntimeException("회원정보를 다시 확인하세요");
        }
    }

    public String emailExists(String email){
        Optional<User> res = userRepository.findByEmail(email);
//        System.out.println(email);
        if(res.isPresent()){
            throw new RuntimeException(("이미 존재하는 이메일 입니다."));
        } else {
            return "사용가능한 Email 입니다.";
        }
    }

    public String nicknameExists(String nickname) {
        Optional<User> res = userRepository.findByNickname(nickname);
        if (res.isPresent()) {
            throw new RuntimeException("이미 존재하는 닉네임 입니다.");
        } else {
            return "사용가능한 닉네임입니다.";
        }
    }

    @Transactional
    public int deleteUser(String nickname){
        Optional<User> present = userRepository.findByNickname(nickname);
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

    public String verifyCode(){
        StringBuilder str = new StringBuilder();
        int idx = 0;
        for(int i = 0; i < 6; i++){
            idx = (int)(charSet.length * Math.random());
            str.append(charSet[idx]);
        }
        return str.toString();
    }

    public MimeMessage CreateMail(MailRequest request){
        tmp = verifyCode();
        MimeMessage message = javaMailSender.createMimeMessage();

        try{
            message.setFrom(senderEmail);
            message.setRecipients(MimeMessage.RecipientType.TO,request.getMail());
            message.setSubject("이메일 인증");
            String body = "";
            body += "<h3>" + "요청하신 인증 번호입니다." + "</h3>";
            body += "<h1>" + tmp + "</h1>";
            body += "<h3>" + "감사합니다." + "</h3>";
            message.setText(body, "UTF-8", "html");
        } catch (MessagingException e) {
            e.printStackTrace();
        }
        return message;
    }

    public String sendMail(MailRequest request){
        MimeMessage message = CreateMail(request);
        javaMailSender.send(message);
        return tmp;
    }

    public List<User> getContainNickname(String s){
        return userRepository.findByNicknameContaining(s);
    }

}
