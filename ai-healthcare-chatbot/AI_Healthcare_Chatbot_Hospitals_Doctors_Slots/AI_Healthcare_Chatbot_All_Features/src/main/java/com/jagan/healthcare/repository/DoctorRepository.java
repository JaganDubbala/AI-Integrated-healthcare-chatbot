package com.jagan.healthcare.repository;
import com.jagan.healthcare.model.Doctor; import org.springframework.data.jpa.repository.JpaRepository; import java.util.*;
public interface DoctorRepository extends JpaRepository<Doctor,Long>{ List<Doctor> findByHospitalNameIgnoreCase(String hospitalName); List<Doctor> findBySpecialtyContainingIgnoreCase(String specialty); List<Doctor> findBySpecialtyContainingIgnoreCaseAndHospitalNameIgnoreCase(String specialty,String hospitalName); }
