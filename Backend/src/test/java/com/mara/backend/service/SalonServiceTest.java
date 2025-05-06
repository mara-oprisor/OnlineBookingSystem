package com.mara.backend.service;

import com.mara.backend.config.exception.DuplicateResourceException;
import com.mara.backend.config.exception.NotExistentException;
import com.mara.backend.model.Salon;
import com.mara.backend.model.dto.SalonCreateDTO;
import com.mara.backend.model.dto.SalonDisplayDTO;
import com.mara.backend.repository.SalonRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
import static org.postgresql.hostchooser.HostRequirement.any;

public class SalonServiceTest {
    @Mock
    private SalonRepository salonRepository;

    @InjectMocks
    private SalonService salonService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetSalons() {
        List<Salon> salons = List.of(new Salon(), new Salon());
        List<SalonDisplayDTO> salonsDTO = new ArrayList<>();
        for(Salon salon: salons) {
            salonsDTO.add(SalonDisplayDTO.salonToDTO(salon));
        }


        when(salonRepository.findAll()).thenReturn(salons);
        List<SalonDisplayDTO> result = salonService.getAllSalons();


        assertEquals(2, result.size());
        assertEquals(salonsDTO, result);
        verify(salonRepository, times(1)).findAll();
    }

    @Test
    void testAddSalon() throws DuplicateResourceException {
        SalonCreateDTO salonDTO = new SalonCreateDTO("salon", "077777777777");

        Salon savedSalon = new Salon();
        savedSalon.setUuid(UUID.randomUUID());
        savedSalon.setName(salonDTO.getName());
        savedSalon.setPhoneNumber(salonDTO.getPhoneNumber());


        when(salonRepository.save(any(Salon.class))).thenReturn(savedSalon);
        SalonDisplayDTO result = salonService.addNewSalon(salonDTO);


        assertEquals(SalonDisplayDTO.salonToDTO(savedSalon), result);
        assertNotNull(result.getUuid());
        verify(salonRepository, times(1)).save(any());
    }

    @Test
    void testAddSalonDuplicateName() {
        SalonCreateDTO salonDTO = new SalonCreateDTO("salon", "077777777777");


        when(salonRepository.existsByName(salonDTO.getName())).thenReturn(true);


        assertThrows(DuplicateResourceException.class, () -> salonService.addNewSalon(salonDTO));
        verify(salonRepository, times(1)).existsByName(salonDTO.getName());
    }

    @Test
    void testUpdateSalon() throws DuplicateResourceException, NotExistentException {
        UUID uuid = UUID.randomUUID();
        Salon existingSalon = new Salon();
        existingSalon.setName("salon");
        existingSalon.setPhoneNumber("0777777777");

        SalonCreateDTO salonDTO = new SalonCreateDTO("salonNew", "077777777777");

        Salon updatedSalon = new Salon();
        updatedSalon.setUuid(uuid);
        updatedSalon.setName(salonDTO.getName());
        updatedSalon.setPhoneNumber(salonDTO.getPhoneNumber());


        when(salonRepository.findById(uuid)).thenReturn(Optional.of(existingSalon));
        when(salonRepository.save(any())).thenReturn(updatedSalon);
        SalonDisplayDTO result = salonService.editSalonInfo(uuid, salonDTO);


        assertEquals("salonNew", result.getName());
        verify(salonRepository, times(1)).save(any());
        verify(salonRepository, times(1)).findById(uuid);
    }

    @Test
    void testUpdateSalonDuplicateName() {
        UUID uuid = UUID.randomUUID();
        SalonCreateDTO salonDTO = new SalonCreateDTO("salon", "077777777777");


        when(salonRepository.findById(uuid)).thenReturn(Optional.of(new Salon()));
        when(salonRepository.existsByName(salonDTO.getName())).thenReturn(true);


        assertThrows(DuplicateResourceException.class, () -> salonService.editSalonInfo(uuid, salonDTO));
        verify(salonRepository, times(1)).findById(uuid);
    }

    @Test
    void testUpdateSalonNotFound() {
        UUID uuid = UUID.randomUUID();
        SalonCreateDTO salonDTO = new SalonCreateDTO();

        when(salonRepository.findById(uuid)).thenReturn(Optional.empty());


        assertThrows(NotExistentException.class, () -> salonService.editSalonInfo(uuid, salonDTO));
    }

    @Test
    void deleteSalon() {
        UUID uuid = UUID.randomUUID();


        doNothing().when(salonRepository).deleteById(uuid);
        salonService.deleteSalon(uuid);


        verify(salonRepository, times(1)).deleteById(uuid);
    }
}
