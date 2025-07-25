import { 
    Container, 
    Typography, 
    Button, 
    Box, 
    Grid, 
    Card, 
    CardContent, 
    TextField, 
    Dialog, 
    DialogTitle, 
    DialogContent, 
    DialogActions,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Snackbar,
    Alert,
    CircularProgress,
    Backdrop,
    Tabs,
    Tab,
    Chip,
    Select,
    MenuItem,
    FormControl,
    
} from "@mui/material";
import { useTranslation } from 'react-i18next';
import { useEffect, useState, useCallback } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { 
    Edit, 
    Delete, 
    Add, 
    ImageNotSupported, 
    Person, 
    ShoppingCart, 
    Inventory,
    AdminPanelSettings,
    Category
} from "@mui/icons-material";
import { api } from "../config/api";
import AdminCategories from "../components/AdminCategories";
import { useCategory } from "../context/CategoryContext";

// Tab Panel Component
function TabPanel({ children, value, index, ...other }) {
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`admin-tabpanel-${index}`}
            aria-labelledby={`admin-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ py: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

export default function AdminPanel() {
    const { t } = useTranslation();
    const { user } = useAuth();
    const { categories } = useCategory();
    
    // Tab Management
    const [currentTab, setCurrentTab] = useState(0);
    
    // Products State
    const [products, setProducts] = useState([]);
    const [productsLoading, setProductsLoading] = useState(false);
    
    // Users State
    const [users, setUsers] = useState([]);
    const [usersLoading, setUsersLoading] = useState(false);
    
    // Orders State
    const [orders, setOrders] = useState([]);
    const [ordersLoading, setOrdersLoading] = useState(false);
    
    // Product Form State
    const [openProductDialog, setOpenProductDialog] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [productFormData, setProductFormData] = useState({
        name: '',
        description: '',
        price: '',
        imageUrl: '',
        categoryId: ''
    });
    const [productFormErrors, setProductFormErrors] = useState({});
    const [productSubmitting, setProductSubmitting] = useState(false);
    
    // Global State
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });

    // ========== PRODUCT MANAGEMENT ==========
    const fetchProducts = useCallback(async () => {
        try {
            setProductsLoading(true);
            const response = await api.getAllProductsAdmin();
            setProducts(response || []);
        } catch (error) {
            console.error('Ürünler yüklenirken hata:', error);
            setSnackbar({
                open: true,
                message: t('error_loading_products') || 'Ürünler yüklenirken hata oluştu',
                severity: 'error'
            });
            setProducts([]);
        } finally {
            setProductsLoading(false);
        }
    }, [t]);

    const validateProductForm = () => {
        const errors = {};
        
        if (!productFormData.name.trim()) {
            errors.name = 'Ürün adı gereklidir';
        }
        
        if (!productFormData.description.trim()) {
            errors.description = 'Açıklama gereklidir';
        }
        
        if (!productFormData.price.trim()) {
            errors.price = 'Fiyat gereklidir';
        } else {
            const price = parseFloat(productFormData.price);
            if (isNaN(price) || price <= 0) {
                errors.price = 'Geçerli bir fiyat giriniz (0\'dan büyük)';
            }
        }
        
        if (!productFormData.imageUrl.trim()) {
            errors.imageUrl = 'Resim URL\'si gereklidir';
        }
        
        if (!productFormData.categoryId) {
            errors.categoryId = 'Kategori seçimi gereklidir';
        }
        
        setProductFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleOpenProductDialog = (product = null) => {
        setProductFormErrors({});
        if (product) {
            setEditingProduct(product);
            setProductFormData({
                name: product.name || '',
                description: product.description || '',
                price: product.price ? product.price.toString() : '',
                imageUrl: product.image || product.imageUrl || '',
                categoryId: product.categoryId || product.category?.id || ''
            });
        } else {
            setEditingProduct(null);
            setProductFormData({
                name: '',
                description: '',
                price: '',
                imageUrl: '',
                categoryId: ''
            });
        }
        setOpenProductDialog(true);
    };

    const handleCloseProductDialog = () => {
        setOpenProductDialog(false);
        setEditingProduct(null);
        setProductFormData({
            name: '',
            description: '',
            price: '',
            imageUrl: '',
            categoryId: ''
        });
        setProductFormErrors({});
    };

    const handleProductInputChange = (e) => {
        const { name, value } = e.target;
        setProductFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        if (productFormErrors[name]) {
            setProductFormErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleProductSubmit = async () => {
        if (!validateProductForm()) {
            return;
        }

        try {
            setProductSubmitting(true);
            const productData = {
                name: productFormData.name,
                description: productFormData.description,
                price: parseFloat(productFormData.price),
                image: productFormData.imageUrl,
                categoryId: parseInt(productFormData.categoryId)
            };

            if (editingProduct) {
                await api.updateProductAdmin(editingProduct.id, productData);
                setSnackbar({
                    open: true,
                    message: t('product_updated_successfully') || 'Ürün başarıyla güncellendi',
                    severity: 'success'
                });
            } else {
                await api.createProductAdmin(productData);
                setSnackbar({
                    open: true,
                    message: t('product_added_successfully') || 'Ürün başarıyla eklendi',
                    severity: 'success'
                });
            }

            await fetchProducts();
            handleCloseProductDialog();
        } catch (error) {
            console.error('Ürün kaydedilirken hata:', error);
            setSnackbar({
                open: true,
                message: 'Ürün kaydedilirken hata oluştu',
                severity: 'error'
            });
        } finally {
            setProductSubmitting(false);
        }
    };

    const handleDeleteProduct = async (productId) => {
        if (window.confirm(t('confirm_delete_product') || 'Bu ürünü silmek istediğinizden emin misiniz?')) {
            try {
                await api.deleteProductAdmin(productId);
                setSnackbar({
                    open: true,
                    message: t('product_deleted_successfully') || 'Ürün başarıyla silindi',
                    severity: 'success'
                });
                await fetchProducts();
            } catch (error) {
                console.error('Ürün silinirken hata:', error);
                setSnackbar({
                    open: true,
                    message: 'Ürün silinirken hata oluştu',
                    severity: 'error'
                });
            }
        }
    };

    // ========== USER MANAGEMENT ==========
    const fetchUsers = useCallback(async () => {
        try {
            setUsersLoading(true);
            const response = await api.getAllUsersAdmin();
            setUsers(response || []);
        } catch (error) {
            console.error('Kullanıcılar yüklenirken hata:', error);
            setSnackbar({
                open: true,
                message: 'Kullanıcılar yüklenirken hata oluştu',
                severity: 'error'
            });
            setUsers([]);
        } finally {
            setUsersLoading(false);
        }
    }, []);

    const handleDeleteUser = async (userId) => {
        if (window.confirm('Bu kullanıcıyı silmek istediğinizden emin misiniz?')) {
            try {
                await api.deleteUserAdmin(userId);
                setSnackbar({
                    open: true,
                    message: 'Kullanıcı başarıyla silindi',
                    severity: 'success'
                });
                await fetchUsers();
            } catch (error) {
                console.error('Kullanıcı silinirken hata:', error);
                setSnackbar({
                    open: true,
                    message: 'Kullanıcı silinirken hata oluştu',
                    severity: 'error'
                });
            }
        }
    };

    const handleUpdateUserRole = async (userId, newRole) => {
        try {
            await api.updateUserRoleAdmin(userId, newRole);
            setSnackbar({
                open: true,
                message: 'Kullanıcı rolü başarıyla güncellendi',
                severity: 'success'
            });
            await fetchUsers();
        } catch (error) {
            console.error('Kullanıcı rolü güncellenirken hata:', error);
            setSnackbar({
                open: true,
                message: 'Kullanıcı rolü güncellenirken hata oluştu',
                severity: 'error'
            });
        }
    };

    // ========== ORDER MANAGEMENT ==========
    const fetchOrders = useCallback(async () => {
        try {
            setOrdersLoading(true);
            const response = await api.getAllOrdersAdmin();
            setOrders(response || []);
        } catch (error) {
            console.error('Siparişler yüklenirken hata:', error);
            setSnackbar({
                open: true,
                message: 'Siparişler yüklenirken hata oluştu',
                severity: 'error'
            });
            setOrders([]);
        } finally {
            setOrdersLoading(false);
        }
    }, []);

    const handleDeleteOrder = async (orderId) => {
        if (window.confirm('Bu siparişi silmek istediğinizden emin misiniz?')) {
            try {
                await api.deleteOrderAdmin(orderId);
                setSnackbar({
                    open: true,
                    message: 'Sipariş başarıyla silindi',
                    severity: 'success'
                });
                await fetchOrders();
            } catch (error) {
                console.error('Sipariş silinirken hata:', error);
                setSnackbar({
                    open: true,
                    message: 'Sipariş silinirken hata oluştu',
                    severity: 'error'
                });
            }
        }
    };

    // ========== EFFECTS ==========
    useEffect(() => {
        if (user && user.role === "ADMIN") {
            if (currentTab === 0) {
                fetchProducts();
            } else if (currentTab === 1) {
                fetchUsers();
            } else if (currentTab === 2) {
                fetchOrders();
            }
            // currentTab === 3 (Kategoriler) için AdminCategories kendi fetch işlemini yapacak
        }
    }, [user, currentTab, fetchProducts, fetchUsers, fetchOrders]);

    // Admin kontrolü
    if (!user || user.role !== "ADMIN") {
        return <Navigate to="/shop" />;
    }

    // ========== HANDLERS ==========
    const handleTabChange = (event, newValue) => {
        setCurrentTab(newValue);
    };

    const handleCloseSnackbar = () => {
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('tr-TR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}> 
                    <AdminPanelSettings sx={{ fontSize: 45, color: '#243E36' }} />
                    <Typography variant="h4" gutterBottom>
                        {t("admin_panel") || "Admin Paneli"}
                    </Typography>
                </Box>
            </Box>

            {/* Tabs */}
            <Card elevation={2} sx={{ mb: 3 }}>
                <Tabs 
                    value={currentTab} 
                    onChange={handleTabChange}
                    sx={{ 
                        borderBottom: 1, 
                        borderColor: 'divider',
                        '& .MuiTab-root': { textTransform: 'none', fontWeight: 500 }
                    }}
                >
                    <Tab 
                        icon={<Inventory />} 
                        iconPosition="start"
                        label="Ürün Yönetimi" 
                    />
                    <Tab 
                        icon={<Person />} 
                        iconPosition="start"
                        label="Kullanıcı Yönetimi" 
                    />
                    <Tab 
                        icon={<ShoppingCart />} 
                        iconPosition="start"
                        label="Sipariş Yönetimi" 
                    />
                    <Tab 
                        icon={<Category />} 
                        iconPosition="start"
                        label="Kategori Yönetimi" 
                    />
                </Tabs>
            </Card>

            {/* Tab Panels */}
            
            {/* PRODUCTS TAB */}
            <TabPanel value={currentTab} index={0}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h5">Ürün Yönetimi</Typography>
                    <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={() => handleOpenProductDialog()}
                        sx={{ 
                            backgroundColor: '#243E36',
                            '&:hover': { backgroundColor: '#1a2d26' }
                        }}
                    >
                        Yeni Ürün Ekle
                    </Button>
                </Box>

                {productsLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                        <CircularProgress />
                    </Box>
                ) : products.length === 0 ? (
                    <Card>
                        <CardContent sx={{ textAlign: 'center', py: 4 }}>
                            <ImageNotSupported sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
                            <Typography variant="h6" color="textSecondary">
                                Henüz ürün bulunmuyor
                            </Typography>
                        </CardContent>
                    </Card>
                ) : (
                    <Card>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>ID</TableCell>
                                        <TableCell>Ürün Adı</TableCell>
                                        <TableCell>Açıklama</TableCell>
                                        <TableCell>Fiyat</TableCell>
                                        <TableCell>Resim</TableCell>
                                        <TableCell align="center">İşlemler</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {products.map((product) => (
                                        <TableRow key={product.id}>
                                            <TableCell>{product.id}</TableCell>
                                            <TableCell>{product.name}</TableCell>
                                            <TableCell sx={{ maxWidth: 200 }}>
                                                {product.description && product.description.length > 50 
                                                    ? `${product.description.substring(0, 50)}...` 
                                                    : (product.description || '')
                                                }
                                            </TableCell>
                                            <TableCell>₺{product.price}</TableCell>
                                            <TableCell>
                                                {(product.image || product.imageUrl) ? (
                                                    <img 
                                                        src={product.image || product.imageUrl} 
                                                        alt={product.name || 'Ürün'}
                                                        style={{ 
                                                            width: 50, 
                                                            height: 50, 
                                                            objectFit: 'cover',
                                                            borderRadius: 4
                                                        }}
                                                        onError={(e) => {
                                                            e.target.style.display = 'none';
                                                        }}
                                                    />
                                                ) : (
                                                    <Box sx={{ 
                                                        width: 50, 
                                                        height: 50, 
                                                        display: 'flex', 
                                                        alignItems: 'center', 
                                                        justifyContent: 'center',
                                                        backgroundColor: 'grey.200',
                                                        borderRadius: 1
                                                    }}>
                                                        <ImageNotSupported color="disabled" />
                                                    </Box>
                                                )}
                                            </TableCell>
                                            <TableCell align="center">
                                                <IconButton 
                                                    color="primary" 
                                                    onClick={() => handleOpenProductDialog(product)}
                                                    title="Düzenle"
                                                >
                                                    <Edit />
                                                </IconButton>
                                                <IconButton 
                                                    color="error" 
                                                    onClick={() => handleDeleteProduct(product.id)}
                                                    title="Sil"
                                                >
                                                    <Delete />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Card>
                )}
            </TabPanel>

            {/* USERS TAB */}
            <TabPanel value={currentTab} index={1}>
                <Typography variant="h5" sx={{ mb: 3 }}>Kullanıcı Yönetimi</Typography>

                {usersLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                        <CircularProgress />
                    </Box>
                ) : users.length === 0 ? (
                    <Card>
                        <CardContent sx={{ textAlign: 'center', py: 4 }}>
                            <Person sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
                            <Typography variant="h6" color="textSecondary">
                                Kullanıcı bulunmuyor
                            </Typography>
                        </CardContent>
                    </Card>
                ) : (
                    <Card>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>ID</TableCell>
                                        <TableCell>Kullanıcı Adı</TableCell>
                                        <TableCell>Email</TableCell>
                                        <TableCell>Rol</TableCell>
                                        <TableCell>Telefon</TableCell>
                                        <TableCell>Şehir</TableCell>
                                        <TableCell align="center">İşlemler</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {users.map((user) => (
                                        <TableRow key={user.id}>
                                            <TableCell>{user.id}</TableCell>
                                            <TableCell>{user.username}</TableCell>
                                            <TableCell>{user.email}</TableCell>
                                            <TableCell>
                                                <FormControl size="small" sx={{ minWidth: 120 }}>
                                                    <Select
                                                        value={user.role || 'USER'}
                                                        onChange={(e) => handleUpdateUserRole(user.id, e.target.value)}
                                                    >
                                                        <MenuItem value="USER">USER</MenuItem>
                                                        <MenuItem value="ADMIN">ADMIN</MenuItem>
                                                        <MenuItem value="SELLER">SELLER</MenuItem>
                                                    </Select>
                                                </FormControl>
                                            </TableCell>
                                            <TableCell>{user.phone || '-'}</TableCell>
                                            <TableCell>{user.city || '-'}</TableCell>
                                            <TableCell align="center">
                                                <IconButton 
                                                    color="error" 
                                                    onClick={() => handleDeleteUser(user.id)}
                                                    title="Kullanıcıyı Sil"
                                                    disabled={user.id === 1} // Prevent deleting main admin
                                                >
                                                    <Delete />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Card>
                )}
            </TabPanel>

            {/* ORDERS TAB */}
            <TabPanel value={currentTab} index={2}>
                <Typography variant="h5" sx={{ mb: 3 }}>Sipariş Yönetimi</Typography>

                {ordersLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                        <CircularProgress />
                    </Box>
                ) : orders.length === 0 ? (
                    <Card>
                        <CardContent sx={{ textAlign: 'center', py: 4 }}>
                            <ShoppingCart sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
                            <Typography variant="h6" color="textSecondary">
                                Henüz sipariş bulunmuyor
                            </Typography>
                        </CardContent>
                    </Card>
                ) : (
                    <Card>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Sipariş ID</TableCell>
                                        <TableCell>Kullanıcı</TableCell>
                                        <TableCell>Tarih</TableCell>
                                        <TableCell>Toplam Tutar</TableCell>
                                        <TableCell>Ürün Sayısı</TableCell>
                                        <TableCell align="center">İşlemler</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {orders.map((order) => (
                                        <TableRow key={order.id}>
                                            <TableCell>{order.id}</TableCell>
                                            <TableCell>
                                                {order.user ? `${order.user.username} (${order.user.email})` : 'Bilinmeyen'}
                                            </TableCell>
                                            <TableCell>{formatDate(order.orderDate)}</TableCell>
                                            <TableCell>₺{order.totalAmount}</TableCell>
                                            <TableCell>
                                                <Chip 
                                                    label={`${order.orderItems?.length || 0} ürün`}
                                                    size="small"
                                                    variant="outlined"
                                                />
                                            </TableCell>
                                            <TableCell align="center">
                                                <IconButton 
                                                    color="error" 
                                                    onClick={() => handleDeleteOrder(order.id)}
                                                    title="Siparişi Sil"
                                                >
                                                    <Delete />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Card>
                )}
            </TabPanel>

            {/* CATEGORIES TAB */}
            <TabPanel value={currentTab} index={3}>
                <AdminCategories />
            </TabPanel>

            {/* Product Dialog */}
            <Dialog open={openProductDialog} onClose={handleCloseProductDialog} maxWidth="sm" fullWidth>
                <DialogTitle>
                    {editingProduct ? 'Ürün Düzenle' : 'Yeni Ürün Ekle'}
                </DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Ürün Adı"
                                name="name"
                                value={productFormData.name}
                                onChange={handleProductInputChange}
                                error={!!productFormErrors.name}
                                helperText={productFormErrors.name}
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Açıklama"
                                name="description"
                                value={productFormData.description}
                                onChange={handleProductInputChange}
                                error={!!productFormErrors.description}
                                helperText={productFormErrors.description}
                                multiline
                                rows={3}
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Fiyat (₺)"
                                name="price"
                                type="number"
                                value={productFormData.price}
                                onChange={handleProductInputChange}
                                error={!!productFormErrors.price}
                                helperText={productFormErrors.price}
                                inputProps={{ min: 0, step: 0.01 }}
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth required error={!!productFormErrors.categoryId}>
                                <TextField
                                    select
                                    label="Kategori"
                                    name="categoryId"
                                    value={productFormData.categoryId}
                                    onChange={handleProductInputChange}
                                    error={!!productFormErrors.categoryId}
                                    helperText={productFormErrors.categoryId || 'Ürün kategorisini seçiniz'}
                                >
                                    {categories.map((category) => (
                                        <MenuItem key={category.id} value={category.id}>
                                            {category.name}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Resim URL"
                                name="imageUrl"
                                value={productFormData.imageUrl}
                                onChange={handleProductInputChange}
                                error={!!productFormErrors.imageUrl}
                                helperText={productFormErrors.imageUrl}
                                required
                            />
                        </Grid>
                        {productFormData.imageUrl && !productFormErrors.imageUrl && (
                            <Grid item xs={12}>
                                <Box sx={{ textAlign: 'center' }}>
                                    <Typography variant="caption" display="block" gutterBottom>
                                        Resim Önizleme
                                    </Typography>
                                    <img 
                                        src={productFormData.imageUrl} 
                                        alt="Preview"
                                        style={{ 
                                            maxWidth: 200, 
                                            maxHeight: 200, 
                                            objectFit: 'cover',
                                            borderRadius: 8
                                        }}
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                        }}
                                    />
                                </Box>
                            </Grid>
                        )}
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseProductDialog}>
                        İptal
                    </Button>
                    <Button 
                        onClick={handleProductSubmit} 
                        variant="contained"
                        disabled={productSubmitting}
                        sx={{ 
                            backgroundColor: '#243E36',
                            '&:hover': { backgroundColor: '#1a2d26' }
                        }}
                    >
                        {productSubmitting ? (
                            <CircularProgress size={24} color="inherit" />
                        ) : (
                            editingProduct ? "Güncelle" : "Ekle"
                        )}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Loading Backdrop */}
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={productSubmitting}
            >
                <CircularProgress color="inherit" />
            </Backdrop>

            {/* Snackbar */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
            >
                <Alert 
                    onClose={handleCloseSnackbar} 
                    severity={snackbar.severity}
                    variant="filled"
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Container>
    );
}
