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
    Alert,
    Tabs,
    Tab 
} from "@mui/material";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [tabValue, setTabValue] = useState(0); // 0: Login, 1: Register
    const navigate = useNavigate();
    const { login, register } = useAuth();
    const { t } = useTranslation();

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
        setError("");
        setSuccess("");
    };

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setError("");
        
        if (!email.trim() || !password.trim()) {
            setError("E-posta ve şifre gereklidir.");
            return;
        }

        const result = await login(email, password);
        if (result.success) {
            navigate("/shop");
        } else {
            setError(result.error);
        }
    };

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        
        if (!email.trim() || !password.trim() || !username.trim()) {
            setError("E-posta, şifre ve kullanıcı adı gereklidir.");
            return;
        }

        const userData = {
            email: email.trim(),
            password: password.trim(),
            username: username.trim(),
            phone: phone.trim(),
            address: address.trim(),
            city: city.trim()
        };

        const result = await register(userData);
        if (result.success) {
            setSuccess("Kayıt başarılı! Şimdi giriş yapabilirsiniz.");
            setTabValue(0); // Login sekmesine geç
            // Form'u temizle
            setEmail("");
            setPassword("");
            setUsername("");
            setPhone("");
            setAddress("");
            setCity("");
        } else {
            setError(result.error);
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
                        p: 4,
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(224, 238, 198, 0.3)',
                    }}
                >
                    <Box sx={{ textAlign: 'center', mb: 3 }}>
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
                            {t("e_shop")}
                        </Typography>
                    </Box>

                    <Tabs 
                        value={tabValue} 
                        onChange={handleTabChange} 
                        centered
                        sx={{ mb: 3 }}
                    >
                        <Tab label="Giriş Yap" />
                        <Tab label="Kayıt Ol" />
                    </Tabs>

                    {error && (
                        <Alert 
                            severity="error" 
                            sx={{ 
                                mb: 2,
                                borderRadius: 3,
                            }}
                        >
                            {error}
                        </Alert>
                    )}

                    {success && (
                        <Alert 
                            severity="success" 
                            sx={{ 
                                mb: 2,
                                borderRadius: 3,
                            }}
                        >
                            {success}
                        </Alert>
                    )}

                    {tabValue === 0 ? (
                        // Login Form
                        <Box component="form" onSubmit={handleLoginSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <TextField
                                fullWidth
                                label="E-posta"
                                type="email"
                                variant="outlined"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                autoFocus
                            />

                            <TextField
                                fullWidth
                                label="Şifre"
                                type="password"
                                variant="outlined"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />

                            <Button 
                                type="submit"
                                fullWidth
                                variant="contained"
                                size="large"
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
                        </Box>
                    ) : (
                        // Register Form
                        <Box component="form" onSubmit={handleRegisterSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <TextField
                                fullWidth
                                label="E-posta *"
                                type="email"
                                variant="outlined"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                autoFocus
                            />

                            <TextField
                                fullWidth
                                label="Kullanıcı Adı *"
                                variant="outlined"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />

                            <TextField
                                fullWidth
                                label="Şifre *"
                                type="password"
                                variant="outlined"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />

                            <TextField
                                fullWidth
                                label="Telefon"
                                variant="outlined"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                            />

                            <TextField
                                fullWidth
                                label="Adres"
                                variant="outlined"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                            />

                            <TextField
                                fullWidth
                                label="Şehir"
                                variant="outlined"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                            />

                            <Button 
                                type="submit"
                                fullWidth
                                variant="contained"
                                size="large"
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
                                Kayıt Ol
                            </Button>
                        </Box>
                    )}
                </Paper>
            </Container>
        </Box>
    );
}