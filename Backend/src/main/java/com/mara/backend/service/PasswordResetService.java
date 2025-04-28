package com.mara.backend.service;

import com.mara.backend.model.PasswordResetToken;
import com.mara.backend.model.User;
import com.mara.backend.model.dto.ResetPasswordRequest;
import com.mara.backend.model.dto.UserCreateDTO;
import com.mara.backend.model.dto.UserDisplayDTO;
import com.mara.backend.repository.PasswordResetRepository;
import com.mara.backend.repository.UserRepository;
import com.mara.backend.util.email.EmailSender;
import com.mara.backend.util.security.PasswordUtil;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Objects;
import java.util.Random;

@Service
@AllArgsConstructor
public class PasswordResetService {
    private final UserRepository userRepository;
    private final PasswordResetRepository passwordResetRepository;
    private final EmailSender emailSender;
    private final PasswordUtil passwordUtil;

    @Transactional
    public void sendResetToken(String email) {
        email = email.trim();
        if (email.startsWith("\"") && email.endsWith("\"")) {
            email = email.substring(1, email.length() - 1);
        }

        userRepository.findByEmail(email).orElseThrow(
                () -> new IllegalStateException("There is no user with this email")
        );

        passwordResetRepository.deleteByEmail(email);

        PasswordResetToken passwordResetToken = createResetToken(email);
        emailSender.sendCode(email, passwordResetToken.getToken());
    }

    private PasswordResetToken createResetToken(String email) {
        PasswordResetToken passwordResetToken = new PasswordResetToken();
        passwordResetToken.setEmail(email);
        passwordResetToken.setExpiresAt(LocalDateTime.now().plusMinutes(10));

        Random rand = new Random();
        int randomCode = rand.nextInt(1000000);
        passwordResetToken.setToken(String.format("%06d", randomCode));

        return passwordResetRepository.save(passwordResetToken);
    }

    public UserDisplayDTO resetPassword(ResetPasswordRequest resetPasswordRequest) {
        User user = userRepository.findByEmail(resetPasswordRequest.getEmail()).orElseThrow(
                () -> new IllegalStateException("There is no user with email " + resetPasswordRequest.getEmail())
        );

        PasswordResetToken passwordResetToken = passwordResetRepository.findByToken(resetPasswordRequest.getToken()).orElseThrow(
                () -> new IllegalStateException("There is token " + resetPasswordRequest.getToken())
        );

        if (passwordResetToken.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new IllegalStateException("The token is expired");
        }

        if(!Objects.equals(passwordResetToken.getEmail(), resetPasswordRequest.getEmail())) {
            throw new IllegalStateException("The token is not assigned to th correct user");
        }

        user.setPassword(passwordUtil.hashPassword(resetPasswordRequest.getPassword()));

        return UserDisplayDTO.userToDTO(userRepository.save(user));
    }
}
