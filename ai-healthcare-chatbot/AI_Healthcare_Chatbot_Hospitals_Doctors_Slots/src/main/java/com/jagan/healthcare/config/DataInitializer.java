package com.jagan.healthcare.config;

import com.jagan.healthcare.model.Faq;
import com.jagan.healthcare.model.Symptom;
import com.jagan.healthcare.repository.FaqRepository;
import com.jagan.healthcare.repository.SymptomRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner loadData(FaqRepository faqRepository, SymptomRepository symptomRepository) {
        return args -> {
            if (faqRepository.count() == 0) {
                faqRepository.save(new Faq(
                        "What is a healthy amount of sleep?",
                        "Many adults need around 7–9 hours of sleep per night. Individual needs can vary.",
                        "sleep rest sleeping hours"
                ));
                faqRepository.save(new Faq(
                        "How much water should I drink?",
                        "Fluid needs vary with age, activity, climate, diet, and medical conditions. Drink regularly and follow advice from your healthcare professional when you have a condition affecting fluid intake.",
                        "water hydration drink dehydration"
                ));
                faqRepository.save(new Faq(
                        "What is a balanced diet?",
                        "A balanced diet generally includes vegetables and fruits, whole grains, protein sources, and appropriate amounts of healthy fats, while limiting excess added sugar and highly processed foods.",
                        "diet food nutrition healthy eating"
                ));
                faqRepository.save(new Faq(
                        "Can this chatbot diagnose me?",
                        "No. This application provides general health information and preliminary guidance. It does not diagnose conditions, prescribe treatment, or replace a qualified healthcare professional.",
                        "diagnosis diagnose doctor medical advice"
                ));
            }

            if (symptomRepository.count() == 0) {
                symptomRepository.save(new Symptom(
                        "headache",
                        "For a mild headache, consider rest, hydration, regular meals, and reducing common triggers. Seek medical care if it is sudden and severe, follows a head injury, or occurs with concerning neurological symptoms.",
                        "head pain migraine"
                ));
                symptomRepository.save(new Symptom(
                        "fever",
                        "Fever can occur with many infections and other conditions. Rest and fluids may help. Seek medical advice for severe symptoms, persistent fever, or fever in a situation where professional assessment is recommended.",
                        "temperature hot chills"
                ));
                symptomRepository.save(new Symptom(
                        "cough",
                        "A cough can have many causes. Stay hydrated and avoid smoke or other irritants. Seek professional care if breathing is difficult, symptoms are severe, or the cough persists or worsens.",
                        "coughing throat cold"
                ));
                symptomRepository.save(new Symptom(
                        "stomach pain",
                        "Stomach pain has many possible causes. Consider hydration and avoiding foods that clearly worsen symptoms. Seek medical attention for severe or worsening pain, persistent vomiting, blood in stool or vomit, or other concerning symptoms.",
                        "stomach abdominal abdomen pain"
                ));
            }
        };
    }
}
