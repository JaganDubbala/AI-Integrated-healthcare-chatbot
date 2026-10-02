package com.medicare.controller;

import com.medicare.dto.ApiResponse;
import com.medicare.dto.CartItemRequest;
import com.medicare.dto.CartItemResponse;
import com.medicare.dto.CartItemUpdateRequest;
import com.medicare.security.SecurityUtil;
import com.medicare.service.CartService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final CartService cartService;
    private final SecurityUtil securityUtil;

    public CartController(CartService cartService, SecurityUtil securityUtil) {
        this.cartService = cartService;
        this.securityUtil = securityUtil;
    }

    @GetMapping("/{customerId}")
    public ResponseEntity<ApiResponse<List<CartItemResponse>>> getCart(@PathVariable Long customerId) {
        if (!securityUtil.isSelfOrAdmin(customerId)) {
            throw new AccessDeniedException("You can only view your own cart");
        }
        return ResponseEntity.ok(ApiResponse.ok("Cart fetched successfully", cartService.getCartByCustomer(customerId)));
    }

    @PostMapping("/add")
    public ResponseEntity<ApiResponse<CartItemResponse>> addToCart(@Valid @RequestBody CartItemRequest request) {
        if (!securityUtil.isSelfOrAdmin(request.getCustomerId())) {
            throw new AccessDeniedException("You can only add items to your own cart");
        }
        return ResponseEntity.ok(ApiResponse.ok("Medicine added to cart", cartService.addToCart(request)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<CartItemResponse>> updateCartItem(@PathVariable Long id,
                                                                         @Valid @RequestBody CartItemUpdateRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("Cart updated successfully", cartService.updateQuantity(id, request.getQuantity())));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> removeCartItem(@PathVariable Long id) {
        cartService.removeFromCart(id);
        return ResponseEntity.ok(ApiResponse.ok("Item removed from cart"));
    }
}
