package com.ecommerce.backend.service;

import com.ecommerce.backend.Entity.Product;
import com.ecommerce.backend.Entity.Category;
import com.ecommerce.backend.Entity.User;
import com.ecommerce.backend.Entity.Cart;
import com.ecommerce.backend.Entity.Favorite;
import com.ecommerce.backend.repository.ProductRepository;
import com.ecommerce.backend.repository.CategoryRepository;
import com.ecommerce.backend.repository.UserRepository;
import com.ecommerce.backend.repository.CartRepository;
import com.ecommerce.backend.repository.FavoriteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.ArrayList;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

@Service
@RequiredArgsConstructor
public class ProductService {
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;
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

    @Transactional
    public Map<String, Object> bulkUploadFromCSV(MultipartFile file, Long sellerId) throws Exception {
        if (file.isEmpty()) {
            throw new RuntimeException("Dosya boş");
        }

        User seller = userRepository.findById(sellerId)
                .orElseThrow(() -> new RuntimeException("Satıcı bulunamadı"));

        List<Product> successfulProducts = new ArrayList<>();
        List<String> errors = new ArrayList<>();
        int totalLines = 0;

        try (BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream(), "UTF-8"))) {
            String line;
            boolean isFirstLine = true;

            while ((line = reader.readLine()) != null) {
                totalLines++;
                
                // İlk satırı header olarak geç
                if (isFirstLine) {
                    isFirstLine = false;
                    continue;
                }

                try {
                    Product product = parseCSVLine(line, seller);
                    Product savedProduct = productRepository.save(product);
                    successfulProducts.add(savedProduct);
                } catch (Exception e) {
                    errors.add("Satır " + totalLines + ": " + e.getMessage());
                }
            }
        }

        Map<String, Object> result = new HashMap<>();
        result.put("success", true);
        result.put("totalProcessed", totalLines - 1); // Header satırını çıkar
        result.put("successCount", successfulProducts.size());
        result.put("errorCount", errors.size());
        result.put("errors", errors);
        
        return result;
    }

    private Product parseCSVLine(String line, User seller) throws Exception {
        // CSV format: name,description,price,imageUrl,categoryName
        String[] values = line.split(",");
        
        if (values.length < 5) {
            throw new RuntimeException("Eksik veri - 5 kolon gerekli: name,description,price,imageUrl,categoryName");
        }

        String name = values[0].trim().replace("\"", "");
        String description = values[1].trim().replace("\"", "");
        String priceStr = values[2].trim().replace("\"", "");
        String imageUrl = values[3].trim().replace("\"", "");
        String categoryName = values[4].trim().replace("\"", "");

        // Fiyat kontrolü
        double price;
        try {
            price = Double.parseDouble(priceStr);
        } catch (NumberFormatException e) {
            throw new RuntimeException("Geçersiz fiyat: " + priceStr);
        }

        // Kategori kontrolü
        Category category = categoryRepository.findByName(categoryName)
                .orElseThrow(() -> new RuntimeException("Kategori bulunamadı: " + categoryName));

        // Ürün oluştur
        Product product = new Product();
        product.setName(name);
        product.setDescription(description);
        product.setPrice(price);
        product.setImageUrl(imageUrl);
        product.setSeller(seller);
        product.setCategory(category);

        return product;
    }
    
    public ResponseEntity<Product> updateProduct(Long id, Product product) {
        Product existingProduct = getProductById(id);
        
        existingProduct.setName(product.getName());
        existingProduct.setDescription(product.getDescription());
        existingProduct.setPrice(product.getPrice());
        existingProduct.setImageUrl(product.getImageUrl());
        existingProduct.setCategory(product.getCategory());
        
        Product updatedProduct = productRepository.save(existingProduct);
        return ResponseEntity.ok(updatedProduct);
    }

    @Transactional
    public ResponseEntity<Void> deleteProduct(Long id) {
        Product product = getProductById(id);
        
        // Sepetlerden kaldır
        cartRepository.deleteCartItemsByProductId(id);
        
        // Favorilerden kaldır  
        favoriteRepository.deleteByProductId(id);
        
        productRepository.delete(product);
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
        return productRepository.findByCategory_Id(categoryId);
    }
    
    public List<Product> searchByNameAndCategory(String query, Long categoryId) {
        return productRepository.findByNameContainingIgnoreCaseAndCategory_Id(query, categoryId);
    }
}