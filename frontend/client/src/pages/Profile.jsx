import { 
    Container, 
    Typography, 
    Box, 
    Card, 
    CardContent, 
    Avatar, 
    Button, 
    Grid, 
    Divider,
    Chip,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Tab,
    Tabs,
    Badge,
    IconButton,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    useTheme,
    useMediaQuery
} from "@mui/material";
import { 
    Person, 
    ShoppingBag, 
    Favorite, 
    Edit, 
    EmailOutlined, 
    PhoneOutlined,
    LocationOnOutlined,
    TrendingUp,
    AttachMoney,
    LocalShipping,
    CheckCircle,
    Cancel
} from "@mui/icons-material";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { usePurchase } from "../context/PurchaseContext";
import { useFavorites } from "../context/FavoritesContext";
import { useTranslation } from 'react-i18next';
import ProductCard from "../components/ProductCard";

export default function Profile() {
    const { t } = useTranslation();
    const { user, updateUser } = useAuth();
    const { orders } = usePurchase();
    const { favorites } = useFavorites();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    
    const [activeTab, setActiveTab] = useState(0);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [editForm, setEditForm] = useState({
        username: user?.username || '',
        email: user?.email || '',
        phone: user?.phone || '',
        address: user?.address || ''
    });

    // Kullanıcı istatistikleri hesapla
    const stats = {
        totalOrders: orders?.length || 0,
        totalSpent: orders?.reduce((sum, order) => sum + (order.totalAmount || 0), 0) || 0,
        completedOrders: orders?.filter(order => order.status === 'TESLIM_EDILDI').length || 0,
        favoriteCount: favorites?.length || 0
    };

    const handleEditSave = () => {
        // Kullanıcı bilgilerini güncelle
        if (updateUser) {
            updateUser(editForm);
        }
        setEditDialogOpen(false);
    };

    const getStatusColor = (status) => {
        const statusColors = {
            'HAZIRLANIYOR': 'warning',
            'ONAYLANDI': 'info',
            'KARGOYA_VERILDI': 'primary',
            'KARGODA': 'primary',
            'TESLIM_EDILDI': 'success',
            'IPTAL_EDILDI': 'error'
        };
        return statusColors[status] || 'default';
    };

    const getStatusLabel = (status) => {
        const statusLabels = {
            'HAZIRLANIYOR': 'Hazırlanıyor',
            'ONAYLANDI': 'Onaylandı',
            'KARGOYA_VERILDI': 'Kargoya Verildi',
            'KARGODA': 'Kargoda',
            'TESLIM_EDILDI': 'Teslim Edildi',
            'IPTAL_EDILDI': 'İptal Edildi'
        };
        return statusLabels[status] || status;
    };

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            {/* Profil Header */}
            <Card elevation={2} sx={{ mb: 4 }}>
                <CardContent>
                    <Box display="flex" alignItems="center" gap={3} flexDirection={isMobile ? 'column' : 'row'}>
                        <Avatar 
                            sx={{ 
                                width: 120, 
                                height: 120, 
                                fontSize: '3rem',
                                background: 'linear-gradient(45deg, #243E36 30%, #C2A83E 90%)'
                            }}
                        >
                            {user?.username?.charAt(0).toUpperCase() || 'U'}
                        </Avatar>
                        <Box flexGrow={1} textAlign={isMobile ? 'center' : 'left'}>
                            <Typography variant="h4" gutterBottom sx={{ color: '#243E36', fontWeight: 600 }}>
                                {user?.username || t("username")}
                            </Typography>
                            <Typography variant="body1" color="text.secondary" gutterBottom>
                                {user?.email || t("email")}
                            </Typography>
                            <Chip 
                                label={user?.role === 'SELLER' ? t("seller") : user?.role === 'ADMIN' ? t("admin") : t("customer")}
                                color={user?.role === 'SELLER' ? 'primary' : user?.role === 'ADMIN' ? 'error' : 'default'}
                                size="small"
                            />
                        </Box>
                        <Button 
                            variant="outlined" 
                            startIcon={<Edit />}
                            onClick={() => setEditDialogOpen(true)}
                            sx={{ borderColor: '#C2A83E', color: '#C2A83E' }}
                        >
                            {t("edit_profile")}
                        </Button>
                    </Box>
                </CardContent>
            </Card>

            {/* İstatistikler */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ textAlign: 'center', p: 2 }}>
                        <TrendingUp sx={{ fontSize: 40, color: '#C2A83E', mb: 1 }} />
                        <Typography variant="h4" sx={{ color: '#243E36', fontWeight: 600 }}>
                            {stats.totalOrders}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {t("total_orders")}
                        </Typography>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ textAlign: 'center', p: 2 }}>
                        <AttachMoney sx={{ fontSize: 40, color: '#4CAF50', mb: 1 }} />
                        <Typography variant="h4" sx={{ color: '#243E36', fontWeight: 600 }}>
                            ₺{stats.totalSpent.toLocaleString()}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {t("total_spent")}
                        </Typography>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ textAlign: 'center', p: 2 }}>
                        <CheckCircle sx={{ fontSize: 40, color: '#2196F3', mb: 1 }} />
                        <Typography variant="h4" sx={{ color: '#243E36', fontWeight: 600 }}>
                            {stats.completedOrders}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {t("completed_orders")}
                        </Typography>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ textAlign: 'center', p: 2 }}>
                        <Favorite sx={{ fontSize: 40, color: '#E91E63', mb: 1 }} />
                        <Typography variant="h4" sx={{ color: '#243E36', fontWeight: 600 }}>
                            {stats.favoriteCount}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {t("favorite_products")}
                        </Typography>
                    </Card>
                </Grid>
            </Grid>

            {/* Tabs */}
            <Card>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs 
                        value={activeTab} 
                        onChange={(_, newValue) => setActiveTab(newValue)}
                        sx={{
                            '& .MuiTab-root': {
                                minHeight: 60,
                                fontSize: '1rem'
                            }
                        }}
                    >
                        <Tab 
                            icon={<Person />} 
                            label={t("personal_info")}
                            iconPosition="start"
                        />
                        <Tab 
                            icon={
                                <Badge badgeContent={stats.totalOrders} color="primary">
                                    <ShoppingBag />
                                </Badge>
                            } 
                            label={t("order_history")}
                            iconPosition="start"
                        />
                        <Tab 
                            icon={
                                <Badge badgeContent={stats.favoriteCount} color="error">
                                    <Favorite />
                                </Badge>
                            } 
                            label={t("my_favorites")}
                            iconPosition="start"
                        />
                    </Tabs>
                </Box>

                {/* Tab İçerikleri */}
                <CardContent sx={{ minHeight: 400 }}>
                    {/* Kişisel Bilgiler Tab */}
                    {activeTab === 0 && (
                        <Box>
                            <Typography variant="h6" gutterBottom sx={{ mb: 3, color: '#243E36' }}>
                                {t("personal_info")}
                            </Typography>
                            
                            <List>
                                <ListItem>
                                    <ListItemAvatar>
                                        <Person sx={{ color: '#C2A83E' }} />
                                    </ListItemAvatar>
                                    <ListItemText 
                                        primary={t("username")}
                                        secondary={user?.username || t("not_specified")} 
                                    />
                                </ListItem>
                                <Divider variant="inset" component="li" />
                                
                                <ListItem>
                                    <ListItemAvatar>
                                        <EmailOutlined sx={{ color: '#C2A83E' }} />
                                    </ListItemAvatar>
                                    <ListItemText 
                                        primary={t("email")}
                                        secondary={user?.email || t("not_specified")} 
                                    />
                                </ListItem>
                                <Divider variant="inset" component="li" />
                                
                                <ListItem>
                                    <ListItemAvatar>
                                        <PhoneOutlined sx={{ color: '#C2A83E' }} />
                                    </ListItemAvatar>
                                    <ListItemText 
                                        primary={t("phone")}
                                        secondary={user?.phone || t("not_specified")} 
                                    />
                                </ListItem>
                                <Divider variant="inset" component="li" />
                                
                                <ListItem>
                                    <ListItemAvatar>
                                        <LocationOnOutlined sx={{ color: '#C2A83E' }} />
                                    </ListItemAvatar>
                                    <ListItemText 
                                        primary={t("address")}
                                        secondary={user?.address || t("not_specified")} 
                                    />
                                </ListItem>
                            </List>
                        </Box>
                    )}

                    {/* Sipariş Geçmişi Tab */}
                    {activeTab === 1 && (
                        <Box>
                            <Typography variant="h6" gutterBottom sx={{ mb: 3, color: '#243E36' }}>
                                {t("order_history")} ({stats.totalOrders} {t("orders")})
                            </Typography>
                            
                            {orders && orders.length > 0 ? (
                                orders.map((order) => (
                                    <Card key={order.id} variant="outlined" sx={{ mb: 2 }}>
                                        <CardContent>
                                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                                <Typography variant="h6">
                                                    {t("order")} #{order.id}
                                                </Typography>
                                                <Chip 
                                                    label={getStatusLabel(order.status)}
                                                    color={getStatusColor(order.status)}
                                                    size="small"
                                                />
                                            </Box>
                                            
                                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                                {t("date")}: {order.orderDate ? 
                                                    new Date(order.orderDate).toLocaleDateString('tr-TR') : 
                                                    t("unknown")
                                                }
                                            </Typography>
                                            
                                            <Typography variant="body2" gutterBottom>
                                                <strong>{order.orderItems?.length || 0} {t("products")}</strong>
                                            </Typography>
                                            
                                            <Box display="flex" justifyContent="flex-end">
                                                <Typography variant="h6" color="primary">
                                                    ₺{(order.totalAmount || 0).toFixed(2)}
                                                </Typography>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                ))
                            ) : (
                                <Box textAlign="center" py={4}>
                                    <ShoppingBag sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                                    <Typography variant="h6" color="text.secondary">
                                        {t("no_orders")}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {t("start_shopping_description")}
                                    </Typography>
                                </Box>
                            )}
                        </Box>
                    )}

                    {/* Favoriler Tab */}
                    {activeTab === 2 && (
                        <Box>
                            <Typography variant="h6" gutterBottom sx={{ mb: 3, color: '#243E36' }}>
                                {t("my_favorites")} ({stats.favoriteCount} {t("products")})
                            </Typography>
                            
                            {favorites && favorites.length > 0 ? (
                                <Grid container spacing={3}>
                                    {favorites.map((favorite) => (
                                        <Grid item xs={12} sm={6} md={4} key={favorite.id}>
                                            <ProductCard product={favorite.product || favorite} />
                                        </Grid>
                                    ))}
                                </Grid>
                            ) : (
                                <Box textAlign="center" py={4}>
                                    <Favorite sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                                    <Typography variant="h6" color="text.secondary">
                                        {t("no_favorites_title")}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {t("no_favorites_description")}
                                    </Typography>
                                </Box>
                            )}
                        </Box>
                    )}
                </CardContent>
            </Card>

            {/* Profil Düzenleme Dialog */}
            <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>{t("edit_profile")}</DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 2 }}>
                        <TextField
                            fullWidth
                            label={t("username")}
                            value={editForm.username}
                            onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            fullWidth
                            label={t("email")}
                            type="email"
                            value={editForm.email}
                            onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            fullWidth
                            label={t("phone")}
                            value={editForm.phone}
                            onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            fullWidth
                            label={t("address")}
                            multiline
                            rows={3}
                            value={editForm.address}
                            onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditDialogOpen(false)}>{t("cancel")}</Button>
                    <Button 
                        onClick={handleEditSave} 
                        variant="contained"
                        sx={{ 
                            background: 'linear-gradient(45deg, #243E36 30%, #C2A83E 90%)'
                        }}
                    >
                        {t("save")}
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
} 