import { 
    Container, 
    Typography, 
    Box, 
    Card, 
    CardContent, 
    Button, 
    Grid, 
    Divider,
    Chip,
    Rating,
    Avatar,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    TextField,
    CardMedia,
    IconButton,
    Breadcrumbs,
    Link,
    useTheme,
    useMediaQuery,
    Skeleton,
    Alert
} from "@mui/material";
import { 
    ShoppingCart, 
    Favorite, 
    FavoriteBorder, 
    Share,
    ArrowBack,
    Star,
    StarBorder,
    NavigateNext,
    Person,
    LocalShipping,
    Shield,
    SwapHoriz
} from "@mui/icons-material";
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link as RouterLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useFavorites } from "../context/FavoritesContext";
import { useTranslation } from 'react-i18next';
import { apiClient } from "../config/api";
import ProductCard from "../components/ProductCard";

export default function ProductDetail() {
    const { t } = useTranslation();
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { addToCart } = useCart();
    const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [newReview, setNewReview] = useState({
        rating: 5,
        comment: ''
    });

    // Ürün bilgilerini yükle
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const response = await apiClient.get(`/products/${id}`);
                setProduct(response.data);
                
                // Aynı kategorideki diğer ürünleri getir (benzer ürünler)
                if (response.data.category?.id) {
                    const relatedResponse = await apiClient.get('/products/search', {
                        params: { categoryId: response.data.category.id }
                    });
                    // Mevcut ürünü çıkar ve ilk 4'ünü al
                    const filtered = relatedResponse.data
                        .filter(p => p.id !== parseInt(id))
                        .slice(0, 4);
                    setRelatedProducts(filtered);
                }
                
                setError(null);
            } catch (error) {
                console.error('Ürün yüklenirken hata:', error);
                setError('Ürün bulunamadı veya yüklenirken bir hata oluştu.');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchProduct();
        }
    }, [id]);

    // Yorumları ve istatistikleri yükle
    useEffect(() => {
        const fetchReviews = async () => {
            if (product?.id) {
                try {
                    // Yorumları getir
                    const reviewsResponse = await apiClient.get(`/reviews/product/${product.id}`);
                    setReviews(reviewsResponse.data);
                } catch (error) {
                    console.error('Yorumlar yüklenirken hata:', error);
                    // Hata durumunda boş liste kullan
                    setReviews([]);
                }
            }
        };

        fetchReviews();
    }, [product]);

    const handleAddToCart = () => {
        for (let i = 0; i < quantity; i++) {
            addToCart(product);
        }
        // Başarı mesajı gösterilebilir
    };

    const handleFavoriteToggle = () => {
        if (isFavorite(product.id)) {
            removeFromFavorites(product.id);
        } else {
            addToFavorites(product);
        }
    };

    const handleReviewSubmit = async () => {
        if (!user) {
            alert('Yorum yapmak için giriş yapmalısınız.');
            return;
        }
        
        if (!newReview.comment.trim()) {
            alert('Lütfen yorum yazınız.');
            return;
        }

        try {
            const reviewData = {
                productId: product.id,
                userId: user.id,
                rating: newReview.rating,
                comment: newReview.comment.trim()
            };

            const response = await apiClient.post('/reviews', reviewData);
            
            // Yeni yorumu listeye ekle
            setReviews([response.data, ...reviews]);
            setNewReview({ rating: 5, comment: '' });
            
            alert('Yorumunuz başarıyla eklendi!');
        } catch (error) {
            console.error('Yorum eklenirken hata:', error);
            if (error.response?.status === 400) {
                alert('Bu ürünü zaten değerlendirdiniz.');
            } else {
                alert('Yorum eklenirken bir hata oluştu.');
            }
        }
    };

    // Loading durumu
    if (loading) {
        return (
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Grid container spacing={4}>
                    <Grid item xs={12} md={6}>
                        <Skeleton variant="rectangular" height={400} />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Skeleton variant="text" sx={{ fontSize: '2rem', mb: 2 }} />
                        <Skeleton variant="text" sx={{ fontSize: '1rem', mb: 1 }} />
                        <Skeleton variant="text" sx={{ fontSize: '1rem', mb: 1 }} />
                        <Skeleton variant="text" sx={{ fontSize: '1rem', mb: 2 }} />
                        <Skeleton variant="rectangular" height={100} />
                    </Grid>
                </Grid>
            </Container>
        );
    }

    // Hata durumu
    if (error) {
        return (
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
                <Button 
                    startIcon={<ArrowBack />}
                    onClick={() => navigate('/shop')}
                    variant="contained"
                >
                    Alışverişe Dön
                </Button>
            </Container>
        );
    }

    // Ürün bulunamadı
    if (!product) {
        return (
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Alert severity="warning">Ürün bulunamadı.</Alert>
            </Container>
        );
    }

    const averageRating = reviews.length > 0 
        ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
        : 0;

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            {/* Breadcrumb */}
            <Breadcrumbs 
                separator={<NavigateNext fontSize="small" />} 
                sx={{ mb: 3 }}
            >
                <Link 
                    component={RouterLink} 
                    to="/shop" 
                    underline="hover"
                    sx={{ color: '#C2A83E' }}
                >
                    Alışveriş
                </Link>
                <Link 
                    component={RouterLink} 
                    to={`/shop?category=${product.category?.id || ''}`}
                    underline="hover"
                    sx={{ color: '#C2A83E' }}
                >
                    {product.category?.name || 'Kategori'}
                </Link>
                <Typography color="text.primary">{product.name}</Typography>
            </Breadcrumbs>

            {/* Ana Ürün Bölümü */}
            <Grid container spacing={4} sx={{ mb: 6 }}>
                {/* Ürün Resmi */}
                <Grid item xs={12} md={6}>
                    <Card elevation={2}>
                        <CardMedia
                            component="img"
                            height="500"
                            image={product.imageUrl || product.image || '/placeholder-image.jpg'}
                            alt={product.name}
                            sx={{ objectFit: 'cover' }}
                        />
                    </Card>
                </Grid>

                {/* Ürün Bilgileri */}
                <Grid item xs={12} md={6}>
                    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                        {/* Başlık ve Kategori */}
                        <Typography variant="h4" gutterBottom sx={{ color: '#243E36', fontWeight: 600 }}>
                            {product.name}
                        </Typography>
                        
                        <Box display="flex" alignItems="center" gap={2} sx={{ mb: 2 }}>
                            <Chip 
                                label={product.category?.name || 'Kategori'}
                                color="primary"
                                variant="outlined"
                            />
                            <Box display="flex" alignItems="center" gap={0.5}>
                                <Rating value={averageRating} readOnly precision={0.1} size="small" />
                                <Typography variant="body2" color="text.secondary">
                                    ({reviews.length} değerlendirme)
                                </Typography>
                            </Box>
                        </Box>

                        {/* Fiyat */}
                        <Typography 
                            variant="h3" 
                            sx={{ 
                                color: '#C2A83E', 
                                fontWeight: 700, 
                                mb: 3 
                            }}
                        >
                            ₺{typeof product.price === 'number' ? product.price.toLocaleString() : product.price}
                        </Typography>

                        {/* Açıklama */}
                        <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.6 }}>
                            {product.description}
                        </Typography>

                        {/* Miktar Seçici */}
                        <Box display="flex" alignItems="center" gap={2} sx={{ mb: 3 }}>
                            <Typography variant="body1" fontWeight={500}>{t("quantity_label")}:</Typography>
                            <Box display="flex" alignItems="center" gap={1}>
                                <Button 
                                    variant="outlined" 
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    size="small"
                                    sx={{ minWidth: 40 }}
                                >
                                    -
                                </Button>
                                <Typography 
                                    variant="h6" 
                                    sx={{ 
                                        minWidth: 40, 
                                        textAlign: 'center',
                                        px: 2,
                                        py: 1,
                                        border: '1px solid #ddd',
                                        borderRadius: 1
                                    }}
                                >
                                    {quantity}
                                </Typography>
                                <Button 
                                    variant="outlined" 
                                    onClick={() => setQuantity(quantity + 1)}
                                    size="small"
                                    sx={{ minWidth: 40 }}
                                >
                                    +
                                </Button>
                            </Box>
                        </Box>

                        {/* Aksiyon Butonları */}
                        <Box display="flex" gap={2} sx={{ mb: 3 }}>
                            <Button
                                variant="contained"
                                size="large"
                                startIcon={<ShoppingCart />}
                                onClick={handleAddToCart}
                                sx={{
                                    flex: 1,
                                    py: 1.5,
                                    background: 'linear-gradient(45deg, #243E36 30%, #7CA982 90%)',
                                    fontSize: '1.1rem',
                                    fontWeight: 600
                                }}
                            >
                                {t("add_to_cart")}
                            </Button>
                            <IconButton
                                onClick={handleFavoriteToggle}
                                size="large"
                                sx={{ 
                                    border: '2px solid #C2A83E',
                                    color: isFavorite(product.id) ? '#C2A83E' : 'text.secondary'
                                }}
                            >
                                {isFavorite(product.id) ? <Favorite /> : <FavoriteBorder />}
                            </IconButton>
                            <IconButton
                                size="large"
                                sx={{ border: '2px solid #ddd' }}
                            >
                                <Share />
                            </IconButton>
                        </Box>

                        {/* Özellikler */}
                        <Card variant="outlined" sx={{ mt: 'auto' }}>
                            <CardContent>
                                <Grid container spacing={2}>
                                    <Grid item xs={6}>
                                        <Box display="flex" alignItems="center" gap={1}>
                                            <LocalShipping color="primary" />
                                            <Typography variant="body2">{t("free_shipping")}</Typography>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Box display="flex" alignItems="center" gap={1}>
                                            <Shield color="primary" />
                                            <Typography variant="body2">{t("warranty_2_years")}</Typography>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Box display="flex" alignItems="center" gap={1}>
                                            <SwapHoriz color="primary" />
                                            <Typography variant="body2">{t("return_14_days")}</Typography>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant="body2" color="text.secondary">
                                            {t("seller_info")}: {product.seller?.username || t("unknown")}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Box>
                </Grid>
            </Grid>

            <Divider sx={{ my: 4 }} />

            {/* Yorumlar Bölümü */}
            <Box sx={{ mb: 6 }}>
                <Typography variant="h5" gutterBottom sx={{ color: '#243E36', fontWeight: 600 }}>
                            {t("customer_reviews")} ({reviews.length})
                        </Typography>
                
                {/* Yeni Yorum Ekleme */}
                {user && (
                    <Card variant="outlined" sx={{ mb: 3 }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>{t("write_review")}</Typography>
                            <Box display="flex" alignItems="center" gap={1} sx={{ mb: 2 }}>
                                <Typography variant="body2">{t("your_rating")}:</Typography>
                                <Rating
                                    value={newReview.rating}
                                    onChange={(_, newValue) => setNewReview({ ...newReview, rating: newValue })}
                                />
                            </Box>
                            <TextField
                                fullWidth
                                multiline
                                rows={3}
                                placeholder={t("review_placeholder")}
                                value={newReview.comment}
                                onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                                sx={{ mb: 2 }}
                            />
                            <Button 
                                variant="contained" 
                                onClick={handleReviewSubmit}
                                disabled={!newReview.comment.trim()}
                            >
                                {t("submit_review")}
                            </Button>
                        </CardContent>
                    </Card>
                )}

                {/* Mevcut Yorumlar */}
                <List>
                    {reviews.map((review) => (
                        <ListItem key={review.id} alignItems="flex-start" sx={{ px: 0 }}>
                            <ListItemAvatar>
                                <Avatar sx={{ bgcolor: '#C2A83E' }}>
                                    {(review.user?.username || 'A').charAt(0).toUpperCase()}
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                                primary={
                                    <Box display="flex" alignItems="center" gap={2}>
                                        <Typography variant="subtitle1" fontWeight={600}>
                                            {review.user?.username || 'Anonim'}
                                        </Typography>
                                        <Rating value={review.rating} readOnly size="small" />
                                        <Typography variant="caption" color="text.secondary">
                                            {review.reviewDate ? 
                                                new Date(review.reviewDate).toLocaleDateString('tr-TR') : 
                                                'Tarih bilinmiyor'
                                            }
                                        </Typography>
                                    </Box>
                                }
                                secondary={
                                    <Typography variant="body2" sx={{ mt: 1 }}>
                                        {review.comment}
                                    </Typography>
                                }
                            />
                        </ListItem>
                    ))}
                </List>
            </Box>

            <Divider sx={{ my: 4 }} />

            {/* Benzer Ürünler */}
            {relatedProducts.length > 0 && (
                <Box>
                    <Typography variant="h5" gutterBottom sx={{ color: '#243E36', fontWeight: 600 }}>
                        {t("related_products")}
                    </Typography>
                    <Grid container spacing={3}>
                        {relatedProducts.map((relatedProduct) => (
                            <Grid item xs={12} sm={6} md={3} key={relatedProduct.id}>
                                <ProductCard product={relatedProduct} />
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            )}
        </Container>
    );
} 