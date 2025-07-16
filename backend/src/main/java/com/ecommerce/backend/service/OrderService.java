package com.ecommerce.backend.service;

import com.ecommerce.backend.Entity.Order;
import com.ecommerce.backend.Entity.User;
import com.ecommerce.backend.repository.OrderRepository;
import com.ecommerce.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;

    public List<Order> getAllOrders() {
        return orderRepository.findAllWithOrderItemsAndProducts();
    }

    public List<Order> getAllOrdersByUserId(Long userId) {
        return orderRepository.findAllByUserIdWithOrderItemsAndProducts(userId);
    }

    public Order getOrderById(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Sipariş bulunamadı"));
    }

    public Order saveOrder(Order order) {
        return orderRepository.save(order);
    }

    public Order saveOrderForUser(Long userId, Order order) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı"));
        order.setUser(user);
        return orderRepository.save(order);
    }

    public void deleteOrder(Long id) {
        orderRepository.deleteById(id);
    }
} 