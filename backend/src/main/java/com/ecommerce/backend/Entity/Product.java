package com.ecommerce.backend.Entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "products")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String name;
    
    @Column(length = 1000)
    private String description;
    
    @Column(name = "image_url")
    private String imageUrl;
    
    @Column(nullable = false)
    private double price;
    
    // Seller relationship - ManyToOne with User
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "seller_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private User seller;
    
    // Backward compatibility - sellerId getter
    public Long getSellerId() {
        return seller != null ? seller.getId() : null;
    }
    
    // Backward compatibility - sellerId setter
    public void setSellerId(Long sellerId) {
        if (sellerId != null) {
            User sellerUser = new User();
            sellerUser.setId(sellerId);
            this.seller = sellerUser;
        } else {
            this.seller = null;
        }
    }

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "category_id")
    private Category category;
    
    // JSON için image getter (backward compatibility)
    @JsonProperty("image")
    public String getImage() {
        return this.imageUrl;
    }
    
    // JSON için image setter (backward compatibility)
    @JsonProperty("image")
    public void setImage(String image) {
        this.imageUrl = image;
    }
} 