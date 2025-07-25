import { 
    Container, 
    Typography, 
    Button, 
    List, 
    ListItem, 
    IconButton, 
    Alert, 
    Box, 
    Card, 
    CardContent,
    Divider,
    Grid,
    Paper,
    useTheme,
    useMediaQuery
} from "@mui/material";
import { useTranslation } from 'react-i18next';
import { Add, Remove, Delete, ShoppingCart, CreditCard, ShoppingBag } from "@mui/icons-material";
import { useCart } from '../context/CartContext';
import { usePurchase } from '../context/PurchaseContext';
import { useState } from 'react';
import { Link } from "react-router-dom";

export default function Cart() {
    const { t } = useTranslation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const { cartItems, removeFromCart, changeQuantity, clearCart, total } = useCart();
    const { addOrder } = usePurchase();
    const [showSuccess, setShowSuccess] = useState(false);

    const handlePurchase = async () => {
        if (cartItems.length === 0) return; 
        addOrder(cartItems);
        await clearCart();
        setShowSuccess(true);
        setTimeout(() => {
            setShowSuccess(false);
        }, 3000);
    };

    const handleClearCart = async () => {
        await clearCart();
    };

    return (
        <>
            {showSuccess && (
                <Alert 
                    severity="success" 
                    sx={{ 
                        position: 'fixed', 
                        top: 20, 
                        left: '50%',
                        transform: 'translateX(-50%)',
                        zIndex: 1000,
                        borderRadius: 2,
                        boxShadow: '0 8px 32px rgba(46, 125, 50, 0.3)'
                    }}
                >
                    {t("purchase_success")}
                </Alert>
            )}
            
            <Container maxWidth="lg" sx={{ py: 4, pb: { xs: 20, md: 4 } }}>
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
                    <ShoppingCart sx={{ fontSize: { xs: '1.5rem', md: '2rem' }, color: '#C2A83E' }} />
                    {t("cart")}
                </Typography>

                {cartItems.length === 0 ? (
                    <Box 
                        sx={{ 
                            textAlign: 'center', 
                            py: 8,
                            color: 'text.secondary'
                        }}
                    >
                        <ShoppingCart sx={{ fontSize: '4rem', color: '#C2A83E', mb: 2, opacity: 0.5 }} />
                        <Typography variant="h6" gutterBottom>
                            {t("no_products_in_cart")}
                        </Typography>
                        <Button 
                            variant="contained" 
                            component={Link} 
                            to="/shop"
                            sx={{
                                mt: 2,
                                backgroundColor: '#C2A83E',
                                '&:hover': {
                                    backgroundColor: '#a08632'
                                }
                            }}
                        >
                            {t("continue_shopping")}
                        </Button>
                    </Box>
                ) : (
                    <>
                        {/* Ürün Listesi */}
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={8}>
                                <Card elevation={2} sx={{ borderRadius: 3 }}>
                                    <CardContent sx={{ p: 0 }}>
                                        <List sx={{ p: 0 }}>
                                            {cartItems.map((item, index) => (
                                                <Box key={item.id}>
                                                    <ListItem sx={{ py: 3, px: 3 }}>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', gap: 2 }}>
                                                            {/* Ürün Resmi */}
                                                            <Box
                                                                sx={{
                                                                    width: { xs: 60, md: 80 },
                                                                    height: { xs: 60, md: 80 },
                                                                    borderRadius: 2,
                                                                    overflow: 'hidden',
                                                                    flexShrink: 0,
                                                                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                                                }}
                                                            >
                                                                <img 
                                                                    src={item.image || item.imageUrl} 
                                                                    alt={item.name} 
                                                                    style={{ 
                                                                        width: '100%', 
                                                                        height: '100%', 
                                                                        objectFit: 'cover' 
                                                                    }} 
                                                                />
                                                            </Box>

                                                            {/* Ürün Bilgileri */}
                                                            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                                                                <Typography 
                                                                    variant="h6" 
                                                                    sx={{ 
                                                                        fontWeight: 600,
                                                                        color: '#243E36',
                                                                        fontSize: { xs: '1rem', md: '1.25rem' },
                                                                        mb: 1
                                                                    }}
                                                                >
                                                                    {item.name}
                                                                </Typography>
                                                                <Typography 
                                                                    variant="body1" 
                                                                    sx={{ 
                                                                        color: '#C2A83E',
                                                                        fontWeight: 600,
                                                                        fontSize: { xs: '1rem', md: '1.1rem' }
                                                                    }}
                                                                >
                                                                    {item.price}₺ / adet
                                                                </Typography>
                                                            </Box>

                                                            {/* Miktar Kontrolleri */}
                                                            <Box 
                                                                sx={{ 
                                                                    display: 'flex', 
                                                                    alignItems: 'center',
                                                                    gap: { xs: 0.5, md: 1 },
                                                                    flexDirection: { xs: 'column', sm: 'row' }
                                                                }}
                                                            >
                                                                <Box 
                                                                    sx={{ 
                                                                        display: 'flex', 
                                                                        alignItems: 'center',
                                                                        border: '2px solid #C2A83E',
                                                                        borderRadius: 2,
                                                                        backgroundColor: 'rgba(194, 168, 62, 0.05)'
                                                                    }}
                                                                >
                                                                    <IconButton 
                                                                        onClick={() => changeQuantity(item.id, -1)}
                                                                        disabled={item.quantity <= 1}
                                                                        size={isMobile ? "small" : "medium"}
                                                                        sx={{ 
                                                                            color: '#C2A83E',
                                                                            '&:disabled': { opacity: 0.3 }
                                                                        }}
                                                                    >
                                                                        <Remove />
                                                                    </IconButton>
                                                                    <Typography 
                                                                        sx={{ 
                                                                            mx: 2, 
                                                                            fontWeight: 600,
                                                                            minWidth: 20,
                                                                            textAlign: 'center'
                                                                        }}
                                                                    >
                                                                        {item.quantity}
                                                                    </Typography>
                                                                    <IconButton 
                                                                        onClick={() => changeQuantity(item.id, 1)}
                                                                        size={isMobile ? "small" : "medium"}
                                                                        sx={{ color: '#C2A83E' }}
                                                                    >
                                                                        <Add />
                                                                    </IconButton>
                                                                </Box>
                                                                
                                                                <IconButton 
                                                                    onClick={() => removeFromCart(item.id)}
                                                                    size={isMobile ? "small" : "medium"}
                                                                    sx={{ 
                                                                        color: '#e53935',
                                                                        '&:hover': {
                                                                            backgroundColor: 'rgba(229, 57, 53, 0.1)'
                                                                        }
                                                                    }}
                                                                >
                                                                    <Delete />
                                                                </IconButton>
                                                            </Box>
                                                        </Box>
                                                    </ListItem>
                                                    {index < cartItems.length - 1 && <Divider />}
                                                </Box>
                                            ))}
                                        </List>
                                    </CardContent>
                                </Card>
                            </Grid>

                            {/* Özet ve Butonlar - Desktop */}
                            {!isMobile && (
                                <Grid item md={4}>
                                    <Card 
                                        elevation={3} 
                                        sx={{ 
                                            borderRadius: 3,
                                            position: 'sticky',
                                            top: 100,
                                            border: '2px solid #C2A83E'
                                        }}
                                    >
                                        <CardContent sx={{ p: 3 }}>
                                            <Typography 
                                                variant="h6" 
                                                sx={{ 
                                                    mb: 3, 
                                                    color: '#243E36',
                                                    fontWeight: 700
                                                }}
                                            >
                                                Sipariş Özeti
                                            </Typography>
                                            
                                            <Box sx={{ mb: 3 }}>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                                    <Typography variant="body2" color="text.secondary">
                                                        Ürün Sayısı:
                                                    </Typography>
                                                    <Typography variant="body2" fontWeight={600}>
                                                        {cartItems.length} adet
                                                    </Typography>
                                                </Box>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                                    <Typography variant="body2" color="text.secondary">
                                                        Toplam Miktar:
                                                    </Typography>
                                                    <Typography variant="body2" fontWeight={600}>
                                                        {cartItems.reduce((sum, item) => sum + item.quantity, 0)} adet
                                                    </Typography>
                                                </Box>
                                                <Divider sx={{ my: 2 }} />
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                    <Typography 
                                                        variant="h6" 
                                                        sx={{ 
                                                            color: '#243E36',
                                                            fontWeight: 700
                                                        }}
                                                    >
                                                        {t("total_amount")}:
                                                    </Typography>
                                                    <Typography 
                                                        variant="h6" 
                                                        sx={{ 
                                                            color: '#C2A83E',
                                                            fontWeight: 700
                                                        }}
                                                    >
                                                        {total}₺
                                                    </Typography>
                                                </Box>
                                            </Box>

                                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                                <Button 
                                                    variant="contained" 
                                                    fullWidth
                                                    onClick={handlePurchase}
                                                    startIcon={<CreditCard />}
                                                    sx={{
                                                        backgroundColor: '#C2A83E',
                                                        py: 1.5,
                                                        fontSize: '1.1rem',
                                                        fontWeight: 600,
                                                        '&:hover': {
                                                            backgroundColor: '#a08632'
                                                        }
                                                    }}
                                                >
                                                    {t("purchase")}
                                                </Button>
                                                
                                                <Button 
                                                    variant="outlined" 
                                                    fullWidth
                                                    onClick={handleClearCart}
                                                    sx={{
                                                        color: '#e53935',
                                                        borderColor: '#e53935',
                                                        '&:hover': {
                                                            borderColor: '#d32f2f',
                                                            backgroundColor: 'rgba(229, 57, 53, 0.1)'
                                                        }
                                                    }}
                                                >
                                                    {t("clear_cart")}
                                                </Button>
                                                
                                                <Button 
                                                    variant="text" 
                                                    fullWidth
                                                    component={Link} 
                                                    to="/shop"
                                                    startIcon={<ShoppingBag />}
                                                    sx={{
                                                        color: '#243E36',
                                                        '&:hover': {
                                                            backgroundColor: 'rgba(36, 62, 54, 0.1)'
                                                        }
                                                    }}
                                                >
                                                    {t("continue_shopping")}
                                                </Button>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            )}
                        </Grid>
                    </>
                )}
            </Container>

            {/* Mobil Alt Butonlar */}
            {isMobile && cartItems.length > 0 && (
                <Paper
                    elevation={8}
                    sx={{
                        position: 'fixed',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        p: 2,
                        backgroundColor: 'white',
                        borderTop: '2px solid #C2A83E',
                        borderRadius: '20px 20px 0 0',
                        zIndex: 1000
                    }}
                >
                    <Box sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography variant="h6" sx={{ color: '#243E36', fontWeight: 700 }}>
                                {t("total_amount")}:
                            </Typography>
                            <Typography variant="h6" sx={{ color: '#C2A83E', fontWeight: 700 }}>
                                {total}₺
                            </Typography>
                        </Box>
                        
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button 
                                variant="contained" 
                                fullWidth
                                onClick={handlePurchase}
                                startIcon={<CreditCard />}
                                sx={{
                                    backgroundColor: '#C2A83E',
                                    py: 1.5,
                                    fontSize: '1rem',
                                    fontWeight: 600,
                                    flex: 2,
                                    '&:hover': {
                                        backgroundColor: '#a08632'
                                    }
                                }}
                            >
                                {t("purchase")}
                            </Button>
                            
                            <Button 
                                variant="outlined" 
                                onClick={handleClearCart}
                                sx={{
                                    color: '#e53935',
                                    borderColor: '#e53935',
                                    flex: 1,
                                    py: 1.5,
                                    '&:hover': {
                                        borderColor: '#d32f2f',
                                        backgroundColor: 'rgba(229, 57, 53, 0.1)'
                                    }
                                }}
                            >
                                {t("clear_cart")}
                            </Button>
                        </Box>
                    </Box>
                </Paper>
            )}
        </>
    );
}   