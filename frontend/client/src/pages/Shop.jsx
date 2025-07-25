import { Grid, Container, Typography, Box, Paper, IconButton, useTheme, useMediaQuery } from "@mui/material";
import { useTranslation } from 'react-i18next';
import ProductCard from "../components/ProductCard";
import { useEffect, useState } from "react";
import { getAllProducts } from "../api/products";
import { apiClient } from "../config/api";
import { useSearchParams } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";

export default function Shop() {
    const { t } = useTranslation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const isSmall = useMediaQuery(theme.breakpoints.down('sm'));
    const [products, setProducts] = useState([]);
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [searchParams] = useSearchParams();
    
    // Query string'ten parametreleri al
    const query = searchParams.get('query');
    const category = searchParams.get('category');
    
    // Öne çıkanlar carousel için state
    const [currentSlide, setCurrentSlide] = useState(0);
    
    // Arama yapılıyor mu kontrol et
    const isSearching = query || category;

    // Responsive için gösterilecek ürün sayısı
    const getItemsPerSlide = () => {
        if (isSmall) return 1; // Telefon: 1 ürün
        if (isMobile) return 2; // Tablet: 2 ürün  
        return 3; // Desktop: 3 ürün
    };

    const itemsPerSlide = getItemsPerSlide();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                if (query || category) {
                    // Arama veya kategori filtresi varsa search endpoint kullan
                    const response = await apiClient.get('/products/search', {
                        params: {
                            query: query || undefined,
                            categoryId: category ? parseInt(category) : undefined,
                        },
                    });
                    setProducts(response.data);
                } else {
                    // Arama yoksa tüm ürünleri getir
                    const data = await getAllProducts();
                    setProducts(data);
                    
                    // Öne çıkanlar için ilk 6 ürünü al
                    setFeaturedProducts(data.slice(0, 6));
                }
            } catch (error) {
                console.error('Ürünler yüklenirken hata:', error);
                setProducts([]);
            }
        };

        fetchProducts();
    }, [query, category]);

    // Carousel navigation - responsive
    const maxSlide = Math.max(0, featuredProducts.length - itemsPerSlide);
    
    const nextSlide = () => {
        setCurrentSlide((prev) => prev >= maxSlide ? 0 : prev + 1);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => prev <= 0 ? maxSlide : prev - 1);
    };

    // Ekran boyutu değiştiğinde slide'ı sıfırla
    useEffect(() => {
        setCurrentSlide(0);
    }, [itemsPerSlide]);

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            {/* Öne Çıkanlar - Sadece arama yapılmadığında göster */}
            {!isSearching && featuredProducts.length > 0 && (
                <Box sx={{ mb: 6 }}>
                    <Typography 
                        variant={isMobile ? "h5" : "h4"}
                        sx={{ 
                            mb: 3, 
                            color: '#243E36',
                            fontWeight: 700,
                            textAlign: isMobile ? 'center' : 'left'
                        }}
                    >
                        Öne Çıkanlar
                    </Typography>
                    
                    {/* Carousel Container */}
                    <Paper 
                        elevation={3}
                        sx={{ 
                            position: 'relative',
                            background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                            borderRadius: { xs: 2, md: 3 },
                            p: { xs: 2, md: 3 },
                            overflow: 'hidden'
                        }}
                    >
                        {/* Navigation Buttons - Sadece gerektiğinde göster */}
                        {featuredProducts.length > itemsPerSlide && (
                            <>
                                <IconButton
                                    onClick={prevSlide}
                                    sx={{
                                        position: 'absolute',
                                        left: { xs: 4, md: 8 },
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        zIndex: 2,
                                        backgroundColor: 'rgba(194, 168, 62, 0.9)',
                                        color: 'white',
                                        width: { xs: 36, md: 44 },
                                        height: { xs: 36, md: 44 },
                                        '&:hover': {
                                            backgroundColor: '#C2A83E',
                                            transform: 'translateY(-50%) scale(1.1)',
                                        }
                                    }}
                                >
                                    <ChevronLeft sx={{ fontSize: { xs: '1.2rem', md: '1.5rem' } }} />
                                </IconButton>
                                
                                <IconButton
                                    onClick={nextSlide}
                                    sx={{
                                        position: 'absolute',
                                        right: { xs: 4, md: 8 },
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        zIndex: 2,
                                        backgroundColor: 'rgba(194, 168, 62, 0.9)',
                                        color: 'white',
                                        width: { xs: 36, md: 44 },
                                        height: { xs: 36, md: 44 },
                                        '&:hover': {
                                            backgroundColor: '#C2A83E',
                                            transform: 'translateY(-50%) scale(1.1)',
                                        }
                                    }}
                                >
                                    <ChevronRight sx={{ fontSize: { xs: '1.2rem', md: '1.5rem' } }} />
                                </IconButton>
                            </>
                        )}

                        {/* Carousel Items */}
                        <Box
                            sx={{
                                display: 'flex',
                                transform: `translateX(-${currentSlide * (100 / itemsPerSlide)}%)`,
                                transition: 'transform 0.5s ease-in-out',
                                gap: { xs: 1, sm: 2 },
                                mx: { xs: 3, md: 5 }, // Navigation butonları için margin
                                width: `${Math.ceil(featuredProducts.length / itemsPerSlide) * 100}%`
                            }}
                        >
                            {featuredProducts.map((product) => (
                                <Box
                                    key={product.id}
                                    sx={{
                                        flex: `0 0 ${100 / itemsPerSlide}%`,
                                        px: { xs: 0.5, sm: 1 },
                                        minWidth: 0 // Flex shrink için
                                    }}
                                >
                                    <ProductCard product={product} />
                                </Box>
                            ))}
                        </Box>

                        {/* Carousel Indicators - Sadece gerektiğinde göster */}
                        {featuredProducts.length > itemsPerSlide && (
                            <Box 
                                sx={{ 
                                    display: 'flex', 
                                    justifyContent: 'center', 
                                    mt: { xs: 2, md: 3 },
                                    gap: { xs: 0.5, md: 1 }
                                }}
                            >
                                {Array.from({ length: maxSlide + 1 }).map((_, index) => (
                                    <Box
                                        key={index}
                                        onClick={() => setCurrentSlide(index)}
                                        sx={{
                                            width: { xs: 8, md: 12 },
                                            height: { xs: 8, md: 12 },
                                            borderRadius: '50%',
                                            backgroundColor: currentSlide === index ? '#C2A83E' : 'rgba(194, 168, 62, 0.3)',
                                            cursor: 'pointer',
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                backgroundColor: '#C2A83E',
                                                transform: 'scale(1.2)'
                                            }
                                        }}
                                    />
                                ))}
                            </Box>
                        )}
                    </Paper>
                </Box>
            )}

            {/* Ana Ürünler Bölümü */}
            <Typography 
                variant={isMobile ? "h5" : "h4"}
                gutterBottom 
                sx={{ 
                    mb: 3,
                    color: '#243E36',
                    fontWeight: 600,
                    textAlign: isMobile ? 'center' : 'left'
                }}
            >
                {isSearching ? 'Arama Sonuçları' : t("products")}
            </Typography>
            
            <Grid container spacing={{ xs: 2, md: 3 }}>
                {products.map((product) => (
                    <Grid item xs={12} sm={6} md={4} key={product.id}>
                        <ProductCard product={product} />
                    </Grid>
                ))}
            </Grid>
            
            {/* Ürün bulunamadı mesajı */}
            {products.length === 0 && (
                <Box 
                    sx={{ 
                        textAlign: 'center', 
                        py: { xs: 4, md: 8 },
                        color: 'text.secondary'
                    }}
                >
                    <Typography variant={isMobile ? "body1" : "h6"} gutterBottom>
                        {isSearching ? 'Arama kriterlerinize uygun ürün bulunamadı' : 'Henüz ürün bulunmamaktadır'}
                    </Typography>
                    <Typography variant="body2">
                        {isSearching ? 'Farklı anahtar kelimeler deneyebilirsiniz' : 'Yakında yeni ürünler eklenecektir'}
                    </Typography>
                </Box>
            )}
        </Container>
    );
}