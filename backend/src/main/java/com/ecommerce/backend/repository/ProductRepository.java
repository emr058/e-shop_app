package com.ecommerce.backend.repository;

import com.ecommerce.backend.Entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import org.springframework.data.jpa.repository.Query;

public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByNameContainingIgnoreCase(String query);
    List<Product> findByNameContainingIgnoreCaseAndCategory_Id(String query, Long categoryId);
    List<Product> findByCategory_Id(Long categoryId);
    @Query("SELECT p FROM Product p WHERE p.seller.id = :sellerId")
    List<Product> findBySellerId(Long sellerId);
}