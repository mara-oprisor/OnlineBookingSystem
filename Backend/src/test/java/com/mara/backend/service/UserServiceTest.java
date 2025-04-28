package com.mara.backend.service;

import com.mara.backend.config.exception.DuplicateResourceException;
import com.mara.backend.model.Admin;
import com.mara.backend.model.Client;
import com.mara.backend.model.User;
import com.mara.backend.model.dto.UserCreateDTO;
import com.mara.backend.model.dto.UserDisplayDTO;
import com.mara.backend.model.dto.UserFilterDTO;
import com.mara.backend.repository.UserRepository;
import com.mara.backend.util.security.PasswordUtil;
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

public class UserServiceTest {
    @Mock
    private UserRepository userRepository;
    @Mock
    private PasswordUtil passwordUtil;

    @InjectMocks
    private UserService userService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        when(passwordUtil.hashPassword(anyString())).thenAnswer(invocation -> invocation.getArgument(0));
    }

    @Test
    void testGetUsers() {
        List<User> users = List.of(new Client(), new Admin(), new Client());
        List<UserDisplayDTO> usersDTO = new ArrayList<>();
        for (User user: users) {
            usersDTO.add(UserDisplayDTO.userToDTO(user));
        }


        when(userRepository.findAll()).thenReturn(users);
        List<UserDisplayDTO> result = userService.getAllUsers();


        assertEquals(3, result.size());
        verify(userRepository, times(1)).findAll();
        assertEquals(usersDTO, result);
    }

    @Test
    void testFilterUsersByUsername() {
        Client client1 = new Client();
        UUID id1 = UUID.randomUUID();
        client1.setId(id1);
        client1.setUsername("john");
        client1.setEmail("john@example.com");
        client1.setPassword("pass");
        client1.setName("John Doe");
        client1.setAge(30);

        Client client2 = new Client();
        UUID id2 = UUID.randomUUID();
        client2.setId(id2);
        client2.setUsername("jane");
        client2.setEmail("jane@example.com");
        client2.setPassword("pass");
        client2.setName("Jane Smith");
        client2.setAge(25);

        Admin admin1 = new Admin();
        UUID id3 = UUID.randomUUID();
        admin1.setId(id3);
        admin1.setUsername("adminUser");
        admin1.setEmail("admin@example.com");
        admin1.setPassword("pass");

        UserFilterDTO filterDTO = new UserFilterDTO();
        filterDTO.setUsername("john");


        List<User> allUsers = List.of(client1, client2, admin1);
        when(userRepository.findAll()).thenReturn(allUsers);
        List<UserDisplayDTO> result = userService.filterUsers(filterDTO);


        assertEquals(1, result.size());
        assertTrue(result.getFirst().getUsername().toLowerCase().contains("john"));
        verify(userRepository, times(1)).findAll();
    }

    @Test
    void testFilterUsersByEmail() {
        Client client1 = new Client();
        UUID id1 = UUID.randomUUID();
        client1.setId(id1);
        client1.setUsername("john");
        client1.setEmail("john@example.com");
        client1.setPassword("pass");
        client1.setName("John Doe");
        client1.setAge(30);

        Client client2 = new Client();
        UUID id2 = UUID.randomUUID();
        client2.setId(id2);
        client2.setUsername("jane");
        client2.setEmail("jane@sample.com");
        client2.setPassword("pass");
        client2.setName("Jane Smith");
        client2.setAge(25);

        List<User> allUsers = List.of(client1, client2);

        UserFilterDTO filterDTO = new UserFilterDTO();
        filterDTO.setEmail("example");


        when(userRepository.findAll()).thenReturn(allUsers);
        List<UserDisplayDTO> result = userService.filterUsers(filterDTO);


        assertEquals(1, result.size());
        assertTrue(result.getFirst().getEmail().toLowerCase().contains("example"));
        verify(userRepository, times(1)).findAll();
    }

    @Test
    void testFilterUsersByUserType() {
        Client client1 = new Client();
        UUID id1 = UUID.randomUUID();
        client1.setId(id1);
        client1.setUsername("john");
        client1.setEmail("john@example.com");
        client1.setPassword("pass");
        client1.setName("John Doe");
        client1.setAge(30);

        Admin admin1 = new Admin();
        UUID id2 = UUID.randomUUID();
        admin1.setId(id2);
        admin1.setUsername("adminUser");
        admin1.setEmail("admin@example.com");
        admin1.setPassword("pass");

        UserFilterDTO filterDTO = new UserFilterDTO();
        filterDTO.setUserType("ADMIN");

        List<User> allUsers = List.of(client1, admin1);


        when(userRepository.findAll()).thenReturn(allUsers);
        List<UserDisplayDTO> result = userService.filterUsers(filterDTO);


        assertEquals(1, result.size());
        assertEquals(admin1.getId(), result.getFirst().getUuid());
        verify(userRepository, times(1)).findAll();
    }

    @Test
    void testFilterUsersByMultipleCriteria() {
        Client client1 = new Client();
        UUID id1 = UUID.randomUUID();
        client1.setId(id1);
        client1.setUsername("john");
        client1.setEmail("john@example.com");
        client1.setPassword("pass");
        client1.setName("John Doe");
        client1.setAge(30);

        Client client2 = new Client();
        UUID id2 = UUID.randomUUID();
        client2.setId(id2);
        client2.setUsername("johnny");
        client2.setEmail("johnny@example.com");
        client2.setPassword("pass");
        client2.setName("Johnny Appleseed");
        client2.setAge(28);

        UserFilterDTO filterDTO = new UserFilterDTO();
        filterDTO.setUsername("john");
        filterDTO.setEmail("example");

        List<User> allUsers = List.of(client1, client2);


        when(userRepository.findAll()).thenReturn(allUsers);
        List<UserDisplayDTO> result = userService.filterUsers(filterDTO);


        assertEquals(2, result.size());
        verify(userRepository, times(1)).findAll();
    }

    @Test
    void testAddClient() throws DuplicateResourceException {
        UserCreateDTO userDTO = new UserCreateDTO("client", "client@email.com", "password", "CLIENT", "Client", null, null);

        Client savedClient = new Client();
        savedClient.setId(UUID.randomUUID());
        savedClient.setUsername(userDTO.getUsername());
        savedClient.setEmail(userDTO.getEmail());
        savedClient.setPassword(userDTO.getPassword());
        savedClient.setName(userDTO.getName());
        savedClient.setAge(userDTO.getAge());


        when(userRepository.save(any(Client.class))).thenReturn(savedClient);
        UserDisplayDTO result = userService.createUser(userDTO);


        assertEquals(UserDisplayDTO.userToDTO(savedClient), result);
        assertNotNull(result.getUuid());
        verify(userRepository, times(1)).save(any());
    }

    @Test
    void testAddAdmin() throws DuplicateResourceException {
        UserCreateDTO userDTO = new UserCreateDTO("admin", "admin@email.com", "adminPass", "ADMIN", null, null, null);

        Admin savedAdmin = new Admin();
        savedAdmin.setId(UUID.randomUUID());
        savedAdmin.setUsername(userDTO.getUsername());
        savedAdmin.setEmail(userDTO.getEmail());
        savedAdmin.setPassword(userDTO.getPassword());


        when(userRepository.save(any(Admin.class))).thenReturn(savedAdmin);
        UserDisplayDTO result = userService.createUser(userDTO);


        assertEquals(UserDisplayDTO.userToDTO(savedAdmin), result);
        assertNotNull(result.getUuid());
        verify(userRepository, times(1)).save(any());
    }

    @Test
    void addUserDuplicateUsername() {
        UserCreateDTO userDTO = new UserCreateDTO("client", "client@email.com", "password", "CLIENT", "Client", null, null);


        when(userRepository.existsByUsername(userDTO.getUsername())).thenReturn(true);


        assertThrows(DuplicateResourceException.class, () -> userService.createUser(userDTO));
        verify(userRepository, times(1)).existsByUsername(userDTO.getUsername());
    }

    @Test
    void addUserDuplicateEmail() {
        UserCreateDTO userDTO = new UserCreateDTO("client", "client@email.com", "password", "CLIENT", "Client", null, null);


        when(userRepository.existsByEmail(userDTO.getEmail())).thenReturn(true);


        assertThrows(DuplicateResourceException.class, () -> userService.createUser(userDTO));
        verify(userRepository, times(1)).existsByEmail(userDTO.getEmail());
    }

    @Test
    void testUpdateUser() throws DuplicateResourceException {
        UUID uuid = UUID.randomUUID();
        Client existingClient = new Client();
        existingClient.setId(uuid);
        existingClient.setUsername("client1");
        existingClient.setEmail("client@gmail.com");
        existingClient.setPassword("password");
        existingClient.setName("Client One");
        existingClient.setAge(25);

        UserCreateDTO editDTO = new UserCreateDTO("client1", "clientnew@email.com", "password", "CLIENT", "Client One New", 26, "FEMALE");

        Client updatedClient = new Client();
        updatedClient.setId(uuid);
        updatedClient.setUsername(editDTO.getUsername());
        updatedClient.setEmail(editDTO.getEmail());
        updatedClient.setPassword(editDTO.getPassword());
        updatedClient.setName(editDTO.getName());
        updatedClient.setAge(editDTO.getAge());


        when(userRepository.findById(uuid)).thenReturn(Optional.of(existingClient));
        when(userRepository.save(any())).thenReturn(updatedClient);
        UserDisplayDTO result = userService.editUser(uuid, editDTO);


        assertEquals("Client One New", result.getName());
        verify(userRepository, times(1)).findById(uuid);
        verify(userRepository, times(1)).save(any());
    }

    @Test
    void testUpdateUserNotFound() {
        UUID uuid = UUID.randomUUID();
        UserCreateDTO user = new UserCreateDTO();


        when(userRepository.findById(uuid)).thenReturn(Optional.empty());


        assertThrows(IllegalStateException.class, () -> userService.editUser(uuid, user));
        verify(userRepository, times(1)).findById(uuid);
    }

    @Test
    void testUpdateDuplicateUsername() {
        UUID uuid = UUID.randomUUID();
        UserCreateDTO user = new UserCreateDTO("client1", "client1@emiail.com", "password", "CLIENT", null, null, null);


        when(userRepository.findById(uuid)).thenReturn(Optional.of(new Client()));
        when(userRepository.existsByUsername(user.getUsername())).thenReturn(true);


        assertThrows(DuplicateResourceException.class, () -> userService.editUser(uuid, user));
        verify(userRepository, times(1)).existsByUsername(user.getUsername());
    }

    @Test
    void testUpdateDuplicateEmail() {
        UUID uuid = UUID.randomUUID();
        UserCreateDTO user = new UserCreateDTO("client1", "client1@emiail.com", "password", "CLIENT", null, null, null);


        when(userRepository.findById(uuid)).thenReturn(Optional.of(new Client()));
        when(userRepository.existsByEmail(user.getEmail())).thenReturn(true);


        assertThrows(DuplicateResourceException.class, () -> userService.editUser(uuid, user));
        verify(userRepository, times(1)).existsByEmail(user.getEmail());
    }

    @Test
    void testDeleteUser() {
        UUID uuid = UUID.randomUUID();


        doNothing().when(userRepository).deleteById(uuid);
        userService.deleteUser(uuid);


        verify(userRepository, times(1)).deleteById(uuid);
    }
}
