-- Test kullanıcıları ekle (sadece mevcut değilse)
MERGE INTO users (username, email, password, role, phone, address, city) KEY(email) VALUES
('testuser', 'test@example.com', '123456', 'USER', '05551234567', 'Test Adresi', 'İstanbul'),
('admin', 'admin@example.com', 'admin123', 'ADMIN', '05559876543', 'Admin Adresi', 'Ankara');

-- Ürünleri ekle (sadece mevcut değilse)
MERGE INTO products (name, description, image_url, price) KEY(name) VALUES
('iPhone 15 Pro', 'Apple iPhone 15 Pro 256GB Doğal Titanyum, ProRAW fotoğraf, A17 Pro çip', 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&h=400&fit=crop', 54999.00),
('MacBook Air M2', 'Apple MacBook Air 13" M2 çip, 8GB RAM, 256GB SSD, Retina ekran', 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=400&fit=crop', 32999.00),
('Sony WH-1000XM5', 'Sony kablosuz gürültü önleyici kulaklık, 30 saate kadar pil ömrü', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop', 8999.00),
('Nike Air Jordan 1', 'Nike Air Jordan 1 Retro High OG spor ayakkabı, premium deri', 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop', 4299.00),
('Adidas Essentials Hoodie', 'Adidas Essentials 3-Stripes kapüşonlu sweatshirt, %100 pamuk', 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop', 899.00),
('Levi''s 501 Original Jean', 'Levi''s 501 Original straight fit kot pantolon, klasik kesim', 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop', 1599.00),
('Apple Watch Series 9', 'Apple Watch Series 9 45mm GPS, Spor Loop kordon, sağlık sensörleri', 'https://images.unsplash.com/photo-1434493907317-a46b5bbe7834?w=400&h=400&fit=crop', 12999.00),
('Samsung 55" OLED TV', 'Samsung 55" 4K QLED Smart TV, HDR10+, 120Hz, Quantum Dot teknolojisi', 'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=400&h=400&fit=crop', 18999.00),
('Kindle Paperwhite', 'Amazon Kindle Paperwhite 11. nesil, 6.8" ekran, su geçirmez, 32GB', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop', 2299.00),
('Manduka PRO Yoga Matı', 'Manduka PRO yoga matı 6mm kalınlık, kaymaz yüzey, ömür boyu garanti', 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=400&fit=crop', 1899.00);