package com.ecommerce.backend.service;

import com.ecommerce.backend.model.Product;
import com.ecommerce.backend.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.http.ResponseEntity;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {
    private final ProductRepository productRepository;

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
    
    public ResponseEntity<Void> deleteProduct(Long id) {
        Product existingProduct = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ürün bulunamadı: " + id));
        
        productRepository.delete(existingProduct);
        return ResponseEntity.ok().build();
    }
}