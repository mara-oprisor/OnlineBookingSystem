package com.mara.backend.logic;

import com.mara.backend.model.Client;
import com.mara.backend.model.ServiceItem;

public interface PricingStrategy {
    double calculatePrice(ServiceItem service, Client client);
}
