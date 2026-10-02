package com.jagan.healthcare.repository;

import com.jagan.healthcare.model.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DoctorRepository extends JpaRepository<Doctor, Long> {
    List<Doctor> findByHospitalNameIgnoreCase(String hospitalName);
}
