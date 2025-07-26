package com.ecommerce.backend.controller;

import com.ecommerce.backend.Entity.Review;
import com.ecommerce.backend.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @GetMapping("/product/{productId}")
    public List<Review> getReviewsByProduct(@PathVariable Long productId) {
        return reviewService.getReviewsByProductId(productId);
    }

    @GetMapping("/user/{userId}")
    public List<Review> getReviewsByUser(@PathVariable Long userId) {
        return reviewService.getReviewsByUserId(userId);
    }

    @GetMapping("/product/{productId}/stats")
    public ResponseEntity<Map<String, Object>> getProductReviewStats(@PathVariable Long productId) {
        Double averageRating = reviewService.getAverageRatingByProductId(productId);
        Long reviewCount = reviewService.getReviewCountByProductId(productId);
        
        Map<String, Object> stats = Map.of(
            "averageRating", averageRating,
            "reviewCount", reviewCount
        );
        
        return ResponseEntity.ok(stats);
    }

    @PostMapping
    public ResponseEntity<Review> createReview(@RequestBody Map<String, Object> reviewRequest) {
        try {
            Long productId = Long.valueOf(reviewRequest.get("productId").toString());
            Long userId = Long.valueOf(reviewRequest.get("userId").toString());
            Integer rating = Integer.valueOf(reviewRequest.get("rating").toString());
            String comment = reviewRequest.get("comment").toString();

            Review review = reviewService.createReview(productId, userId, rating, comment);
            return ResponseEntity.ok(review);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{reviewId}")
    public ResponseEntity<Review> updateReview(
            @PathVariable Long reviewId, 
            @RequestBody Map<String, Object> reviewRequest) {
        try {
            Integer rating = Integer.valueOf(reviewRequest.get("rating").toString());
            String comment = reviewRequest.get("comment").toString();

            Review updatedReview = reviewService.updateReview(reviewId, rating, comment);
            return ResponseEntity.ok(updatedReview);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{reviewId}")
    public ResponseEntity<Void> deleteReview(@PathVariable Long reviewId) {
        try {
            reviewService.deleteReview(reviewId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/{reviewId}")
    public ResponseEntity<Review> getReviewById(@PathVariable Long reviewId) {
        try {
            Review review = reviewService.getReviewById(reviewId);
            return ResponseEntity.ok(review);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
} 