import { createContext, useState, useContext, useEffect } from "react";
import { api } from "../config/api";
import { useAuth } from "./AuthContext";

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user, isAuthenticated, loading: authLoading } = useAuth();

    useEffect(() => {
        // AuthContext loading'i bitene kadar bekle
        if (authLoading) {
            return;
        }

        if (!isAuthenticated || !user?.id) {
            setFavorites([]);
            setLoading(false);
            return;
        }

        setLoading(true);
        api.getAllFavorites(user.id).then((response) => {
            // Response'un array olduğundan emin ol
            if (Array.isArray(response)) {
                setFavorites(response);
            } else {
                console.warn('Favorites API response is not an array:', response);
                setFavorites([]);
            }
        }).catch((error) => {
            console.error('Error loading favorites:', error);
            setFavorites([]); // Hata durumunda boş array
        }).finally(() => {
            setLoading(false);
        });
    }, [isAuthenticated, user?.id, authLoading]);

    const addToFavorites = (product) => {
        if (!product || !product.id) {
            console.error('Invalid product:', product);
            return;
        }

        if (!isAuthenticated || !user?.id) {
            console.error('User not authenticated');
            return;
        }

        try {
            const isAlreadyFavorite = favorites.some(fav => 
                fav && fav.product && fav.product.id === product.id
            );
            
            if (!isAlreadyFavorite) {
                api.addToFavorites(user.id, product.id).then((newFavorite) => {
                    if (newFavorite) {
                        setFavorites(prev => [...prev, newFavorite]);
                    }
                }).catch((error) => {
                    console.error('Error adding favorites:', error);
                });
            }
        } catch (error) {
            console.error("Favorilere eklerken hata:", error);
        }
    };

    const removeFromFavorites = (productId) => {
        if (!productId) {
            console.error('Invalid productId:', productId);
            return;
        }

        if (!isAuthenticated || !user?.id) {
            console.error('User not authenticated');
            return;
        }

        try {
            const favoriteToRemove = favorites.find(fav => 
                fav && fav.product && fav.product.id === productId
            );
            
            if (favoriteToRemove) {
                api.removeFromFavorites(favoriteToRemove.id).then(() => {
                    setFavorites(prev => prev.filter(fav => 
                        fav && fav.product && fav.product.id !== productId
                    ));
                }).catch((error) => {
                    console.error('Error removing favorites:', error);
                });
            }
        } catch (error) {
            console.error("Favorilerden çıkarırken hata:", error);
        }
    };

    const isFavorite = (productId) => {
        if (!productId || !Array.isArray(favorites)) {
            return false;
        }
        return favorites.some(fav => 
            fav && fav.product && fav.product.id === productId
        );
    };

    const clearFavorites = () => {
        if (!isAuthenticated || !user?.id) {
            console.error('User not authenticated');
            return;
        }

        try {
            api.clearFavorites().then(() => {
                setFavorites([]);
            }).catch((error) => {
                console.error('Error clearing favorites:', error);
            });
        } catch (error) {
            console.error("Favorileri temizlerken hata:", error);
        }
    };

    return (
        <FavoritesContext.Provider 
            value={{
                favorites,
                loading,
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