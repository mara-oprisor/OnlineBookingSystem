package com.mara.backend.service;

import com.mara.backend.model.Client;
import com.mara.backend.model.login.LoginResponse;
import com.mara.backend.repository.UserRepository;
import com.mara.backend.util.security.JWTUtil;
import com.mara.backend.util.security.PasswordUtil;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class LoginService {
    private final UserRepository userRepository;
    private final PasswordUtil passwordUtil;
    private final JWTUtil jwtUtil;

    public LoginResponse login(String username, String password) {
        return userRepository.findByUsername(username)
                .map(user ->
                        passwordUtil.checkPassword(password, user.getPassword())
                                ? new LoginResponse(
                                    true,
                                    user instanceof Client ? "CLIENT" : "ADMIN",
                                    null,
                                    jwtUtil.createToken(user))

                                : new LoginResponse(
                                    false,
                                    null,
                                    "Incorrect password! Please try again!",
                                    null)
                )
                .orElseGet(() -> new LoginResponse(
                        false,
                        null,
                        "There is no user with username " + username,
                        null
                ));
    }
}
