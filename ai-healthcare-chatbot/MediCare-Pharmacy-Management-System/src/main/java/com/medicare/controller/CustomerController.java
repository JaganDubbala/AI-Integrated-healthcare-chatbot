package com.medicare.controller;

import com.medicare.dto.ApiResponse;
import com.medicare.dto.CustomerResponse;
import com.medicare.dto.CustomerUpdateRequest;
import com.medicare.security.SecurityUtil;
import com.medicare.service.CustomerService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customers")
public class CustomerController {

    private final CustomerService customerService;
    private final SecurityUtil securityUtil;

    public CustomerController(CustomerService customerService, SecurityUtil securityUtil) {
        this.customerService = customerService;
        this.securityUtil = securityUtil;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<CustomerResponse>>> getAllCustomers() {
        if (!securityUtil.isAdmin()) {
            throw new AccessDeniedException("Only admins can view all customers");
        }
        return ResponseEntity.ok(ApiResponse.ok("Customers fetched successfully", customerService.getAllCustomers()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CustomerResponse>> getCustomerById(@PathVariable Long id) {
        if (!securityUtil.isSelfOrAdmin(id)) {
            throw new AccessDeniedException("You can only view your own profile");
        }
        return ResponseEntity.ok(ApiResponse.ok("Customer fetched successfully", customerService.getCustomerById(id)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<CustomerResponse>> updateCustomer(@PathVariable Long id,
                                                                         @Valid @RequestBody CustomerUpdateRequest request) {
        if (!securityUtil.isSelfOrAdmin(id)) {
            throw new AccessDeniedException("You can only update your own profile");
        }
        return ResponseEntity.ok(ApiResponse.ok("Profile updated successfully", customerService.updateCustomer(id, request)));
    }
}
