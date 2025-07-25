package com.ecommerce.backend.Entity;

import com.ecommerce.backend.Entity.Product;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "order_items")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    @JsonIgnore
    private Order order;

    // Product referansı nullable - ürün silinirse null olacak
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = true)
    private Product product;

    // Ürün bilgilerinin snapshot'ı - ürün silinse bile korunur
    @Column(nullable = false)
    private String productName;
    
    @Column(length = 1000)
    private String productDescription;
    
    @Column(name = "product_image_url")
    private String productImageUrl;

    @Column(nullable = false)
    private Integer quantity;

    @Column(nullable = false)
    private Double unitPrice;

    // Constructor for creating new order items
    public OrderItem(Order order, Product product, Integer quantity, Double unitPrice) {
        this.order = order;
        this.product = product;
        this.quantity = quantity;
        this.unitPrice = unitPrice;
        
        // Ürün bilgilerini snapshot olarak sakla
        if (product != null) {
            this.productName = product.getName();
            this.productDescription = product.getDescription();
            this.productImageUrl = product.getImageUrl();
        }
    }
    
    // Ürün hala mevcut mu kontrol et
    public boolean isProductAvailable() {
        return product != null;
    }
    
    // Ürün adını al (snapshot'tan veya product'tan)
    public String getDisplayProductName() {
        return productName != null ? productName : (product != null ? product.getName() : "Bilinmeyen Ürün");
    }
} 