-- Test kullanıcıları ekle (duplicate'ları ignore et)
INSERT OR IGNORE INTO users (username, email, password, role, phone, address, city) VALUES
('testuser', 'test@example.com', '123456', 'USER', '05551234567', 'Test Adresi', 'İstanbul'),
('admin', 'admin@example.com', 'admin123', 'ADMIN', '05559876543', 'Admin Adresi', 'Ankara'),
('Satici', 'seller@example.com', 'seller123', 'SELLER', '05559876543', 'Seller Adresi', 'Ankara');

-- Kategorileri ekle (duplicate'ları ignore et)
INSERT OR IGNORE INTO categories (name) VALUES
('Elektronik'),
('Giyim'),
('Spor'),
('Kitap'),
('Ev & Yaşam');

-- Ürünleri ekle (kategori ID'leri ile) - local image files kullanarak (duplicate'ları ignore et)
INSERT OR IGNORE INTO products (name, description, image_url, price, seller_id, category_id) VALUES
('Gaming Klavye', 'Mekanik gaming klavye, RGB aydınlatma, macro tuşları', 'http://localhost:8080/klavye.jpg', 899.00, 3, 1),
('Gaming Kulaklık', 'Stereo gaming kulaklık, mikrofon, ses kontrolü', 'http://localhost:8080/kulaklik.jpg', 599.00, 3, 1),
('Gaming Monitör', '24" Full HD gaming monitör, 144Hz, 1ms gecikme', 'http://localhost:8080/monitor.jpg', 2999.00, 3, 1),
('Gaming Mouse', 'Optik gaming mouse, DPI ayarlanabilir, ergonomik tasarım', 'http://localhost:8080/mouse.jpg', 399.00, 3, 1),
('MacBook Air M2', 'Apple MacBook Air 13" M2 çip, 8GB RAM, 256GB SSD, Retina ekran', 'http://localhost:8080/logo.jpg', 32999.00, 3, 1),
('Sony WH-1000XM5', 'Sony kablosuz gürültü önleyici kulaklık, 30 saate kadar pil ömrü', 'http://localhost:8080/kulaklik.jpg', 8999.00, 3, 1),
('Nike Air Jordan 1', 'Nike Air Jordan 1 Retro High OG spor ayakkabı, premium deri', 'http://localhost:8080/logo.jpg', 4299.00, 3, 2),
('Adidas Essentials Hoodie', 'Adidas Essentials 3-Stripes kapüşonlu sweatshirt, %100 pamuk', 'http://localhost:8080/logo.jpg', 899.00, 3, 2),
('Levi''s 501 Original Jean', 'Levi''s 501 Original straight fit kot pantolon, klasik kesim', 'http://localhost:8080/logo.jpg', 1599.00, 3, 2),
('Apple Watch Series 9', 'Apple Watch Series 9 45mm GPS, Spor Loop kordon, sağlık sensörleri', 'http://localhost:8080/logo.jpg', 12999.00, 3, 1);