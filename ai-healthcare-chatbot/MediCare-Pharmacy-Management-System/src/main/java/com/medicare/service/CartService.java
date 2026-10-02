package com.medicare.service;

import com.medicare.dto.CartItemRequest;
import com.medicare.dto.CartItemResponse;
import com.medicare.entity.Cart;
import com.medicare.entity.Customer;
import com.medicare.entity.Drug;
import com.medicare.exception.CartItemNotFoundException;
import com.medicare.exception.InsufficientStockException;
import com.medicare.repository.CartRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@Transactional(readOnly = true)
public class CartService {

    private final CartRepository cartRepository;
    private final CustomerService customerService;
    private final DrugService drugService;

    public CartService(CartRepository cartRepository, CustomerService customerService, DrugService drugService) {
        this.cartRepository = cartRepository;
        this.customerService = customerService;
        this.drugService = drugService;
    }

    public List<CartItemResponse> getCartByCustomer(Long customerId) {
        return cartRepository.findByCustomerId(customerId).stream().map(this::toResponse).toList();
    }

    @Transactional
    public CartItemResponse addToCart(CartItemRequest request) {
        Customer customer = customerService.findCustomerOrThrow(request.getCustomerId());
        Drug drug = drugService.findDrugOrThrow(request.getDrugId());

        if (drug.isExpired()) {
            throw new InsufficientStockException("This medicine has expired and cannot be ordered");
        }

        Optional<Cart> existing = cartRepository.findByCustomerIdAndDrugId(request.getCustomerId(), request.getDrugId());
        Cart cart = existing.orElseGet(() -> {
            Cart c = new Cart();
            c.setCustomer(customer);
            c.setDrug(drug);
            c.setQuantity(0);
            return c;
        });

        int newQuantity = cart.getQuantity() + request.getQuantity();
        if (newQuantity > drug.getStockQuantity()) {
            throw new InsufficientStockException("Only " + drug.getStockQuantity() + " units of " + drug.getName() + " are available in stock");
        }

        cart.setQuantity(newQuantity);
        cart.setTotalPrice(drug.getPrice().multiply(BigDecimal.valueOf(newQuantity)));
        return toResponse(cartRepository.save(cart));
    }

    @Transactional
    public CartItemResponse updateQuantity(Long cartId, Integer quantity) {
        Cart cart = findCartOrThrow(cartId);
        Drug drug = cart.getDrug();

        if (quantity > drug.getStockQuantity()) {
            throw new InsufficientStockException("Only " + drug.getStockQuantity() + " units of " + drug.getName() + " are available in stock");
        }

        cart.setQuantity(quantity);
        cart.setTotalPrice(drug.getPrice().multiply(BigDecimal.valueOf(quantity)));
        return toResponse(cartRepository.save(cart));
    }

    @Transactional
    public void removeFromCart(Long cartId) {
        Cart cart = findCartOrThrow(cartId);
        cartRepository.delete(cart);
    }

    @Transactional
    public void clearCart(Long customerId) {
        cartRepository.deleteByCustomerId(customerId);
    }

    private Cart findCartOrThrow(Long cartId) {
        return cartRepository.findById(cartId)
                .orElseThrow(() -> new CartItemNotFoundException("Cart item not found with id: " + cartId));
    }

    private CartItemResponse toResponse(Cart cart) {
        Drug drug = cart.getDrug();
        return new CartItemResponse(cart.getId(), drug.getId(), drug.getName(), drug.getPrice(),
                cart.getQuantity(), cart.getTotalPrice(), drug.getStockQuantity());
    }
}
