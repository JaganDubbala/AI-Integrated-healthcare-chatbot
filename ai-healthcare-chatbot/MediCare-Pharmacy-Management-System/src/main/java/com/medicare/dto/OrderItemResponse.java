package com.medicare.dto;

import java.math.BigDecimal;

public class OrderItemResponse {

    private Long id;
    private Long drugId;
    private String drugName;
    private Integer quantity;
    private BigDecimal price;
    private BigDecimal subtotal;

    public OrderItemResponse(Long id, Long drugId, String drugName, Integer quantity, BigDecimal price, BigDecimal subtotal) {
        this.id = id;
        this.drugId = drugId;
        this.drugName = drugName;
        this.quantity = quantity;
        this.price = price;
        this.subtotal = subtotal;
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

    public Integer getQuantity() {
        return quantity;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public BigDecimal getSubtotal() {
        return subtotal;
    }
}
