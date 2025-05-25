package com.mara.backend.controller;

import com.mara.backend.service.AIChatService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin
@AllArgsConstructor
public class AIChatController {
    private final AIChatService aiChatService;

    @PostMapping("/api/chat/message")
    public ResponseEntity<String> sendMessage(@RequestBody String request) {
        String response = aiChatService.reply(request);

        return ResponseEntity.ok(response);
    }
}
