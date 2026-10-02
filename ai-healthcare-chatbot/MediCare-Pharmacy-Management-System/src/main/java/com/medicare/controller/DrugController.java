package com.medicare.controller;

import com.medicare.dto.ApiResponse;
import com.medicare.dto.DrugRequest;
import com.medicare.dto.DrugResponse;
import com.medicare.service.DrugService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/drugs")
public class DrugController {

    private final DrugService drugService;

    public DrugController(DrugService drugService) {
        this.drugService = drugService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<DrugResponse>>> getAllDrugs() {
        return ResponseEntity.ok(ApiResponse.ok("Medicines fetched successfully", drugService.getAllDrugs()));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<DrugResponse>>> search(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String category) {
        return ResponseEntity.ok(ApiResponse.ok("Search results fetched successfully", drugService.search(name, category)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<DrugResponse>> getDrugById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok("Medicine fetched successfully", drugService.getDrugById(id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<DrugResponse>> addDrug(@Valid @RequestBody DrugRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("Medicine added successfully", drugService.addDrug(request)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<DrugResponse>> updateDrug(@PathVariable Long id, @Valid @RequestBody DrugRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("Medicine updated successfully", drugService.updateDrug(id, request)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteDrug(@PathVariable Long id) {
        drugService.deleteDrug(id);
        return ResponseEntity.ok(ApiResponse.ok("Medicine deleted successfully"));
    }
}
