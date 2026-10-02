package com.jagan.healthcare.config;

import com.jagan.healthcare.model.Hospital;
import com.jagan.healthcare.repository.HospitalRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class HospitalDataInitializer {

    @Bean
    CommandLineRunner loadHospitals(HospitalRepository repository) {
        return args -> {
            if (repository.count() > 0) return;

            repository.save(new Hospital(
                "City General Hospital", "Hyderabad", "Dilsukhnagar",
                "Dilsukhnagar, Hyderabad", "Demo contact", "General Medicine, Emergency"
            ));
            repository.save(new Hospital(
                "Sunrise Multispeciality Hospital", "Hyderabad", "LB Nagar",
                "LB Nagar, Hyderabad", "Demo contact", "Cardiology, General Medicine, Orthopedics"
            ));
            repository.save(new Hospital(
                "Care Medical Centre", "Hyderabad", "Madhapur",
                "Madhapur, Hyderabad", "Demo contact", "General Medicine, Dermatology, Pediatrics"
            ));
            repository.save(new Hospital(
                "HealthFirst Hospital", "Hyderabad", "Kukatpally",
                "Kukatpally, Hyderabad", "Demo contact", "General Medicine, ENT, Orthopedics"
            ));
        };
    }
}
