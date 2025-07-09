import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from 'react-i18next';
import { 
    Container, 
    Paper, 
    TextField, 
    Button, 
    Typography, 
    Box, 
    Alert 
} from "@mui/material";

export default function Login() {
    const [username, setUsername] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const { login } = useAuth();
    const { t } = useTranslation();

    const handleLogin = () => {
        setError("");
        if(username.trim() === "") {
            setError(t("pleaseEnterUsername") || "Lütfen kullanıcı adınızı giriniz.");
            return;
        }
        login(username);
        navigate("/shop");
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleLogin();
        }
    };

    return (
        <Box sx={{ 
            minHeight: 'calc(100vh - 64px)', 
            display: 'flex', 
            alignItems: 'center', 
            py: 4 
        }}>
            <Container maxWidth="sm">
                <Paper 
                    elevation={3} 
                    sx={{ 
                        p: 6,
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(224, 238, 198, 0.3)',
                    }}
                >
                    <Box sx={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center', 
                        gap: 3 
                    }}>
                        <Box sx={{ textAlign: 'center', mb: 2 }}>
                            <Typography 
                                variant="h4" 
                                component="h1" 
                                gutterBottom
                                sx={{ 
                                    fontWeight: 700,
                                    mb: 1,
                                    background: 'linear-gradient(45deg, #243E36 30%, #7CA982 90%)',
                                    backgroundClip: 'text',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                }}
                            >
                                {t("welcome")}
                            </Typography>
                            
                            <Typography 
                                variant="body1" 
                                color="textSecondary"
                                sx={{ fontSize: '1.1rem' }}
                            >
                                {t("login_to_e_shop")}
                            </Typography>
                        </Box>

                        {error && (
                            <Alert 
                                severity="error" 
                                sx={{ 
                                    width: '100%',
                                    borderRadius: 3,
                                    '& .MuiAlert-icon': {
                                        color: '#d32f2f'
                                    }
                                }}
                            >
                                {error}
                            </Alert>
                        )}

                        <TextField
                            fullWidth
                            label={t("username") || "Kullanıcı Adı"}
                            variant="outlined"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            onKeyPress={handleKeyPress}
                            error={!!error}
                            autoFocus
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    fontSize: '1.1rem',
                                    py: 0.5,
                                },
                                '& .MuiInputLabel-root': {
                                    fontSize: '1.1rem',
                                }
                            }}
                        />

                        <Button 
                            fullWidth
                            variant="contained"
                            size="large"
                            onClick={handleLogin}
                            sx={{ 
                                mt: 2, 
                                py: 1.8,
                                fontSize: '1.1rem',
                                fontWeight: 600,
                                background: 'linear-gradient(45deg, #243E36 30%, #7CA982 90%)',
                                '&:hover': {
                                    background: 'linear-gradient(45deg, #1a2d26 30%, #5a7d61 90%)',
                                }
                            }}
                        >
                            {t("login")}
                        </Button>

                        <Typography 
                            variant="body2" 
                            color="textSecondary" 
                            sx={{ 
                                mt: 2,
                                textAlign: 'center',
                                fontSize: '0.9rem'
                            }}
                        >
                            {t("login_to_e_shop_description")}
                        </Typography>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
}