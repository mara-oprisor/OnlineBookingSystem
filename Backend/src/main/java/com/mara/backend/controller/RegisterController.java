package com.mara.backend.controller;

import com.mara.backend.config.exception.DuplicateResourceException;
import com.mara.backend.model.dto.UserCreateDTO;
import com.mara.backend.model.dto.UserDisplayDTO;
import com.mara.backend.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin
@RestController
@AllArgsConstructor
public class RegisterController {
    private final UserService userService;

    @PostMapping("/register")
    public UserDisplayDTO registerUser(@RequestBody UserCreateDTO dto) throws DuplicateResourceException {
        return userService.createUser(dto);
    }
}
