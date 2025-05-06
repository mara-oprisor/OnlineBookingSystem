package com.mara.backend.model.dto;

import com.mara.backend.model.Client;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class PricingDTO {
    private int basePrice;
    private String discountCode;
    private Client client;
}
