import { Box, Container, Grid, Typography, IconButton, Divider, useTheme, useMediaQuery } from '@mui/material';
import { Facebook, Twitter, Instagram, LinkedIn, Store, Email, Phone } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export default function Footer() {
    const { t } = useTranslation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    return (
        <Box
            component="footer"
            sx={{
                backgroundColor: '#243E36',
                color: 'white',
                mt: 'auto',
                pt: { xs: 3, md: 4 },
                pb: { xs: 2, md: 3 },
            }}
        >
            <Container maxWidth="lg">
                <Grid container spacing={{ xs: 3, md: 4 }}>
                    {/* Logo ve Açıklama */}
                    <Grid item xs={12} md={4}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Store sx={{ fontSize: '1.8rem', color: '#C2A83E', mr: 1 }} />
                            <Typography 
                                variant="h6" 
                                sx={{ 
                                    fontWeight: 800,
                                    background: 'linear-gradient(45deg, #C2A83E 30%, #ffffff 90%)',
                                    backgroundClip: 'text',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                }}
                            >
                                {t("e_shop")}
                            </Typography>
                        </Box>
                        <Typography 
                            variant="body2" 
                            sx={{ 
                                color: 'rgba(255, 255, 255, 0.7)', 
                                mb: 2, 
                                lineHeight: 1.5,
                                fontSize: '0.875rem'
                            }}
                        >
                            Kaliteli ürünler, güvenli alışveriş ve hızlı teslimat. E-ticaretin yeni adresi.
                        </Typography>
                        
                        {/* Sosyal Medya İkonları - Kompakt */}
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                            {[Facebook, Twitter, Instagram, LinkedIn].map((Icon, index) => (
                                <IconButton 
                                    key={index}
                                    size="small"
                                    sx={{ 
                                        color: '#C2A83E',
                                        '&:hover': { 
                                            backgroundColor: 'rgba(194, 168, 62, 0.1)',
                                            transform: 'translateY(-2px)',
                                            transition: 'all 0.3s ease'
                                        }
                                    }}
                                >
                                    <Icon fontSize="small" />
                                </IconButton>
                            ))}
                        </Box>
                    </Grid>

                    {/* Hızlı Linkler - Kompakt */}
                    <Grid item xs={6} md={2}>
                        <Typography 
                            variant="subtitle2" 
                            sx={{ 
                                mb: 2, 
                                color: '#C2A83E', 
                                fontWeight: 600,
                                fontSize: '0.9rem'
                            }}
                        >
                            {t("quick_links")}
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.8 }}>
                            {[
                                { text: t("products"), link: '/shop' },
                                { text: t("favorites"), link: '/favorites' },
                                { text: t("orders"), link: '/orders' },
                                { text: t("cart"), link: '/cart' },
                            ].map((item, index) => (
                                <Typography
                                    key={index}
                                    component={Link}
                                    to={item.link}
                                    variant="body2"
                                    sx={{
                                        color: 'rgba(255, 255, 255, 0.7)',
                                        textDecoration: 'none',
                                        fontSize: '0.8rem',
                                        '&:hover': {
                                            color: '#C2A83E',
                                            transform: 'translateX(3px)',
                                            transition: 'all 0.3s ease'
                                        }
                                    }}
                                >
                                    {item.text}
                                </Typography>
                            ))}
                        </Box>
                    </Grid>

                    {/* Müşteri Hizmetleri - Kompakt */}
                    <Grid item xs={6} md={3}>
                        <Typography 
                            variant="subtitle2" 
                            sx={{ 
                                mb: 2, 
                                color: '#C2A83E', 
                                fontWeight: 600,
                                fontSize: '0.9rem'
                            }}
                        >
                            Destek
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.8 }}>
                            {[
                                'SSS',
                                'İade & Değişim',
                                'Kargo Bilgisi',
                                'Gizlilik Politikası',
                            ].map((item, index) => (
                                <Typography
                                    key={index}
                                    variant="body2"
                                    sx={{
                                        color: 'rgba(255, 255, 255, 0.7)',
                                        cursor: 'pointer',
                                        fontSize: '0.8rem',
                                        '&:hover': {
                                            color: '#C2A83E',
                                            transform: 'translateX(3px)',
                                            transition: 'all 0.3s ease'
                                        }
                                    }}
                                >
                                    {item}
                                </Typography>
                            ))}
                        </Box>
                    </Grid>

                    {/* İletişim - Kompakt */}
                    <Grid item xs={12} md={3}>
                        <Typography 
                            variant="subtitle2" 
                            sx={{ 
                                mb: 2, 
                                color: '#C2A83E', 
                                fontWeight: 600,
                                fontSize: '0.9rem'
                            }}
                        >
                            İletişim
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Phone sx={{ color: '#C2A83E', fontSize: '1rem' }} />
                                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.8rem' }}>
                                    +90 (212) 123 45 67
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Email sx={{ color: '#C2A83E', fontSize: '1rem' }} />
                                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.8rem' }}>
                                    info@eshop.com
                                </Typography>
                            </Box>
                        </Box>

                        {/* Çalışma Saatleri - Mini */}
                        <Box 
                            sx={{ 
                                mt: 2, 
                                p: 1.5, 
                                backgroundColor: 'rgba(194, 168, 62, 0.1)', 
                                borderRadius: 1,
                                border: '1px solid rgba(194, 168, 62, 0.3)'
                            }}
                        >
                            <Typography 
                                variant="caption" 
                                sx={{ 
                                    color: '#C2A83E', 
                                    fontWeight: 600, 
                                    display: 'block',
                                    mb: 0.5,
                                    fontSize: '0.75rem'
                                }}
                            >
                                Destek: 7/24
                            </Typography>
                            <Typography 
                                variant="caption" 
                                sx={{ 
                                    color: 'rgba(255, 255, 255, 0.7)', 
                                    fontSize: '0.7rem',
                                    lineHeight: 1.3
                                }}
                            >
                                Hafta içi: 09:00-18:00<br />
                                Hafta sonu: 10:00-16:00
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>

                <Divider sx={{ my: { xs: 2, md: 3 }, borderColor: 'rgba(255, 255, 255, 0.1)' }} />

                {/* Alt Kısım - Kompakt */}
                <Box 
                    sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        flexDirection: isMobile ? 'column' : 'row',
                        gap: isMobile ? 1.5 : 0,
                        textAlign: isMobile ? 'center' : 'left'
                    }}
                >
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.75rem' }}>
                        © 2025 E-Shop. Tüm hakları saklıdır.
                    </Typography>
                    
                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: isMobile ? 'center' : 'flex-end' }}>
                        {['Visa', 'Mastercard', 'PayPal'].map((payment, index) => (
                            <Box
                                key={index}
                                sx={{
                                    px: 1.5,
                                    py: 0.3,
                                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                    borderRadius: 0.5,
                                    fontSize: '0.7rem',
                                    color: 'rgba(255, 255, 255, 0.7)',
                                    border: '1px solid rgba(255, 255, 255, 0.1)'
                                }}
                            >
                                {payment}
                            </Box>
                        ))}
                    </Box>
                </Box>
            </Container>
        </Box>
    );
} 