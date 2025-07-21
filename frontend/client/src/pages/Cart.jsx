import { Container, Typography, Button, List, ListItem, IconButton, Alert } from "@mui/material";
import { useTranslation } from 'react-i18next';
import { Add, Remove, Delete } from "@mui/icons-material";
import { useCart } from '../context/CartContext';
import { usePurchase } from '../context/PurchaseContext';
import { useState } from 'react';
import { Link } from "react-router-dom";

export default function Cart() {
    const { t } = useTranslation();
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
                <Alert severity="success" sx={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000 }}>
                    {t("purchase_success")}
                </Alert>
            )}
            
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Typography variant="h4" gutterBottom sx={{ mb: 2 }}>{t("cart")}</Typography>
                {cartItems.length === 0 && (
                    <Container maxWidth="lg" sx={{ py: 4 }}>
                        <Typography variant="body2" color="text.secondary"> {t("no_products_in_cart")} </Typography>
                    </Container>
                )}
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
                    <div style={{ boxShadow: '0 4px 12px rgba(36, 62, 54, 0.15)', borderRadius: '12px', border: '2px solid #7CA982', display: 'flex', position: 'fixed', bottom: 100, width: '50%', justifyContent: 'space-between', padding: '10px', alignItems: 'center',  }}>
                    <Typography variant="h5" >{t("total")}: {total}₺</Typography>
                    <Button variant="contained" color="primary"  onClick={handlePurchase}>{t("purchase")}</Button>
                    <Button variant="contained" color="secondary"  onClick={handleClearCart}>{t("clear_cart")}</Button>
                    <Button variant="contained" color="primary"  component={Link} to="/shop">{t("continue_shopping")}</Button>
                </div>
            </Container>
        </>
    );
}   