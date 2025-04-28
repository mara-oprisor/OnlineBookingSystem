package com.mara.backend.controller;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mara.backend.model.Client;
import com.mara.backend.model.User;
import com.mara.backend.repository.UserRepository;
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
import java.util.List;
import java.util.UUID;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@TestPropertySource(locations = "classpath:application-test.properties")
public class UserControllerIntegrationTest {
    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JWTUtil jwtUtil;

    private static final String FIXTURE_PATH = "src/test/resources/fixtures/user/";
    private static final ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    void setUp() throws Exception {
        userRepository.deleteAll();
        userRepository.flush();
        seedDatabase();
    }

    private void seedDatabase() throws Exception {
        String seedDataJSON = loadFixture("user_seed.json");
        List<User> users = objectMapper.readValue(seedDataJSON, new TypeReference<List<User>>() {});
        userRepository.saveAll(users);
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
    void testGetUsers() throws Exception {
        mockMvc.perform(get("/users")
                        .header("Authorization", "Bearer " + generateTestToken()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(3))
                .andExpect(jsonPath("$[*].username", Matchers.containsInAnyOrder("client1", "admin1", "client2")))
                .andExpect(jsonPath("$[*].email", Matchers.containsInAnyOrder("client1@example.com", "admin1@example.com", "client2@example.com")))
                .andExpect(jsonPath("$[*].userType", Matchers.containsInAnyOrder("CLIENT", "ADMIN", "CLIENT")));
    }

    @Test
    void testFilterUsersByUsername() throws Exception {
        String filterJson = "{\"username\": \"client\", \"email\": \"\", \"userType\": \"\"}";
        mockMvc.perform(post("/user_filter")
                        .header("Authorization", "Bearer " + generateTestToken())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(filterJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[*].username", Matchers.containsInAnyOrder("client1", "client2")));
    }

    @Test
    void testFilterUsersByEmail() throws Exception {
        String filterJson = "{\"username\": \"\", \"email\": \"admin1@example.com\", \"userType\": \"\"}";
        mockMvc.perform(post("/user_filter")
                        .header("Authorization", "Bearer " + generateTestToken())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(filterJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].email").value("admin1@example.com"));
    }

    @Test
    void testFilterUsersByUserType() throws Exception {
        String filterJson = "{\"username\": \"\", \"email\": \"\", \"userType\": \"CLIENT\"}";
        mockMvc.perform(post("/user_filter")
                        .header("Authorization", "Bearer " + generateTestToken())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(filterJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[*].userType", Matchers.everyItem(Matchers.equalTo("CLIENT"))));
    }

    @Test
    void testFilterUsersByMultipleCriteria() throws Exception {
        String filterJson = "{\"username\": \"client\", \"email\": \"example\", \"userType\": \"\"}";
        mockMvc.perform(post("/user_filter")
                        .header("Authorization", "Bearer " + generateTestToken())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(filterJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[*].username", Matchers.containsInAnyOrder("client1", "client2")))
                .andExpect(jsonPath("$[*].email", Matchers.containsInAnyOrder("client1@example.com", "client2@example.com")));
    }

    @Test
    void testAddClientValid() throws Exception {
        String validClientJson = loadFixture("valid_client.json");

        mockMvc.perform(post("/add_user")
                        .header("Authorization", "Bearer " + generateTestToken())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(validClientJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.uuid").exists())
                .andExpect(jsonPath("$.username").value("clientNew"))
                .andExpect(jsonPath("$.email").value("clientNew@example.com"))
                .andExpect(jsonPath("$.userType").value("CLIENT"))
                .andExpect(jsonPath("$.name").value("Client New"));
    }

    @Test
    void testAddAdminValid() throws Exception {
        String validClientJson = loadFixture("valid_admin.json");

        mockMvc.perform(post("/add_user")
                        .header("Authorization", "Bearer " + generateTestToken())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(validClientJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.uuid").exists())
                .andExpect(jsonPath("$.username").value("adminNew"))
                .andExpect(jsonPath("$.email").value("adminNew@example.com"))
                .andExpect(jsonPath("$.userType").value("ADMIN"));
    }

    @Test
    void testAddUserInvalid() throws Exception {
        String invalidClientJson = loadFixture("invalid_user.json");

        mockMvc.perform(post("/add_user")
                        .header("Authorization", "Bearer " + generateTestToken())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(invalidClientJson))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.password").value("Password should be longer than 8 characters"))
                .andExpect(jsonPath("$.email").value( "Email is required!"));
    }

    @Test
    void testAddUserDuplicateInfo() throws Exception {
        String invalidClientJson = loadFixture("duplicate_data_user.json");

        mockMvc.perform(post("/add_user")
                        .header("Authorization", "Bearer " + generateTestToken())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(invalidClientJson))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Username 'client1' already exists."));
    }

    @Test
    void testUpdateUserValid() throws Exception {
        String validClientJson = loadFixture("valid_client.json");
        User existingUser = userRepository.findByUsername("client1").orElseThrow(
                () -> new RuntimeException("User not found")
        );

        mockMvc.perform(put("/edit_user/{uuid}", existingUser.getId())
                        .header("Authorization", "Bearer " + generateTestToken())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(validClientJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value("clientNew"))
                .andExpect(jsonPath("$.email").value("clientNew@example.com"))
                .andExpect(jsonPath("$.userType").value("CLIENT"));
    }

    @Test
    void testUpdateUserInvalid() throws Exception {
        String validClientJson = loadFixture("invalid_user.json");
        User existingUser = userRepository.findByUsername("client1").orElseThrow(
                () -> new RuntimeException("User not found")
        );

        mockMvc.perform(put("/edit_user/{uuid}", existingUser.getId())
                        .header("Authorization", "Bearer " + generateTestToken())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(validClientJson))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.password").value("Password should be longer than 8 characters"))
                .andExpect(jsonPath("$.email").value( "Email is required!"));
    }

    @Test
    void testUpdateUserDuplicate() throws Exception {
        String validClientJson = loadFixture("duplicate_data_user.json");
        User existingUser = userRepository.findByUsername("client2").orElseThrow(
                () -> new RuntimeException("User not found")
        );

        mockMvc.perform(put("/edit_user/{uuid}", existingUser.getId())
                        .header("Authorization", "Bearer " + generateTestToken())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(validClientJson))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Username 'client1' already exists."));
    }

    @Test
    void testDeleteUser() throws Exception {
        User existingUser = userRepository.findByUsername("client2").orElseThrow(
                () -> new RuntimeException("User not found")
        );

        mockMvc.perform(delete("/delete_user/{uuid}", existingUser.getId())
                        .header("Authorization", "Bearer " + generateTestToken()))
                .andExpect(status().isOk());
    }

    @AfterEach
    void cleanDatabases() {
        userRepository.deleteAll();
        userRepository.flush();
    }
}
