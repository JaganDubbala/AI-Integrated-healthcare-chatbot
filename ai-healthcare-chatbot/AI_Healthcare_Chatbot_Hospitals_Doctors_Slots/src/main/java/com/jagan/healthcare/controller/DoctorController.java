package com.jagan.healthcare.controller;

import com.jagan.healthcare.model.Doctor;
import com.jagan.healthcare.repository.DoctorRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/doctors")
@CrossOrigin(origins = "*")
public class DoctorController {
    private final DoctorRepository repository;

    public DoctorController(DoctorRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<Doctor> getDoctors(@RequestParam(required = false) String hospital) {
        if (hospital == null || hospital.isBlank()) {
            return repository.findAll();
        }
        return repository.findByHospitalNameIgnoreCase(hospital);
    }
}
