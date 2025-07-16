package com.ecommerce.backend.service;
import com.ecommerce.backend.Entity.User;
import com.ecommerce.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {
    private final UserRepository userRepo;

    public UserService(UserRepository userRepo){
        this.userRepo=userRepo;
    }

    public Optional<User> login(String email,String password){
        return userRepo.findByEmail(email)
        .filter(user->user.getPassword().equals(password));
    }

    public User register(User user){
        if(userRepo.existsByEmail(user.getEmail())){
            throw new RuntimeException("Bu e-posta adresi zaten kullanılıyor");
        }
        if(userRepo.existsByUsername(user.getUsername())){
            throw new RuntimeException("Bu kullanıcı adı zaten kullanılıyor");
        }
        return userRepo.save(user);
    }

    public Optional<User> getUserById(Long id){
        return userRepo.findById(id);
    }

    public void deleteUser(Long id){
        userRepo.deleteById(id);
    }

    public User updateUser(User user){
        return userRepo.save(user);
    }
}
