package com.mara.backend.logic;

import com.mara.backend.model.Client;
import com.mara.backend.model.ServiceItem;

public class DiscountCodePricingStrategy implements PricingStrategy{
    private final int discountPercentage;

    public DiscountCodePricingStrategy(int discountPercentage) {
        this.discountPercentage = discountPercentage;
    }


    public double calculatePrice(ServiceItem service, Client client) {
        double basePrice = service.getPrice();

        return basePrice * (100 - discountPercentage) / 100.0;
    }
}
