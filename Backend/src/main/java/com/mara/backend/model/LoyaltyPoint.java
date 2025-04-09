package com.mara.backend.model;

import jakarta.persistence.*;
import lombok.Data;

import java.util.UUID;

@Entity(name = "loyalty_point")
@Data
public class LoyaltyPoint {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID uuid;

    @ManyToOne
    @JoinColumn(name = "client_id", nullable = false)
    private Client client;

    @Column(name = "no_of_points", nullable = false)
    private int points;
}
