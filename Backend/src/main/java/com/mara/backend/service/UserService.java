package com.mara.backend.service;

import com.mara.backend.config.exception.DuplicateResourceException;
import com.mara.backend.config.exception.NotExistentException;
import com.mara.backend.model.Admin;
import com.mara.backend.model.Client;
import com.mara.backend.model.dto.UserCreateDTO;
import com.mara.backend.model.dto.UserDisplayDTO;
import com.mara.backend.model.dto.UserFilterDTO;
import com.mara.backend.repository.UserRepository;
import com.mara.backend.util.security.PasswordUtil;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
@AllArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final PasswordUtil passwordUtil;

    public List<UserDisplayDTO> getAllUsers() {
        return userRepository.findAll().stream()
                .map(UserDisplayDTO::userToDTO)
                .collect(Collectors.toList());
    }
    public List<UserDisplayDTO> filterUsers(UserFilterDTO filterDTO) {
        return userRepository.findAll().stream()
                .filter(user -> Optional.ofNullable(filterDTO.getUsername())
                        .map(String::toLowerCase)
                        .map(x -> user.getUsername()
                                .toLowerCase()
                                .contains(x))
                        .orElse(true))
                .filter(user -> Optional.ofNullable(filterDTO.getEmail())
                        .map(String::toLowerCase)
                        .map(x -> user.getEmail()
                                .toLowerCase()
                                .contains(x))
                        .orElse(true))
                .filter(user -> Optional.ofNullable(filterDTO.getUserType())
                        .map(type -> switch (type) {
                            case "ADMIN" -> user instanceof Admin;
                            case "CLIENT" -> user instanceof Client;
                            default -> true;
                        })
                        .orElse(true))
                .map(UserDisplayDTO::userToDTO)
                .collect(Collectors.toList());
    }

    public UserDisplayDTO getUserByUsername(String username) throws NotExistentException {
        return userRepository.findByUsername(username)
                .map(UserDisplayDTO::userToDTO)
                .orElseThrow(() -> new NotExistentException("There is no user with username: " + username));
    }

    public UserDisplayDTO createUser(UserCreateDTO userDTO) throws DuplicateResourceException {
        validateUniqueness(userDTO);

        return Stream.of(userDTO)
                .map(dto -> switch (dto.getUserType().toUpperCase()) {
                    case "CLIENT" -> createClient(dto);
                    case "ADMIN"  -> createAdmin(dto);
                    default       -> throw new IllegalStateException("Invalid user type: " + dto.getUserType());
                })
                .map(userRepository::save)
                .map(UserDisplayDTO::userToDTO)
                .findFirst()
                .get();
    }

    public UserDisplayDTO editUser(UUID uuid, UserCreateDTO userDTO) throws DuplicateResourceException, NotExistentException {
        validateUniqueness(userDTO);

        return userRepository.findById(uuid).stream()
                .peek(user -> {
                    user.setEmail(userDTO.getEmail());
                    user.setUsername(userDTO.getUsername());
                    user.setPassword(userDTO.getPassword());
                })
                .map(user -> {
                    if (user instanceof Client client) {
                        client.setName(userDTO.getName());
                        client.setAge(userDTO.getAge());
                        return client;
                    }
                    return user;
                })
                .map(userRepository::save)
                .map(UserDisplayDTO::userToDTO)
                .findFirst()
                .orElseThrow(() ->
                        new NotExistentException("There is no user with uuid " + uuid)
                );
    }

    public void deleteUser(UUID uuid) {
        userRepository.deleteById(uuid);
    }

    private void validateUniqueness(UserCreateDTO userDTO) throws DuplicateResourceException {
        if (userRepository.existsByEmail(userDTO.getEmail())) {
            throw new DuplicateResourceException("Email '" + userDTO.getEmail() + "' already exists.");
        }

        if (userRepository.existsByUsername(userDTO.getUsername())) {
            throw new DuplicateResourceException("Username '" + userDTO.getUsername() + "' already exists.");
        }
    }

    private Client createClient(UserCreateDTO dto) {
        Client client = new Client();
        client.setUsername(dto.getUsername());
        client.setEmail(dto.getEmail());
        client.setPassword(passwordUtil.hashPassword(dto.getPassword()));
        client.setName(dto.getName());
        client.setAge(dto.getAge());
        client.setUsername(dto.getUsername());
        client.setEmail(dto.getEmail());
        return client;
    }

    private Admin createAdmin(UserCreateDTO dto) {
        Admin admin = new Admin();
        admin.setUsername(dto.getUsername());
        admin.setEmail(dto.getEmail());
        admin.setPassword(passwordUtil.hashPassword(dto.getPassword()));
        return admin;
    }
}
