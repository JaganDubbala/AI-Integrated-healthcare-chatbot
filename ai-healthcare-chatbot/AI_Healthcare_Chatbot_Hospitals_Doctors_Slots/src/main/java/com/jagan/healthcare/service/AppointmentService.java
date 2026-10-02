package com.jagan.healthcare.service;

import com.jagan.healthcare.dto.AppointmentRequest;
import com.jagan.healthcare.model.Appointment;
import com.jagan.healthcare.repository.AppointmentRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class AppointmentService {
    private final AppointmentRepository repository;

    public AppointmentService(AppointmentRepository repository) {
        this.repository = repository;
    }

    public Appointment book(AppointmentRequest request) {
        boolean exists = repository
            .existsByDoctorNameAndAppointmentDateAndAppointmentTimeAndStatus(
                request.getDoctorName(), request.getAppointmentDate(),
                request.getAppointmentTime(), "BOOKED");

        if (exists) {
            throw new IllegalArgumentException(
                "That doctor already has a booked appointment at the selected date and time.");
        }

        return repository.save(new Appointment(
            request.getPatientName(), request.getDoctorName(),
            request.getAppointmentDate(), request.getAppointmentTime(), request.getReason()));
    }

    public List<Appointment> all() {
        return repository.findAllByOrderByAppointmentDateAscAppointmentTimeAsc();
    }
}
