package com.mara.backend.service;

import com.mara.backend.model.LoyaltyPoint;
import com.mara.backend.repository.LoyaltyPointRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@AllArgsConstructor
public class LoyaltyPointService {
    private final LoyaltyPointRepository loyaltyPointRepository;

    public int getAllPointsForUser(UUID clientId) {
        return loyaltyPointRepository.findByClientId(clientId).stream()
                .mapToInt(LoyaltyPoint::getPoints)
                .sum();
    }

    public void addLoyaltyPoint(LoyaltyPoint loyaltyPoint) {
        loyaltyPointRepository.save(loyaltyPoint);
    }
}
