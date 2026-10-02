package com.jagan.healthcare.repository;

import com.jagan.healthcare.model.ChatInteraction;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ChatInteractionRepository extends JpaRepository<ChatInteraction, Long> {
}
