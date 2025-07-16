package com.ecommerce.backend.controller;

import com.ecommerce.backend.Entity.Order;
import com.ecommerce.backend.Entity.OrderItem;
import com.ecommerce.backend.service.OrderService;
import com.ecommerce.backend.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;
    private final ProductService productService;

    @GetMapping("/user/{userId}")
    public List<Order> getAllOrdersByUser(@PathVariable Long userId) {
        return orderService.getAllOrdersByUserId(userId);
    }

    @GetMapping("/{id}")
    public Order getOrderById(@PathVariable Long id) {
        return orderService.getOrderById(id);
    }

    @PostMapping("/user/{userId}")
    public Order createOrder(@PathVariable Long userId, @RequestBody Map<String, Object> orderRequest) {
        // Frontend'ten gelen veriyi parse et
        String orderDateStr = (String) orderRequest.get("orderDate");
        
        // Number tiplerini güvenli şekilde çevir
        Number totalAmountNum = (Number) orderRequest.get("totalAmount");
        Double totalAmount = totalAmountNum.doubleValue();
        
        @SuppressWarnings("unchecked")
        List<Map<String, Object>> orderItemsData = (List<Map<String, Object>>) orderRequest.get("orderItems");

        // LocalDateTime'a çevir
        LocalDateTime orderDate = LocalDateTime.parse(orderDateStr, DateTimeFormatter.ISO_DATE_TIME);
        
        // Order oluştur
        Order order = new Order();
        order.setOrderDate(orderDate);
        order.setTotalAmount(totalAmount);
        
        // Order'ı önce kaydet ki ID alabilelim
        Order savedOrder = orderService.saveOrderForUser(userId, order);
        
        // OrderItem'ları oluştur
        List<OrderItem> orderItems = orderItemsData.stream().map(itemData -> {
            @SuppressWarnings("unchecked")
            Map<String, Object> productData = (Map<String, Object>) itemData.get("product");
            Long productId = Long.valueOf(productData.get("id").toString());
            
            // Number tiplerini güvenli şekilde çevir
            Number quantityNum = (Number) itemData.get("quantity");
            Integer quantity = quantityNum.intValue();
            
            Number priceNum = (Number) itemData.get("price");
            Double price = priceNum.doubleValue();
            
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(savedOrder);
            orderItem.setProduct(productService.getProductById(productId));
            orderItem.setQuantity(quantity);
            orderItem.setUnitPrice(price);
            
            return orderItem;
        }).collect(java.util.stream.Collectors.toList());
        
        savedOrder.setOrderItems(orderItems);
        return orderService.saveOrder(savedOrder);
    }

    @DeleteMapping("/{id}")
    public void deleteOrder(@PathVariable Long id) {
        orderService.deleteOrder(id);
    }
} 