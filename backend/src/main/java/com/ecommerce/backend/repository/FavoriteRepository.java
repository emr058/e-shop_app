package com.ecommerce.backend.repository;

import com.ecommerce.backend.Entity.Favorite;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FavoriteRepository extends JpaRepository<Favorite, Long> {
    
    @Query("SELECT f FROM Favorite f JOIN FETCH f.product")
    List<Favorite> findAllWithProducts();
    
    @Query("SELECT f FROM Favorite f JOIN FETCH f.product WHERE f.user.id = :userId")
    List<Favorite> findAllByUserIdWithProducts(Long userId);
} 