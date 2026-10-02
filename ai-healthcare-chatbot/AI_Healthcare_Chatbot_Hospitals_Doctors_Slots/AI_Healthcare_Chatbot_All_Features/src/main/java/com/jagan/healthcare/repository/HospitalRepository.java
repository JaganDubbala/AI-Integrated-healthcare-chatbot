package com.jagan.healthcare.repository;

import com.jagan.healthcare.model.Hospital;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface HospitalRepository extends JpaRepository<Hospital, Long> {
    List<Hospital> findByCityIgnoreCase(String city);
    List<Hospital> findByCityIgnoreCaseAndAreaContainingIgnoreCase(String city, String area);
}
