package com.mara.backend.service;

import com.mara.backend.util.security.PasswordUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

public class PasswordUtilTest {
    private PasswordUtil passwordUtil;

    @BeforeEach
    void setUp() {
        passwordUtil = new PasswordUtil();
    }

    @Test
    void correctPasswordCheck() {
        String raw = "12345678";
        String hash = passwordUtil.hashPassword(raw);
        assertTrue(passwordUtil.checkPassword(raw, hash));
    }

    @Test
    void testDifferentHashesForDifferentPassword() {
        String h1 = passwordUtil.hashPassword("12345678");
        String h2 = passwordUtil.hashPassword("12345");
        assertNotEquals(h1, h2);
    }

    @Test
    void testDifferentHashesForSamePassword() {
        String h1 = passwordUtil.hashPassword("12345678");
        String h2 = passwordUtil.hashPassword("12345678");
        assertNotEquals(h1, h2);
    }

    @Test
    void testPasswordCheckAfterHashing() {
        String h1 = passwordUtil.hashPassword("123456");
        assertTrue(passwordUtil.checkPassword("123456", h1));
    }
}
