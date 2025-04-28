package com.mara.backend.util.email;

import lombok.AllArgsConstructor;
import org.simplejavamail.api.email.Email;
import org.simplejavamail.api.mailer.Mailer;
import org.simplejavamail.email.EmailBuilder;
import org.springframework.stereotype.Service;

@AllArgsConstructor
@Service
public class EmailSender {
    private final Mailer mailer;
    public void sendCode(String email, String code) {
        Email msg = EmailBuilder.startingBlank()
                .to(email)
                .from("mara.conturi@yahoo.com")
                .withSubject("Reset your password")
                .withPlainText("Your code: " + code + ". Expires in 10 minutes.")
                .buildEmail();

        mailer.sendMail(msg);
    }
}
