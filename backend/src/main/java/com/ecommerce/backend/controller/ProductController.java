package com.ecommerce.backend.controller;

import com.ecommerce.backend.Entity.Product;
import com.ecommerce.backend.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {
    private final ProductService productService;

    @GetMapping
    public List<Product> getAllProducts() {
        return productService.getAllProducts();
    }
    
    @GetMapping("/{id}")
    public Product getProductById(@PathVariable Long id) {
        return productService.getProductById(id);
    }
    
    @PostMapping
    public ResponseEntity<Product> createProduct(@RequestBody Product product) {
        return productService.saveProduct(product);
    }
    
    @PostMapping("/bulk-upload")
    public ResponseEntity<Map<String, Object>> bulkUploadProducts(
            @RequestParam("file") MultipartFile file,
            @RequestParam("sellerId") Long sellerId) {
        try {
            Map<String, Object> result = productService.bulkUploadFromCSV(file, sellerId);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", "Dosya yüklenirken hata oluştu: " + e.getMessage()
            ));
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        return productService.deleteProduct(id);
    }
    
    @GetMapping("/seller/{sellerId}")
    public List<Product> getProductsForSeller(@PathVariable Long sellerId) {
        return productService.getProductsForSeller(sellerId);
    }
    
    @GetMapping("/search")
    public List<Product> searchProducts(
        @RequestParam(required = false) String query,
        @RequestParam(required = false) Long categoryId
    ) {
        if (query != null && categoryId != null) {
            return productService.searchByNameAndCategory(query, categoryId);
        } else if (categoryId != null && query == null) {
            return productService.searchByCategory(categoryId);
        } else if (query != null) {
            return productService.searchByName(query);
        } else {
            return productService.getAllProducts();
        }
    }
}