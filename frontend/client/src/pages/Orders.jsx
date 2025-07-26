import React, { useContext, useEffect, useState } from "react";
import { usePurchase } from "../context/PurchaseContext";
import { 
    Container, 
    Typography, 
    Card, 
    CardContent, 
    Box, 
    Chip, 
    LinearProgress,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Stepper,
    Step,
    StepLabel,
    StepContent,
    ListItem,
    ListItemText,
    Button,
    Divider,
    useTheme,
    useMediaQuery,
    CircularProgress
} from "@mui/material";
import { 
    ExpandMore,
    Assignment,
    CheckCircle,
    Inventory,
    LocalShipping,
    ShoppingBag 
} from "@mui/icons-material";
import { useTranslation } from 'react-i18next';

const Orders = () => {
    const { orders } = usePurchase();
    const { t } = useTranslation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    // Sipariş adımları tanımı
    const orderSteps = [
        { 
            key: 'HAZIRLANIYOR', 
            label: t("order_received"), 
            icon: <Assignment />,
            description: t("order_received_desc")
        },
        { 
            key: 'ONAYLANDI', 
            label: t("confirmed"), 
            icon: <CheckCircle />,
            description: t("confirmed_desc")
        },
        { 
            key: 'KARGOYA_VERILDI', 
            label: t("shipped"), 
            icon: <Inventory />,
            description: t("shipped_desc")
        },
        { 
            key: 'KARGODA', 
            label: t("in_transit"), 
            icon: <LocalShipping />,
            description: t("in_transit_desc")
        },
        { 
            key: 'TESLIM_EDILDI', 
            label: t("delivered"), 
            icon: <CheckCircle />,
            description: t("delivered_desc")
        }
    ];

    // Sipariş durumu için renk ve Türkçe çevirisi
    const getStatusDisplay = (status) => {
        const statusMap = {
            'HAZIRLANIYOR': { label: t("preparing"), color: 'warning', progress: 20 },
            'ONAYLANDI': { label: t("confirmed"), color: 'info', progress: 40 },
            'KARGOYA_VERILDI': { label: t("shipped"), color: 'primary', progress: 60 },
            'KARGODA': { label: t("in_transit"), color: 'primary', progress: 80 },
            'TESLIM_EDILDI': { label: t("delivered"), color: 'success', progress: 100 },
            'IPTAL_EDILDI': { label: t("cancelled"), color: 'error', progress: 0 }
        };
        return statusMap[status] || { label: status || t("unknown"), color: 'default', progress: 0 };
    };

    // Aktif adımı bulma
    const getActiveStep = (status) => {
        const stepIndex = orderSteps.findIndex(step => step.key === status);
        return stepIndex !== -1 ? stepIndex : 0;
    };

    // Progress yüzdesi hesaplama
    const getProgressPercentage = (status) => {
        if (status === 'IPTAL_EDILDI') return 0;
        const stepIndex = getActiveStep(status);
        return ((stepIndex + 1) / orderSteps.length) * 100;
    };

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
                <Box 
                    sx={{ 
                        textAlign: 'center', 
                        py: 8,
                        backgroundColor: '#f8f9fa',
                        borderRadius: 2,
                        border: '1px solid #e0e0e0'
                    }}
                >
                    <Assignment sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h5" color="text.secondary" gutterBottom>
                        {t("no_orders_yet_title")}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" mb={3}>
                        {t("start_shopping_description")}
                    </Typography>
                    <Button 
                        variant="contained" 
                        onClick={() => window.location.href = '/shop'}
                        sx={{ 
                            background: 'linear-gradient(45deg, #243E36 30%, #C2A83E 90%)',
                            px: 4,
                            py: 1.5
                        }}
                    >
                        {t("start_shopping")}
                    </Button>
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
                <Assignment sx={{ fontSize: { xs: '1.5rem', md: '2rem' }, color: '#C2A83E' }} />
                {t("orders")} ({orders.length} {t("orders")})
            </Typography>
            
            {orders.map((order) => {
                const statusDisplay = getStatusDisplay(order.status);
                const progressPercentage = statusDisplay.progress;
                
                // Sipariş durumuna göre aktif adımı belirle
                const activeStep = orderSteps.findIndex(step => step.key === order.status);
                
                return (
                    <Card key={order.id} variant="outlined" sx={{ mb: 4, borderRadius: 2 }}>
                        <CardContent sx={{ p: 3 }}>
                            {/* Sipariş Başlığı */}
                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                                <Box display="flex" alignItems="center" gap={2}>
                                    <Typography variant="h6" sx={{ color: '#243E36', fontWeight: 600 }}>
                                        {t("order")} #{order.id}
                                    </Typography>
                                    <Chip 
                                        label={statusDisplay.label}
                                        color={statusDisplay.color}
                                        size="medium"
                                        sx={{ fontWeight: 600 }}
                                    />
                                </Box>
                                
                                <Typography variant="body2" color="text.secondary">
                                    <strong>{t("order_date")}:</strong> {order.orderDate ? 
                                        new Date(order.orderDate).toLocaleDateString('tr-TR') : 
                                        t("unknown")
                                    }
                                </Typography>
                                <Typography variant="h6" color="primary" sx={{ fontWeight: 600 }}>
                                    {(order.totalAmount || 0).toFixed(2)} TL
                                </Typography>
                            </Box>

                            {/* Visual Progress Bar */}
                            <Box sx={{ mb: 3 }}>
                                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                                    <Typography variant="body2" color="text.secondary">
                                        {t("order_status")}
                                    </Typography>
                                    <Typography variant="body2" color="primary" fontWeight={600}>
                                        %{Math.round(progressPercentage)}
                                    </Typography>
                                </Box>
                                <LinearProgress 
                                    variant="determinate" 
                                    value={progressPercentage} 
                                    sx={{ 
                                        height: 8, 
                                        borderRadius: 4,
                                        backgroundColor: '#e0e0e0',
                                        '& .MuiLinearProgress-bar': {
                                            backgroundColor: '#C2A83E'
                                        }
                                    }} 
                                />
                            </Box>

                            {/* Detaylı Sipariş Takibi */}
                            <Accordion>
                                <AccordionSummary expandIcon={<ExpandMore />}>
                                    <Typography variant="subtitle1" fontWeight={600}>
                                        {t("detailed_order_tracking")}
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Stepper activeStep={activeStep} orientation="vertical">
                                        {orderSteps.map((step, index) => (
                                            <Step key={step.key}>
                                                <StepLabel 
                                                    icon={
                                                        <Box 
                                                            sx={{ 
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                width: 40,
                                                                height: 40,
                                                                borderRadius: '50%',
                                                                backgroundColor: index <= activeStep ? '#C2A83E' : '#e0e0e0',
                                                                color: index <= activeStep ? 'white' : 'text.secondary'
                                                            }}
                                                        >
                                                            {step.icon}
                                                        </Box>
                                                    }
                                                >
                                                    <Typography 
                                                        variant="subtitle2" 
                                                        sx={{ 
                                                            fontWeight: index <= activeStep ? 600 : 400,
                                                            color: index <= activeStep ? '#243E36' : 'text.secondary'
                                                        }}
                                                    >
                                                        {step.label}
                                                    </Typography>
                                                </StepLabel>
                                                <StepContent>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {step.description}
                                                    </Typography>
                                                </StepContent>
                                            </Step>
                                        ))}
                                    </Stepper>
                                </AccordionDetails>
                            </Accordion>

                            <Divider sx={{ my: 3 }} />

                            {/* Ürün Listesi */}
                            <Accordion>
                                <AccordionSummary expandIcon={<ExpandMore />}>
                                    <Typography variant="subtitle1" fontWeight={600}>
                                        {t("order_contents")} ({order.orderItems?.length || 0} {t("products")})
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    {order.orderItems?.map((item) => {
                                        const productName = item.productName || item.product?.name || t("product");
                                        const isProductDeleted = !item.product;
                                        
                                        return (
                                            <ListItem 
                                                key={item.id} 
                                                sx={{ 
                                                    px: 0, 
                                                    py: 1,
                                                    borderBottom: '1px solid #f0f0f0',
                                                    '&:last-child': { borderBottom: 'none' }
                                                }}
                                            >
                                                <ListItemText
                                                    primary={
                                                        <Box display="flex" alignItems="center" gap={1}>
                                                            <Typography variant="body1" fontWeight={500}>
                                                                {productName}
                                                            </Typography>
                                                            {isProductDeleted && (
                                                                <Chip 
                                                                    label={t("product_not_available")}
                                                                    size="small"
                                                                    color="error"
                                                                    variant="outlined"
                                                                />
                                                            )}
                                                        </Box>
                                                    }
                                                    secondary={
                                                        <Box display="flex" justifyContent="space-between" alignItems="center">
                                                            <Typography variant="body2" color="text.secondary">
                                                                {item.quantity || 0} {t("pieces")} × {(item.unitPrice || 0).toFixed(2)} TL
                                                            </Typography>
                                                            <Typography variant="body2" fontWeight={600} color="primary">
                                                                {((item.quantity || 0) * (item.unitPrice || 0)).toFixed(2)} TL
                                                            </Typography>
                                                        </Box>
                                                    }
                                                />
                                            </ListItem>
                                        );
                                    })}
                                </AccordionDetails>
                            </Accordion>
                        </CardContent>
                    </Card>
                );
            })}

            {orders.length === 0 && (
                <Box 
                    display="flex" 
                    flexDirection="column" 
                    alignItems="center" 
                    justifyContent="center" 
                    minHeight="50vh"
                    textAlign="center"
                >
                    <Assignment sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h5" color="text.secondary" gutterBottom>
                        {t("no_orders_yet_title")}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" mb={3}>
                        {t("start_shopping_description")}
                    </Typography>
                    <Button 
                        variant="contained" 
                        onClick={() => window.location.href = '/shop'}
                        sx={{ 
                            background: 'linear-gradient(45deg, #243E36 30%, #C2A83E 90%)',
                            px: 4,
                            py: 1.5
                        }}
                    >
                        {t("start_shopping")}
                    </Button>
                </Box>
            )}
        </Container>
    );
};

export default Orders;