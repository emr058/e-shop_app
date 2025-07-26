package com.ecommerce.backend.repository;

import com.ecommerce.backend.Entity.Cart;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

public interface CartRepository extends JpaRepository<Cart, Long> {
    
    @Query("SELECT c FROM Cart c WHERE c.user.id = :userId")
    Optional<Cart> findByUserId(Long userId);
    
    @Modifying
    @Transactional
    @Query("DELETE FROM CartItem ci WHERE ci.product.id = :productId")
    void deleteCartItemsByProductId(Long productId);
}

