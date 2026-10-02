package com.jagan.healthcare.repository;

import com.jagan.healthcare.model.Symptom;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SymptomRepository extends JpaRepository<Symptom, Long> {
    List<Symptom> findAllByOrderByIdAsc();
}
