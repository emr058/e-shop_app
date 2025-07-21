package com.ecommerce.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import com.ecommerce.backend.Entity.Order;
import com.ecommerce.backend.Entity.User;
import com.ecommerce.backend.repository.OrderRepository;
import com.ecommerce.backend.repository.UserRepository;
import com.ecommerce.backend.repository.ProductRepository;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin")
public class AdminController{

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;



    @GetMapping("/orders")
    public List<Order> getAllOrders(){
        return orderRepository.findAll();
    }

    @GetMapping("/users")
    public List<User> getAllUsers(){
        List<User> users = userRepository.findAll();
        // Password'ları güvenlik için çıkar
        users.forEach(user -> user.setPassword(null));
        return users;
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id){
        Optional<User> user = userRepository.findById(id);
        if (user.isPresent()) {
            userRepository.deleteById(id);
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/users/{id}/role")
    public ResponseEntity<?> updateUserRole(@PathVariable Long id, @RequestBody Map<String, String> roleUpdate){
        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            user.setRole(roleUpdate.get("role"));
            userRepository.save(user);
            user.setPassword(null); // Password'u güvenlik için çıkar
            return ResponseEntity.ok(user);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/orders/{id}")
    public ResponseEntity<?> deleteOrder(@PathVariable Long id){
        Optional<Order> order = orderRepository.findById(id);
        if (order.isPresent()) {
            orderRepository.deleteById(id);
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

}