package com.mara.backend.model.dto;

import com.mara.backend.model.ServiceItem;
import lombok.Data;

import java.util.UUID;

@Data
public class ServiceItemDisplayDTO {
    private UUID uuid;
    private String name;
    private String description;
    private Integer price;
    private String salonName;

    public static ServiceItemDisplayDTO serviceToDTO(ServiceItem service) {
        ServiceItemDisplayDTO serviceDTO = new ServiceItemDisplayDTO();

        serviceDTO.setUuid(service.getUuid());
        serviceDTO.setName(service.getName());
        serviceDTO.setPrice(service.getPrice());
        serviceDTO.setDescription(service.getDescription());
        serviceDTO.setSalonName(service.getSalon().getName());

        return serviceDTO;
    }
}
