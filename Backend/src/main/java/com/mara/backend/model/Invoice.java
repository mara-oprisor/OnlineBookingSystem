package com.mara.backend.model;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class Invoice {
    private UUID bookingId;
    private String salon;
    private String serviceName;
    private String clientUsername;
    private String clientEmail;
    private LocalDateTime date;
    private Double finalPrice;
}
