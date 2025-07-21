package com.ecommerce.backend.controller;

import com.ecommerce.backend.Entity.User;
import com.ecommerce.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class UserController {
    
    private final UserService userService;
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginRequest) {
        String email = loginRequest.get("email");
        String password = loginRequest.get("password");
        
        Optional<User> user = userService.login(email, password);
        
        if (user.isPresent()) {
            // Password'u response'tan çıkar (güvenlik için)
            User userResponse = user.get();
            userResponse.setPassword(null);
            return ResponseEntity.ok(userResponse);
        } else {
            return ResponseEntity.badRequest()
                .body(Map.of("error", "Invalid email or password"));
        }
    }
    
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        try {
            User savedUser = userService.register(user);
            savedUser.setPassword(null);  // Password'u response'tan çıkar (güvenlik için)
            return ResponseEntity.ok(savedUser);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", e.getMessage()));
        }
    }
    
    @GetMapping("/user/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        Optional<User> user = userService.getUserById(id);
        
        if (user.isPresent()) {
            User userResponse = user.get();
            userResponse.setPassword(null); // Password'u response'tan çıkar
            return ResponseEntity.ok(userResponse);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    @PutMapping("/user/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User user) {
        user.setId(id);
        User updatedUser = userService.updateUser(user);
        updatedUser.setPassword(null); // Password'u response'tan çıkar
        return ResponseEntity.ok(updatedUser);
    }
    
    @DeleteMapping("/user/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.ok().build();
    }
} 