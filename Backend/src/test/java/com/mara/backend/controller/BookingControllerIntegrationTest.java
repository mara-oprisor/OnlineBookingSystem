package com.mara.backend.controller;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.mara.backend.model.Client;
import com.mara.backend.model.ServiceItem;
import com.mara.backend.model.dto.BookingDisplayDTO;
import com.mara.backend.repository.BookingRepository;
import com.mara.backend.repository.ServiceItemRepository;
import com.mara.backend.repository.UserRepository;
import com.mara.backend.repository.DiscountCodeRepository;
import com.mara.backend.repository.LoyaltyPointRepository;
import org.hamcrest.Matchers;
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
    private UserRepository userRepository;

    @Autowired
    private ServiceItemRepository serviceItemRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private DiscountCodeRepository discountCodeRepository;

    // Inject LoyaltyPointRepository so that we can clear loyalty points
    @Autowired
    private LoyaltyPointRepository loyaltyPointRepository;

    // Also, your SalonRepository is used for seeding.
    @Autowired
    private com.mara.backend.repository.SalonRepository salonRepository;

    // Use an ObjectMapper configured with JavaTimeModule for LocalDateTime handling.
    private static final ObjectMapper objectMapper = new ObjectMapper().registerModule(new JavaTimeModule());

    // Paths for fixture files.
    private static final String USER_FIXTURE_PATH = "src/test/resources/fixtures/user/";
    private static final String SERVICE_FIXTURE_PATH = "src/test/resources/fixtures/service/";
    private static final String BOOKING_FIXTURE_PATH = "src/test/resources/fixtures/booking/";

    @BeforeEach
    void setUp() throws Exception {
        // Clear all relevant tables, including loyalty points.
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

    /**
     * Seed Users using the working user seed file.
     */
    private void seedUsers() throws IOException {
        String userSeedJson = Files.readString(Paths.get(USER_FIXTURE_PATH + "client_seed.json"));
        // Assume client_seed.json contains an array of Client objects.
        List<Client> clients = objectMapper.readValue(userSeedJson, new TypeReference<List<Client>>() {});
        userRepository.saveAll(clients);
    }

    /**
     * Seed ServiceItems using the working service seed file.
     */
    private void seedServices() throws IOException {
        String serviceSeedJson = Files.readString(Paths.get(SERVICE_FIXTURE_PATH + "service_seed.json"));
        List<ServiceItem> services = objectMapper.readValue(serviceSeedJson, new TypeReference<List<ServiceItem>>() {});
        for (ServiceItem service : services) {
            if (service.getSalon() != null) {
                // Persist the Salon if necessary.
                service.setSalon(salonRepository.save(service.getSalon()));
            }
        }
        serviceItemRepository.saveAll(services);
    }

    /**
     * Loads a fixture file from the booking fixtures directory.
     */
    private String loadBookingFixture(String fileName) throws IOException {
        return Files.readString(Paths.get(BOOKING_FIXTURE_PATH + fileName));
    }

    @Test
    void testGetBookings() throws Exception {
        // Retrieve the persisted master data.
        Client persistedClient = (Client) userRepository.findByUsername("client1")
                .orElseThrow(() -> new RuntimeException("Client not found"));
        ServiceItem persistedService = serviceItemRepository.findServiceItemByName("Service A")
                .orElseThrow(() -> new RuntimeException("Service item not found"));

        // Load the valid booking JSON fixture and replace the placeholders.
        String validBookingJson = loadBookingFixture("valid_booking.json");
        validBookingJson = validBookingJson.replace("PLACEHOLDER_CLIENT_ID", persistedClient.getId().toString());
        validBookingJson = validBookingJson.replace("PLACEHOLDER_SERVICE_ID", persistedService.getUuid().toString());

        // First, create a booking so that GET /bookings returns at least one record.
        mockMvc.perform(post("/booking")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(validBookingJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.bookingId").exists());

        // Retrieve the list of bookings and check that the response contains at least one booking.
        mockMvc.perform(get("/bookings"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()", Matchers.greaterThanOrEqualTo(1)))
                .andExpect(jsonPath("$[0].bookingId", Matchers.notNullValue()));
    }


    @Test
    void testCreateBookingValid() throws Exception {
        // Retrieve persisted master data.
        Client persistedClient = (Client) userRepository.findByUsername("client1")
                .orElseThrow(() -> new RuntimeException("Client not found"));
        ServiceItem persistedService = serviceItemRepository.findServiceItemByName("Service A")
                .orElseThrow(() -> new RuntimeException("Service item not found"));

        String validBookingJson = loadBookingFixture("valid_booking.json");
        validBookingJson = validBookingJson.replace("PLACEHOLDER_CLIENT_ID", persistedClient.getId().toString());
        validBookingJson = validBookingJson.replace("PLACEHOLDER_SERVICE_ID", persistedService.getUuid().toString());

        mockMvc.perform(post("/booking")
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
        // Persist a valid discount code.
        com.mara.backend.model.DiscountCode discountCode = new com.mara.backend.model.DiscountCode();
        discountCode.setCode("DISC10");
        discountCode.setExpirationDate(LocalDateTime.now().plusDays(5));
        discountCodeRepository.save(discountCode);

        Client persistedClient = (Client) userRepository.findByUsername("client1")
                .orElseThrow(() -> new RuntimeException("Client not found"));
        ServiceItem persistedService = serviceItemRepository.findServiceItemByName("Service A")
                .orElseThrow(() -> new RuntimeException("Service item not found"));

        String discountBookingJson = loadBookingFixture("booking_with_discount.json");
        // Replace placeholders with actual IDs.
        discountBookingJson = discountBookingJson.replace("PLACEHOLDER_CLIENT_ID", persistedClient.getId().toString());
        discountBookingJson = discountBookingJson.replace("PLACEHOLDER_SERVICE_ID", persistedService.getUuid().toString());

        mockMvc.perform(post("/booking")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(discountBookingJson))
                .andExpect(status().isOk())
                // Assuming DISC10 applies a 10% discount on a base price of 100,
                // the final price should be 90.
                .andExpect(jsonPath("$.finalPrice").value(90.0));
    }


    @Test
    void testCreateBookingWithExpiredDiscount() throws Exception {
        // Ensure no discount code exists in the table.
        discountCodeRepository.deleteAll();
        discountCodeRepository.flush();

        // Persist an expired discount code.
        com.mara.backend.model.DiscountCode discountCode = new com.mara.backend.model.DiscountCode();
        discountCode.setCode("DISC10");
        discountCode.setExpirationDate(LocalDateTime.now().minusDays(1));
        discountCodeRepository.save(discountCode);

        Client persistedClient = (Client) userRepository.findByUsername("client1")
                .orElseThrow(() -> new RuntimeException("Client not found"));
        ServiceItem persistedService = serviceItemRepository.findServiceItemByName("Service A")
                .orElseThrow(() -> new RuntimeException("Service item not found"));

        String expiredDiscountJson = loadBookingFixture("expired_discount_booking.json");
        expiredDiscountJson = expiredDiscountJson.replace("PLACEHOLDER_CLIENT_ID", persistedClient.getId().toString());
        expiredDiscountJson = expiredDiscountJson.replace("PLACEHOLDER_SERVICE_ID", persistedService.getUuid().toString());

        mockMvc.perform(post("/booking")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(expiredDiscountJson))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Discount code is expired!"));
    }


    @Test
    void testEditBooking() throws Exception {
        // Create a booking first.
        Client persistedClient = (Client) userRepository.findByUsername("client1")
                .orElseThrow(() -> new RuntimeException("Client not found"));
        ServiceItem persistedService = serviceItemRepository.findServiceItemByName("Service A")
                .orElseThrow(() -> new RuntimeException("Service item not found"));
        String validBookingJson = loadBookingFixture("valid_booking.json");
        validBookingJson = validBookingJson.replace("PLACEHOLDER_CLIENT_ID", persistedClient.getId().toString());
        validBookingJson = validBookingJson.replace("PLACEHOLDER_SERVICE_ID", persistedService.getUuid().toString());

        String createResponse = mockMvc.perform(post("/booking")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(validBookingJson))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();
        BookingDisplayDTO createdBooking = objectMapper.readValue(createResponse, BookingDisplayDTO.class);
        UUID bookingId = createdBooking.getBookingId();

        // Now update the booking's date.
        String newDateTime = "2025-12-31T10:00:00";
        // Send the newDateTime as plain text using MediaType.TEXT_PLAIN.
        mockMvc.perform(put("/booking/{uuid}", bookingId)
                        .contentType(MediaType.TEXT_PLAIN)
                        .content(newDateTime))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.dateTime").value(newDateTime));
    }


    @Test
    void testDeleteBooking() throws Exception {
        // Create a booking first.
        Client persistedClient = (Client) userRepository.findByUsername("client1")
                .orElseThrow(() -> new RuntimeException("Client not found"));
        ServiceItem persistedService = serviceItemRepository.findServiceItemByName("Service A")
                .orElseThrow(() -> new RuntimeException("Service item not found"));
        String validBookingJson = loadBookingFixture("valid_booking.json");
        validBookingJson = validBookingJson.replace("PLACEHOLDER_CLIENT_ID", persistedClient.getId().toString());
        validBookingJson = validBookingJson.replace("PLACEHOLDER_SERVICE_ID", persistedService.getUuid().toString());

        String createResponse = mockMvc.perform(post("/booking")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(validBookingJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.bookingId").exists())
                .andReturn().getResponse().getContentAsString();

        BookingDisplayDTO createdBooking = objectMapper.readValue(createResponse, BookingDisplayDTO.class);
        UUID bookingId = createdBooking.getBookingId();

        // Delete the newly created booking.
        mockMvc.perform(delete("/booking/{uuid}", bookingId))
                .andExpect(status().isOk());
    }


}
