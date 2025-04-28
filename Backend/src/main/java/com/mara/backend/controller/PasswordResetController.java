package com.mara.backend.controller;

import com.mara.backend.model.dto.ResetPasswordRequest;
import com.mara.backend.model.dto.UserDisplayDTO;
import com.mara.backend.service.PasswordResetService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin
@AllArgsConstructor
public class PasswordResetController {
    private final PasswordResetService passwordResetService;

    @PostMapping("/forgot_password")
    public ResponseEntity<String> forgotPassword(@RequestBody String email) {
        passwordResetService.sendResetToken(email);

        return ResponseEntity.ok("Code sent!");
    }

    @PostMapping("/reset_password")
    public UserDisplayDTO resetPassword(@RequestBody ResetPasswordRequest resetPasswordRequest) {
        return passwordResetService.resetPassword(resetPasswordRequest);
    }
}
