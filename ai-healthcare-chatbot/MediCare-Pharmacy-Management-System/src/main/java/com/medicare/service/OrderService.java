package com.medicare.service;

import com.medicare.dto.OrderItemResponse;
import com.medicare.dto.OrderResponse;
import com.medicare.entity.*;
import com.medicare.exception.InsufficientStockException;
import com.medicare.exception.InvalidOrderStatusException;
import com.medicare.exception.OrderNotFoundException;
import com.medicare.repository.CartRepository;
import com.medicare.repository.DrugRepository;
import com.medicare.repository.OrderRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional(readOnly = true)
public class OrderService {

    private final OrderRepository orderRepository;
    private final CartRepository cartRepository;
    private final DrugRepository drugRepository;
    private final CustomerService customerService;

    public OrderService(OrderRepository orderRepository, CartRepository cartRepository,
                         DrugRepository drugRepository, CustomerService customerService) {
        this.orderRepository = orderRepository;
        this.cartRepository = cartRepository;
        this.drugRepository = drugRepository;
        this.customerService = customerService;
    }

    @Transactional
    public OrderResponse placeOrder(Long customerId) {
        Customer customer = customerService.findCustomerOrThrow(customerId);
        List<Cart> cartItems = cartRepository.findByCustomerId(customerId);

        if (cartItems.isEmpty()) {
            throw new IllegalArgumentException("Your cart is empty. Add medicines before placing an order");
        }

        Order order = new Order();
        order.setCustomer(customer);
        order.setOrderDate(LocalDateTime.now());
        order.setStatus(OrderStatus.PLACED);

        BigDecimal total = BigDecimal.ZERO;

        for (Cart cartItem : cartItems) {
            Drug drug = cartItem.getDrug();

            if (drug.isExpired()) {
                throw new InsufficientStockException(drug.getName() + " has expired and cannot be ordered");
            }
            if (cartItem.getQuantity() > drug.getStockQuantity()) {
                throw new InsufficientStockException("Only " + drug.getStockQuantity() + " units of " + drug.getName() + " are available in stock");
            }

            OrderItem item = new OrderItem();
            item.setDrug(drug);
            item.setQuantity(cartItem.getQuantity());
            item.setPrice(drug.getPrice());
            order.addItem(item);

            drug.setStockQuantity(drug.getStockQuantity() - cartItem.getQuantity());
            drugRepository.save(drug);

            total = total.add(drug.getPrice().multiply(BigDecimal.valueOf(cartItem.getQuantity())));
        }

        order.setTotalAmount(total);
        Order saved = orderRepository.save(order);

        cartRepository.deleteByCustomerId(customerId);

        return toResponse(saved);
    }

    public OrderResponse getOrderById(Long id) {
        return toResponse(findOrderOrThrow(id));
    }

    public List<OrderResponse> getOrdersByCustomer(Long customerId) {
        return orderRepository.findByCustomerIdOrderByOrderDateDesc(customerId).stream().map(this::toResponse).toList();
    }

    public List<OrderResponse> getAllOrders() {
        return orderRepository.findAllByOrderByOrderDateDesc().stream().map(this::toResponse).toList();
    }

    @Transactional
    public OrderResponse updateStatus(Long id, String statusValue) {
        Order order = findOrderOrThrow(id);
        OrderStatus newStatus;
        try {
            newStatus = OrderStatus.valueOf(statusValue.trim().toUpperCase());
        } catch (IllegalArgumentException ex) {
            throw new InvalidOrderStatusException("Invalid order status: " + statusValue);
        }

        if (newStatus.ordinal() < order.getStatus().ordinal()) {
            throw new InvalidOrderStatusException("Cannot move order status back from " + order.getStatus() + " to " + newStatus);
        }

        order.setStatus(newStatus);
        return toResponse(orderRepository.save(order));
    }

    private Order findOrderOrThrow(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new OrderNotFoundException("Order not found with id: " + id));
    }

    private OrderResponse toResponse(Order order) {
        List<OrderItemResponse> items = order.getItems().stream()
                .map(i -> new OrderItemResponse(
                        i.getId(),
                        i.getDrug().getId(),
                        i.getDrug().getName(),
                        i.getQuantity(),
                        i.getPrice(),
                        i.getPrice().multiply(BigDecimal.valueOf(i.getQuantity()))
                )).toList();

        return new OrderResponse(
                order.getId(),
                order.getCustomer().getId(),
                order.getCustomer().getName(),
                order.getOrderDate(),
                order.getTotalAmount(),
                order.getStatus().name(),
                items
        );
    }
}
