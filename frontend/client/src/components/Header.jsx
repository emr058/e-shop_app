import { AppBar, Toolbar, Typography, Button, Box, TextField, InputAdornment, FormControl, Select, MenuItem, Menu, IconButton, Drawer, List, ListItem, ListItemIcon, ListItemText, useMediaQuery, useTheme } from "@mui/material";
import { ShoppingCart, Search, Person, Language, Favorite, ShoppingBag, AdminPanelSettings, Store, Menu as MenuIcon, Close } from "@mui/icons-material";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { useCart } from "../context/CartContext";
import { useCategory } from "../context/CategoryContext";
import { useState, useEffect, useRef } from "react";

export default function Header() {
    const { user, logout, isAuthenticated } = useAuth();
    const { t , i18n } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const { categories } = useCategory();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md')); // 960px altı mobil
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const searchInputRef = useRef(null);

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
                                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                    transform: isSearchFocused ? 'scale(1.02)' : 'scale(1)',
                                    boxShadow: isSearchFocused ? '0 8px 32px rgba(194, 168, 62, 0.3)' : '0 2px 8px rgba(0, 0, 0, 0.1)',
                                    '&:hover': {
                                        backgroundColor: 'rgba(255, 255, 255, 0.15)',
                                        transform: isSearchFocused ? 'scale(1.02)' : 'scale(1.01)',
                                        boxShadow: isSearchFocused ? '0 8px 32px rgba(194, 168, 62, 0.3)' : '0 4px 16px rgba(194, 168, 62, 0.15)',
                                    },
                                    cursor: 'text',
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
                                        {categories.map(category => (
                                            <MenuItem key={category.id} value={category.id}>
                                                {category.name}
                                            </MenuItem>
                                        ))}
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

                                {user?.role === 'SELLER' && (
                                    <Button 
                                        color="inherit" 
                                        component={Link} 
                                        to="/seller"
                                        startIcon={<Store />}
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
                                        startIcon={<AdminPanelSettings />}
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
                                
                                <Button 
                                    color="inherit" 
                                    startIcon={<Language />}
                                    onClick={() => changeLanguage(i18n.language === 'tr' ? 'en' : 'tr')}
                                    sx={{ 
                                        minWidth: 'auto', 
                                        textTransform: 'none',
                                        borderRadius: 2,
                                        px: 1.5,
                                        ml: 1,
                                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                        '&:hover': {
                                            backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                        }
                                    }}
                                >
                                    {i18n.language === 'tr' ? 'EN' : 'TR'}
                                </Button>
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
                                            onChange={(e) => setSelectedCategory(e.target.value)}
                                            displayEmpty
                                            sx={{
                                                '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                                                '& .MuiSelect-select': { fontSize: '0.875rem' }
                                            }}
                                        >
                                            <MenuItem value="">{t("all_categories")}</MenuItem>
                                            {categories.map(category => (
                                                <MenuItem key={category.id} value={category.id}>
                                                    {category.name}
                                                </MenuItem>
                                            ))}
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
                    <ListItem 
                        component={Link} 
                        to="/cart"
                        onClick={() => setMobileMenuOpen(false)}
                        sx={{ 
                            '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' },
                            borderRadius: 1,
                            mx: 1
                        }}
                    >
                        <ListItemIcon sx={{ color: '#C2A83E', minWidth: 40 }}>
                            <ShoppingCart />
                        </ListItemIcon>
                        <ListItemText primary={t("cart")} />
                    </ListItem>

                    <ListItem 
                        component={Link} 
                        to="/favorites"
                        onClick={() => setMobileMenuOpen(false)}
                        sx={{ 
                            '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' },
                            borderRadius: 1,
                            mx: 1
                        }}
                    >
                        <ListItemIcon sx={{ color: '#C2A83E', minWidth: 40 }}>
                            <Favorite />
                        </ListItemIcon>
                        <ListItemText primary={t("favorites")} />
                    </ListItem>

                    <ListItem 
                        component={Link} 
                        to="/orders"
                        onClick={() => setMobileMenuOpen(false)}
                        sx={{ 
                            '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' },
                            borderRadius: 1,
                            mx: 1
                        }}
                    >
                        <ListItemIcon sx={{ color: '#C2A83E', minWidth: 40 }}>
                            <ShoppingBag />
                        </ListItemIcon>
                        <ListItemText primary={t("orders")} />
                    </ListItem>

                    {user?.role === 'SELLER' && (
                        <ListItem 
                            component={Link} 
                            to="/seller"
                            onClick={() => setMobileMenuOpen(false)}
                            sx={{ 
                                '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' },
                                borderRadius: 1,
                                mx: 1
                            }}
                        >
                            <ListItemIcon sx={{ color: '#C2A83E', minWidth: 40 }}>
                                <Store />
                            </ListItemIcon>
                            <ListItemText primary="Satıcı Paneli" />
                        </ListItem>
                    )}

                    {user?.role === 'ADMIN' && (
                        <ListItem 
                            component={Link} 
                            to="/admin"
                            onClick={() => setMobileMenuOpen(false)}
                            sx={{ 
                                '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' },
                                borderRadius: 1,
                                mx: 1
                            }}
                        >
                            <ListItemIcon sx={{ color: '#C2A83E', minWidth: 40 }}>
                                <AdminPanelSettings />
                            </ListItemIcon>
                            <ListItemText primary="Admin Paneli" />
                        </ListItem>
                    )}

                    {isAuthenticated && (
                        <>
                            <Box sx={{ 
                                px: 2, 
                                py: 1,
                                mt: 2,
                                borderTop: '1px solid rgba(255, 255, 255, 0.1)'
                            }}>
                                <Typography variant="body2" sx={{ 
                                    color: '#C2A83E',
                                    fontWeight: 500
                                }}>
                                    {user?.username}
                                </Typography>
                            </Box>
                            <ListItem 
                                onClick={() => {
                                    logout();
                                    setMobileMenuOpen(false);
                                }}
                                sx={{ 
                                    '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' },
                                    borderRadius: 1,
                                    mx: 1,
                                    cursor: 'pointer'
                                }}
                            >
                                <ListItemIcon sx={{ color: '#C2A83E', minWidth: 40 }}>
                                    <Person />
                                </ListItemIcon>
                                <ListItemText primary={t("logout")} />
                            </ListItem>
                        </>
                    )}

                    {!isAuthenticated && (
                        <ListItem 
                            component={Link} 
                            to="/"
                            onClick={() => setMobileMenuOpen(false)}
                            sx={{ 
                                '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' },
                                borderRadius: 1,
                                mx: 1
                            }}
                        >
                            <ListItemIcon sx={{ color: '#C2A83E', minWidth: 40 }}>
                                <Person />
                            </ListItemIcon>
                            <ListItemText primary={t("login")} />
                        </ListItem>
                    )}

                    <ListItem 
                        onClick={() => {
                            changeLanguage(i18n.language === 'tr' ? 'en' : 'tr');
                            setMobileMenuOpen(false);
                        }}
                        sx={{ 
                            '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' },
                            borderRadius: 1,
                            mx: 1,
                            cursor: 'pointer'
                        }}
                    >
                        <ListItemIcon sx={{ color: '#C2A83E', minWidth: 40 }}>
                            <Language />
                        </ListItemIcon>
                        <ListItemText primary={i18n.language === 'tr' ? 'English' : 'Türkçe'} />
                    </ListItem>
                </List>
            </Drawer>
        </>
    );
}

