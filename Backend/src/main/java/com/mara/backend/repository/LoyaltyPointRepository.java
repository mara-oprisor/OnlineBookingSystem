package com.mara.backend.repository;

import com.mara.backend.model.LoyaltyPoint;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface LoyaltyPointRepository extends JpaRepository<LoyaltyPoint, UUID> {
    List<LoyaltyPoint> findByClientId(UUID clientId);
}
