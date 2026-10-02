package com.medicare.dto;

import java.math.BigDecimal;

public class CartItemResponse {

    private Long id;
    private Long drugId;
    private String drugName;
    private BigDecimal price;
    private Integer quantity;
    private BigDecimal totalPrice;
    private Integer availableStock;

    public CartItemResponse(Long id, Long drugId, String drugName, BigDecimal price, Integer quantity,
                             BigDecimal totalPrice, Integer availableStock) {
        this.id = id;
        this.drugId = drugId;
        this.drugName = drugName;
        this.price = price;
        this.quantity = quantity;
        this.totalPrice = totalPrice;
        this.availableStock = availableStock;
    }

    public Long getId() {
        return id;
    }

    public Long getDrugId() {
        return drugId;
    }

    public String getDrugName() {
        return drugName;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public BigDecimal getTotalPrice() {
        return totalPrice;
    }

    public Integer getAvailableStock() {
        return availableStock;
    }
}
