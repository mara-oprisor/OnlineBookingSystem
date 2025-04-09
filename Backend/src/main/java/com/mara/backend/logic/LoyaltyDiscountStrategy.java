package com.mara.backend.logic;

import com.mara.backend.model.Client;
import com.mara.backend.model.ServiceItem;

public class LoyaltyDiscountStrategy implements PricingStrategy {
    @Override
    public double calculatePrice(ServiceItem service, Client client) {
        return service.getPrice() * 0.8;
    }
}
