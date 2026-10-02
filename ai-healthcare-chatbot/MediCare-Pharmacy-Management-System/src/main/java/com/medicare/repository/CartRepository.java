package com.medicare.repository;

import com.medicare.entity.Cart;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CartRepository extends JpaRepository<Cart, Long> {

    List<Cart> findByCustomerId(Long customerId);

    Optional<Cart> findByCustomerIdAndDrugId(Long customerId, Long drugId);

    void deleteByCustomerId(Long customerId);
}
