import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../config/api";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export function CartProvider({ children }) {
    const [cartItems, setCartItems] = useState([]);
    const { user, isAuthenticated, loading: authLoading } = useAuth();

    // User değiştiğinde sepeti yükle
    useEffect(() => {
        // AuthContext loading'i bitene kadar bekle
        if (authLoading) {
            return;
        }

        if (!isAuthenticated || !user?.id) {
            setCartItems([]);
            return;
        }

        // Backend'den kullanıcının sepetini yükle
        api.getCart(user.id).then((cart) => {
            if (cart && cart.items) {
                // Backend Cart formatını frontend formatına çevir
                const items = cart.items.map(item => ({
                    id: item.product.id,
                    name: item.product.name,
                    price: item.product.price,
                    image: item.product.imageUrl,
                    description: item.product.description,
                    quantity: item.quantity
                }));
                setCartItems(items);
            } else {
                setCartItems([]);
            }
        }).catch((error) => {
            console.error('Error loading cart:', error);
            setCartItems([]);
        });
    }, [isAuthenticated, user?.id, authLoading]);

    const addToCart = (product) => {
        if (!isAuthenticated || !user?.id) {
            console.error('User not authenticated');
            return;
        }

        // Önce frontend state'ini güncelle
        setCartItems((prev) => {
            const existing = prev.find((item) => item.id === product.id);
            if (existing) {
                return prev.map((item) => 
                    item.id === product.id 
                        ? { ...item, quantity: item.quantity + 1 } 
                        : item
                );
            } else {
                return [...prev, { 
                    ...product, 
                    image: product.imageUrl, // imageUrl'ı image olarak map et
                    quantity: 1 
                }];
            }
        });

        // Backend'e de ekle
        api.addToCart(user.id, product.id, 1).catch((error) => {
            console.error('Error adding to cart on server:', error);
            // Hata durumunda frontend state'ini geri al
            setCartItems((prev) => prev.filter(item => item.id !== product.id));
        });
    };

    const removeFromCart = async (productId) => {
        if (!isAuthenticated || !user?.id) {
            console.error('User not authenticated');
            return;
        }

        try {
            // Backend'ten kaldır
            await api.removeFromCartByProductId(user.id, productId);
            // Frontend state'ini güncelle
            setCartItems((prev) => prev.filter((item) => item.id !== productId));
        } catch (error) {
            console.error('Error removing from cart on server:', error);
            // Hata durumunda sadece frontend'i güncelle
            setCartItems((prev) => prev.filter((item) => item.id !== productId));
        }
    };

    const changeQuantity = async (productId, amount) => {
        if (!isAuthenticated || !user?.id) {
            console.error('User not authenticated');
            return;
        }

        const currentItem = cartItems.find(item => item.id === productId);
        if (!currentItem) return;

        const newQuantity = currentItem.quantity + amount;
        if (newQuantity < 1) return;

        try {
            // Backend'te quantity'yi güncelle
            await api.updateQuantity(user.id, productId, newQuantity);
            // Frontend state'ini güncelle
            setCartItems((prev) => prev.map((item) => {
                if (item.id === productId) {
                    return { ...item, quantity: newQuantity };
                }
                return item;
            }));
        } catch (error) {
            console.error('Error updating quantity on server:', error);
            // Hata durumunda frontend'i geri al (eğer istenirse)
        }
    };

    const clearCart = async () => {
        if (!isAuthenticated || !user?.id) {
            console.error('User not authenticated');
            return;
        }

        try {
            await api.clearCart(user.id);
            setCartItems([]);
        } catch (error) {
            console.error('Error clearing cart on server:', error);
            // Hata olsa bile frontend'i temizle
            setCartItems([]);
        }
    };

    const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

    return (
        <CartContext.Provider value={{ 
            cartItems, 
            addToCart, 
            removeFromCart, 
            changeQuantity, 
            clearCart, 
            total 
        }}>
            {children}
        </CartContext.Provider> 
    );
}

export function useCart() { 
    return useContext(CartContext);
}
