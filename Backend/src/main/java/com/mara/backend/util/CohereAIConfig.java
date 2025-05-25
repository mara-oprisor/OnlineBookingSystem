package com.mara.backend.util;

import com.cohere.api.Cohere;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class CohereAIConfig {
    @Bean
    Cohere cohere(@Value("${cohere.api-key}") String key) {
        if (key == null || key.isEmpty()) {
            throw new IllegalArgumentException("Cohere API key is missing or empty");
        }
        return Cohere.builder()
                .token(key)
                .clientName("spring-backend")
                .build();
    }
}
