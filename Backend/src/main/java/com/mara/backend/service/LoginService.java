package com.mara.backend.service;

import com.mara.backend.model.Client;
import com.mara.backend.model.User;
import com.mara.backend.model.login.LoginResponse;
import com.mara.backend.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@AllArgsConstructor
public class LoginService {
    private final UserRepository userRepository;

    public LoginResponse login(String username, String password) {
        Optional<User> maybeUser = userRepository.findByUsername(username);

        if(maybeUser.isEmpty()) {
            return new LoginResponse(
                    false,
                    null,
                    "There is no user with username " + username
            );
        }

        User user = maybeUser.get();
        if(user.getPassword().equals(password)) {
            if(user instanceof Client) {
                return new LoginResponse(
                        true,
                        "CLIENT",
                        null
                );
            } else {
                return new LoginResponse(
                        true,
                        "ADMIN",
                        null
                );
            }
        } else {
            return new LoginResponse(
                    false,
                    null,
                    "Incorrect password! Please try again!"
            );
        }
    }
}
