package com.ecommerce.backend.Entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.ArrayList;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Cart {
@Id
@GeneratedValue(strategy = GenerationType.IDENTITY)
private Long id;

@OneToOne(fetch = FetchType.LAZY)
@JoinColumn(name = "user_id")
@JsonIgnore
private User user;

@OneToMany(mappedBy = "cart", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
private List<CartItem> items = new ArrayList<>();

public double getTotalPrice() {
    if (items == null) return 0.0;
    return items.stream()
            .mapToDouble(CartItem::getTotalPrice)
            .sum();
}
}