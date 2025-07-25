package com.ecommerce.backend.service;

import com.ecommerce.backend.Entity.Product;
import com.ecommerce.backend.Entity.Cart;
import com.ecommerce.backend.Entity.Favorite;
import com.ecommerce.backend.repository.ProductRepository;
import com.ecommerce.backend.repository.CartRepository;
import com.ecommerce.backend.repository.FavoriteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.http.ResponseEntity;
import java.util.List;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

@Service
@RequiredArgsConstructor
public class ProductService {
    private final ProductRepository productRepository;
    private final CartRepository cartRepository;
    private final FavoriteRepository favoriteRepository;
    
    @PersistenceContext
    private EntityManager entityManager;

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }
    
    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ürün bulunamadı: " + id));
    }
    
    public ResponseEntity<Product> saveProduct(Product product) {
        Product savedProduct = productRepository.save(product);
        return ResponseEntity.ok(savedProduct);
    }
    
    public ResponseEntity<Product> updateProduct(Long id, Product product) {
        Product existingProduct = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ürün bulunamadı: " + id));
        
        existingProduct.setName(product.getName());
        existingProduct.setDescription(product.getDescription());
        existingProduct.setPrice(product.getPrice());
        existingProduct.setImageUrl(product.getImageUrl());
        
        Product updatedProduct = productRepository.save(existingProduct);
        return ResponseEntity.ok(updatedProduct);
    }
    
    @Transactional
    public ResponseEntity<Void> deleteProduct(Long id) {
        Product existingProduct = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ürün bulunamadı: " + id));
        
        // 1. Bu ürünle ilişkili cart item'ları JPQL ile sil
        entityManager.createQuery("DELETE FROM CartItem ci WHERE ci.product.id = :productId")
                .setParameter("productId", id)
                .executeUpdate();
        
        // 2. Bu ürünle ilişkili favorites'ları JPQL ile sil
        entityManager.createQuery("DELETE FROM Favorite f WHERE f.product.id = :productId")
                .setParameter("productId", id)
                .executeUpdate();
        
        // 3. Order item'lardaki product referansını null yap (sipariş geçmişini koru)
        entityManager.createQuery("UPDATE OrderItem oi SET oi.product = null WHERE oi.product.id = :productId")
                .setParameter("productId", id)
                .executeUpdate();
        
        // 4. Değişiklikleri flush et
        entityManager.flush();
        
        // 5. Son olarak ürünü sil
        productRepository.delete(existingProduct);
        return ResponseEntity.ok().build();
    }
    
    @Query("SELECT p FROM Product p WHERE p.seller.id = :sellerId")
    public List<Product> getProductsForSeller(Long sellerId) {
        return productRepository.findBySellerId(sellerId);
    }
    

    
    public List<Product> searchByName(String query) {
        return productRepository.findByNameContainingIgnoreCase(query);
    }
    
    public List<Product> searchByCategory(Long categoryId) {
        return productRepository.findByCategoryId(categoryId);
    }
    
    public List<Product> searchByNameAndCategory(String query, Long categoryId) {
        return productRepository.findByNameContainingIgnoreCaseAndCategoryId(query, categoryId);
    }
}