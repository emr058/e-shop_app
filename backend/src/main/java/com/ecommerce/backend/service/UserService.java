package com.ecommerce.backend.service;

import com.ecommerce.backend.Entity.User;
import com.ecommerce.backend.model.Role;
import com.ecommerce.backend.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    private final UserRepository userRepo;
    private final BCryptPasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepo) {
        this.userRepo = userRepo;
        this.passwordEncoder = new BCryptPasswordEncoder();
    }

    public Optional<User> login(String email, String password) {
        return userRepo.findByEmail(email)
            .filter(user -> passwordEncoder.matches(password, user.getPassword()));
    }

    public User register(User user) {
        if (userRepo.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Bu e-posta adresi zaten kullanılıyor");
        }
        if (userRepo.existsByUsername(user.getUsername())) {
            throw new RuntimeException("Bu kullanıcı adı zaten kullanılıyor");
        }
        
        // Şifreyi hash'le
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        
        // Eğer role set edilmemişse USER yap
        if (user.getRole() == null) {
            user.setRole(Role.USER);
        }
        
        return userRepo.save(user);
    }

    public Optional<User> getUserById(Long id) {
        return userRepo.findById(id);
    }

    public void deleteUser(Long id) {
        userRepo.deleteById(id);
    }

    public User updateUser(User user) {
        User existingUser = userRepo.findById(user.getId())
            .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı"));
        
        // Eğer şifre değiştiriliyorsa hash'le
        if (user.getPassword() != null && !user.getPassword().isEmpty()) {
            existingUser.setPassword(passwordEncoder.encode(user.getPassword()));
        }
        
        // Diğer alanları güncelle
        if (user.getUsername() != null) existingUser.setUsername(user.getUsername());
        if (user.getEmail() != null) existingUser.setEmail(user.getEmail());
        if (user.getRole() != null) existingUser.setRole(user.getRole());
        if (user.getPhone() != null) existingUser.setPhone(user.getPhone());
        if (user.getAddress() != null) existingUser.setAddress(user.getAddress());
        if (user.getCity() != null) existingUser.setCity(user.getCity());
        
        return userRepo.save(existingUser);
    }
    
    public User updateUserRole(Long userId, Role newRole) {
        User user = userRepo.findById(userId)
            .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı"));
        user.setRole(newRole);
        return userRepo.save(user);
    }
    
    public List<User> getAllUsers() {
        return userRepo.findAll();
    }
}
