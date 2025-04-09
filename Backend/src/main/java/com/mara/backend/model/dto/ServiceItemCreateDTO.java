package com.mara.backend.model.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ServiceItemCreateDTO {
    @NotBlank(message = "Name of the service is required!")
    private String name;

    private String description;

    @NotNull
    @Min(value = 10, message = "Price must be a number greater than 10!")
    private Integer price;

    @NotNull(message = "The name of the salon is required!")
    private String salonName;
}
