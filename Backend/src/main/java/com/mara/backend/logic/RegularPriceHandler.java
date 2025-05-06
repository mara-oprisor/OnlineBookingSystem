package com.mara.backend.logic;

import com.mara.backend.model.dto.PricingDTO;
import lombok.AllArgsConstructor;

@AllArgsConstructor
public class RegularPriceHandler implements PriceHandler {
    private PriceHandler next;

    @Override
    public double findFinalPrice(PricingDTO pricingDTO) {
        return pricingDTO.getBasePrice();
    }

    @Override
    public PriceHandler setNextHandler(PriceHandler priceHandler) {
        this.next = priceHandler;
        return next;
    }
}
