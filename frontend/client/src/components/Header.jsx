import { useAuth } from "../context/AuthContext";
import {AppBar, Toolbar, Typography, Button, Box} from "@mui/material";
import {Link} from "react-router-dom";
import { useTranslation } from 'react-i18next';
import {Language, Store} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

export default function Header() {
    const { user, logout, isAuthenticated } = useAuth();
    const { t , i18n } = useTranslation();
    const navigate = useNavigate();
    
    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    }
   
    return (
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
                py: 1
            }}>
                <Box 
                    sx={{ 
                        display: 'flex',
                        alignItems: 'center',
                        cursor: 'pointer',
                        gap: 1,
                        '&:hover': {
                            opacity: 0.8
                        }
                    }}
                    onClick={() => navigate('/shop')}
                >
                    <Store sx={{ fontSize: '2rem', color: '#C2A83E' }} />
                    <Typography 
                        variant="h6" 
                        component="div" 
                        sx={{ 
                            fontWeight: 800,
                            fontSize: '1.8rem',
                            letterSpacing: '1px',
                            background: 'linear-gradient(45deg, #C2A83E 30%, #ffffff 90%)',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            textShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }}
                    >
                        {t("e_shop")}
                    </Typography>
                </Box>
                
                <Box sx={{ 
                    display: "flex", 
                    alignItems: "center", 
                    gap: 1.5 
                }}>
                    <Button 
                        color="inherit" 
                        component={Link} 
                        to="/shop"
                        sx={{ 
                            borderRadius: 2,
                            px: 2,
                            '&:hover': {
                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            }
                        }}
                    >
                        {t("products")}
                    </Button>
                    
                    <Button 
                        color="inherit" 
                        component={Link} 
                        to="/cart"
                        sx={{ 
                            borderRadius: 2,
                            px: 2,
                            '&:hover': {
                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            }
                        }}
                    >
                        {t("cart")}
                    </Button>
                    
                    <Button 
                        color="inherit" 
                        component={Link} 
                        to="/favorites"
                        sx={{ 
                            borderRadius: 2,
                            px: 2,
                            '&:hover': {
                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            }
                        }}
                    >
                        {t("favorites")}
                    </Button>
                    <Button 
                        color="inherit" 
                        component={Link} 
                        to="/orders"
                        sx={{ 
                            borderRadius: 2,
                            px: 2,
                            '&:hover': {
                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            }
                        }}
                    >
                        {t("orders")}
                    </Button>

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
                        {i18n.language.toUpperCase()}
                    </Button>
                </Box>
            </Toolbar>
        </AppBar>
    );
}

