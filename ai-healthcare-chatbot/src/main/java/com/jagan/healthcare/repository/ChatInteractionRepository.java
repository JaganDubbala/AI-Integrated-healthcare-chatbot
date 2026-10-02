package com.jagan.healthcare.repository;
import com.jagan.healthcare.model.ChatInteraction; import org.springframework.data.jpa.repository.JpaRepository; import java.util.*;
public interface ChatInteractionRepository extends JpaRepository<ChatInteraction,Long>{ List<ChatInteraction> findAllByOrderByCreatedAtDesc(); }
