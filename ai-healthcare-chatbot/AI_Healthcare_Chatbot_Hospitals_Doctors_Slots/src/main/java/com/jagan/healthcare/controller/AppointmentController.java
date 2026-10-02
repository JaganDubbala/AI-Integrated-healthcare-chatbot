package com.jagan.healthcare.controller;

import com.jagan.healthcare.dto.AppointmentRequest;
import com.jagan.healthcare.model.Appointment;
import com.jagan.healthcare.service.AppointmentService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/appointments")
@CrossOrigin(origins="*")
public class AppointmentController {
    private final AppointmentService service;

    public AppointmentController(AppointmentService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<Map<String,Object>> book(
            @Valid @RequestBody AppointmentRequest request) {
        Appointment a = service.book(request);
        return ResponseEntity.ok(Map.of(
            "message", "Appointment booked successfully.",
            "appointment", a
        ));
    }

    @GetMapping
    public List<Appointment> all() {
        return service.all();
    }
}
