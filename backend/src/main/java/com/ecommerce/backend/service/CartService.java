package com.ecommerce.backend.service;

import com.ecommerce.backend.Entity.Cart;
import com.ecommerce.backend.Entity.CartItem;
import com.ecommerce.backend.Entity.User;
import com.ecommerce.backend.repository.CartRepository;
import com.ecommerce.backend.repository.ProductRepository;
import com.ecommerce.backend.repository.UserRepository;
import com.ecommerce.backend.Entity.Product;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.ArrayList;

@Service
@RequiredArgsConstructor
public class CartService {

private final CartRepository cartRepository;
private final ProductRepository productRepository;
private final UserRepository userRepository;

public Cart getCart(Long cartId) {
    Cart cart = cartRepository.findById(cartId).orElse(new Cart());
    
    // Items'ı manuel olarak yükle (LAZY loading için)
    if (cart.getItems() != null) {
        cart.getItems().size(); // LAZY loading'i tetikle
    }
    
    return cart;
}

public Cart addToCart(Long cartId, Long productId, int quantity) {
    Cart cart = cartRepository.findById(cartId).orElse(new Cart());
    
    // Items listesi null ise yeni ArrayList oluştur
    if (cart.getItems() == null) {
        cart.setItems(new ArrayList<>());
    }

    Product product = productRepository.findById(productId)
            .orElseThrow(() -> new RuntimeException("Ürün bulunamadı"));

    // Mevcut ürün sepette var mı kontrol et
    CartItem existingItem = cart.getItems().stream()
            .filter(item -> item.getProduct().getId().equals(productId))
            .findFirst()
            .orElse(null);
    
    if (existingItem != null) {
        // Mevcut ürünün miktarını artır
        existingItem.setQuantity(existingItem.getQuantity() + quantity);
    } else {
        // Yeni ürün ekle
        CartItem newItem = new CartItem();
        newItem.setCart(cart); // Cart referansını ayarla
        newItem.setProduct(product);
        newItem.setQuantity(quantity);
        cart.getItems().add(newItem);
    }
    
    return cartRepository.save(cart);
}

public Cart removeItem(Long cartId, Long itemId) {
    Cart cart = cartRepository.findById(cartId)
            .orElseThrow(() -> new RuntimeException("Sepet bulunamadı"));

    cart.getItems().removeIf(item -> item.getId().equals(itemId));
    return cartRepository.save(cart);
}

public Cart saveCart(Cart cart) {
    return cartRepository.save(cart);
}

public Cart getCartByUserId(Long userId) {
    Cart cart = cartRepository.findByUserId(userId).orElseGet(() -> {
        // Kullanıcının sepeti yoksa yeni sepet oluştur
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı"));
        Cart newCart = new Cart();
        newCart.setUser(user);
        newCart.setItems(new ArrayList<>());
        return cartRepository.save(newCart);
    });
    
    // Items'ı manuel olarak yükle (LAZY loading için)
    if (cart.getItems() != null) {
        cart.getItems().size(); // LAZY loading'i tetikle
    }
    
    return cart;
}

public Cart addToCartForUser(Long userId, Long productId, int quantity) {
    Cart cart = getCartByUserId(userId);
    
    // Items listesi null ise yeni ArrayList oluştur
    if (cart.getItems() == null) {
        cart.setItems(new ArrayList<>());
    }

    Product product = productRepository.findById(productId)
            .orElseThrow(() -> new RuntimeException("Ürün bulunamadı"));

    // Mevcut ürün sepette var mı kontrol et
    CartItem existingItem = cart.getItems().stream()
            .filter(item -> item.getProduct().getId().equals(productId))
            .findFirst()
            .orElse(null);
    
    if (existingItem != null) {
        // Mevcut ürünün miktarını artır
        existingItem.setQuantity(existingItem.getQuantity() + quantity);
    } else {
        // Yeni ürün ekle
        CartItem newItem = new CartItem();
        newItem.setCart(cart);
        newItem.setProduct(product);
        newItem.setQuantity(quantity);
        cart.getItems().add(newItem);
    }
    
    return cartRepository.save(cart);
}

public void clearCartForUser(Long userId) {
    Cart cart = cartRepository.findByUserId(userId).orElse(null);
    if (cart != null) {
        cart.getItems().clear();
        cartRepository.save(cart);
    }
}

public Cart updateQuantityForUser(Long userId, Long productId, int quantity) {
    Cart cart = getCartByUserId(userId);
    
    if (cart.getItems() != null) {
        CartItem existingItem = cart.getItems().stream()
                .filter(item -> item.getProduct().getId().equals(productId))
                .findFirst()
                .orElse(null);
        
        if (existingItem != null) {
            if (quantity <= 0) {
                cart.getItems().remove(existingItem);
            } else {
                existingItem.setQuantity(quantity);
            }
            return cartRepository.save(cart);
        }
    }
    
    throw new RuntimeException("Ürün sepette bulunamadı");
}

public Cart removeItemByProductId(Long userId, Long productId) {
    Cart cart = getCartByUserId(userId);
    
    if (cart.getItems() != null) {
        cart.getItems().removeIf(item -> item.getProduct().getId().equals(productId));
        return cartRepository.save(cart);
    }
    
    return cart;
}
}