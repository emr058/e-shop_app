package com.ecommerce.backend.service;

import com.ecommerce.backend.Entity.Review;
import com.ecommerce.backend.Entity.Product;
import com.ecommerce.backend.Entity.User;
import com.ecommerce.backend.repository.ReviewRepository;
import com.ecommerce.backend.repository.ProductRepository;
import com.ecommerce.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public List<Review> getReviewsByProductId(Long productId) {
        return reviewRepository.findByProductIdOrderByReviewDateDesc(productId);
    }

    public List<Review> getReviewsByUserId(Long userId) {
        return reviewRepository.findByUserIdOrderByReviewDateDesc(userId);
    }

    public Review createReview(Long productId, Long userId, Integer rating, String comment) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Ürün bulunamadı: " + productId));
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı: " + userId));

        // Kullanıcı daha önce bu ürünü değerlendirmiş mi kontrol et
        if (reviewRepository.existsByProductIdAndUserId(productId, userId)) {
            throw new RuntimeException("Bu ürünü zaten değerlendirdiniz.");
        }

        Review review = new Review(product, user, rating, comment);
        return reviewRepository.save(review);
    }

    public Review updateReview(Long reviewId, Integer rating, String comment) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Yorum bulunamadı: " + reviewId));
        
        review.setRating(rating);
        review.setComment(comment);
        return reviewRepository.save(review);
    }

    public void deleteReview(Long reviewId) {
        if (!reviewRepository.existsById(reviewId)) {
            throw new RuntimeException("Yorum bulunamadı: " + reviewId);
        }
        reviewRepository.deleteById(reviewId);
    }

    public Double getAverageRatingByProductId(Long productId) {
        Double average = reviewRepository.findAverageRatingByProductId(productId);
        return average != null ? average : 0.0;
    }

    public Long getReviewCountByProductId(Long productId) {
        return reviewRepository.countByProductId(productId);
    }

    public Review getReviewById(Long reviewId) {
        return reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Yorum bulunamadı: " + reviewId));
    }
} 