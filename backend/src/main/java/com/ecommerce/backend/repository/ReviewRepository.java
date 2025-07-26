package com.ecommerce.backend.repository;

import com.ecommerce.backend.Entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    
    List<Review> findByProductIdOrderByReviewDateDesc(Long productId);
    
    List<Review> findByUserIdOrderByReviewDateDesc(Long userId);
    
    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.product.id = :productId")
    Double findAverageRatingByProductId(@Param("productId") Long productId);
    
    @Query("SELECT COUNT(r) FROM Review r WHERE r.product.id = :productId")
    Long countByProductId(@Param("productId") Long productId);
    
    boolean existsByProductIdAndUserId(Long productId, Long userId);
} 