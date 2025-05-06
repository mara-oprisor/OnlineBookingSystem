package com.mara.backend.controller;

import com.mara.backend.config.exception.DuplicateResourceException;
import com.mara.backend.config.exception.NotExistentException;
import com.mara.backend.model.dto.UserCreateDTO;
import com.mara.backend.model.dto.UserDisplayDTO;
import com.mara.backend.model.dto.UserFilterDTO;
import com.mara.backend.service.UserService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@AllArgsConstructor
@CrossOrigin
public class UserController {
    private UserService userService;

    @GetMapping("/users")
    public List<UserDisplayDTO> getUsers() {
        return userService.getAllUsers();
    }

    @PostMapping("/user_filter")
    public List<UserDisplayDTO> filterUsers(@RequestBody UserFilterDTO filterDTO) {
        return userService.filterUsers(filterDTO);
    }

    @GetMapping("/user/{username}")
    public  UserDisplayDTO getUserByUsername(@PathVariable String username) throws NotExistentException {
        return userService.getUserByUsername(username);
    }

    @PostMapping("/add_user")
    public UserDisplayDTO addUser(@Valid @RequestBody UserCreateDTO userDTO) throws DuplicateResourceException {
        return userService.createUser(userDTO);
    }

    @PutMapping("/edit_user/{uuid}")
    public UserDisplayDTO editUser(@PathVariable UUID uuid, @Valid @RequestBody UserCreateDTO userDTO) throws DuplicateResourceException, NotExistentException {
        return userService.editUser(uuid, userDTO);
    }

    @DeleteMapping("/delete_user/{uuid}")
    public void deleteUser(@PathVariable UUID uuid) {
        userService.deleteUser(uuid);
    }
}
