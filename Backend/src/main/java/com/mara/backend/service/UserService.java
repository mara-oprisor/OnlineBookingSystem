package com.mara.backend.service;

import com.mara.backend.config.exception.DuplicateResourceException;
import com.mara.backend.model.Admin;
import com.mara.backend.model.Client;
import com.mara.backend.model.Gender;
import com.mara.backend.model.User;
import com.mara.backend.model.dto.UserCreateDTO;
import com.mara.backend.model.dto.UserDisplayDTO;
import com.mara.backend.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@AllArgsConstructor
public class UserService {
    private UserRepository userRepository;

    public List<UserDisplayDTO> getAllUsers() {
        List<User> users = userRepository.findAll();
        List<UserDisplayDTO> usersDTO = new ArrayList<>();

        for(User user: users) {
            usersDTO.add(UserDisplayDTO.userToDTO(user));
        }

        return usersDTO;
    }

    public UserDisplayDTO getUserByUsername(String username) {
        User user = userRepository.findByUsername(username).orElseThrow(
                () -> new IllegalStateException("There is no user with username: " + username)
        );

        return UserDisplayDTO.userToDTO(user);
    }

    public UserDisplayDTO createUser(UserCreateDTO userDTO) throws DuplicateResourceException {
        if (userRepository.existsByEmail(userDTO.getEmail())) {
            throw new DuplicateResourceException("Email '" + userDTO.getEmail() + "' already exists.");
        }

        if (userRepository.existsByUsername(userDTO.getUsername())) {
            throw new DuplicateResourceException("Username '" + userDTO.getUsername() + "' already exists.");
        }

        if ("CLIENT".equalsIgnoreCase(userDTO.getUserType())) {
            Client client = new Client();

            client.setName(userDTO.getName());
            client.setAge(userDTO.getAge());
            client.setUsername(userDTO.getUsername());
            client.setPassword(userDTO.getPassword());
            client.setEmail(userDTO.getEmail());

            if(userDTO.getGender() != null && !userDTO.getGender().isEmpty()) {
                client.setGender(Gender.valueOf(userDTO.getGender()));
            } else {
                client.setGender(null);
            }


            return UserDisplayDTO.userToDTO(userRepository.save(client));
        } else if ("ADMIN".equalsIgnoreCase(userDTO.getUserType())) {
            Admin admin = new Admin();

            admin.setUsername(userDTO.getUsername());
            admin.setEmail(userDTO.getEmail());
            admin.setPassword(userDTO.getPassword());

            return UserDisplayDTO.userToDTO(userRepository.save(admin));
        } else {
            throw new IllegalStateException("Invalid user type provided!");
        }
    }

    public UserDisplayDTO editUser(UUID uuid, UserCreateDTO userDTO) throws DuplicateResourceException {
        User existingUser = userRepository.findById(uuid).orElseThrow(
                () -> new IllegalStateException("There is no user with uuid " + uuid)
        );

        if (!userDTO.getEmail().equals(existingUser.getEmail()) && userRepository.existsByEmail(userDTO.getEmail())) {
            throw new DuplicateResourceException("Email '" + userDTO.getEmail() + "' already exists.");
        }

        if (!userDTO.getUsername().equals(existingUser.getUsername()) && userRepository.existsByUsername(userDTO.getUsername())) {
            throw new DuplicateResourceException("Username '" + userDTO.getUsername() + "' already exists.");
        }

        existingUser.setEmail(userDTO.getEmail());
        existingUser.setUsername(userDTO.getUsername());
        existingUser.setPassword(userDTO.getPassword());

        if (existingUser instanceof Client client) {

            client.setName(userDTO.getName());
            client.setAge(userDTO.getAge());

            if(userDTO.getGender() != null && !userDTO.getGender().isEmpty()) {
                client.setGender(Gender.valueOf(userDTO.getGender()));
            } else {
                client.setGender(null);
            }

            return UserDisplayDTO.userToDTO(userRepository.save(client));
        }

        return UserDisplayDTO.userToDTO(userRepository.save(existingUser));
    }

    public void deleteUser(UUID uuid) {
        userRepository.deleteById(uuid);
    }
}
