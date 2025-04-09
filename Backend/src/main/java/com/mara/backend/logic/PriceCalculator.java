package com.mara.backend.logic;

import com.mara.backend.model.Client;
import com.mara.backend.model.ServiceItem;
import lombok.Setter;

@Setter
public class PriceCalculator {
    PricingStrategy strategy;

    public double computeFinalPrice(ServiceItem serviceItem, Client client) {
        return strategy.calculatePrice(serviceItem, client);
    }
}
