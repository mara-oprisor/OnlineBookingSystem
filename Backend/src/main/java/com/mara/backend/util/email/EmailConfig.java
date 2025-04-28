package com.mara.backend.util.email;

import org.simplejavamail.api.mailer.Mailer;
import org.simplejavamail.mailer.MailerBuilder;
import org.simplejavamail.api.mailer.config.TransportStrategy;
import org.simplejavamail.api.email.Recipient;
import org.springframework.beans.factory.annotation.Value;   // <— correct import
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class EmailConfig {
    @Value("${spring.mail.host}")
    private String host;

    @Value("${spring.mail.port}")
    private int port;

    @Value("${spring.mail.username}")
    private String username;

    @Value("${spring.mail.password}")
    private String password;

    @Bean
    public Mailer mailer() {
        return MailerBuilder
                .withSMTPServerHost(host)
                .withSMTPServerPort(port)
                .withSMTPServerUsername(username)
                .withSMTPServerPassword(password)
                .withTransportStrategy(TransportStrategy.SMTP_TLS)
                .buildMailer();
    }
}
