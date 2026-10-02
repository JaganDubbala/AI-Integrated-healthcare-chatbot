# AI-Integrated Healthcare Chatbot with Voice Assistant

## Technology
- Core Java 17
- Spring Boot 3.5.x
- Spring MVC / REST APIs
- Spring Data JPA / Hibernate
- MySQL
- HTML, CSS, JavaScript
- Browser Speech Recognition API (STT)
- Browser Speech Synthesis API (TTS)

## Architecture

Browser UI
   |
   | POST /api/chat (JSON)
   v
ChatController
   |
   v
ChatbotService
   |--------------------|
   v                    v
FAQ Repository     Symptom Repository
   |                    |
   +---------+----------+
             v
          MySQL
             |
             v
      Chat interaction log

Voice flow:
Microphone -> Browser Speech Recognition -> text -> REST API
REST response -> JavaScript -> SpeechSynthesis -> speaker

## Prerequisites

1. JDK 17+
2. Maven 3.9+
3. MySQL 8+
4. A modern browser. SpeechRecognition support varies by browser.

## MySQL setup

Run:

CREATE DATABASE healthcare_chatbot;

Then update:
src/main/resources/application.properties

spring.datasource.username=root
spring.datasource.password=root

Use your own MySQL credentials.

## Run

From the project folder:

mvn spring-boot:run

Open:

http://localhost:8080

Health endpoint:

http://localhost:8080/api/health

Chat endpoint:

POST http://localhost:8080/api/chat

Example JSON:

{
  "message": "I have a headache"
}

Example response:

{
  "response": "For a mild headache...",
  "intent": "SYMPTOM_GUIDANCE"
}

## How the chatbot works

1. User types or speaks a message.
2. SpeechRecognition converts speech into text.
3. JavaScript sends JSON to Spring Boot.
4. ChatController receives the request.
5. Validation checks that the message exists and is <= 500 characters.
6. ChatbotService normalizes the text.
7. Emergency keywords are checked first.
8. FAQ keywords/questions are scored.
9. If no FAQ matches, symptom keywords are scored.
10. A response and intent are returned as JSON.
11. The interaction is stored in MySQL.
12. JavaScript displays the answer and uses SpeechSynthesis to read it aloud.

## Important project limitation

This is a rule-based/keyword-matching chatbot, not a clinical diagnostic AI model. It intentionally provides general information and safety-oriented guidance rather than diagnosis or treatment.

For a stronger "AI-integrated" version, replace the matching layer with an approved LLM/API behind the Spring Boot service, add authentication, audit logging, rate limiting, encrypted storage, and healthcare/privacy controls appropriate to the deployment environment.


## Appointment Booking Added

Ask "How to book an appointment?" to trigger the appointment intent.
The frontend opens a booking form and POSTs appointment details to
`/api/appointments`. Appointments are stored in the MySQL `appointments`
table. A doctor/date/time conflict returns HTTP 409.

This is a project/demo scheduling feature, not a connection to a real hospital.


## Hospital Directory Added

- GET /api/hospitals
- Optional filters: `?city=Hyderabad&area=Madhapur`
- The demo database is seeded with sample hospital records.
- The hospital names/contact values in this demo are placeholders; verify real hospital details before using them for actual healthcare navigation.


## Doctors and Available Slots Added

- GET /api/doctors
- GET /api/slots?doctor=Dr.%20Ananya&date=2026-09-20
- Appointment form now loads doctors dynamically.
- Selecting a doctor and date loads available 30-minute demo slots.
- Already-booked slots are removed from the available list.
- Doctor and slot data are demo records for the project.
