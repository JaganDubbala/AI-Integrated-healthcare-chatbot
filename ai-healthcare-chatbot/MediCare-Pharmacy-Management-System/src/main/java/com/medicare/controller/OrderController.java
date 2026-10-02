package com.medicare.controller;

import com.medicare.dto.ApiResponse;
import com.medicare.dto.OrderResponse;
import com.medicare.dto.OrderStatusUpdateRequest;
import com.medicare.dto.PlaceOrderRequest;
import com.medicare.security.SecurityUtil;
import com.medicare.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;
    private final SecurityUtil securityUtil;

    public OrderController(OrderService orderService, SecurityUtil securityUtil) {
        this.orderService = orderService;
        this.securityUtil = securityUtil;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<OrderResponse>> placeOrder(@Valid @RequestBody PlaceOrderRequest request) {
        if (!securityUtil.isSelfOrAdmin(request.getCustomerId())) {
            throw new AccessDeniedException("You can only place orders for yourself");
        }
        return ResponseEntity.ok(ApiResponse.ok("Order placed successfully", orderService.placeOrder(request.getCustomerId())));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<OrderResponse>> getOrderById(@PathVariable Long id) {
        OrderResponse order = orderService.getOrderById(id);
        if (!securityUtil.isSelfOrAdmin(order.getCustomerId())) {
            throw new AccessDeniedException("You can only view your own orders");
        }
        return ResponseEntity.ok(ApiResponse.ok("Order fetched successfully", order));
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<ApiResponse<List<OrderResponse>>> getOrdersByCustomer(@PathVariable Long customerId) {
        if (!securityUtil.isSelfOrAdmin(customerId)) {
            throw new AccessDeniedException("You can only view your own orders");
        }
        return ResponseEntity.ok(ApiResponse.ok("Orders fetched successfully", orderService.getOrdersByCustomer(customerId)));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<OrderResponse>>> getAllOrders() {
        return ResponseEntity.ok(ApiResponse.ok("Orders fetched successfully", orderService.getAllOrders()));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse<OrderResponse>> updateStatus(@PathVariable Long id,
                                                                    @Valid @RequestBody OrderStatusUpdateRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("Order status updated successfully", orderService.updateStatus(id, request.getStatus())));
    }
}
