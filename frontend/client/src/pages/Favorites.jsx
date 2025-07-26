import { 
    Grid, 
    Container, 
    Typography, 
    CircularProgress, 
    Box, 
    Button,
    useTheme,
    useMediaQuery
} from "@mui/material";
import { 
    Favorite, 
    FavoriteBorder, 
    ShoppingBag 
} from "@mui/icons-material";
import { useTranslation } from 'react-i18next';
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { useFavorites } from "../context/FavoritesContext";

export default function Favorites() {
    const { t } = useTranslation();
    const { favorites, loading } = useFavorites();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    if (loading) {
        return (
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Typography 
                    variant={isMobile ? "h5" : "h4"} 
                    gutterBottom 
                    sx={{ 
                        mb: 4,
                        color: '#243E36',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2
                    }}
                >
                    <Favorite sx={{ fontSize: { xs: '1.5rem', md: '2rem' }, color: '#E91E63' }} />
                    {t("favorites")}
                </Typography>
                <Box display="flex" justifyContent="center" mt={4}>
                    <CircularProgress sx={{ color: '#C2A83E' }} />
                </Box>
            </Container>
        );
    }

    if (!Array.isArray(favorites) || favorites.length === 0) {
        return (
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Typography 
                    variant={isMobile ? "h5" : "h4"} 
                    gutterBottom 
                    sx={{ 
                        mb: 4,
                        color: '#243E36',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2
                    }}
                >
                    <Favorite sx={{ fontSize: { xs: '1.5rem', md: '2rem' }, color: '#E91E63' }} />
                    {t("favorites")}
                </Typography>
                
                <Box 
                    sx={{ 
                        textAlign: 'center', 
                        py: 8,
                        backgroundColor: '#f8f9fa',
                        borderRadius: 3,
                        border: '2px dashed #e0e0e0'
                    }}
                >
                    <FavoriteBorder sx={{ 
                        fontSize: '5rem', 
                        color: '#E91E63', 
                        mb: 2, 
                        opacity: 0.6 
                    }} />
                    <Typography variant="h5" color="text.secondary" gutterBottom>
                        Henüz favori ürününüz yok
                    </Typography>
                    <Typography variant="body1" color="text.secondary" mb={4}>
                        Beğendiğiniz ürünleri kalp ikonuna tıklayarak favorilerinize ekleyebilirsiniz!
                    </Typography>
                    <Button 
                        variant="contained" 
                        component={Link} 
                        to="/shop"
                        startIcon={<ShoppingBag />}
                        sx={{
                            background: 'linear-gradient(45deg, #243E36 30%, #C2A83E 90%)',
                            px: 4,
                            py: 1.5,
                            fontSize: '1rem',
                            fontWeight: 600,
                            borderRadius: 2,
                            '&:hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: '0 8px 25px rgba(36, 62, 54, 0.3)'
                            }
                        }}
                    >
                        Ürünleri Keşfet
                    </Button>
                    
                    <Box sx={{ mt: 4, p: 3, backgroundColor: '#fff3cd', borderRadius: 2 }}>
                        <Typography variant="body2" color="#856404" fontWeight={500}>
                            💡 İpucu: Ürün kartlarındaki kalp ikonuna tıklayarak favori ürünlerinizi buraya ekleyebilirsiniz
                        </Typography>
                    </Box>
                </Box>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Typography 
                variant={isMobile ? "h5" : "h4"} 
                gutterBottom 
                sx={{ 
                    mb: 4,
                    color: '#243E36',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2
                }}
            >
                <Favorite sx={{ fontSize: { xs: '1.5rem', md: '2rem' }, color: '#E91E63' }} />
                {t("favorites")} ({favorites.length} ürün)
            </Typography>
            
            <Grid container spacing={3}>
                {favorites.map((favorite) => {
                    // Defensive check - favorite ve product var mı?
                    if (!favorite || !favorite.product) {
                        console.warn('Invalid favorite item:', favorite);
                        return null;
                    }
                    
                    return (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={favorite.id}>
                            <ProductCard product={favorite.product} />
                        </Grid>
                    );
                })}
            </Grid>
            
            {/* Alt Bilgi */}
            <Box 
                sx={{ 
                    mt: 6, 
                    p: 3, 
                    backgroundColor: '#e8f5e8', 
                    borderRadius: 2,
                    border: '1px solid #c8e6c9'
                }}
            >
                <Typography variant="body2" color="#2e7d32" textAlign="center" fontWeight={500}>
                    ✨ Favori ürünlerinizi sepete ekleyerek hızlıca satın alabilirsiniz!
                </Typography>
            </Box>
        </Container>
    );
}