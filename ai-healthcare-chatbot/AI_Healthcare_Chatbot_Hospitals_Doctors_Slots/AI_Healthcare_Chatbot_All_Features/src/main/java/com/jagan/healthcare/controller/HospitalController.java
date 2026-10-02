package com.jagan.healthcare.controller;

import com.jagan.healthcare.model.Hospital;
import com.jagan.healthcare.repository.HospitalRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/hospitals")
@CrossOrigin(origins = "*")
public class HospitalController {

    private final HospitalRepository hospitalRepository;

    public HospitalController(HospitalRepository hospitalRepository) {
        this.hospitalRepository = hospitalRepository;
    }

    @GetMapping
    public List<Hospital> getHospitals(
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String area) {

        if (city == null || city.isBlank()) {
            return hospitalRepository.findAll();
        }

        if (area != null && !area.isBlank()) {
            return hospitalRepository
                    .findByCityIgnoreCaseAndAreaContainingIgnoreCase(city, area);
        }

        return hospitalRepository.findByCityIgnoreCase(city);
    }
}
