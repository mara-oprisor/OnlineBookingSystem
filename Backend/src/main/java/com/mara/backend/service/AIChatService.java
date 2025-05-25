package com.mara.backend.service;

import com.cohere.api.Cohere;
import com.cohere.api.requests.ChatRequest;
import com.cohere.api.types.NonStreamedChatResponse;
import lombok.AllArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class AIChatService {
    private static final Logger logger = LoggerFactory.getLogger(AIChatService.class);
    private final Cohere cohere;

    public String reply(String userMsg) {
        try {
            if (userMsg == null || userMsg.trim().isEmpty()) {
                logger.warn("Received empty or null user message");
                return "Please provide a valid message.";
            }

            logger.info("Sending message to Cohere API: {}", userMsg);
            NonStreamedChatResponse res = cohere.chat(ChatRequest.builder()
                    .message(userMsg)
                    .maxTokens(200)
                    .build());
            String responseText = res.getText();
            logger.info("Received response from Cohere API: {}", responseText);
            return responseText.replaceAll("[^\\p{Alnum}\\s\\.,]", "");
        } catch (Exception e) {
            logger.error("Error communicating with Cohere API: {}", e.getMessage(), e);
            return "Sorry, an error occurred while processing your request.";
        }
    }
}