import { 
    Container, 
    Typography, 
    Card, 
    CardContent, 
    List, 
    ListItem, 
    ListItemText, 
    Divider, 
    Box, 
    Button, 
    CircularProgress 
} from "@mui/material";
import { useTranslation } from 'react-i18next';
import { usePurchase } from "../context/PurchaseContext";

export default function Orders() {
    const { t } = useTranslation();
    const { orders, removeOrder } = usePurchase();

    if (!Array.isArray(orders)) {
        return (
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
                    {t("orders")}
                </Typography>
                <Box display="flex" justifyContent="center" mt={4}>
                    <CircularProgress />
                </Box>
            </Container>
        );
    }

    if (orders.length === 0) {
        return (
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
                    {t("orders")}
                </Typography>
                <Typography variant="body1" color="text.secondary" textAlign="center" mt={4}>
                    {t("no_orders")}
                </Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
                {t("orders")}
            </Typography>
            
            {orders.map((order) => {
                // Defensive check - order valid mi?
                if (!order || !order.id) {
                    console.warn('Invalid order item:', order);
                    return null;
                }

                return (
                    <Card key={order.id} sx={{ mb: 3 }}>
                        <CardContent>
                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                <Typography variant="h6">
                                    Sipariş #{order.id}
                                </Typography>
                                <Button 
                                    color="error" 
                                    variant="outlined" 
                                    onClick={() => removeOrder(order.id)}
                                >
                                    {t("delete")}
                                </Button>
                            </Box>
                            
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                Tarih: {order.orderDate ? 
                                    new Date(order.orderDate).toLocaleDateString('tr-TR') : 
                                    'Bilinmiyor'
                                }
                            </Typography>

                            <Divider sx={{ my: 2 }} />

                            <Typography variant="subtitle2" gutterBottom>
                                {t("products")}:
                            </Typography>
                            
                            <List dense>
                                {Array.isArray(order.orderItems) && order.orderItems.map((item, index) => {
                                    // Defensive check - item valid mi?
                                    if (!item || !item.product) {
                                        console.warn('Invalid order item:', item);
                                        return null;
                                    }

                                    return (
                                        <ListItem key={index} disablePadding>
                                            <ListItemText
                                                primary={item.product.name || 'Ürün adı bilinmiyor'}
                                                secondary={`${item.quantity || 0} adet × ${(item.unitPrice || 0).toFixed(2)} TL`}
                                            />
                                        </ListItem>
                                    );
                                })}
                            </List>

                            <Divider sx={{ my: 2 }} />
                            
                            <Box display="flex" justifyContent="flex-end">
                                <Typography variant="h6" color="primary">
                                    {t("total")}: {(order.totalAmount || 0).toFixed(2)} TL
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                );
            })}
        </Container>
    );
}