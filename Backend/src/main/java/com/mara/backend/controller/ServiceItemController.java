package com.mara.backend.controller;

import com.mara.backend.config.exception.NotExistentException;
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

    @GetMapping("/common/services")
    public List<ServiceItemDisplayDTO> getAllServices() {
        return serviceItemService.getAllServices();
    }

    @GetMapping("/common/services/{uuid}")
    public List<ServiceItemDisplayDTO> getServicesBySalon(@PathVariable UUID uuid) {
        return serviceItemService.getServicesBySalon(uuid);
    }

    @GetMapping("/common/service/{name}")
    public ServiceItemDisplayDTO getServiceByName(@PathVariable String name) throws NotExistentException {
        return serviceItemService.getServiceByName(name);
    }

    @PostMapping("/admin/add_service")
    public ServiceItemDisplayDTO addService(@Valid @RequestBody ServiceItemCreateDTO serviceDTO) throws NotExistentException {
        return serviceItemService.addService(serviceDTO);
    }

    @PutMapping("/admin/edit_service/{uuid}")
    public ServiceItemDisplayDTO updateService(@PathVariable UUID uuid, @Valid @RequestBody ServiceItemUpdateDTO serviceDTO) throws NotExistentException {
        return serviceItemService.editService(uuid, serviceDTO);
    }

    @DeleteMapping("/admin/delete_service/{uuid}")
    public void deleteService(@PathVariable UUID uuid) {
        serviceItemService.deleteService(uuid);
    }
}
