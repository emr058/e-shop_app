import { Container, Typography, Button, List, ListItem, IconButton, Alert } from "@mui/material";
import { useTranslation } from 'react-i18next';
import { Add, Remove, Delete } from "@mui/icons-material";
import { useCart } from '../context/CartContext';
import { usePurchase } from '../context/PurchaseContext';
import { useState } from 'react';

export default function Cart() {
    const { t } = useTranslation();
    const { cartItems, removeFromCart, changeQuantity, clearCart, total } = useCart();
    const { addOrder } = usePurchase();
    const [showSuccess, setShowSuccess] = useState(false);

    const handlePurchase = () => {
        if (cartItems.length === 0) return; 
        addOrder(cartItems);
        clearCart();
        setShowSuccess(true);
        setTimeout(() => {
            setShowSuccess(false);
        }, 3000);
    };

    const handleClearCart = () => {
        clearCart();
    };

    return (
        <>
            {showSuccess && (
                <Alert severity="success" sx={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000 }}>
                    {t("purchase_success")}
                </Alert>
            )}
            
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Typography variant="h4" gutterBottom sx={{ mb: 2 }}>{t("cart")}</Typography>
                <List>
                    {cartItems.map((item) => (
                        <ListItem key={item.id} divider sx={{ py: 1, px: 0 }}>
                            <Typography style={{display: 'flex', alignItems: 'center'}} sx={{flexGrow: 1}}>
                                <img src={item.image} alt={item.name} style={{ width: '50px', height: '50px', marginTop: '5px', marginRight: '10px', borderRadius: '5px' }} /> 
                                {item.name} ({item.quantity}) - {item.price}₺
                            </Typography>
                            <IconButton 
                                onClick={() => changeQuantity(item.id, -1)}
                                disabled={item.quantity <= 1}
                                sx={{ 
                                    opacity: item.quantity <= 1 ? 0.3 : 1,
                                    cursor: item.quantity <= 1 ? 'not-allowed' : 'pointer'
                                }}
                            >
                                <Remove />
                            </IconButton>
                            <IconButton onClick={() => changeQuantity(item.id, 1)}>
                                <Add />
                            </IconButton>
                            <IconButton onClick={() => removeFromCart(item.id)}>
                                <Delete />
                            </IconButton>
                        </ListItem>
                    ))}
                </List>
                <div style={{ display: 'flex', position: 'fixed', bottom: 100, width: '50%', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                    <Typography variant="h6" sx={{ mt: 2 }}>{t("total")}: {total}₺</Typography>
                    <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={handlePurchase}>{t("purchase")}</Button>
                    <Button variant="contained" color="secondary" sx={{ mt: 2 }} onClick={handleClearCart}>{t("clear_cart")}</Button>
                </div>
            </Container>
        </>
    );
}   