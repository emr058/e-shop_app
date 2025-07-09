import { Container, Typography, Paper, Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Home, ArrowBack } from "@mui/icons-material";
import { useTranslation } from 'react-i18next';

export default function NotFound() {
    const { t } = useTranslation();
    const navigate = useNavigate();

    return (
        <Container maxWidth="md" sx={{ py: 6 }}>
            <Paper 
                sx={{ 
                    p: 6,
                    textAlign: 'center',
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(10px)',
                }}
            >
                <Typography 
                    variant="h1" 
                    sx={{ 
                        fontSize: '8rem',
                        fontWeight: 900,
                        background: 'linear-gradient(45deg, #243E36 30%, #7CA982 90%)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        mb: 2
                    }}
                >
                    404
                </Typography>
                
                <Typography 
                    variant="h4" 
                    gutterBottom
                    sx={{ 
                        fontWeight: 600,
                        color: 'primary.main',
                        mb: 2
                    }}
                >
                    {t("page_not_found")}
                </Typography>
                
                <Typography 
                    variant="body1" 
                    color="textSecondary"
                    sx={{ mb: 4, fontSize: '1.1rem' }}
                >
                    {t("page_not_found_description")}
                </Typography>

                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                    <Button
                        variant="contained"
                        startIcon={<Home />}
                        onClick={() => navigate('/')}
                        size="large"
                        sx={{
                            py: 1.5,
                            px: 4,
                            fontSize: '1rem',
                            fontWeight: 600
                        }}
                    >
                        {t("home")}
                    </Button>
                    
                    <Button
                        variant="outlined"
                        startIcon={<ArrowBack />}
                        onClick={() => navigate(-1)}
                        size="large"
                        sx={{
                            py: 1.5,
                            px: 4,
                            fontSize: '1rem',
                            fontWeight: 600
                        }}
                    >
                        {t("back")}
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
}