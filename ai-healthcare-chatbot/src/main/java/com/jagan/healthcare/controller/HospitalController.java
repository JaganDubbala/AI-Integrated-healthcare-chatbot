package com.jagan.healthcare.controller;

import com.jagan.healthcare.dto.HospitalRequest;
import com.jagan.healthcare.model.Hospital;
import com.jagan.healthcare.repository.HospitalRepository;
import com.jagan.healthcare.security.SessionAuth;
import com.jagan.healthcare.service.HospitalService;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/hospitals")
@CrossOrigin(origins = "*")
public class HospitalController {

    private final HospitalRepository hospitalRepository;
    private final HospitalService hospitalService;

    public HospitalController(HospitalRepository hospitalRepository, HospitalService hospitalService) {
        this.hospitalRepository = hospitalRepository;
        this.hospitalService = hospitalService;
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

    @PostMapping
    public Hospital create(@Valid @RequestBody HospitalRequest r, HttpSession session) {
        SessionAuth.requireAdmin(session);
        return hospitalService.create(r);
    }

    @PutMapping("/{id}")
    public Hospital update(@PathVariable Long id, @Valid @RequestBody HospitalRequest r, HttpSession session) {
        SessionAuth.requireAdmin(session);
        return hospitalService.update(id, r);
    }

    @DeleteMapping("/{id}")
    public Map<String, String> delete(@PathVariable Long id, HttpSession session) {
        SessionAuth.requireAdmin(session);
        hospitalService.delete(id);
        return Map.of("message", "Hospital deleted.");
    }
}
