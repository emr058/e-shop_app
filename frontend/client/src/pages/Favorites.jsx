import { Grid, Container, Typography } from "@mui/material";
import { useTranslation } from 'react-i18next';
import { useFavorites } from "../context/FavoritesContext";
import ProductCard from "../components/ProductCard";

export default function Favorites() {
    const { favorites } = useFavorites();
    const { t } = useTranslation();

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>{t("favorites")}</Typography>
            <Grid container spacing={3}>
                {favorites.length === 0 ? (
                    <Grid item xs={12}>
                        <Typography 
                            variant="body1" 
                            sx={{ 
                                textAlign: "center",
                                py: 8,
                                color: 'text.secondary',
                                fontSize: '1.1rem'
                            }}
                        >
                            {t("no_favorites_products")}
                        </Typography>
                    </Grid>
                ) : (
                    favorites.map((product) => (
                       <Grid item xs={12} sm={6} md={4} key={product.id}>
                        <ProductCard product={product} />
                       </Grid>
                    ))
                )}
            </Grid>
        </Container>
    );
}