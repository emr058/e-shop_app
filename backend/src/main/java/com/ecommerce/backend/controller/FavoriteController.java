package com.ecommerce.backend.controller;

import com.ecommerce.backend.Entity.Favorite;
import com.ecommerce.backend.service.FavoriteService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/favorites")
@RequiredArgsConstructor
public class FavoriteController {

    private final FavoriteService favoriteService;

    @GetMapping("/user/{userId}")
    public List<Favorite> getAllFavorites(@PathVariable Long userId) {
        return favoriteService.getAllFavoritesByUserId(userId);
    }

    @GetMapping("/{id}")
    public Favorite getFavoriteById(@PathVariable Long id) {
        return favoriteService.getFavoriteById(id);
    }

    @PostMapping("/user/{userId}")
    public Favorite addFavorite(@PathVariable Long userId, @RequestBody Map<String, Object> favoriteData) {
        return favoriteService.addFavoriteForUser(userId, favoriteData);
    }

    @DeleteMapping("/{id}")
    public void removeFavorite(@PathVariable Long id) {
        favoriteService.deleteFavorite(id);
    }

    @DeleteMapping
    public void clearAllFavorites() {
        favoriteService.deleteAllFavorites();
    }
} 