package com.medicare.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public class DrugResponse {

    private Long id;
    private String name;
    private String description;
    private String category;
    private String manufacturer;
    private BigDecimal price;
    private Integer stockQuantity;
    private LocalDate expiryDate;
    private boolean expired;
    private boolean inStock;

    public DrugResponse(Long id, String name, String description, String category, String manufacturer,
                         BigDecimal price, Integer stockQuantity, LocalDate expiryDate, boolean expired) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.category = category;
        this.manufacturer = manufacturer;
        this.price = price;
        this.stockQuantity = stockQuantity;
        this.expiryDate = expiryDate;
        this.expired = expired;
        this.inStock = stockQuantity != null && stockQuantity > 0;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }

    public String getCategory() {
        return category;
    }

    public String getManufacturer() {
        return manufacturer;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public Integer getStockQuantity() {
        return stockQuantity;
    }

    public LocalDate getExpiryDate() {
        return expiryDate;
    }

    public boolean isExpired() {
        return expired;
    }

    public boolean isInStock() {
        return inStock;
    }
}
