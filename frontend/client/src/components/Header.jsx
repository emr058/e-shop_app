import React, { useState, useContext, useEffect, useRef } from "react";
import { AppBar, Toolbar, Typography, Button, Box, TextField, InputAdornment, FormControl, Select, MenuItem, Menu, IconButton, Drawer, List, ListItem, ListItemIcon, ListItemText, useMediaQuery, useTheme, Badge, Divider } from "@mui/material";
import { ShoppingCart, Search, Person, Language, Favorite, ShoppingBag, AdminPanelSettings, Store, Menu as MenuIcon, Close, ExitToApp, Login, Assignment } from "@mui/icons-material";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useCart } from "../context/CartContext";
import { useCategory } from "../context/CategoryContext";

export default function Header() {
    const { user, logout, isAuthenticated } = useAuth();
    const { cartItems } = useCart();
    const { categories } = useCategory();
    const navigate = useNavigate();
    const location = useLocation();
    const { t, i18n } = useTranslation();
    
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [languageMenuAnchor, setLanguageMenuAnchor] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [searchTerm, setSearchTerm] = useState("");
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const searchInputRef = useRef(null);
    
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const getTotalItemCount = () => {
        if (!cartItems || cartItems.length === 0) return 0;
        return cartItems.reduce((total, item) => total + (item.quantity || 0), 0);
    };

    const handleLogout = () => {
        logout();
        setMobileMenuOpen(false);
        navigate('/login');
    };

    // Debug: Header'da kategorileri izle
    useEffect(() => {
        console.log('Header: Categories received:', categories);
        console.log('Header: Categories length:', categories.length);
        if (categories.length === 0) {
            console.warn('Header: No categories available for search dropdown!');
        }
    }, [categories]);

    // Arama inputu için focus yönetimi
    useEffect(() => {
        if (isSearchFocused && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [isSearchFocused]);

    // Arama fonksiyonu
    const handleSearch = () => {
        if (searchTerm.trim()) {
            navigate(`/shop?query=${encodeURIComponent(searchTerm.trim())}`);
            setSearchTerm("");
            setIsSearchFocused(false);
        }
    };

    // Kategori değişikliği
    const handleCategoryChange = (categoryId) => {
        if (categoryId) {
            navigate(`/shop?category=${categoryId}`);
        } else {
            navigate('/shop');
        }
    };

    // Enter tuşu ile arama
    useEffect(() => {
        const handleKeyPress = (e) => {
            if (e.key === 'Enter' && isSearchFocused && searchTerm.trim()) {
                handleSearch();
            }
        };

        document.addEventListener('keypress', handleKeyPress);
        return () => document.removeEventListener('keypress', handleKeyPress);
    }, [searchTerm, isSearchFocused]);

    // Container'a tıklayınca arama kutusuna odaklan
    const handleContainerClick = (e) => {
        // Kategori dropdown'a tıklanmışsa focus etme
        if (e.target.closest('.MuiSelect-root') || e.target.closest('[role="combobox"]')) {
            return;
        }
        searchInputRef.current?.focus();
    };

    // URL'deki parametreleri okuyup state'i güncelle (geri dönme için)
    useEffect(() => {
        if (location.pathname === '/shop' && location.search) {
            const searchParams = new URLSearchParams(location.search);
            const urlQuery = searchParams.get('query') || '';
            const urlCategory = searchParams.get('category') || '';
            
            setSearchTerm(urlQuery);
            setSelectedCategory(urlCategory);
        } else if (location.pathname === '/shop' && !location.search) {
            // Shop'a direk gelindiyse arama kutusunu temizle
            setSearchTerm('');
            setSelectedCategory('');
        }
    }, [location]);

    // Anlık arama ve filtreleme
    useEffect(() => {
        // URL'den gelen değişiklikse tetikleme (sonsuz döngü önleme)
        const currentParams = new URLSearchParams(location.search);
        const currentQuery = currentParams.get('query') || '';
        const currentCategory = currentParams.get('category') || '';
        
        if (searchTerm === currentQuery && selectedCategory === currentCategory) {
            return;
        }
        
        const timeoutId = setTimeout(() => {
            const searchQuery = searchTerm.trim();
            const categoryParam = selectedCategory;
            
            if (searchQuery || categoryParam) {
                // Query string kullan - daha temiz URL
                const params = new URLSearchParams();
                if (searchQuery) params.append('query', searchQuery);
                if (categoryParam) params.append('category', categoryParam);
                
                navigate(`/shop?${params.toString()}`);
            } else if (window.location.pathname === '/shop') {
                // Arama temizlenirse ve shop sayfasındaysak, temiz shop'a git
                navigate('/shop');
            }
        }, 300); // 300ms debounce - çok hızlı API çağrısı yapmasın
        
        return () => clearTimeout(timeoutId);
    }, [searchTerm, selectedCategory, navigate, location.search]);

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    }
   
    return (
        <>
            <AppBar position="static" elevation={2} sx={{
                borderTopLeftRadius: 0,
                borderTopRightRadius: 0,
                borderBottomLeftRadius: 12,
                borderBottomRightRadius: 12,
                backgroundColor: '#243E36'
            }}>
                <Toolbar sx={{ 
                    display: "flex", 
                    justifyContent: "space-between", 
                    alignItems: "center",
                    py: 1,
                    minHeight: isMobile ? '64px' : '80px'
                }}>
                    {/* Logo */}
                    <Box 
                        sx={{ 
                            display: 'flex',
                            alignItems: 'center',
                            cursor: 'pointer',
                            gap: 1,
                            flexShrink: 0, // Logo asla küçülmesin
                            '&:hover': {
                                opacity: 0.8
                            }
                        }}
                        onClick={() => navigate('/shop')}
                    >
                        <Store sx={{ 
                            fontSize: isMobile ? '1.5rem' : '2rem', 
                            color: '#C2A83E' 
                        }} />
                        <Typography 
                            variant="h6" 
                            component="div" 
                            sx={{ 
                                fontWeight: 800,
                                fontSize: isMobile ? '1.2rem' : '1.8rem',
                                letterSpacing: '1px',
                                background: 'linear-gradient(45deg, #C2A83E 30%, #ffffff 90%)',
                                backgroundClip: 'text',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                whiteSpace: 'nowrap' // Logonun bölünmesini önle
                            }}
                        >
                            {t("e_shop")}
                        </Typography>
                    </Box>

                    {/* Desktop Layout */}
                    {!isMobile && (
                        <>
                            {/* Arama Barı - Desktop */}
                            <Box 
                                onClick={handleContainerClick}
                                sx={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    gap: 1,
                                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                    borderRadius: 2,
                                    p: 1,
                                    flexGrow: 1,
                                    maxWidth: isSearchFocused ? 700 : 500,
                                    mx: 3,
                                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)', // Smooth animasyon
                                    transform: isSearchFocused ? 'scale(1.02)' : 'scale(1)', // Hafif büyütme
                                    boxShadow: isSearchFocused ? '0 8px 32px rgba(194, 168, 62, 0.3)' : '0 2px 8px rgba(0, 0, 0, 0.1)', // Glow efekti
                                    '&:hover': {
                                        backgroundColor: 'rgba(255, 255, 255, 0.15)',
                                        transform: isSearchFocused ? 'scale(1.02)' : 'scale(1.01)',
                                        boxShadow: isSearchFocused ? '0 8px 32px rgba(194, 168, 62, 0.3)' : '0 4px 16px rgba(194, 168, 62, 0.15)',
                                    },
                                    cursor: 'text', // Tıklanabilir olduğunu göster
                                }}
                            >
                                <TextField
                                    size="small"
                                    placeholder={t("search_products")}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    onFocus={() => setIsSearchFocused(true)}
                                    onBlur={() => setIsSearchFocused(false)}
                                    inputRef={searchInputRef}
                                    sx={{
                                        flexGrow: 1,
                                        '& .MuiOutlinedInput-root': {
                                            backgroundColor: isSearchFocused ? 'rgba(255, 255, 255, 1)' : 'rgba(255, 255, 255, 0.9)',
                                            borderRadius: 1.5,
                                            transition: 'all 0.3s ease-in-out',
                                            '& fieldset': { 
                                                border: isSearchFocused ? '2px solid #C2A83E' : 'none',
                                                transition: 'border 0.3s ease-in-out'
                                            },
                                            '&:hover fieldset': { 
                                                border: isSearchFocused ? '2px solid #C2A83E' : '1px solid rgba(194, 168, 62, 0.5)' 
                                            },
                                            '&.Mui-focused fieldset': { 
                                                border: '2px solid #C2A83E' 
                                            },
                                            transform: isSearchFocused ? 'translateY(-1px)' : 'translateY(0)',
                                        },
                                        '& .MuiOutlinedInput-input': {
                                            fontSize: isSearchFocused ? '1rem' : '0.9rem',
                                            transition: 'font-size 0.3s ease-in-out',
                                            padding: isSearchFocused ? '12px 14px' : '10px 14px',
                                        }
                                    }}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Search sx={{ 
                                                    color: isSearchFocused ? '#C2A83E' : 'text.secondary', 
                                                    fontSize: isSearchFocused ? '1.4rem' : '1.2rem',
                                                    transition: 'all 0.3s ease-in-out',
                                                    transform: isSearchFocused ? 'rotate(5deg)' : 'rotate(0deg)'
                                                }} />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                                <FormControl 
                                    size="small" 
                                    sx={{ 
                                        minWidth: 120,
                                        opacity: isSearchFocused ? 0.7 : 1,
                                        transition: 'opacity 0.3s ease-in-out',
                                    }}
                                >
                                    <Select
                                        value={selectedCategory}
                                        onChange={(e) => setSelectedCategory(e.target.value)}
                                        displayEmpty
                                        sx={{
                                            backgroundColor: isSearchFocused ? 'rgba(255, 255, 255, 1)' : 'rgba(255, 255, 255, 0.9)',
                                            borderRadius: 1.5,
                                            transition: 'all 0.3s ease-in-out',
                                            transform: isSearchFocused ? 'translateY(-1px)' : 'translateY(0)',
                                            '& .MuiOutlinedInput-notchedOutline': { 
                                                border: isSearchFocused ? '1px solid rgba(194, 168, 62, 0.3)' : 'none',
                                                transition: 'border 0.3s ease-in-out'
                                            },
                                            '&:hover .MuiOutlinedInput-notchedOutline': { 
                                                border: '1px solid rgba(194, 168, 62, 0.5)' 
                                            },
                                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': { 
                                                border: '2px solid #C2A83E' 
                                            },
                                            '& .MuiSelect-select': {
                                                fontSize: isSearchFocused ? '1rem' : '0.9rem',
                                                transition: 'font-size 0.3s ease-in-out',
                                                padding: isSearchFocused ? '12px 14px' : '10px 14px',
                                            }
                                        }}
                                    >
                                        <MenuItem value="">{t("all_categories")}</MenuItem>
                                        {categories.length === 0 ? (
                                            <MenuItem disabled>
                                                <em style={{ color: 'red' }}>Kategoriler yüklenemedi</em>
                                            </MenuItem>
                                        ) : (
                                            categories.map(category => (
                                                <MenuItem key={category.id} value={category.id}>
                                                    {category.name}
                                                </MenuItem>
                                            ))
                                        )}
                                    </Select>
                                </FormControl>
                            </Box>

                            {/* Desktop Menü */}
                            <Box sx={{ 
                                display: "flex", 
                                alignItems: "center", 
                                gap: 1.5,
                                flexShrink: 0
                            }}>
                                <IconButton 
                                    color="inherit" 
                                    component={Link} 
                                    to="/cart"
                                    sx={{ 
                                        borderRadius: 2,
                                        '&:hover': {
                                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                        }
                                    }}
                                >
                                    <ShoppingCart />
                                </IconButton>
                                
                                <IconButton 
                                    color="inherit" 
                                    component={Link} 
                                    to="/favorites"
                                    sx={{ 
                                        borderRadius: 2,
                                        '&:hover': {
                                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                        }
                                    }}
                                >
                                    <Favorite />
                                </IconButton>
                                
                                <IconButton 
                                    color="inherit" 
                                    component={Link} 
                                    to="/orders"
                                    sx={{ 
                                        borderRadius: 2,
                                        '&:hover': {
                                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                        }
                                    }}
                                >
                                    <ShoppingBag />
                                </IconButton>

                                <IconButton 
                                    color="inherit" 
                                    component={Link} 
                                    to="/profile"
                                    sx={{ 
                                        borderRadius: 2,
                                        '&:hover': {
                                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                        }
                                    }}
                                >
                                    <Person />
                                </IconButton>

                                {user?.role === 'SELLER' && (
                                    <Button 
                                        color="inherit" 
                                        component={Link} 
                                        to="/seller"
                                        sx={{ 
                                            borderRadius: 2,
                                            px: 2,
                                            textTransform: 'none',
                                            '&:hover': {
                                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                            }
                                        }}
                                    >
                                        Satıcı Paneli
                                    </Button>
                                )}

                                {user?.role === 'ADMIN' && (
                                    <Button 
                                        color="inherit" 
                                        component={Link} 
                                        to="/admin"
                                        sx={{ 
                                            borderRadius: 2,
                                            px: 2,
                                            textTransform: 'none',
                                            '&:hover': {
                                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                            }
                                        }}
                                    >
                                        Admin Paneli
                                    </Button>
                                )}

                                {isAuthenticated && (
                                    <>
                                        <Typography 
                                            sx={{ 
                                                ml: 2,
                                                px: 2,
                                                py: 0.5,
                                                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                                                borderRadius: 2,
                                                fontSize: '0.9rem',
                                                fontWeight: 500
                                            }}
                                        >
                                            {user?.username}
                                        </Typography>
                                        <Button 
                                            color="inherit" 
                                            onClick={logout}
                                            sx={{ 
                                                borderRadius: 2,
                                                px: 2,
                                                '&:hover': {
                                                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                                }
                                            }}
                                        >
                                            {t("logout")}
                                        </Button>
                                    </>
                                )}
                                
                                {!isAuthenticated && (
                                    <Button 
                                        color="inherit" 
                                        component={Link} 
                                        to="/"
                                        sx={{ 
                                            borderRadius: 2,
                                            px: 2,
                                            '&:hover': {
                                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                            }
                                        }}
                                    >
                                        {t("login")}
                                    </Button>
                                )}
                                
                                <IconButton
                                    color="inherit"
                                    onClick={() => i18n.changeLanguage(i18n.language === 'tr' ? 'en' : 'tr')}
                                    sx={{ mr: 1 }}
                                    title={i18n.language === 'tr' ? 'Switch to English' : 'Türkçe\'ye geç'}
                                >
                                    <Language />
                                </IconButton>
                            </Box>
                        </>
                    )}

                    {/* Mobile Layout */}
                    {isMobile && (
                        <>
                            {/* Mobil Arama - Sadece İkon */}
                            <IconButton 
                                onClick={() => searchInputRef.current?.focus()}
                                sx={{ 
                                    color: '#C2A83E',
                                    '&:hover': {
                                        backgroundColor: 'rgba(194, 168, 62, 0.1)'
                                    }
                                }}
                            >
                                <Search />
                            </IconButton>

                            {/* Mobil Menü İkonu */}
                            <IconButton 
                                onClick={() => setMobileMenuOpen(true)}
                                sx={{ 
                                    color: 'white',
                                    '&:hover': {
                                        backgroundColor: 'rgba(255, 255, 255, 0.1)'
                                    }
                                }}
                            >
                                <MenuIcon />
                            </IconButton>
                        </>
                    )}
                </Toolbar>
            </AppBar>

            {/* Mobil Arama Barı - Ekstra satır */}
            {isMobile && (
                <Box sx={{ 
                    backgroundColor: '#243E36', 
                    pb: 1,
                    px: 2,
                }}>
                    <TextField
                        size="small"
                        fullWidth
                        placeholder={t("search_products")}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        inputRef={searchInputRef}
                        sx={{
                            mb: 2,
                            '& .MuiOutlinedInput-root': {
                                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                borderRadius: 2,
                                '& fieldset': { border: 'none' },
                                '&:hover fieldset': { border: '1px solid rgba(194, 168, 62, 0.5)' },
                                '&.Mui-focused fieldset': { border: '2px solid #C2A83E' }
                            }
                        }}
                        InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Search sx={{ color: 'text.secondary' }} />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <FormControl size="small" sx={{ minWidth: 100 }}>
                                            <Select
                                                value={selectedCategory}
                                                onChange={(e) => handleCategoryChange(e.target.value)}
                                                displayEmpty
                                                sx={{
                                                    '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                                                    '& .MuiSelect-select': { fontSize: '0.875rem' }
                                                }}
                                            >
                                                <MenuItem value="">{t("all_categories")}</MenuItem>
                                                {categories.length === 0 ? (
                                                    <MenuItem disabled>
                                                        <em style={{ color: 'red', fontSize: '0.8rem' }}>Kategoriler yok</em>
                                                    </MenuItem>
                                                ) : (
                                                    categories.map(category => (
                                                        <MenuItem key={category.id} value={category.id}>
                                                            {category.name}
                                                        </MenuItem>
                                                    ))
                                                )}
                                            </Select>
                                        </FormControl>
                                    </InputAdornment>
                                ),
                            }}
                        />
                </Box>
            )}

            {/* Mobil Drawer Menü */}
            <Drawer
                anchor="right"
                open={mobileMenuOpen}
                onClose={() => setMobileMenuOpen(false)}
                sx={{
                    '& .MuiDrawer-paper': {
                        width: 280,
                        backgroundColor: '#243E36',
                        color: 'white'
                    }
                }}
            >
                <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    p: 2,
                    borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                    <Typography variant="h6" sx={{ color: '#C2A83E' }}>
                        {t("menu")}
                    </Typography>
                    <IconButton 
                        onClick={() => setMobileMenuOpen(false)}
                        sx={{ color: 'white' }}
                    >
                        <Close />
                    </IconButton>
                </Box>

                <List sx={{ pt: 0 }}>
                    <ListItem button onClick={() => { navigate('/shop'); setMobileMenuOpen(false); }}>
                        <ListItemIcon><Store /></ListItemIcon>
                        <ListItemText primary={t("products")} />
                    </ListItem>

                    <ListItem button onClick={() => { navigate('/profile'); setMobileMenuOpen(false); }}>
                        <ListItemIcon><Person /></ListItemIcon>
                        <ListItemText primary={t("profile")} />
                    </ListItem>

                    <ListItem button onClick={() => { navigate('/favorites'); setMobileMenuOpen(false); }}>
                        <ListItemIcon><Favorite /></ListItemIcon>
                        <ListItemText primary={t("favorites")} />
                    </ListItem>

                    <ListItem button onClick={() => { navigate('/cart'); setMobileMenuOpen(false); }}>
                        <ListItemIcon>
                            <Badge badgeContent={getTotalItemCount()} color="error">
                                <ShoppingCart />
                            </Badge>
                        </ListItemIcon>
                        <ListItemText primary={t("cart")} />
                    </ListItem>

                    <ListItem button onClick={() => { navigate('/orders'); setMobileMenuOpen(false); }}>
                        <ListItemIcon><Assignment /></ListItemIcon>
                        <ListItemText primary={t("orders")} />
                    </ListItem>

                    <Divider />

                    <ListItem button onClick={() => { 
                        i18n.changeLanguage(i18n.language === 'tr' ? 'en' : 'tr'); 
                        setMobileMenuOpen(false); 
                    }}>
                        <ListItemIcon><Language /></ListItemIcon>
                        <ListItemText primary={i18n.language === 'tr' ? 'English' : 'Türkçe'} />
                    </ListItem>

                    {user ? (
                        <ListItem button onClick={handleLogout}>
                            <ListItemIcon><ExitToApp /></ListItemIcon>
                            <ListItemText primary={t("logout")} />
                        </ListItem>
                    ) : (
                        <ListItem button onClick={() => { navigate('/login'); setMobileMenuOpen(false); }}>
                            <ListItemIcon><Login /></ListItemIcon>
                            <ListItemText primary={t("login")} />
                        </ListItem>
                    )}
                </List>
            </Drawer>
        </>
    );
}

