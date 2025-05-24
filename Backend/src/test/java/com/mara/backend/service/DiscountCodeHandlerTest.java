package com.mara.backend.service;

import com.mara.backend.logic.DiscountCodeHandler;
import com.mara.backend.logic.LoyalClientBronzeHandler;
import com.mara.backend.logic.RegularPriceHandler;
import com.mara.backend.model.Client;
import com.mara.backend.model.dto.DiscountCodeDisplayDTO;
import com.mara.backend.model.dto.PricingDTO;
import org.junit.jupiter.api.BeforeEach;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

public class DiscountCodeHandlerTest {
    @Mock DiscountCodeService discountCodeService;
    @Mock LoyaltyPointService loyaltyPointService;

    DiscountCodeHandler discountHandler;
    LoyalClientBronzeHandler loyaltyHandler;
    RegularPriceHandler regularHandler;


    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        regularHandler = new RegularPriceHandler(null);
        loyaltyHandler = new LoyalClientBronzeHandler(regularHandler, loyaltyPointService);
        discountHandler = new DiscountCodeHandler(loyaltyHandler, discountCodeService);
    }

    @Test
    void testValidDiscount() {
        PricingDTO dto = new PricingDTO(200, "PROMO15", null);
        when(discountCodeService.getDiscountCodeIfValid("PROMO15")).thenReturn(Optional.of(new DiscountCodeDisplayDTO(UUID.randomUUID(),"PROMO15", LocalDateTime.now().plusDays(1))));

        double finalPrice = discountHandler.findFinalPrice(dto);
        assertEquals(200 * 0.85, finalPrice);
    }

    @Test
    void testExpiredDiscountFallsThroughToRegular() {
        Client dummy = new Client();
        dummy.setId(UUID.randomUUID());
        PricingDTO dto = new PricingDTO(100, "BAD10", dummy);


        when(discountCodeService.getDiscountCodeIfValid("BAD10")).thenReturn(Optional.empty());
        when(loyaltyPointService.getAllPointsForUser(dummy.getId())).thenReturn(0);


        assertEquals(100.0, discountHandler.findFinalPrice(dto));
    }

    @Test
    void testLoyaltyPointsDiscount() {
        Client dummy = new Client();
        dummy.setId(UUID.randomUUID());
        PricingDTO dto = new PricingDTO(100, null, dummy);


        when(loyaltyPointService.getAllPointsForUser(dummy.getId())).thenReturn(150);


        assertEquals(80.0, discountHandler.findFinalPrice(dto));
    }
}
