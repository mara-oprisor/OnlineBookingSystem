package com.mara.backend.logic;

import com.mara.backend.model.dto.PricingDTO;

public interface PriceHandler {
    double findFinalPrice(PricingDTO pricingDTO);
    PriceHandler setNextHandler(PriceHandler priceHandler);
}
