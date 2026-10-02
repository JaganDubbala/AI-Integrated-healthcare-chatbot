CREATE DATABASE IF NOT EXISTS healthcare_chatbot;
USE healthcare_chatbot;

-- Spring Boot/JPA will create and update the tables automatically.
-- This file is provided mainly to create the database before starting the app.

-- Optional manual schema reference:
-- faqs(id, question, answer, keywords)
-- symptoms(id, symptom_name, guidance, keywords)
-- chat_interactions(id, user_message, bot_response, intent, created_at)
