import { Grid, Container, Typography, Box, Paper, IconButton, useTheme, useMediaQuery } from "@mui/material";
import { useTranslation } from 'react-i18next';
import ProductCard from "../components/ProductCard";
import { useEffect, useState, useRef } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import { Search, FilterList, ChevronLeft, ChevronRight, Star } from "@mui/icons-material";
import { apiClient } from "../config/api";
import { useCategory } from "../context/CategoryContext";

export default function Shop() {
    const { t } = useTranslation();
    const [products, setProducts] = useState([]);
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [searchParams] = useSearchParams();
    const autoScrollRef = useRef(null);
    
    // Query string'ten parametreleri al
    const query = searchParams.get('query');
    const category = searchParams.get('category');
    
    // Öne çıkanlar carousel için state - her zaman 0'dan başla
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                if (query || category) {
                    // Arama veya kategori filtresi varsa
                    const response = await apiClient.get('/products/search', {
                        params: {
                            query: query || '',
                            category: category || ''
                        }
                    });
                    setProducts(response.data);
                } else {
                    // Arama yoksa tüm ürünleri getir
                    const data = await apiClient.get('/products/all');
                    setProducts(data.data);
                    
                    // Öne çıkanlar için ilk 5 ürünü al (en çok satılan simülasyonu)
                    setFeaturedProducts(data.data.slice(0, 5));
                }
            } catch (error) {
                console.error('Ürünler yüklenirken hata:', error);
            }
        };

        fetchProducts();
    }, [query, category]);

    // Auto scroll için useEffect
    useEffect(() => {
        if (featuredProducts.length > 0) {
            const interval = setInterval(() => {
                setCurrentIndex((prevIndex) => 
                    prevIndex === featuredProducts.length - 1 ? 0 : prevIndex + 1
                );
            }, 5000); // 5 saniyede bir değişir

            return () => clearInterval(interval);
        }
    }, [featuredProducts.length]);

    const nextSlide = () => {
        setCurrentIndex((prevIndex) => 
            prevIndex === featuredProducts.length - 1 ? 0 : prevIndex + 1
        );
    };

    const prevSlide = () => {
        setCurrentIndex((prevIndex) => 
            prevIndex === 0 ? featuredProducts.length - 1 : prevIndex - 1
        );
    };

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            {!query && !category && featuredProducts.length > 0 && (
                <Box sx={{ mb: 6 }}>
                    <Typography 
                        variant="h4" 
                        gutterBottom 
                        sx={{ 
                            textAlign: 'center',
                            color: '#243E36',
                            fontWeight: 700,
                            mb: 4
                        }}
                    >
                        {t("featured_products")}
                    </Typography>

                    <Paper 
                        elevation={3}
                        sx={{ 
                            position: 'relative',
                            borderRadius: 3,
                            overflow: 'hidden',
                            height: 400,
                            display: 'flex',
                            alignItems: 'center',
                            background: 'linear-gradient(135deg, #243E36 0%, #7CA982 100%)'
                        }}
                    >
                        {/* Carousel Content */}
                        <Box sx={{ 
                            width: '100%', 
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            color: 'white',
                            px: 4
                        }}>
                            <Box sx={{ flex: 1 }}>
                                <Typography variant="h3" sx={{ fontWeight: 700, mb: 2 }}>
                                    {featuredProducts[currentIndex]?.name}
                                </Typography>
                                <Typography variant="h6" sx={{ mb: 3, opacity: 0.9 }}>
                                    {featuredProducts[currentIndex]?.description}
                                </Typography>
                                <Box display="flex" alignItems="center" gap={1} sx={{ mb: 3 }}>
                                    <Star sx={{ color: '#FFD700' }} />
                                    <Typography variant="body1">
                                        {t("best_seller")}
                                    </Typography>
                                </Box>
                                <Typography variant="h4" sx={{ 
                                    fontWeight: 700,
                                    color: '#C2A83E'
                                }}>
                                    ₺{featuredProducts[currentIndex]?.price}
                                </Typography>
                            </Box>

                            <Box sx={{ 
                                flex: 1, 
                                display: 'flex', 
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}>
                                <img 
                                    src={featuredProducts[currentIndex]?.imageUrl} 
                                    alt={featuredProducts[currentIndex]?.name}
                                    style={{
                                        maxWidth: '300px',
                                        maxHeight: '300px',
                                        objectFit: 'contain',
                                        borderRadius: '12px'
                                    }}
                                />
                            </Box>
                        </Box>

                        {/* Navigation Arrows */}
                        <IconButton
                            onClick={prevSlide}
                            sx={{
                                position: 'absolute',
                                left: 20,
                                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                color: 'white',
                                '&:hover': {
                                    backgroundColor: 'rgba(255, 255, 255, 0.3)',
                                }
                            }}
                        >
                            <ChevronLeft />
                        </IconButton>

                        <IconButton
                            onClick={nextSlide}
                            sx={{
                                position: 'absolute',
                                right: 20,
                                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                color: 'white',
                                '&:hover': {
                                    backgroundColor: 'rgba(255, 255, 255, 0.3)',
                                }
                            }}
                        >
                            <ChevronRight />
                        </IconButton>

                        {/* Dots indicator */}
                        <Box sx={{
                            position: 'absolute',
                            bottom: 20,
                            left: '50%',
                            transform: 'translateX(-50%)',
                            display: 'flex',
                            gap: 1
                        }}>
                            {featuredProducts.map((_, index) => (
                                <Box
                                    key={index}
                                    onClick={() => setCurrentIndex(index)}
                                    sx={{
                                        width: 12,
                                        height: 12,
                                        borderRadius: '50%',
                                        backgroundColor: index === currentIndex ? '#C2A83E' : 'rgba(255, 255, 255, 0.4)',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease'
                                    }}
                                />
                            ))}
                        </Box>
                    </Paper>
                </Box>
            )}

            {/* Ürün Listesi */}
            <Box>
                {query && (
                    <Typography variant="h5" gutterBottom sx={{ color: '#243E36', mb: 3 }}>
                        "{query}" {t("search_results")} ({products.length} {t("products")})
                    </Typography>
                )}

                {category && (
                    <Typography variant="h5" gutterBottom sx={{ color: '#243E36', mb: 3 }}>
                        {t("category")}: {category} ({products.length} {t("products")})
                    </Typography>
                )}

                {!query && !category && (
                    <Typography variant="h5" gutterBottom sx={{ color: '#243E36', mb: 3 }}>
                        {t("all_products")} ({products.length} {t("products")})
                    </Typography>
                )}

                {products.length === 0 ? (
                    <Box 
                        display="flex" 
                        flexDirection="column" 
                        alignItems="center" 
                        justifyContent="center" 
                        minHeight="40vh"
                        textAlign="center"
                    >
                        <Search sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
                        <Typography variant="h5" color="text.secondary" gutterBottom>
                            {t("no_products_found")}
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            {query ? t("try_different_search") : t("products_will_be_added_soon")}
                        </Typography>
                    </Box>
                ) : (
                    <Grid container spacing={{ xs: 2, md: 3 }} sx={{ mt: 0 }}>
                        {products.map((product) => (
                            <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                                <ProductCard product={product} />
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Box>
        </Container>
    );
}