package com.mara.backend.controller;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.mara.backend.model.Client;
import com.mara.backend.model.ServiceItem;
import com.mara.backend.model.dto.BookingDisplayDTO;
import com.mara.backend.repository.*;
import com.mara.backend.util.security.JWTUtil;
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
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@TestPropertySource(locations = "classpath:application-test.properties")
public class BookingControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private JWTUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ServiceItemRepository serviceItemRepository;
    @Autowired
    private BookingRepository bookingRepository;
    @Autowired
    private DiscountCodeRepository discountCodeRepository;
    @Autowired
    private LoyaltyPointRepository loyaltyPointRepository;
    @Autowired
    private SalonRepository salonRepository;

    private static final ObjectMapper objectMapper = new ObjectMapper().registerModule(new JavaTimeModule());

    private static final String USER_FIXTURE_PATH = "src/test/resources/fixtures/user/";
    private static final String SERVICE_FIXTURE_PATH = "src/test/resources/fixtures/service/";
    private static final String BOOKING_FIXTURE_PATH = "src/test/resources/fixtures/booking/";

    @BeforeEach
    void setUp() throws Exception {
        bookingRepository.deleteAll();
        bookingRepository.flush();

        loyaltyPointRepository.deleteAll();
        loyaltyPointRepository.flush();

        userRepository.deleteAll();
        userRepository.flush();

        serviceItemRepository.deleteAll();
        serviceItemRepository.flush();

        salonRepository.deleteAll();
        salonRepository.flush();

        seedUsers();
        seedServices();
    }

    private void seedUsers() throws IOException {
        String userSeedJson = Files.readString(Paths.get(USER_FIXTURE_PATH + "client_seed.json"));
        List<Client> clients = objectMapper.readValue(userSeedJson, new TypeReference<List<Client>>() {});
        userRepository.saveAll(clients);
    }

    private void seedServices() throws IOException {
        String serviceSeedJson = Files.readString(Paths.get(SERVICE_FIXTURE_PATH + "service_seed.json"));
        List<ServiceItem> services = objectMapper.readValue(serviceSeedJson, new TypeReference<List<ServiceItem>>() {});
        for (ServiceItem service : services) {
            if (service.getSalon() != null) {
                service.setSalon(salonRepository.save(service.getSalon()));
            }
        }
        serviceItemRepository.saveAll(services);
    }

    private String loadBookingFixture(String fileName) throws IOException {
        return Files.readString(Paths.get(BOOKING_FIXTURE_PATH + fileName));
    }

    private String generateTestToken() {
        Client dummyUser = new Client();
        dummyUser.setId(UUID.randomUUID());
        dummyUser.setUsername("testUser");
        dummyUser.setEmail("testUser@example.com");

        return jwtUtil.createToken(dummyUser);
    }

    @Test
    void testGetBookings() throws Exception {
        Client persistedClient = (Client) userRepository.findByUsername("client1")
                .orElseThrow(() -> new RuntimeException("Client not found"));
        ServiceItem persistedService = serviceItemRepository.findServiceItemByName("Service A")
                .orElseThrow(() -> new RuntimeException("Service item not found"));

        String validBookingJson = loadBookingFixture("valid_booking.json");
        validBookingJson = validBookingJson.replace("PLACEHOLDER_CLIENT_ID", persistedClient.getId().toString());
        validBookingJson = validBookingJson.replace("PLACEHOLDER_SERVICE_ID", persistedService.getUuid().toString());

        mockMvc.perform(post("/booking")
                        .header("Authorization", "Bearer " + generateTestToken())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(validBookingJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.bookingId").exists());

        mockMvc.perform(get("/bookings")
                        .header("Authorization", "Bearer " + generateTestToken()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()", Matchers.equalTo(1)))
                .andExpect(jsonPath("$[0].bookingId", Matchers.notNullValue()));
    }


    @Test
    void testCreateBookingValid() throws Exception {
        Client persistedClient = (Client) userRepository.findByUsername("client1")
                .orElseThrow(() -> new RuntimeException("Client not found"));
        ServiceItem persistedService = serviceItemRepository.findServiceItemByName("Service A")
                .orElseThrow(() -> new RuntimeException("Service item not found"));

        String validBookingJson = loadBookingFixture("valid_booking.json");
        validBookingJson = validBookingJson.replace("PLACEHOLDER_CLIENT_ID", persistedClient.getId().toString());
        validBookingJson = validBookingJson.replace("PLACEHOLDER_SERVICE_ID", persistedService.getUuid().toString());

        mockMvc.perform(post("/booking")
                        .header("Authorization", "Bearer " + generateTestToken())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(validBookingJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.bookingId").exists())
                .andExpect(jsonPath("$.clientId").value(persistedClient.getId().toString()))
                .andExpect(jsonPath("$.serviceId").value(persistedService.getUuid().toString()))
                .andExpect(jsonPath("$.dateTime").value("2025-06-15T14:30:00"))
                .andExpect(jsonPath("$.finalPrice").value(100.0));
    }

    @Test
    void testCreateBookingWithDiscount() throws Exception {
        com.mara.backend.model.DiscountCode discountCode = new com.mara.backend.model.DiscountCode();
        discountCode.setCode("DISC10");
        discountCode.setExpirationDate(LocalDateTime.now().plusDays(5));
        discountCodeRepository.save(discountCode);

        Client persistedClient = (Client) userRepository.findByUsername("client1")
                .orElseThrow(() -> new RuntimeException("Client not found"));
        ServiceItem persistedService = serviceItemRepository.findServiceItemByName("Service A")
                .orElseThrow(() -> new RuntimeException("Service item not found"));

        String discountBookingJson = loadBookingFixture("booking_with_discount.json");
        discountBookingJson = discountBookingJson.replace("PLACEHOLDER_CLIENT_ID", persistedClient.getId().toString());
        discountBookingJson = discountBookingJson.replace("PLACEHOLDER_SERVICE_ID", persistedService.getUuid().toString());

        mockMvc.perform(post("/booking")
                        .header("Authorization", "Bearer " + generateTestToken())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(discountBookingJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.finalPrice").value(90.0));
    }


    @Test
    void testEditBooking() throws Exception {
        Client persistedClient = (Client) userRepository.findByUsername("client1")
                .orElseThrow(() -> new RuntimeException("Client not found"));
        ServiceItem persistedService = serviceItemRepository.findServiceItemByName("Service A")
                .orElseThrow(() -> new RuntimeException("Service item not found"));
        String validBookingJson = loadBookingFixture("valid_booking.json");
        validBookingJson = validBookingJson.replace("PLACEHOLDER_CLIENT_ID", persistedClient.getId().toString());
        validBookingJson = validBookingJson.replace("PLACEHOLDER_SERVICE_ID", persistedService.getUuid().toString());

        String createResponse = mockMvc.perform(post("/booking")
                        .header("Authorization", "Bearer " + generateTestToken())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(validBookingJson))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();
        BookingDisplayDTO createdBooking = objectMapper.readValue(createResponse, BookingDisplayDTO.class);
        UUID bookingId = createdBooking.getBookingId();

        String newDateTime = "2025-12-31T10:00:00";
        mockMvc.perform(put("/booking/{uuid}", bookingId)
                        .header("Authorization", "Bearer " + generateTestToken())
                        .contentType(MediaType.TEXT_PLAIN)
                        .content(newDateTime))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.dateTime").value(newDateTime));
    }


    @Test
    void testDeleteBooking() throws Exception {
        Client persistedClient = (Client) userRepository.findByUsername("client1")
                .orElseThrow(() -> new RuntimeException("Client not found"));
        ServiceItem persistedService = serviceItemRepository.findServiceItemByName("Service A")
                .orElseThrow(() -> new RuntimeException("Service item not found"));
        String validBookingJson = loadBookingFixture("valid_booking.json");
        validBookingJson = validBookingJson.replace("PLACEHOLDER_CLIENT_ID", persistedClient.getId().toString());
        validBookingJson = validBookingJson.replace("PLACEHOLDER_SERVICE_ID", persistedService.getUuid().toString());

        String createResponse = mockMvc.perform(post("/booking")
                        .header("Authorization", "Bearer " + generateTestToken())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(validBookingJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.bookingId").exists())
                .andReturn().getResponse().getContentAsString();

        BookingDisplayDTO createdBooking = objectMapper.readValue(createResponse, BookingDisplayDTO.class);
        UUID bookingId = createdBooking.getBookingId();

        mockMvc.perform(delete("/booking/{uuid}", bookingId)
                        .header("Authorization", "Bearer " + generateTestToken()))
                .andExpect(status().isOk());
    }

    @AfterEach
    void cleanDatabase() {
        bookingRepository.deleteAll();
        bookingRepository.flush();

        loyaltyPointRepository.deleteAll();
        loyaltyPointRepository.flush();

        userRepository.deleteAll();
        userRepository.flush();

        serviceItemRepository.deleteAll();
        serviceItemRepository.flush();

        salonRepository.deleteAll();
        salonRepository.flush();
    }
}
