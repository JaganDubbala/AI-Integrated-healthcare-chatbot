package com.jagan.healthcare.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "chat_interactions")
public class ChatInteraction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String userMessage;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String botResponse;

    private String intent;
    private LocalDateTime createdAt;

    @PrePersist
    public void beforeInsert() {
        createdAt = LocalDateTime.now();
    }

    public ChatInteraction() {}

    public ChatInteraction(String userMessage, String botResponse, String intent) {
        this.userMessage = userMessage;
        this.botResponse = botResponse;
        this.intent = intent;
    }

    public Long getId() { return id; }
    public String getUserMessage() { return userMessage; }
    public String getBotResponse() { return botResponse; }
    public String getIntent() { return intent; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}
