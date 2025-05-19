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

    @GetMapping("/salons")
    public List<SalonDisplayDTO> getSalons() {
        return salonService.getAllSalons();
    }

    @GetMapping("/salon/{name}")
    public SalonDisplayDTO getServiceByName(@PathVariable String name) throws NotExistentException {
        return salonService.getSalonByName(name);
    }

    @PostMapping("/salon")
    public SalonDisplayDTO addSalon(@Valid @RequestBody SalonCreateDTO salonDTO) throws DuplicateResourceException {
        return salonService.addNewSalon(salonDTO);
    }

    @PutMapping("/salon/{uuid}")
    public SalonDisplayDTO editSalon(@PathVariable UUID uuid, @Valid @RequestBody SalonCreateDTO salonDTO) throws DuplicateResourceException, NotExistentException {
        return salonService.editSalonInfo(uuid, salonDTO);
    }

    @DeleteMapping("/salon/{uuid}")
    public void deleteSalon(@PathVariable UUID uuid) {
        salonService.deleteSalon(uuid);
    }

    @PostMapping("/favorite_salon/{client_uuid}/{salon_uuid}")
    public SalonDisplayDTO addFavoriteSalon(@PathVariable UUID client_uuid, @PathVariable UUID salon_uuid) throws NotExistentException {
        return salonService.addFavoriteSalon(client_uuid, salon_uuid);
    }

    @DeleteMapping("/favorite_salon/{client_uuid}/{salon_uuid}")
    public SalonDisplayDTO removeFavoriteSalon(@PathVariable UUID client_uuid, @PathVariable UUID salon_uuid) throws NotExistentException {
        return salonService.removeFavoriteSalon(client_uuid, salon_uuid);
    }

    @GetMapping("/favorite_salon/{client_uuid}")
    public List<SalonDisplayDTO> getFavoriteSalonsForUser(@PathVariable UUID client_uuid) throws NotExistentException {
        return salonService.getFavoriteSalonsForClient(client_uuid);
    }
}
