package com.mara.backend.service;

import com.mara.backend.model.Salon;
import com.mara.backend.model.ServiceItem;
import com.mara.backend.model.dto.ServiceItemCreateDTO;
import com.mara.backend.model.dto.ServiceItemDisplayDTO;
import com.mara.backend.model.dto.ServiceItemUpdateDTO;
import com.mara.backend.repository.SalonRepository;
import com.mara.backend.repository.ServiceItemRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@AllArgsConstructor
public class ServiceItemService {
    private final ServiceItemRepository serviceItemRepository;
    private final SalonRepository salonRepository;

    public List<ServiceItemDisplayDTO> getAllServices() {
        List<ServiceItem> services = serviceItemRepository.findAll();
        List<ServiceItemDisplayDTO> servicesDTO = new ArrayList<>();

        for (ServiceItem service: services) {
            servicesDTO.add(ServiceItemDisplayDTO.serviceToDTO(service));
        }

        return servicesDTO;
    }

    public List<ServiceItemDisplayDTO> getServicesBySalon(UUID salonUuid) {
        List<ServiceItem> items = serviceItemRepository.findBySalonUuid(salonUuid);
        List<ServiceItemDisplayDTO> displayList = new ArrayList<>();
        for (ServiceItem item : items) {
            displayList.add(ServiceItemDisplayDTO.serviceToDTO(item));
        }
        return displayList;
    }

    public ServiceItemDisplayDTO getServiceByName(String name) {
        ServiceItem service = serviceItemRepository.findServiceItemByName(name).orElseThrow(
                () -> new IllegalStateException("There is no service with name: " + name)
        );

        return ServiceItemDisplayDTO.serviceToDTO(service);
    }

    public ServiceItemDisplayDTO addService(ServiceItemCreateDTO serviceDTO) {
        Salon salon = salonRepository.findByName(serviceDTO.getSalonName()).orElseThrow(
                () -> new IllegalStateException("Salon with name " + serviceDTO.getSalonName() + " does not exist!")
        );

        ServiceItem serviceItem = new ServiceItem();
        serviceItem.setName(serviceDTO.getName());
        serviceItem.setDescription(serviceDTO.getDescription());
        serviceItem.setPrice(serviceDTO.getPrice());
        serviceItem.setSalon(salon);

        return ServiceItemDisplayDTO.serviceToDTO(serviceItemRepository.save(serviceItem));
    }

    public ServiceItemDisplayDTO editService(UUID uuid, ServiceItemUpdateDTO serviceDTO) {
        ServiceItem existingService = serviceItemRepository.findById(uuid).orElseThrow(
                () -> new IllegalStateException("Service with uuid " + uuid + " does not exist!")
        );

        existingService.setName(serviceDTO.getName());
        existingService.setPrice(serviceDTO.getPrice());
        existingService.setDescription(serviceDTO.getDescription());

        return ServiceItemDisplayDTO.serviceToDTO(serviceItemRepository.save(existingService));
    }

    public void deleteService(UUID uuid) {
        serviceItemRepository.deleteById(uuid);
    }
}
