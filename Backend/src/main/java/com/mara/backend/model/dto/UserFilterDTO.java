package com.mara.backend.model.dto;


import lombok.Data;

@Data
public class UserFilterDTO {
    private String username;
    private String email;
    private String userType;
}
