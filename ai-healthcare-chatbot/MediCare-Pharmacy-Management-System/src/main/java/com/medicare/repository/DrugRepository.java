package com.medicare.repository;

import com.medicare.entity.Drug;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DrugRepository extends JpaRepository<Drug, Long> {

    List<Drug> findByNameContainingIgnoreCase(String name);

    List<Drug> findByCategoryContainingIgnoreCase(String category);

    List<Drug> findByNameContainingIgnoreCaseOrCategoryContainingIgnoreCase(String name, String category);
}
