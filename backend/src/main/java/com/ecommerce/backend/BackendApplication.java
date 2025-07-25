package com.ecommerce.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import com.ecommerce.backend.Entity.User;
import com.ecommerce.backend.Entity.Product;
import com.ecommerce.backend.Entity.Category;
import com.ecommerce.backend.model.Role;
import com.ecommerce.backend.service.UserService;
import com.ecommerce.backend.service.ProductService;
import com.ecommerce.backend.repository.UserRepository;
import com.ecommerce.backend.repository.ProductRepository;
import com.ecommerce.backend.repository.CategoryRepository;

@SpringBootApplication
public class BackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
	}
	
	@Bean
	ApplicationRunner init(UserRepository userRepository, UserService userService, 
						   ProductRepository productRepository, CategoryRepository categoryRepository,
						   ProductService productService) {
		return args -> {
			// Test kullanıcıları ekle (sadece mevcut değilse)
			try {
				if (userRepository.count() == 0) {
					// Test kullanıcısı
					User testUser = new User();
					testUser.setUsername("testuser");
					testUser.setEmail("test@example.com");
					testUser.setPassword("123456");
					testUser.setRole(Role.USER);
					testUser.setPhone("05551234567");
					testUser.setAddress("Test Adresi");
					testUser.setCity("İstanbul");
					userService.register(testUser);
					System.out.println("Test kullanıcısı oluşturuldu: test@example.com");
					
					// Admin kullanıcısı
					User adminUser = new User();
					adminUser.setUsername("admin");
					adminUser.setEmail("admin@example.com");
					adminUser.setPassword("admin123");
					adminUser.setRole(Role.ADMIN);
					adminUser.setPhone("05559876543");
					adminUser.setAddress("Admin Adresi");
					adminUser.setCity("Ankara");
					userService.register(adminUser);
					System.out.println("Admin kullanıcısı oluşturuldu: admin@example.com");
					
					// Seller kullanıcısı
					User sellerUser = new User();
					sellerUser.setUsername("seller");
					sellerUser.setEmail("seller@example.com");
					sellerUser.setPassword("seller123");
					sellerUser.setRole(Role.SELLER);
					sellerUser.setPhone("05557654321");
					sellerUser.setAddress("Seller Adresi");
					sellerUser.setCity("İzmir");
					userService.register(sellerUser);
					System.out.println("Seller kullanıcısı oluşturuldu: seller@example.com");
				} else {
					System.out.println("Kullanıcılar zaten mevcut, yeniden oluşturulmadı.");
				}
				
				// Kategorileri ekle (sadece mevcut değilse)
				if (categoryRepository.count() == 0) {
					Category elektronik = new Category();
					elektronik.setName("Elektronik");
					categoryRepository.save(elektronik);
					
					Category giyim = new Category();
					giyim.setName("Giyim");
					categoryRepository.save(giyim);
					
					Category spor = new Category();
					spor.setName("Spor");
					categoryRepository.save(spor);
					
					Category kitap = new Category();
					kitap.setName("Kitap");
					categoryRepository.save(kitap);
					
					Category evYasam = new Category();
					evYasam.setName("Ev & Yaşam");
					categoryRepository.save(evYasam);
					
					System.out.println("Kategoriler oluşturuldu.");
				}
				
				// Ürünleri ekle (sadece mevcut değilse) - External URL'ler ile
				if (productRepository.count() == 0) {
					User seller = userRepository.findByEmail("seller@example.com").orElse(null);
					Category elektronik = categoryRepository.findByName("Elektronik").orElse(null);
					Category giyim = categoryRepository.findByName("Giyim").orElse(null);
					Category spor = categoryRepository.findByName("Spor").orElse(null);
					Category kitap = categoryRepository.findByName("Kitap").orElse(null);
					Category evYasam = categoryRepository.findByName("Ev & Yaşam").orElse(null);
					
					if (seller != null && elektronik != null && giyim != null) {
						// 1. iPhone 15 Pro
						Product iphone = new Product();
						iphone.setName("iPhone 15 Pro");
						iphone.setDescription("Apple iPhone 15 Pro 256GB Doğal Titanyum, ProRAW fotoğraf, A17 Pro çip");
						iphone.setImageUrl("https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&h=400&fit=crop");
						iphone.setPrice(54999.00);
						iphone.setSeller(seller);
						iphone.setCategory(elektronik);
						productRepository.save(iphone);
						
						// 2. MacBook Air M2
						Product macbook = new Product();
						macbook.setName("MacBook Air M2");
						macbook.setDescription("Apple MacBook Air 13\" M2 çip, 8GB RAM, 256GB SSD, Retina ekran");
						macbook.setImageUrl("https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=400&fit=crop");
						macbook.setPrice(32999.00);
						macbook.setSeller(seller);
						macbook.setCategory(elektronik);
						productRepository.save(macbook);
						
						// 3. Sony Kulaklık
						Product kulaklik = new Product();
						kulaklik.setName("Sony WH-1000XM5");
						kulaklik.setDescription("Sony kablosuz gürültü önleyici kulaklık, 30 saate kadar pil ömrü");
						kulaklik.setImageUrl("https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop");
						kulaklik.setPrice(8999.00);
						kulaklik.setSeller(seller);
						kulaklik.setCategory(elektronik);
						productRepository.save(kulaklik);
						
						// 4. Nike Ayakkabı
						Product nike = new Product();
						nike.setName("Nike Air Jordan 1");
						nike.setDescription("Nike Air Jordan 1 Retro High OG spor ayakkabı, premium deri");
						nike.setImageUrl("https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop");
						nike.setPrice(4299.00);
						nike.setSeller(seller);
						nike.setCategory(giyim);
						productRepository.save(nike);
						
						// 5. Adidas Hoodie
						Product adidas = new Product();
						adidas.setName("Adidas Essentials Hoodie");
						adidas.setDescription("Adidas Essentials 3-Stripes kapüşonlu sweatshirt, %100 pamuk");
						adidas.setImageUrl("https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop");
						adidas.setPrice(899.00);
						adidas.setSeller(seller);
						adidas.setCategory(giyim);
						productRepository.save(adidas);
						
						// 6. Samsung Galaxy S24
						Product samsung = new Product();
						samsung.setName("Samsung Galaxy S24 Ultra");
						samsung.setDescription("Samsung Galaxy S24 Ultra 512GB, S Pen dahil, 200MP kamera, Titanium");
						samsung.setImageUrl("https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&h=400&fit=crop");
						samsung.setPrice(47999.00);
						samsung.setSeller(seller);
						samsung.setCategory(elektronik);
						productRepository.save(samsung);
						
						// 7. Yoga Matı (Spor)
						Product yogaMat = new Product();
						yogaMat.setName("Premium Yoga Matı");
						yogaMat.setDescription("6mm kalınlık, kaymaz yüzey, çevre dostu malzeme, yoga ve pilates için");
						yogaMat.setImageUrl("https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=400&fit=crop");
						yogaMat.setPrice(249.00);
						yogaMat.setSeller(seller);
						yogaMat.setCategory(spor);
						productRepository.save(yogaMat);
						
						// 8. Kahve Makinesi (Ev & Yaşam)
						Product kahveMakinesi = new Product();
						kahveMakinesi.setName("Delonghi Kahve Makinesi");
						kahveMakinesi.setDescription("Otomatik espresso makinesi, süt köpürtücü, 15 bar basınç, çift fincan");
						kahveMakinesi.setImageUrl("https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&h=400&fit=crop");
						kahveMakinesi.setPrice(2899.00);
						kahveMakinesi.setSeller(seller);
						kahveMakinesi.setCategory(evYasam);
						productRepository.save(kahveMakinesi);
						
						// 9. Programlama Kitabı (Kitap)
						Product kitapJava = new Product();
						kitapJava.setName("Clean Code - Temiz Kod");
						kitapJava.setDescription("Robert C. Martin - Yazılım geliştirme sanatı, temiz kod yazma rehberi");
						kitapJava.setImageUrl("https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop");
						kitapJava.setPrice(89.00);
						kitapJava.setSeller(seller);
						kitapJava.setCategory(kitap);
						productRepository.save(kitapJava);
						
						// 10. Levi's Kot Pantolon (Giyim)
						Product kotPantolon = new Product();
						kotPantolon.setName("Levi's 501 Original Jean");
						kotPantolon.setDescription("Klasik straight fit kot pantolon, %100 pamuk, vintage yıkama");
						kotPantolon.setImageUrl("https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop");
						kotPantolon.setPrice(599.00);
						kotPantolon.setSeller(seller);
						kotPantolon.setCategory(giyim);
						productRepository.save(kotPantolon);
						
						System.out.println("10 adet ürün başarıyla oluşturuldu.");
					}
				}
			} catch (Exception e) {
				System.out.println("Veri oluşturma hatası: " + e.getMessage());
				e.printStackTrace();
			}
		};
	}
}
