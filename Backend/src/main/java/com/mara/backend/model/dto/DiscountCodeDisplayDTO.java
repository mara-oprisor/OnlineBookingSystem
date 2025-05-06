package com.mara.backend.model.dto;

import com.mara.backend.model.DiscountCode;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DiscountCodeDisplayDTO {
    private UUID uuid;
    private String discountCode;
    private LocalDateTime expirationDate;

    public static DiscountCodeDisplayDTO discountToDTO(DiscountCode discountCode) {
        DiscountCodeDisplayDTO displayDTO = new DiscountCodeDisplayDTO();

        displayDTO.setUuid(discountCode.getUuid());
        displayDTO.setDiscountCode(discountCode.getCode());
        displayDTO.setExpirationDate(discountCode.getExpirationDate());

        return displayDTO;
    }
}
