package com.jagan.healthcare.config;

import com.jagan.healthcare.model.Doctor;
import com.jagan.healthcare.repository.DoctorRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DoctorDataInitializer {

    @Bean
    CommandLineRunner loadDoctors(DoctorRepository repository) {
        return args -> {
            if (repository.count() > 0) return;

            repository.save(new Doctor("Dr. Ananya", "General Physician",
                    "City General Hospital", "₹500"));
            repository.save(new Doctor("Dr. Rahul", "General Physician",
                    "Sunrise Multispeciality Hospital", "₹600"));
            repository.save(new Doctor("Dr. Priya", "Dermatology",
                    "Care Medical Centre", "₹700"));
            repository.save(new Doctor("Dr. Kiran", "Pediatrics",
                    "HealthFirst Hospital", "₹600"));
            repository.save(new Doctor("Dr. Meera", "Cardiology",
                    "Sunrise Multispeciality Hospital", "₹900"));
        };
    }
}
