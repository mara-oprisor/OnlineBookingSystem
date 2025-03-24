package com.mara.backend.controller;

import com.mara.backend.model.dto.ServiceItemCreateDTO;
import com.mara.backend.model.dto.ServiceItemDisplayDTO;
import com.mara.backend.model.dto.ServiceItemUpdateDTO;
import com.mara.backend.service.ServiceItemService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@AllArgsConstructor
@CrossOrigin
public class ServiceItemController {
    private ServiceItemService serviceItemService;

    @GetMapping("/services")
    public List<ServiceItemDisplayDTO> getAllServices() {
        return serviceItemService.getAllServices();
    }

    @GetMapping("/service/{name}")
    public ServiceItemDisplayDTO getServiceByName(@PathVariable String name) {
        return serviceItemService.getServiceByName(name);
    }

    @PostMapping("/add_service")
    public ServiceItemDisplayDTO addService(@Valid @RequestBody ServiceItemCreateDTO serviceDTO) {
        return serviceItemService.addService(serviceDTO);
    }

    @PutMapping("/edit_service/{uuid}")
    public ServiceItemDisplayDTO updateService(@PathVariable UUID uuid, @Valid @RequestBody ServiceItemUpdateDTO serviceDTO) {
        return serviceItemService.editService(uuid, serviceDTO);
    }

    @DeleteMapping("/delete_service/{uuid}")
    public void deleteService(@PathVariable UUID uuid) {
        serviceItemService.deleteService(uuid);
    }
}
