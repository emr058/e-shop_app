package com.ecommerce.backend.controller;

import com.ecommerce.backend.Entity.Cart;
import com.ecommerce.backend.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

private final CartService cartService;

@GetMapping("/{userId}")
public Cart getCartByUser(@PathVariable Long userId) {
    return cartService.getCartByUserId(userId);
}

@PostMapping("/{userId}/add")
public Cart addToCart(
        @PathVariable Long userId,
        @RequestParam Long productId,
        @RequestParam(defaultValue = "1") int quantity
) {
    return cartService.addToCartForUser(userId, productId, quantity);
}

@DeleteMapping("/{cartId}/remove/{itemId}")
public Cart removeItem(@PathVariable Long cartId, @PathVariable Long itemId) {
    return cartService.removeItem(cartId, itemId);
}

@DeleteMapping("/{userId}/clear")
public void clearCart(@PathVariable Long userId) {
    cartService.clearCartForUser(userId);
}

@PostMapping
public Cart saveCart(@RequestBody Cart cart) {
    return cartService.saveCart(cart);
}
}