package com.mara.backend.model.login;

public record LoginResponse(
        Boolean success,
        String role,
        String errorMessage
) {
}
