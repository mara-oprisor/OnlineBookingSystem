package com.mara.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity(name = "discount_code")
@Data
public class DiscountCode {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID uuid;

    @Column(name = "code", nullable = false, unique = true)
    private String code;

    @Column(name = "expiration_date", nullable = false)
    private LocalDateTime expirationDate;
}
