package com.mara.backend.service;

import com.mara.backend.config.exception.DuplicateResourceException;
import com.mara.backend.config.exception.NotExistentException;
import com.mara.backend.model.Client;
import com.mara.backend.model.Salon;
import com.mara.backend.model.User;
import com.mara.backend.model.dto.SalonCreateDTO;
import com.mara.backend.model.dto.SalonDisplayDTO;
import com.mara.backend.repository.SalonRepository;
import com.mara.backend.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@AllArgsConstructor
public class SalonService {
    private final SalonRepository salonRepository;
    private final UserRepository userRepository;

    public List<SalonDisplayDTO> getAllSalons() {
        List<Salon> salons = salonRepository.findAll();
        List<SalonDisplayDTO> salonsDTO = new ArrayList<>();

        for(Salon salon: salons) {
            salonsDTO.add(SalonDisplayDTO.salonToDTO(salon));
        }

        return salonsDTO;
    }

    public SalonDisplayDTO getSalonByName(String name) throws NotExistentException {
        Salon salon = salonRepository.findByName(name).orElseThrow(
                () -> new NotExistentException("There is no salon with the name: " + name)
        );

        return SalonDisplayDTO.salonToDTO(salon);
    }

    public SalonDisplayDTO addNewSalon(SalonCreateDTO salonDTO) throws DuplicateResourceException {
        Salon salon = new Salon();

        if(salonRepository.existsByName(salonDTO.getName())) {
            throw new DuplicateResourceException("Salon name '" + salonDTO.getName() + "' already exists.");
        }

        if(salonRepository.existsByPhoneNumber(salonDTO.getPhoneNumber())) {
            throw new DuplicateResourceException("Phone number '" + salonDTO.getPhoneNumber() + "' already exists.");
        }

        salon.setName(salonDTO.getName());
        salon.setPhoneNumber(salonDTO.getPhoneNumber());

        return SalonDisplayDTO.salonToDTO(salonRepository.save(salon));
    }

    public SalonDisplayDTO editSalonInfo(UUID uuid, SalonCreateDTO salonDTO) throws DuplicateResourceException, NotExistentException {
        Salon existingSalon = salonRepository.findById(uuid).orElseThrow(
                () -> new NotExistentException("There is no user with such uuid!")
        );

        if(!salonDTO.getName().equals(existingSalon.getName()) && salonRepository.existsByName(salonDTO.getName())) {
            throw new DuplicateResourceException("Salon name '" + salonDTO.getName() + "' already exists.");
        }

        if(!salonDTO.getPhoneNumber().equals(existingSalon.getPhoneNumber()) && salonRepository.existsByPhoneNumber(salonDTO.getPhoneNumber())) {
            throw new DuplicateResourceException("Phone number '" + salonDTO.getName() + "' already exists.");
        }

        existingSalon.setName(salonDTO.getName());
        existingSalon.setPhoneNumber(salonDTO.getPhoneNumber());

        return SalonDisplayDTO.salonToDTO(salonRepository.save(existingSalon));
    }

    public void deleteSalon(UUID uuid) {
        salonRepository.deleteById(uuid);
    }

    public SalonDisplayDTO addFavoriteSalon(UUID clientUUID, UUID salonUUID) throws NotExistentException {
        User user = userRepository.findById(clientUUID).orElseThrow(
                () -> new NotExistentException("There is no user with uuid " + clientUUID)
        );

        if(!(user instanceof Client client)) {
            throw new IllegalStateException("The user with uuid " + clientUUID + " is not a client!");
        }

        Salon salon = salonRepository.findById(salonUUID).orElseThrow(
                () -> new NotExistentException("There is no salon with uuid " + salonUUID)
        );

        if(!salon.getFavoriteFor().contains(client)) {
            salon.getFavoriteFor().add(client);
        }

        return SalonDisplayDTO.salonToDTO(salonRepository.save(salon));
    }
}
