package com.mara.backend.logic;

import com.mara.backend.model.Client;
import com.mara.backend.model.dto.PricingDTO;
import com.mara.backend.service.LoyaltyPointService;
import lombok.AllArgsConstructor;

@AllArgsConstructor
public class LoyalClientBronzeHandler implements PriceHandler {
    private PriceHandler next;
    private LoyaltyPointService loyaltyPointService;

    @Override
    public double findFinalPrice(PricingDTO pricingDTO) {
        Client client = pricingDTO.getClient();

        if (loyaltyPointService.getAllPointsForUser(client.getId()) > 200) {
            return pricingDTO.getBasePrice() * 0.95;
        }

        return next.findFinalPrice(pricingDTO);
    }

    @Override
    public PriceHandler setNextHandler(PriceHandler priceHandler) {
        this.next = priceHandler;
        return next;
    }
}
