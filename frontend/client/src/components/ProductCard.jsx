import { 
    Card, 
    CardMedia, 
    CardContent, 
    CardActions, 
    Typography, 
    Button, 
    IconButton,
    Box,
    useMediaQuery,
    useTheme
} from '@mui/material';
import { Favorite, FavoriteBorder, ShoppingCart } from '@mui/icons-material';
import { useFavorites } from '../context/FavoritesContext';
import { useTranslation } from 'react-i18next';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

export default function ProductCard({ product }) {
    const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
    const { t } = useTranslation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const isProductFavorite = isFavorite(product.id);
    const { addToCart } = useCart();
    const navigate = useNavigate();

    const handleFavoriteClick = () => {
        if (isProductFavorite) {
            removeFromFavorites(product.id);
        } else {
            addToFavorites(product);
        }
    };

    const handleProductClick = () => {
        navigate(`/product/${product.id}`);
    };

    return (
        <Card 
            sx={{ 
                height: '100%', // Flexible height geri geldi
                display: 'flex',
                justifyContent: 'space-between',
                flexDirection: 'column',
                borderRadius: 2,
                transition: 'all 0.3s ease',
                border: '1px solid rgba(0, 0, 0, 0.08)',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 40px rgba(36, 62, 54, 0.15)',
                    borderColor: 'rgba(194, 168, 62, 0.3)',
                },
                cursor: 'pointer'
            }}
            onClick={handleProductClick}
        >
            <Box sx={{ position: 'relative' }}>
                <CardMedia
                    component="img"
                    height="200" // Sabit yükseklik - standart
                    image={product.image || product.imageUrl || '/placeholder-image.jpg'}
                    alt={product.name}
                    sx={{ 
                        objectFit: 'cover',
                        borderRadius: '12px 12px 0 0'
                    }}
                />
                <IconButton
                    onClick={(e) => {
                        e.stopPropagation(); // Card click'ini engellemek için
                        handleFavoriteClick();
                    }}
                    sx={{
                        position: 'absolute',
                        top: 15,
                        right: 15,
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        backdropFilter: 'blur(10px)',
                        '&:hover': {
                            backgroundColor: 'rgba(255, 255, 255, 1)',
                        }
                    }}
                >
                    {isProductFavorite ? (
                        <Favorite sx={{ color: '#C2A83E' }} />
                    ) : (
                        <FavoriteBorder sx={{ color: 'text.secondary' }} />
                    )}
                </IconButton>
            </Box>

            <CardContent sx={{ flexGrow: 1, p: 3 }}>
                <Typography 
                    variant="h6" 
                    component="h2" 
                    gutterBottom
                    sx={{ 
                        fontWeight: 600,
                        color: '#243E36',
                        fontSize: '1.1rem',
                        '&:hover': {
                            color: '#C2A83E'
                        }
                    }}
                >
                    {product.name}
                </Typography>
                
                <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    sx={{ mb: 2, lineHeight: 1.5 }}
                >
                    {product.description}
                </Typography>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography 
                        variant="h6" 
                        sx={{ 
                            fontWeight: 700,
                            color: '#C2A83E',
                            fontSize: '1.2rem'
                        }}
                    >
                        ₺{typeof product.price === 'number' ? product.price.toLocaleString() : product.price}
                    </Typography>
                    
                    <Typography 
                        variant="caption" 
                        sx={{ 
                            backgroundColor: 'rgba(194, 168, 62, 0.1)',
                            color: '#C2A83E',
                            px: 1.5,
                            py: 0.5,
                            borderRadius: 2,
                            fontWeight: 600,
                            border: '1px solid rgba(194, 168, 62, 0.3)'
                        }}
                    >
                        {product.category?.name || product.categoryName || 'Kategori'}
                    </Typography>
                </Box>
            </CardContent>

            <CardActions sx={{ p: 3, pt: 0 }}>
                <Button
                    fullWidth
                    variant="contained"
                    startIcon={<ShoppingCart />}
                    onClick={(e) => {
                        e.stopPropagation(); // Card click'ini engellemek için
                        addToCart(product);
                    }}
                    sx={{
                        py: 1.5,
                        fontWeight: 600,
                        borderRadius: 2,
                        background: 'linear-gradient(45deg, #243E36 30%, #7CA982 90%)',
                        '&:hover': {
                            background: 'linear-gradient(45deg, #1a2d26 30%, #5a7d61 90%)',
                        }
                    }}
                >
                    {t("add_to_cart")}
                </Button>
            </CardActions>
        </Card>
    );
}