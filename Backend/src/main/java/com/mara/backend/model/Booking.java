package com.mara.backend.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity(name = "booking")
@Data
public class Booking {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID uuid;

    @ManyToOne
    private Client client;

    @ManyToOne
    private ServiceItem serviceItem;

    @Column(name = "date_time", nullable = false)
    private LocalDateTime dateTime;

    @Column(name = "final_price", nullable = false)
    private Double finalPrice;
}
