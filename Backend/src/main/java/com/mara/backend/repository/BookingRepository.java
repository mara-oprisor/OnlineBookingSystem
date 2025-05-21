package com.mara.backend.repository;

import com.mara.backend.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, UUID> {
    List<Booking> findByClient_Id(UUID clientId);
}
