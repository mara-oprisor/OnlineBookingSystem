package com.mara.backend.logic;

import com.mara.backend.config.exception.NotExistentException;
import com.mara.backend.model.DiscountCode;
import com.mara.backend.model.dto.BookingCreateDTO;
import com.mara.backend.model.dto.PricingDTO;
import com.mara.backend.repository.DiscountCodeRepository;
import com.mara.backend.service.DiscountCodeService;
import lombok.AllArgsConstructor;


@AllArgsConstructor
public class DiscountCodeHandler implements PriceHandler{
    private PriceHandler next;
    private DiscountCodeService discountCodeService;

    @Override
    public double findFinalPrice(PricingDTO pricingDTO) {
        String code = pricingDTO.getDiscountCode();

        if(code != null && !code.isEmpty() && discountCodeService.getDiscountCodeIfValid(code).isPresent()) {
            int discount = extractPercentageFromCode(code);
            int basePrice = pricingDTO.getBasePrice();

            return basePrice * (100 - discount) / 100.0;
        }

        return next.findFinalPrice(pricingDTO);
    }

    private int extractPercentageFromCode(String code) {
        String lastDigits = code.substring(code.length() - 2);
        return Integer.parseInt(lastDigits);
    }

    @Override
    public PriceHandler setNextHandler(PriceHandler priceHandler) {
        this.next = priceHandler;
        return next;
    }
}
