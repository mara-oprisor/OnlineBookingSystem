package com.mara.backend.model;

import jakarta.persistence.*;
import lombok.Data;

import java.util.List;
import java.util.UUID;

@Entity
@Data
@Table(name="salon")
public class Salon {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID uuid;

    @Column(name = "name", nullable = false, unique = true)
    private String name;

    @Column(name = "phone_nr", unique = true)
    private String phoneNumber;

    @ManyToMany
    @JoinTable(
            name = "client_favorite_salons",
            joinColumns = @JoinColumn(name = "salon_uuid"),
            inverseJoinColumns = @JoinColumn(name = "client_uuid")
    )
    private List<Client> favoriteFor;
}

