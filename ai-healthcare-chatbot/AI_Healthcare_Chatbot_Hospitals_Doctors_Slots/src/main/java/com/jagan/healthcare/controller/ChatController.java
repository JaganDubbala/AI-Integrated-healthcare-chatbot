package com.jagan.healthcare.controller;

import com.jagan.healthcare.dto.ChatRequest;
import com.jagan.healthcare.dto.ChatResponse;
import com.jagan.healthcare.service.ChatbotService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = "*")
public class ChatController {

    private final ChatbotService chatbotService;

    public ChatController(ChatbotService chatbotService) {
        this.chatbotService = chatbotService;
    }

    @PostMapping
    public ResponseEntity<ChatResponse> chat(
            @Valid @RequestBody ChatRequest request) {

        if (request.getSeverity() != null &&
                !request.getSeverity().trim().isEmpty()) {

            return ResponseEntity.ok(
                    chatbotService.processSeverity(
                            request.getMessage(),
                            request.getSeverity()
                    )
            );
        }

        return ResponseEntity.ok(
                chatbotService.processMessage(
                        request.getMessage()
                )
        );
    }
}