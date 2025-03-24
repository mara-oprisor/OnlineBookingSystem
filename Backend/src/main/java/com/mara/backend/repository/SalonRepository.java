package com.mara.backend.repository;

import com.mara.backend.model.Salon;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface SalonRepository extends JpaRepository<Salon, UUID> {
    Optional<Salon> findByName(String name);
    boolean existsByName(String name);
    boolean existsByPhoneNumber(String phoneNr);
}

