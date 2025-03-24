package com.mara.backend.model.dto;

import com.mara.backend.model.Salon;
import lombok.Data;

import java.util.UUID;

@Data
public class SalonDisplayDTO {
    private UUID uuid;
    private String name;
    private String phoneNumber;

    public static SalonDisplayDTO salonToDTO(Salon salon) {
        SalonDisplayDTO salonDisplayDTO = new SalonDisplayDTO();

        salonDisplayDTO.setUuid(salon.getUuid());
        salonDisplayDTO.setName(salon.getName());
        salonDisplayDTO.setPhoneNumber(salon.getPhoneNumber());

        return salonDisplayDTO;
    }
}
