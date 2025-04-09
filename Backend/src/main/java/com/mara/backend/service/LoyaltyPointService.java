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
        List<LoyaltyPoint> loyaltyPointList = loyaltyPointRepository.findByClientId(clientId);
        int totalPoints = 0;

        for (LoyaltyPoint loyaltyPoint: loyaltyPointList) {
            totalPoints += loyaltyPoint.getPoints();
        }

        return totalPoints;
    }

    public void addLoyaltyPoint(LoyaltyPoint loyaltyPoint) {
        loyaltyPointRepository.save(loyaltyPoint);
    }
}
