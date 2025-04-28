package com.mara.backend.model.dto;

import lombok.Data;

@Data
public class ResetPasswordRequest {
    private String email;
    private String password;
    private String token;
}
