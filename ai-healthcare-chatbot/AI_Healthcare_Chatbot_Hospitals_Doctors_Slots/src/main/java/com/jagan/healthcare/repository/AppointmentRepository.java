package com.jagan.healthcare.repository;

import com.jagan.healthcare.model.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    boolean existsByDoctorNameAndAppointmentDateAndAppointmentTimeAndStatus(
        String doctorName, LocalDate appointmentDate, LocalTime appointmentTime, String status);

    List<Appointment> findAllByOrderByAppointmentDateAscAppointmentTimeAsc();
}
