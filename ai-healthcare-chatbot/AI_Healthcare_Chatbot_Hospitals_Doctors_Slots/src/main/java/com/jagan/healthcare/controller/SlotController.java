package com.jagan.healthcare.controller;

import com.jagan.healthcare.repository.AppointmentRepository;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/slots")
@CrossOrigin(origins = "*")
public class SlotController {

    private final AppointmentRepository appointmentRepository;

    public SlotController(AppointmentRepository appointmentRepository) {
        this.appointmentRepository = appointmentRepository;
    }

    @GetMapping
    public List<String> availableSlots(
            @RequestParam String doctor,
            @RequestParam String date) {

        LocalDate selectedDate = LocalDate.parse(date);

        List<String> allSlots = List.of(
                "09:00", "09:30", "10:00", "10:30",
                "11:00", "11:30", "14:00", "14:30",
                "15:00", "15:30", "16:00", "16:30"
        );

        return allSlots.stream()
                .map(LocalTime::parse)
                .filter(time -> !appointmentRepository
                        .existsByDoctorNameAndAppointmentDateAndAppointmentTimeAndStatus(
                                doctor, selectedDate, time, "BOOKED"))
                .map(LocalTime::toString)
                .collect(Collectors.toList());
    }
}
