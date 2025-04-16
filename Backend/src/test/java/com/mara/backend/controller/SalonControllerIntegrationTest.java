package com.mara.backend.controller;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mara.backend.model.Client;
import com.mara.backend.model.Salon;
import com.mara.backend.repository.SalonRepository;
import com.mara.backend.security.JWTUtil;
import org.hamcrest.Matchers;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@TestPropertySource(locations = "classpath:application-test.properties")
public class SalonControllerIntegrationTest {
    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private SalonRepository salonRepository;

    @Autowired
    private JWTUtil jwtUtil;

    private static final String FIXTURE_PATH = "src/test/resources/fixtures/salon/";
    private static final ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    void setUp() throws Exception {
        salonRepository.deleteAll();
        salonRepository.flush();
        seedDatabase();
    }

    private void seedDatabase() throws Exception {
        String seedDataJSON = loadFixture("salon_seed.json");
        List<Salon> salons = objectMapper.readValue(seedDataJSON, new TypeReference<List<Salon>>() {});
        salonRepository.saveAll(salons);
    }

    private String loadFixture(String fileName) throws IOException {
        return Files.readString(Paths.get(FIXTURE_PATH + fileName));
    }

    private String generateTestToken() {
        Client dummyUser = new Client();
        dummyUser.setId(UUID.randomUUID());
        dummyUser.setUsername("testUser");
        dummyUser.setEmail("testUser@example.com");

        return jwtUtil.createToken(dummyUser);
    }

    @Test
    void testGetSalons() throws Exception {
        mockMvc.perform(get("/salons")
                        .header("Authorization", "Bearer " + generateTestToken()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(3))
                .andExpect(jsonPath("$[*].name", Matchers.containsInAnyOrder("salon1", "salon2", "salon3")))
                .andExpect(jsonPath("$[*].phoneNumber", Matchers.containsInAnyOrder("0711111111", "0722222222", "0733333333")));
    }

    @Test
    void testAddSalonValid() throws Exception {
        String validSalonJson = loadFixture("valid_salon.json");

        mockMvc.perform(post("/add_salon")
                        .header("Authorization", "Bearer " + generateTestToken())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(validSalonJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.uuid").exists())
                .andExpect(jsonPath("$.name").value("salonNew"))
                .andExpect(jsonPath("$.phoneNumber").value("0777777777"));
    }

    @Test
    void testAddSalonInvalid() throws Exception {
        String invalidSalonJson = loadFixture("invalid_salon.json");

        mockMvc.perform(post("/add_salon")
                        .header("Authorization", "Bearer " + generateTestToken())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(invalidSalonJson))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.name").value("Name of the salon is required!"))
                .andExpect(jsonPath("$.phoneNumber").value("Please enter a valid phone number! It should start ith 07 and have exactly 10 digits"));
    }

    @Test
    void testAddSalonDuplicate() throws Exception {
        String invalidSalonJson = loadFixture("duplicate_salon.json");

        mockMvc.perform(post("/add_salon")
                        .header("Authorization", "Bearer " + generateTestToken())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(invalidSalonJson))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Salon name 'salon1' already exists."));
    }

    @Test
    void testUpdateSalonValid() throws Exception {
        String validSalonJson = loadFixture("valid_salon.json");
        Salon existingSalon = salonRepository.findByName("salon1").orElseThrow(
                () -> new RuntimeException("Salon not found")
        );

        mockMvc.perform(put("/edit_salon/{uuid}", existingSalon.getUuid())
                        .header("Authorization", "Bearer " + generateTestToken())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(validSalonJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("salonNew"))
                .andExpect(jsonPath("$.phoneNumber").value("0777777777"));
    }

    @Test
    void testUpdateSalonInvalid() throws Exception {
        String invalidSalonJson = loadFixture("invalid_salon.json");
        Salon existingSalon = salonRepository.findByName("salon1").orElseThrow(
                () -> new RuntimeException("Salon not found")
        );


        mockMvc.perform(put("/edit_salon/{uuid}", existingSalon.getUuid())
                        .header("Authorization", "Bearer " + generateTestToken())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(invalidSalonJson))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.name").value("Name of the salon is required!"))
                .andExpect(jsonPath("$.phoneNumber").value("Please enter a valid phone number! It should start ith 07 and have exactly 10 digits"));
    }

    @Test
    void testUpdateSalonDuplicate() throws Exception {
        String invalidSalonJson = loadFixture("duplicate_salon.json");
        Salon existingSalon = salonRepository.findByName("salon3").orElseThrow(
                () -> new RuntimeException("Salon not found")
        );


        mockMvc.perform(put("/edit_salon/{uuid}", existingSalon.getUuid())
                        .header("Authorization", "Bearer " + generateTestToken())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(invalidSalonJson))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Salon name 'salon1' already exists."));
    }

    @Test
    void testDeleteSalon() throws Exception {
        Salon existingSalon = salonRepository.findByName("salon3").orElseThrow(
                () -> new RuntimeException("Salon not found")
        );

        mockMvc.perform(delete("/delete_salon/{uuid}", existingSalon.getUuid())
                        .header("Authorization", "Bearer " + generateTestToken()))
                .andExpect(status().isOk());
    }

    @AfterEach
    void cleanDatabase() {
        salonRepository.deleteAll();
        salonRepository.flush();
    }
}
