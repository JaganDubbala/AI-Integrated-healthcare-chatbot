package com.jagan.healthcare.model;

import jakarta.persistence.*;

@Entity
@Table(name = "doctors")
public class Doctor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String specialty;

    @Column(nullable = false)
    private String hospitalName;

    private String consultationFee;

    public Doctor() {}

    public Doctor(String name, String specialty, String hospitalName, String consultationFee) {
        this.name = name;
        this.specialty = specialty;
        this.hospitalName = hospitalName;
        this.consultationFee = consultationFee;
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public String getSpecialty() { return specialty; }
    public String getHospitalName() { return hospitalName; }
    public String getConsultationFee() { return consultationFee; }

    public void setId(Long id) { this.id = id; }
    public void setName(String name) { this.name = name; }
    public void setSpecialty(String specialty) { this.specialty = specialty; }
    public void setHospitalName(String hospitalName) { this.hospitalName = hospitalName; }
    public void setConsultationFee(String consultationFee) { this.consultationFee = consultationFee; }
}
