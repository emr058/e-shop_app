package com.ecommerce.backend.controller;

import com.ecommerce.backend.Entity.Order;
import com.ecommerce.backend.Entity.OrderItem;
import com.ecommerce.backend.Entity.Product;
import com.ecommerce.backend.service.OrderService;
import com.ecommerce.backend.service.ProductService;
import com.ecommerce.backend.model.OrderStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
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
    @GetMapping("/seller/{sellerId}")
    public List<Order> getOrdersForSeller(@PathVariable Long sellerId){
        return orderService.getOrdersForSeller(sellerId);
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
            
            // Product'ı al
            Product product = productService.getProductById(productId);
            
            // Constructor kullanarak OrderItem oluştur (snapshot bilgileri otomatik set edilir)
            OrderItem orderItem = new OrderItem(savedOrder, product, quantity, price);
            
            return orderItem;
        }).collect(java.util.stream.Collectors.toList());
        
        savedOrder.setOrderItems(orderItems);
        return orderService.saveOrder(savedOrder);
    }

    @DeleteMapping("/{id}")
    public void deleteOrder(@PathVariable Long id) {
        orderService.deleteOrder(id);
    }

    @PutMapping("/{orderId}/status")
    public ResponseEntity<?> updateOrderStatus(@PathVariable Long orderId, @RequestBody Map<String, String> statusRequest) {
        try{
            OrderStatus newStatus = OrderStatus.valueOf(statusRequest.get("status"));
            Order updatedOrder = orderService.updateOrderStatus(orderId, newStatus);
            return ResponseEntity.ok(updatedOrder);
        }catch(IllegalArgumentException e){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Geçersiz sipariş durumu");
        }
    }
} 