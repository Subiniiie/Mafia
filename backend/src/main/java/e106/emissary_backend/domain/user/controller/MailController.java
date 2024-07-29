package e106.emissary_backend.domain.user.controller;

import e106.emissary_backend.domain.user.service.UserService;
import e106.emissary_backend.domain.user.dto.MailRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@RequiredArgsConstructor
public class MailController {

    private final UserService mailService;

    @ResponseBody
    @PostMapping("/mail")
    public String MailSend(@RequestBody MailRequest request){
        return mailService.sendMail(request);
    }

}
