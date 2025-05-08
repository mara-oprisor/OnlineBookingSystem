package com.mara.backend.controller;

import com.mara.backend.config.exception.DuplicateResourceException;
import com.mara.backend.config.exception.NotExistentException;
import com.mara.backend.model.dto.SalonCreateDTO;
import com.mara.backend.model.dto.SalonDisplayDTO;
import com.mara.backend.service.SalonService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@AllArgsConstructor
@CrossOrigin
public class SalonController {
    private SalonService salonService;

    @GetMapping("/common/salons")
    public List<SalonDisplayDTO> getSalons() {
        return salonService.getAllSalons();
    }

    @GetMapping("/common/salon/{name}")
    public SalonDisplayDTO getServiceByName(@PathVariable String name) throws NotExistentException {
        return salonService.getSalonByName(name);
    }

    @PostMapping("/admin/add_salon")
    public SalonDisplayDTO addSalon(@Valid @RequestBody SalonCreateDTO salonDTO) throws DuplicateResourceException {
        return salonService.addNewSalon(salonDTO);
    }

    @PutMapping("/admin/edit_salon/{uuid}")
    public SalonDisplayDTO editSalon(@PathVariable UUID uuid, @Valid @RequestBody SalonCreateDTO salonDTO) throws DuplicateResourceException, NotExistentException {
        return salonService.editSalonInfo(uuid, salonDTO);
    }

    @DeleteMapping("/admin/delete_salon/{uuid}")
    public void deleteSalon(@PathVariable UUID uuid) {
        salonService.deleteSalon(uuid);
    }

    @PostMapping("/client/{client_uuid}/favorite_salon/{salon_uuid}")
    public SalonDisplayDTO addFavoriteSalon(@PathVariable UUID client_uuid, @PathVariable UUID salon_uuid) throws NotExistentException {
        return salonService.addFavoriteSalon(client_uuid, salon_uuid);
    }
}
