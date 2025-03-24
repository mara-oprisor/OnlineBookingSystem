package com.mara.backend.model.dto;

import com.mara.backend.model.Client;
import com.mara.backend.model.User;
import lombok.Data;

import java.util.UUID;

@Data
public class UserDisplayDTO {
    private UUID uuid;
    private String username;
    private String email;
    private String password;
    private String userType;
    private String name;
    private Integer age;
    private String gender;

    public static UserDisplayDTO userToDTO(User user) {
        UserDisplayDTO userDTO = new UserDisplayDTO();

        userDTO.setUuid(user.getId());
        userDTO.setUsername(user.getUsername());
        userDTO.setPassword(user.getPassword());
        userDTO.setEmail(user.getEmail());

        if(user instanceof Client client) {
            userDTO.setUserType("CLIENT");
            userDTO.setName(client.getName());
            userDTO.setAge(client.getAge());
            userDTO.setGender(String.valueOf(client.getGender()));
        } else {
            userDTO.setUserType("ADMIN");
        }

        return userDTO;
    }
}
