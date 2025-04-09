package com.mara.backend.model.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserCreateDTO {
    @NotBlank(message = "Username is required!")
    @Size(min = 5, max = 25, message = "Username must have between 5 and 25 characters")
    private String username;

    @NotBlank(message = "Email is required!")
    @Email(
            message = "Please provide a valid email address!",
            regexp = "[a-z0-9._-]+@[a-z0-9.-]+\\.[a-z]{2,3}",
            flags = Pattern.Flag.CASE_INSENSITIVE)
    private String email;

    @NotBlank(message = "Password is required!")
    @Size(min = 8, message = "Password should be longer than 8 characters")
    private String password;

    @Pattern(regexp = "CLIENT|ADMIN")
    @NotBlank(message = "User type is required!")
    private String userType;

    private String name;

    @Min(value = 18, message = "Age must be at least 18")
    @Max(value = 99, message = "Age must be at most 99")
    private Integer age;

    private String gender;
}
