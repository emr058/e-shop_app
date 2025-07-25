package com.ecommerce.backend.service;

import com.ecommerce.backend.Entity.Favorite;
import com.ecommerce.backend.Entity.User;
import com.ecommerce.backend.Entity.Product;
import com.ecommerce.backend.repository.FavoriteRepository;
import com.ecommerce.backend.repository.UserRepository;
import com.ecommerce.backend.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class FavoriteService {

    private final FavoriteRepository favoriteRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    public List<Favorite> getAllFavorites() {
        return favoriteRepository.findAllWithProducts();
    }

    public List<Favorite> getAllFavoritesByUserId(Long userId) {
        List<Favorite> favorites = favoriteRepository.findAllByUserIdWithProducts(userId);
        // Product'ları manuel olarak yükle (LAZY loading için)
        favorites.forEach(favorite -> {
            if (favorite.getProduct() != null) {
                favorite.getProduct().getName(); // LAZY loading'i tetikle
            }
        });
        return favorites;
    }

    public Favorite getFavoriteById(Long id) {
        return favoriteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Favori bulunamadı"));
    }

    public Favorite saveFavorite(Favorite favorite) {
        return favoriteRepository.save(favorite);
    }

    public Favorite addFavoriteForUser(Long userId, Map<String, Object> favoriteData) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı"));
        
        @SuppressWarnings("unchecked")
        Map<String, Object> productData = (Map<String, Object>) favoriteData.get("product");
        Long productId = Long.valueOf(productData.get("id").toString());
        
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Ürün bulunamadı"));
        
        Favorite favorite = new Favorite();
        favorite.setUser(user);
        favorite.setProduct(product);
        
        return favoriteRepository.save(favorite);
    }

    public void deleteFavorite(Long id) {
        favoriteRepository.deleteById(id);
    }

    public void deleteAllFavorites() {
        favoriteRepository.deleteAll();
    }
} 