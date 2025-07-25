package com.ecommerce.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import com.ecommerce.backend.Entity.Order;
import com.ecommerce.backend.Entity.User;
import com.ecommerce.backend.model.Role;
import com.ecommerce.backend.repository.OrderRepository;
import com.ecommerce.backend.service.UserService;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserService userService;

    // ========== ORDER MANAGEMENT ==========
    @GetMapping("/orders")
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    @DeleteMapping("/orders/{id}")
    public ResponseEntity<?> deleteOrder(@PathVariable Long id) {
        Optional<Order> order = orderRepository.findById(id);
        if (order.isPresent()) {
            orderRepository.deleteById(id);
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // ========== USER MANAGEMENT ==========
    @GetMapping("/users")
    public List<User> getAllUsers() {
        List<User> users = userService.getAllUsers();
        // Password'ları güvenlik için çıkar
        users.forEach(user -> user.setPassword(null));
        return users;
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        try {
            userService.deleteUser(id);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/users/{id}/role")
    public ResponseEntity<?> updateUserRole(@PathVariable Long id, @RequestBody Map<String, String> roleUpdate) {
        try {
            String roleString = roleUpdate.get("role");
            Role newRole = Role.valueOf(roleString.toUpperCase());
            
            User updatedUser = userService.updateUserRole(id, newRole);
            updatedUser.setPassword(null); // Password'u güvenlik için çıkar
            return ResponseEntity.ok(updatedUser);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", "Geçersiz rol: " + roleUpdate.get("role")));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}