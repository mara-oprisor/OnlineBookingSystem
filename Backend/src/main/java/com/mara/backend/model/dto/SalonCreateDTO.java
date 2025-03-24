package com.mara.backend.model.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class SalonCreateDTO {
    @NotBlank(message = "Name of the salon is required!")
    private String name;

    @Pattern(regexp = "07[0-9]{8}", message = "Please enter a valid phone number! It should start ith 07 and have exactly 10 digits")
    private String phoneNumber;
}
