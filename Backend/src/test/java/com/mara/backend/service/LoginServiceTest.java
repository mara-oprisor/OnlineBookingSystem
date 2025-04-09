package com.mara.backend.service;

import com.mara.backend.model.Admin;
import com.mara.backend.model.Client;
import com.mara.backend.model.User;
import com.mara.backend.model.login.LoginResponse;
import com.mara.backend.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class LoginServiceTest {
    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private LoginService loginService;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testLoginClient() {
        String username = "client1";
        String password = "password";
        Client client = new Client();
        client.setUsername(username);
        client.setPassword(password);


        when(userRepository.findByUsername(username)).thenReturn(Optional.of(client));
        LoginResponse result = loginService.login(username, password);


        assertTrue(result.success());
        assertEquals("CLIENT", result.role());
        verify(userRepository, times(1)).findByUsername(username);
    }

    @Test
    void testLoginAdmin() {
        String username = "admin1";
        String password = "password";
        Admin admin = new Admin();
        admin.setUsername(username);
        admin.setPassword(password);


        when(userRepository.findByUsername(username)).thenReturn(Optional.of(admin));
        LoginResponse result = loginService.login(username, password);


        assertTrue(result.success());
        assertEquals("ADMIN", result.role());
        verify(userRepository, times(1)).findByUsername(username);
    }

    @Test
    void testLoginIncorrectPassword() {
        String username = "client1";
        String password = "password";
        Client client = new Client();
        client.setUsername(username);
        client.setPassword("wrongPassword");


        when(userRepository.findByUsername(username)).thenReturn(Optional.of(client));
        LoginResponse result = loginService.login(username, password);


        assertFalse(result.success());
        assertEquals("Incorrect password! Please try again!", result.errorMessage());
        verify(userRepository, times(1)).findByUsername(username);
    }

    @Test
    void testLoginUsernameNotFound() {
        String username = "client1";
        String password = "password";

        when(userRepository.findByUsername(username)).thenReturn(Optional.empty());
        LoginResponse result = loginService.login(username, password);

        assertFalse(result.success());
        assertEquals("There is no user with username " + username, result.errorMessage());
        verify(userRepository, times(1)).findByUsername(username);
    }
}
