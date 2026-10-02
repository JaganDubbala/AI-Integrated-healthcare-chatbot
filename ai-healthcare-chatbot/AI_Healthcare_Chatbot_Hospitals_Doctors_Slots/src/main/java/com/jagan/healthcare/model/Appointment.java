package com.jagan.healthcare.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "appointments")
public class Appointment {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false) private String patientName;
    @Column(nullable = false) private String doctorName;
    @Column(nullable = false) private LocalDate appointmentDate;
    @Column(nullable = false) private LocalTime appointmentTime;
    @Column(length = 500) private String reason;
    @Column(nullable = false) private String status;
    private LocalDateTime createdAt;

    @PrePersist
    public void beforeInsert() {
        createdAt = LocalDateTime.now();
        if (status == null || status.isBlank()) status = "BOOKED";
    }

    public Appointment() {}

    public Appointment(String patientName, String doctorName, LocalDate date,
                       LocalTime time, String reason) {
        this.patientName = patientName;
        this.doctorName = doctorName;
        this.appointmentDate = date;
        this.appointmentTime = time;
        this.reason = reason;
        this.status = "BOOKED";
    }

    public Long getId() { return id; }
    public String getPatientName() { return patientName; }
    public String getDoctorName() { return doctorName; }
    public LocalDate getAppointmentDate() { return appointmentDate; }
    public LocalTime getAppointmentTime() { return appointmentTime; }
    public String getReason() { return reason; }
    public String getStatus() { return status; }
    public LocalDateTime getCreatedAt() { return createdAt; }

    public void setId(Long id) { this.id = id; }
    public void setPatientName(String v) { this.patientName = v; }
    public void setDoctorName(String v) { this.doctorName = v; }
    public void setAppointmentDate(LocalDate v) { this.appointmentDate = v; }
    public void setAppointmentTime(LocalTime v) { this.appointmentTime = v; }
    public void setReason(String v) { this.reason = v; }
    public void setStatus(String v) { this.status = v; }
}
