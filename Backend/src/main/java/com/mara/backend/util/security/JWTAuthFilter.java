package com.mara.backend.util.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.crypto.SecretKey;
import java.io.IOException;
import java.util.Date;

@Component
@Slf4j
public class JWTAuthFilter extends OncePerRequestFilter {
    @Value("${jwt.secret}")
    private String secretKey;

    private SecretKey getLoginKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    private Claims getAllClaimsFromToken(String token) {
        return Jwts
                .parser()
                .verifyWith(getLoginKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    private boolean checkClaims(String token) {
        Claims claims = getAllClaimsFromToken(token);

        if(!claims.getIssuer().equals("backend-spring")) {
            log.error("Token does not have the right issuer");
            return false;
        }

        if(claims.getExpiration().before(new Date())) {
            log.error("Token has expired");
            return false;
        }

        if(claims.getIssuedAt() == null || claims.getIssuedAt().after(new Date(System.currentTimeMillis()))) {
            log.error("Token issued at date is invalid");
            return false;
        }

        if(claims.get("userId") == null || claims.get("role") == null) {
            log.error("Token claims are invalid: does not contain userId and role");
            return false;
        }

        log.info("Token is valid. User ID: {}, Role: {}", claims.get("userId"), claims.get("role"));
        return true;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        String path = request.getRequestURI();
        String method = request.getMethod();

        if ("/login".equals(path) || "/reset_password".equals(path) || "/forgot_password".equals(path) || "OPTIONS".equalsIgnoreCase(method)) {
            log.info("Skipping JWT filter for path: {} and method: {}", path, method);
            filterChain.doFilter(request, response);
            return;
        }

        String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            log.error("Authorization header is missing or does not start with 'Bearer '");
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }

        String token = authHeader.substring(7);

        try {
            boolean isValid = checkClaims(token);
            if (!isValid) {
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                return;
            }

            Claims claims = getAllClaimsFromToken(token);
            String role   = claims.get("role", String.class);

            boolean allowed = false;
            if ("CLIENT".equals(role)) {
                if (path.startsWith("/client/") || path.startsWith("/common/")) {
                    allowed = true;
                }
            }
            else if ("ADMIN".equals(role)) {
                if (path.startsWith("/admin/") || path.startsWith("/common/")) {
                    allowed = true;
                }
            }

            if (!allowed) {
                log.warn("Role '{}' is not permitted to access '{}'", role, path);
                response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                return;
            }

            filterChain.doFilter(request, response);
        } catch (JwtException e) {
            log.error("Invalid JWT token: {}", e.getMessage());
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        }
    }
}
