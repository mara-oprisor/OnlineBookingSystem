package com.mara.backend.model.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;


@Data
public class DiscountCodeCreateDTO {
    @NotNull(message = "Code is required!")
    private String code;

    @NotNull(message = "Discount is required!")
    private int discount;

    @NotNull(message = "Expiration date is required!")
    private String dateTime;
}
