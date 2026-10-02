package com.jagan.healthcare.service;

import com.jagan.healthcare.dto.ChatResponse;
import com.jagan.healthcare.model.ChatInteraction;
import com.jagan.healthcare.model.Faq;
import com.jagan.healthcare.model.Symptom;
import com.jagan.healthcare.repository.ChatInteractionRepository;
import com.jagan.healthcare.repository.FaqRepository;
import com.jagan.healthcare.repository.SymptomRepository;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class ChatbotService {

    private final FaqRepository faqRepository;
    private final SymptomRepository symptomRepository;
    private final ChatInteractionRepository chatRepository;

    public ChatbotService(
            FaqRepository faqRepository,
            SymptomRepository symptomRepository,
            ChatInteractionRepository chatRepository) {

        this.faqRepository = faqRepository;
        this.symptomRepository = symptomRepository;
        this.chatRepository = chatRepository;
    }

    // =====================================================
    // NORMAL CHAT MESSAGE
    // =====================================================

    public ChatResponse processMessage(String rawMessage) {

        String message = normalize(rawMessage);

        // Greeting
        if (containsAny(
                message,
                "hello",
                "hi",
                "hey",
                "good morning",
                "good evening")) {

            return saveAndReturn(
                    rawMessage,
                    "Hello! I can help with general health FAQs and basic symptom guidance. What would you like to know?",
                    "GREETING");
        }

        // Emergency
        if (containsAny(
                message,
                "emergency",
                "unconscious",
                "not breathing",
                "severe chest pain",
                "stroke",
                "heavy bleeding",
                "suicide")) {

            return saveAndReturn(
                    rawMessage,
                    "This may require urgent medical attention. Please contact your local emergency service or go to the nearest emergency department. This chatbot cannot assess emergencies.",
                    "EMERGENCY");
        }

        // Appointment
        if (containsAny(
                message,
                "appointment",
                "book doctor",
                "book a doctor",
                "schedule doctor",
                "schedule an appointment",
                "see a doctor",
                "doctor appointment")) {

            return saveAndReturn(
                    rawMessage,
                    "Sure. I can help you book an appointment. Please complete the appointment form below with your name, doctor, preferred date, time, and optional reason for the visit.",
                    "APPOINTMENT");
        }

        // Hospital
        if (containsAny(
                message,
                "hospital",
                "hospitals",
                "nearby hospital",
                "nearest hospital",
                "hospital list",
                "find hospital",
                "find hospitals")) {

            return saveAndReturn(
                    rawMessage,
                    "I can show the hospitals available in the demo hospital directory. Use the Hospital List section below to view hospitals and filter by city or area.",
                    "HOSPITAL_LIST");
        }

        // FAQ matching
        Faq bestFaq = findBestFaq(message);

        if (bestFaq != null) {

            return saveAndReturn(
                    rawMessage,
                    bestFaq.getAnswer(),
                    "FAQ");
        }

        // Symptom matching
        Symptom bestSymptom = findBestSymptom(message);

        if (bestSymptom != null) {

            String symptomName = bestSymptom.getSymptomName();

            String response =
                    "You mentioned \"" +
                    symptomName +
                    "\".\n\n" +
                    "Is your symptom Minor/Mild or Major/Severe?";

            return saveAndReturnWithSeverity(
                    rawMessage,
                    response,
                    "SEVERITY_REQUIRED",
                    true,
                    symptomName);
        }

        // Thanks
        if (containsAny(
                message,
                "thank you",
                "thanks")) {

            return saveAndReturn(
                    rawMessage,
                    "You're welcome. Remember that this chatbot provides general information and is not a substitute for professional medical advice.",
                    "THANKS");
        }

        // Unknown
        return saveAndReturn(
                rawMessage,
                "I couldn't confidently match that question to my health information. Try asking about a common symptom, a general health FAQ, or contact a healthcare professional for personalized advice.",
                "UNKNOWN");
    }

    // =====================================================
    // PROCESS MINOR / MAJOR
    // =====================================================

    public ChatResponse processSeverity(
            String symptomName,
            String severity) {

        String level = normalize(severity);

        Symptom symptom = findBestSymptom(
                normalize(symptomName));

        if (symptom == null) {

            return saveAndReturn(
                    symptomName,
                    "I couldn't identify that symptom. Please describe your symptom again.",
                    "UNKNOWN");
        }

        // Major / Severe
        if (level.equals("major") ||
                level.equals("severe")) {

            String response =
                    "Because you described your " +
                    symptom.getSymptomName() +
                    " as major/severe, please seek prompt medical evaluation. " +
                    "If the symptom is sudden, rapidly worsening, or accompanied by emergency warning signs, seek emergency medical care. " +
                    "This chatbot cannot determine the cause or prescribe treatment.";

            return saveAndReturn(
                    symptomName + " - MAJOR",
                    response,
                    "MAJOR_SYMPTOM");
        }

        // Minor / Mild
        if (level.equals("minor") ||
                level.equals("mild")) {

            String response =
                    getMinorGuidance(symptom);

            return saveAndReturn(
                    symptomName + " - MINOR",
                    response,
                    "MINOR_SYMPTOM");
        }

        // Invalid severity
        return saveAndReturn(
                symptomName,
                "Please select either Minor/Mild or Major/Severe.",
                "SEVERITY_REQUIRED");
    }

    // =====================================================
    // MINOR SYMPTOM GUIDANCE
    // =====================================================

    private String getMinorGuidance(Symptom symptom) {

        String name =
                normalize(symptom.getSymptomName());

        StringBuilder response =
                new StringBuilder();

        response.append(
                "Since you described your ")
                .append(symptom.getSymptomName())
                .append(" as minor/mild:\n\n");

        response.append(
                symptom.getGuidance());

        response.append(
                "\n\nGeneral medicine information:");

        // Headache
        if (name.contains("headache")) {

            response.append(
                    "\n• Paracetamol (acetaminophen) is a commonly used over-the-counter medicine for pain.");

            response.append(
                    "\n• Check the package label and ask a pharmacist or healthcare professional whether it is appropriate for you.");

            response.append(
                    "\n• Avoid taking a medicine if you have been advised not to use it or if it may interact with your other medicines.");
        }

        // Fever
        else if (name.contains("fever")) {

            response.append(
                    "\n• Paracetamol (acetaminophen) is commonly used for fever.");

            response.append(
                    "\n• Check the package label and ask a pharmacist or healthcare professional whether it is appropriate for you.");

            response.append(
                    "\n• Stay hydrated and monitor your symptoms.");
        }

        // Cough
        else if (name.contains("cough")) {

            response.append(
                    "\n• Cough medicines vary depending on the type and cause of the cough.");

            response.append(
                    "\n• Ask a pharmacist or healthcare professional to help choose an appropriate product.");

            response.append(
                    "\n• Warm fluids may provide comfort for some minor coughs.");
        }

        // Stomach pain
        else if (name.contains("stomach")) {

            response.append(
                    "\n• Avoid self-medicating for unexplained or persistent stomach pain.");

            response.append(
                    "\n• Ask a pharmacist or healthcare professional whether an over-the-counter medicine is appropriate.");
        }

        // Other symptoms
        else {

            response.append(
                    "\n• Medicine choice depends on the cause, age, allergies, existing conditions, and other medicines.");

            response.append(
                    "\n• Please ask a pharmacist or healthcare professional before taking an over-the-counter medicine.");
        }

        response.append(
                "\n\nIf your symptoms become severe, worsen, persist, or you develop concerning symptoms, seek medical attention.");

        return response.toString();
    }

    // =====================================================
    // FAQ SEARCH
    // =====================================================

    private Faq findBestFaq(String message) {

        List<Faq> faqs =
                faqRepository.findAll();

        Faq best = null;

        int bestScore = 0;

        for (Faq faq : faqs) {

            int score =
                    score(
                            message,
                            faq.getQuestion() +
                            " " +
                            faq.getKeywords());

            if (score > bestScore) {

                bestScore = score;

                best = faq;
            }
        }

        return bestScore >= 1
                ? best
                : null;
    }

    // =====================================================
    // SYMPTOM SEARCH
    // =====================================================

    private Symptom findBestSymptom(String message) {

        List<Symptom> symptoms =
                symptomRepository.findAll();

        Symptom best = null;

        int bestScore = 0;

        for (Symptom symptom : symptoms) {

            int score =
                    score(
                            message,
                            symptom.getSymptomName() +
                            " " +
                            symptom.getKeywords());

            if (score > bestScore) {

                bestScore = score;

                best = symptom;
            }
        }

        return bestScore >= 1
                ? best
                : null;
    }

    // =====================================================
    // SCORE MESSAGE
    // =====================================================

    private int score(
            String message,
            String searchableText) {

        Set<String> messageWords =
                tokenize(message);

        Set<String> targetWords =
                tokenize(searchableText);

        int score = 0;

        for (String word : messageWords) {

            if (word.length() >= 3 &&
                    targetWords.contains(word)) {

                score++;
            }
        }

        return score;
    }

    // =====================================================
    // TOKENIZE
    // =====================================================

    private Set<String> tokenize(String text) {

        return Arrays.stream(
                        normalize(text).split("\\s+"))
                .filter(word -> word.length() >= 2)
                .collect(Collectors.toSet());
    }

    // =====================================================
    // NORMALIZE
    // =====================================================

    private String normalize(String text) {

        return text == null
                ? ""
                : text
                .toLowerCase(Locale.ROOT)
                .replaceAll(
                        "[^a-z0-9\\s]",
                        " ")
                .replaceAll(
                        "\\s+",
                        " ")
                .trim();
    }

    // =====================================================
    // CHECK KEYWORDS
    // =====================================================

    private boolean containsAny(
            String text,
            String... values) {

        for (String value : values) {

            if (text.contains(value)) {
                return true;
            }
        }

        return false;
    }

    // =====================================================
    // SAVE NORMAL RESPONSE
    // =====================================================

    private ChatResponse saveAndReturn(
            String userMessage,
            String response,
            String intent) {

        chatRepository.save(
                new ChatInteraction(
                        userMessage,
                        response,
                        intent));

        return new ChatResponse(
                response,
                intent);
    }

    // =====================================================
    // SAVE SEVERITY RESPONSE
    // =====================================================

    private ChatResponse saveAndReturnWithSeverity(
            String userMessage,
            String response,
            String intent,
            boolean severityRequired,
            String symptom) {

        chatRepository.save(
                new ChatInteraction(
                        userMessage,
                        response,
                        intent));

        return new ChatResponse(
                response,
                intent,
                severityRequired,
                symptom);
    }
}