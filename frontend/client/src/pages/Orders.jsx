import { Container, Typography, Card,CardContent,CardHeader } from "@mui/material";
import { usePurchase } from '../context/PurchaseContext';
import { useTranslation } from 'react-i18next';

export default function Orders() {
    const { orders } = usePurchase();
    const { t } = useTranslation();

    // orders undefined kontrolü
    if (!orders || orders.length === 0) {
        return (
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>{t("no_orders")}</Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>{t("orders")}</Typography>
            {orders.map((order) => (
                <Card key={order.id} sx={{ mb: 2 }}>
                    <CardHeader 
                        title={`${t("order")} #${order.id}`} 
                        subheader={`${t("date")}: ${order.date}`}
                    />
                    <CardContent>
                        <ul style={{ paddingLeft: '20px', marginBottom: '16px' }}>
                            {order.items && order.items.map((item) => (
                                <li key={item.id} style={{ marginBottom: '8px' }}>
                                    <Typography variant="body2">
                                        {item.name} x {item.quantity} = {(item.quantity * item.price).toLocaleString()}₺
                                    </Typography>
                                </li>
                            ))}
                        </ul>
                        <Typography variant="h6" sx={{ mt: 2, fontWeight: 'bold' }}>
                                {t("total")}: {order.total ? order.total.toLocaleString() : 0}₺
                        </Typography>
                    </CardContent>
                </Card>
            ))}
        </Container>
    );
}