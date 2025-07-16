package com.ecommerce.backend.repository;

import com.ecommerce.backend.Entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
 
@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    
    @Query("SELECT DISTINCT o FROM Order o JOIN FETCH o.orderItems oi JOIN FETCH oi.product")
    List<Order> findAllWithOrderItemsAndProducts();
    
    @Query("SELECT DISTINCT o FROM Order o JOIN FETCH o.orderItems oi JOIN FETCH oi.product WHERE o.user.id = :userId")
    List<Order> findAllByUserIdWithOrderItemsAndProducts(Long userId);
} 