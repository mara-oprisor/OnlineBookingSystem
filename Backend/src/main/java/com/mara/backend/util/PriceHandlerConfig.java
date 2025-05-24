package com.mara.backend.util;

import com.mara.backend.logic.*;
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
    public LoyalClientBronzeHandler loyalClientBronzeHandler(LoyaltyPointService loyaltyPointService) {
        return new LoyalClientBronzeHandler(null, loyaltyPointService);
    }

    @Bean
    public LoyalClientSilverHandler loyalClientSilverHandler(LoyaltyPointService loyaltyPointService) {
        return new LoyalClientSilverHandler(null, loyaltyPointService);
    }

    @Bean
    public LoyalClientGoldHandler loyalClientGoldHandler(LoyaltyPointService loyaltyPointService) {
        return new LoyalClientGoldHandler(null, loyaltyPointService);
    }

    @Bean
    public RegularPriceHandler regularPriceHandler() {
        return new RegularPriceHandler(null);
    }

    @Bean
    @Primary
    public PriceHandler priceHandlerChain(DiscountCodeHandler discountCodeHandler,
                                          LoyalClientBronzeHandler loyalClientBronzeHandler,
                                          LoyalClientSilverHandler loyalClientSilverHandler,
                                          LoyalClientGoldHandler loyalClientGoldHandler,
                                          RegularPriceHandler regularPriceHandler) {
        discountCodeHandler
                .setNextHandler(loyalClientBronzeHandler)
                .setNextHandler(loyalClientSilverHandler)
                .setNextHandler(loyalClientGoldHandler)
                .setNextHandler(regularPriceHandler);
        return discountCodeHandler;
    }
}

