package com.mara.backend.service;

import com.mara.backend.model.Salon;
import com.mara.backend.model.ServiceItem;
import com.mara.backend.model.dto.SalonCreateDTO;
import com.mara.backend.model.dto.ServiceItemCreateDTO;
import com.mara.backend.model.dto.ServiceItemDisplayDTO;
import com.mara.backend.model.dto.ServiceItemUpdateDTO;
import com.mara.backend.repository.SalonRepository;
import com.mara.backend.repository.ServiceItemRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.*;

public class ServiceItemServiceTest {
    @Mock
    private ServiceItemRepository serviceItemRepository;
    @Mock
    private SalonRepository salonRepository;

    @InjectMocks
    private ServiceItemService serviceItemService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetServices() {
        Salon salon = new Salon();
        salon.setName("Salon 1");

        ServiceItem service1 = new ServiceItem();
        service1.setUuid(UUID.randomUUID());
        service1.setName("Service One");
        service1.setPrice(100);
        service1.setDescription("Description One");
        service1.setSalon(salon);

        ServiceItem service2 = new ServiceItem();
        service2.setUuid(UUID.randomUUID());
        service2.setName("Service Two");
        service2.setPrice(150);
        service2.setDescription("Description Two");
        service2.setSalon(salon);

        List<ServiceItem> services = List.of(service1, service2);
        List<ServiceItemDisplayDTO> servicesDTO = new ArrayList<>();
        for(ServiceItem service: services) {
            servicesDTO.add(ServiceItemDisplayDTO.serviceToDTO(service));
        }

        when(serviceItemRepository.findAll()).thenReturn(services);
        List<ServiceItemDisplayDTO> result = serviceItemService.getAllServices();


        assertEquals(2, result.size());
        assertEquals(servicesDTO, result);
        verify(serviceItemRepository, times(1)).findAll();
    }

    @Test
    void testAddService() {
        ServiceItemCreateDTO serviceItemDto = new ServiceItemCreateDTO("service", "description", 10, "salon1");

        ServiceItem savedService = new ServiceItem();
        savedService.setUuid(UUID.randomUUID());
        savedService.setName(serviceItemDto.getName());
        savedService.setPrice(serviceItemDto.getPrice());
        savedService.setDescription(serviceItemDto.getDescription());
        Salon salon = new Salon();
        savedService.setSalon(salon);


        when(salonRepository.findByName(serviceItemDto.getSalonName())).thenReturn(Optional.of(salon));
        when(serviceItemRepository.save((any(ServiceItem.class)))).thenReturn(savedService);
        ServiceItemDisplayDTO result = serviceItemService.addService(serviceItemDto);


        assertEquals(ServiceItemDisplayDTO.serviceToDTO(savedService), result);
        assertNotNull(result.getUuid());

    }

    @Test
    void testEditService() {
        UUID serviceId = UUID.randomUUID();
        ServiceItem existingService = new ServiceItem();
        existingService.setUuid(serviceId);
        existingService.setName("Old Service");
        existingService.setDescription("Old Description");
        existingService.setPrice(20);
        existingService.setSalon(new Salon());

        ServiceItemUpdateDTO updateDto = new ServiceItemUpdateDTO("New Service", "New Description", 30);

        ServiceItem updatedService = new ServiceItem();
        updatedService.setUuid(serviceId);
        updatedService.setName(updateDto.getName());
        updatedService.setDescription(updateDto.getDescription());
        updatedService.setPrice(updateDto.getPrice());
        updatedService.setSalon(new Salon());


        when(serviceItemRepository.findById(serviceId)).thenReturn(Optional.of(existingService));
        when(serviceItemRepository.save(any(ServiceItem.class))).thenReturn(updatedService);
        ServiceItemDisplayDTO result = serviceItemService.editService(serviceId, updateDto);


        assertEquals("New Service", result.getName());
        assertEquals("New Description", result.getDescription());
        assertEquals(30, result.getPrice());
        assertEquals(serviceId, result.getUuid());
        verify(serviceItemRepository, times(1)).findById(serviceId);
        verify(serviceItemRepository, times(1)).save(existingService);
    }

    @Test
    void testDeleteService() {
        UUID serviceId = UUID.randomUUID();


        serviceItemService.deleteService(serviceId);


        verify(serviceItemRepository, times(1)).deleteById(serviceId);
    }
}
