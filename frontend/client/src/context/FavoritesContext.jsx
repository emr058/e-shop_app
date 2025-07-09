import { createContext, useState, useContext, useEffect } from "react";

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        try {
            const savedFavorites = localStorage.getItem("favorites");
            if (savedFavorites) {
                const parsed = JSON.parse(savedFavorites);
                if (Array.isArray(parsed)) {
                    setFavorites(parsed);
                }
            }
        } catch (error) {
            console.error("Favori ürünleri yüklerken hata:", error);
            localStorage.removeItem("favorites");
        }
        setLoading(false);
    }, []);

    const addToFavorites = (product) => {
        try {
            const isAlreadyFavorite = favorites.some(fav => fav.id === product.id);
            if (!isAlreadyFavorite) {
                const newFavorites = [...favorites, product];
                setFavorites(newFavorites);
                localStorage.setItem("favorites", JSON.stringify(newFavorites));
            }
        } catch (error) {
            console.error("Favorilere eklerken hata:", error);
        }
    };

    const removeFromFavorites = (productId) => {
        try {
            const newFavorites = favorites.filter(fav => fav.id !== productId);
            setFavorites(newFavorites);
            localStorage.setItem("favorites", JSON.stringify(newFavorites));
        } catch (error) {
            console.error("Favorilerden çıkarırken hata:", error);
        }
    };

    const isFavorite = (productId) => {
        return favorites.some(fav => fav.id === productId);
    };

    const clearFavorites = () => {
        try {
            setFavorites([]);
            localStorage.removeItem("favorites");
        } catch (error) {
            console.error("Favorileri temizlerken hata:", error);
        }
    };

    if (loading) {
        return null;
    }

    return (
        <FavoritesContext.Provider 
            value={{
                favorites,
                addToFavorites,
                removeFromFavorites,
                isFavorite,
                clearFavorites
            }}
        >
            {children}
        </FavoritesContext.Provider>
    );
};

export const useFavorites = () => {
    const context = useContext(FavoritesContext);
    if (!context) {
        throw new Error('useFavorites must be used within a FavoritesProvider');
    }
    return context;
};