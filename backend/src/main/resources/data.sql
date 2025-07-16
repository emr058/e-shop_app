-- Test kullanıcıları ekle
INSERT INTO users (username, email, password, role, phone, address, city) VALUES
('testuser', 'test@example.com', '123456', 'USER', '05551234567', 'Test Adresi', 'İstanbul'),
('admin', 'admin@example.com', 'admin123', 'ADMIN', '05559876543', 'Admin Adresi', 'Ankara');

-- Ürünleri ekle
INSERT INTO products (name, description, image_url, price) 
SELECT * FROM (
    SELECT 'Bluetooth Kulaklik' as name, 'Kablosuz stereo kulaklik, gurultu onleyici ozellik' as description, 'http://localhost:8080/kulaklik.jpg' as image_url, 299.99 as price
    UNION ALL
    SELECT 'Mekanik Klavye', 'RGB aydinlatmali gaming klavye, Blue Switch', 'http://localhost:8080/klavye.jpg', 459.00
    UNION ALL
    SELECT 'Gaming Mouse', 'Yuksek DPI oyuncu faresi, ergonomik tasarim', 'http://localhost:8080/mouse.jpg', 189.50
    UNION ALL
    SELECT '4K Monitor', '27 inc UltraHD IPS panel, 144Hz yenileme hizi', 'http://localhost:8080/monitor.jpg', 1299.00
    UNION ALL
    SELECT 'Dizustu Bilgisayar', 'Intel i7 islemci, 16GB RAM, 512GB SSD', 'http://localhost:8080/logo.jpg', 8999.99
) AS tmp
WHERE NOT EXISTS (SELECT 1 FROM products);