package com.mara.backend.service;

import com.mara.backend.config.exception.DuplicateResourceException;
import com.mara.backend.model.Admin;
import com.mara.backend.model.Client;
import com.mara.backend.model.User;
import com.mara.backend.model.dto.UserCreateDTO;
import com.mara.backend.model.dto.UserDisplayDTO;
import com.mara.backend.model.dto.UserFilterDTO;
import com.mara.backend.repository.UserRepository;
import com.mara.backend.util.security.PasswordUtil;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final PasswordUtil passwordUtil;

    public List<UserDisplayDTO> getAllUsers() {
        List<User> users = userRepository.findAll();
        List<UserDisplayDTO> usersDTO = new ArrayList<>();

        for(User user: users) {
            usersDTO.add(UserDisplayDTO.userToDTO(user));
        }

        return usersDTO;
    }
    public List<UserDisplayDTO> filterUsers(UserFilterDTO filterDTO) {
        List<User> users = userRepository.findAll();

        if (filterDTO.getUsername() != null && !filterDTO.getUsername().trim().isEmpty()) {
            String usernameLower = filterDTO.getUsername().toLowerCase();
            users = users.stream()
                    .filter(u -> u.getUsername().toLowerCase().contains(usernameLower))
                    .collect(Collectors.toList());
        }

        if (filterDTO.getEmail() != null && !filterDTO.getEmail().trim().isEmpty()) {
            String emailLower = filterDTO.getEmail().toLowerCase();
            users = users.stream()
                    .filter(u -> u.getEmail().toLowerCase().contains(emailLower))
                    .collect(Collectors.toList());
        }

        if (filterDTO.getUserType() != null && !filterDTO.getUserType().trim().isEmpty()) {
            String filterType = filterDTO.getUserType().toUpperCase();
            users = users.stream()
                    .filter(u -> {
                        if (filterType.equals("CLIENT")) {
                            return u instanceof Client;
                        } else if (filterType.equals("ADMIN")) {
                            return u instanceof Admin;
                        } else {
                            return true;
                        }
                    })
                    .collect(Collectors.toList());
        }

        return users.stream()
                .map(UserDisplayDTO::userToDTO)
                .collect(Collectors.toList());
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
            String hashedPassword = passwordUtil.hashPassword(userDTO.getPassword());
            client.setPassword(hashedPassword);
            client.setEmail(userDTO.getEmail());

            return UserDisplayDTO.userToDTO(userRepository.save(client));
        } else if ("ADMIN".equalsIgnoreCase(userDTO.getUserType())) {
            Admin admin = new Admin();

            admin.setUsername(userDTO.getUsername());
            admin.setEmail(userDTO.getEmail());
            String hashedPassword = passwordUtil.hashPassword(userDTO.getPassword());
            admin.setPassword(hashedPassword);

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
        String hashedPassword = passwordUtil.hashPassword(userDTO.getPassword());
        existingUser.setPassword(hashedPassword);

        if (existingUser instanceof Client client) {

            client.setName(userDTO.getName());
            client.setAge(userDTO.getAge());

            return UserDisplayDTO.userToDTO(userRepository.save(client));
        }

        return UserDisplayDTO.userToDTO(userRepository.save(existingUser));
    }

    public void deleteUser(UUID uuid) {
        userRepository.deleteById(uuid);
    }
}
