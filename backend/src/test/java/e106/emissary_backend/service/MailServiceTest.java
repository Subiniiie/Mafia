package e106.emissary_backend.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import e106.emissary_backend.domain.user.dto.MailRequest;
import e106.emissary_backend.domain.user.service.UserService;
import jakarta.transaction.Transactional;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.annotation.Rollback;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
@Rollback(false)
class MailServiceTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserService mailService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @WithMockUser(username = "testuser", roles = "USER")
    void testMailSend() throws Exception {

        MailRequest mailRequest = new MailRequest();
        mailRequest.setMail("hwk216@naver.com");

        String jsonRequest = objectMapper.writeValueAsString(mailRequest);

        MvcResult result = mockMvc.perform(post("/api/mail")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(jsonRequest))
                .andExpect(status().isOk())
                .andReturn();

        String content = result.getResponse().getContentAsString();
        assertNotNull(content);
        assertEquals(6, content.length());
        assertTrue(content.matches("[0-9A-Z]{6}"));
    }
}