import { Grid, Container, Typography, CircularProgress, Box } from "@mui/material";
import { useTranslation } from 'react-i18next';
import ProductCard from "../components/ProductCard";
import { useFavorites } from "../context/FavoritesContext";

export default function Favorites() {
    const { t } = useTranslation();
    const { favorites, loading } = useFavorites();

    if (loading) {
        return (
            <Container maxWidth="2xl" sx={{ py: 4 }}>
                <Typography variant="h4" gutterBottom sx={{ mb: 2 }}>
                    {t("favorites")}
                </Typography>
                <Box display="flex" justifyContent="center" mt={4}>
                    <CircularProgress />
                </Box>
            </Container>
        );
    }

    if (!Array.isArray(favorites) || favorites.length === 0) {
        return (
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Typography variant="h4" gutterBottom sx={{ mb: 2 }}>
                    {t("favorites")}
                </Typography>
                <Typography variant="body1" color="text.secondary" textAlign="center" mt={4}>
                    {t("no_favorites_products")}
                </Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Typography variant="h4" gutterBottom sx={{ mb: 2 }}>
                {t("favorites")}
            </Typography>
            <Grid container spacing={3}>
                {favorites.map((favorite) => {
                    // Defensive check - favorite ve product var mı?
                    if (!favorite || !favorite.product) {
                        console.warn('Invalid favorite item:', favorite);
                        return null;
                    }
                    
                    return (
                        <Grid size={{xs: 12, sm: 6, md: 4}} key={favorite.id}>
                            <ProductCard product={favorite.product} />
                        </Grid>
                    );
                })}
            </Grid>
        </Container>
    );
}