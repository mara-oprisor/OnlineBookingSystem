package com.mara.backend.util;

import com.mara.backend.logic.DiscountCodeHandler;
import com.mara.backend.logic.LoyalClientHandler;
import com.mara.backend.logic.PriceHandler;
import com.mara.backend.logic.RegularPriceHandler;
import com.mara.backend.service.DiscountCodeService;
import com.mara.backend.service.LoyaltyPointService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

@Configuration
public class PriceHandlerConfig {

    @Bean
    public DiscountCodeHandler discountCodeHandler(DiscountCodeService discountCodeService) {
        return new DiscountCodeHandler(null, discountCodeService);
    }

    @Bean
    public LoyalClientHandler loyalClientHandler(LoyaltyPointService loyaltyPointService) {
        return new LoyalClientHandler(null, loyaltyPointService);
    }

    @Bean
    public RegularPriceHandler regularPriceHandler() {
        return new RegularPriceHandler(null);
    }

    @Bean
    @Primary
    public PriceHandler priceHandlerChain(DiscountCodeHandler discountCodeHandler,
                                          LoyalClientHandler loyalClientHandler,
                                          RegularPriceHandler regularPriceHandler) {
        discountCodeHandler
                .setNextHandler(loyalClientHandler)
                .setNextHandler(regularPriceHandler);
        return discountCodeHandler;
    }
}

