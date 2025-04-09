package com.mara.backend.model.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class BookingCreateDTO {
    @NotBlank(message = "Please select a client")
    private UUID clientId;

    @NotBlank(message = "Please select a service")
    private UUID serviceId;

    @NotBlank(message = "Please choose a date and a time for the booking")
    private LocalDateTime dateTime;

    private String discountCode;
}
