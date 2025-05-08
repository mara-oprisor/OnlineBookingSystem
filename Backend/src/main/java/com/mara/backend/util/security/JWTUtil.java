package com.mara.backend.util.security;

import com.mara.backend.model.Client;
import com.mara.backend.model.User;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.Map;

@Component
public class JWTUtil {
    @Value("${jwt.secret}")
    private String secretKey;

    private SecretKey getLoginKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public String createToken(User user) {
        return Jwts
                .builder()
                .subject(user.getUsername())
                .issuer("backend-spring")
                .issuedAt(new Date(System.currentTimeMillis()))
                .claims(Map.of(
                        "userId", user.getId(),
                        "role", user instanceof Client? "CLIENT" : "ADMIN"
                ))
                .expiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60))
                .signWith(getLoginKey(), Jwts.SIG.HS256)
                .compact();

    }
}
