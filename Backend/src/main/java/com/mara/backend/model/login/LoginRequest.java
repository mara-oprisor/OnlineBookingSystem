package com.mara.backend.model.login;

public record LoginRequest(
        String username,
        String password
) {
}
