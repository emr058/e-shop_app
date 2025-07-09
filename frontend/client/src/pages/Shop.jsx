import { Grid, Container, Typography } from "@mui/material";
import { useTranslation } from 'react-i18next';
import ProductCard from "../components/ProductCard";
import { useEffect, useState } from "react";
import { getAllProducts } from "../api/products";

export default function Shop() {
    const { t } = useTranslation();
    const [products, setProducts] = useState([]);
    useEffect(() => {
        getAllProducts().then((data) => {
            setProducts(data);
        });
    }, []);
    return (
        <Container maxWidth="2xl" sx={{ py: 4 }}>
          <Typography variant="h4" gutterBottom sx={{ mb: 2 }}>{t("products")}</Typography>
            <Grid container spacing={3}>
            {products.map((product) => (
              <Grid item xs={12} sm={6} md={4} key={product.id}>
                <ProductCard product={product} />
              </Grid>
            ))}
          </Grid>
        </Container>
    );
}