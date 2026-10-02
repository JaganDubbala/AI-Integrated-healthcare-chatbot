package com.medicare.service;

import com.medicare.dto.DrugRequest;
import com.medicare.dto.DrugResponse;
import com.medicare.entity.Drug;
import com.medicare.exception.DrugNotFoundException;
import com.medicare.repository.DrugRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class DrugService {

    private final DrugRepository drugRepository;

    public DrugService(DrugRepository drugRepository) {
        this.drugRepository = drugRepository;
    }

    public List<DrugResponse> getAllDrugs() {
        return drugRepository.findAll().stream().map(this::toResponse).toList();
    }

    public DrugResponse getDrugById(Long id) {
        return toResponse(findDrugOrThrow(id));
    }

    public DrugResponse addDrug(DrugRequest request) {
        Drug drug = new Drug();
        applyRequest(drug, request);
        return toResponse(drugRepository.save(drug));
    }

    public DrugResponse updateDrug(Long id, DrugRequest request) {
        Drug drug = findDrugOrThrow(id);
        applyRequest(drug, request);
        return toResponse(drugRepository.save(drug));
    }

    public void deleteDrug(Long id) {
        Drug drug = findDrugOrThrow(id);
        drugRepository.delete(drug);
    }

    public List<DrugResponse> search(String name, String category) {
        List<Drug> results;
        if (name != null && !name.isBlank() && category != null && !category.isBlank()) {
            results = drugRepository.findByNameContainingIgnoreCaseOrCategoryContainingIgnoreCase(name, category);
        } else if (name != null && !name.isBlank()) {
            results = drugRepository.findByNameContainingIgnoreCase(name);
        } else if (category != null && !category.isBlank()) {
            results = drugRepository.findByCategoryContainingIgnoreCase(category);
        } else {
            results = drugRepository.findAll();
        }
        return results.stream().map(this::toResponse).toList();
    }

    public Drug findDrugOrThrow(Long id) {
        return drugRepository.findById(id)
                .orElseThrow(() -> new DrugNotFoundException("Medicine not found with id: " + id));
    }

    private void applyRequest(Drug drug, DrugRequest request) {
        drug.setName(request.getName());
        drug.setDescription(request.getDescription());
        drug.setCategory(request.getCategory());
        drug.setManufacturer(request.getManufacturer());
        drug.setPrice(request.getPrice());
        drug.setStockQuantity(request.getStockQuantity());
        drug.setExpiryDate(request.getExpiryDate());
    }

    private DrugResponse toResponse(Drug drug) {
        boolean expired = drug.getExpiryDate() != null && drug.getExpiryDate().isBefore(LocalDate.now());
        return new DrugResponse(drug.getId(), drug.getName(), drug.getDescription(), drug.getCategory(),
                drug.getManufacturer(), drug.getPrice(), drug.getStockQuantity(), drug.getExpiryDate(), expired);
    }
}
