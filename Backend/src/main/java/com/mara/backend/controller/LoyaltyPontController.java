package com.mara.backend.controller;

import com.mara.backend.service.LoyaltyPointService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@CrossOrigin
@AllArgsConstructor
public class LoyaltyPontController {
    private final LoyaltyPointService loyaltyPointService;

    @GetMapping("/loyalty-points/{uuid}")
    public int getLoyaltyPointsForUser(@PathVariable UUID uuid) {
        return loyaltyPointService.getAllPointsForUser(uuid);
    }
}
