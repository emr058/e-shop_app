package com.ecommerce.backend.repository;
import com.ecommerce.backend.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User,Long>{
    Optional<User> findByEmail(String email);
    Optional<User> findByUsername(String username);
    boolean existsByEmail(String email);
    boolean existsByUsername(String username);
    void deleteByEmail(String email);
    void deleteByUsername(String username);
    void deleteById(Long id);
}
