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
                return [...prev, { ...product, quantity: 1 }];
            }
        });

        // Backend'e de ekle
        api.addToCart(user.id, product.id, 1).catch((error) => {
            console.error('Error adding to cart on server:', error);
            // Hata durumunda frontend state'ini geri al
            setCartItems((prev) => prev.filter(item => item.id !== product.id));
        });
    };

    const removeFromCart = (productId) => {
        if (!isAuthenticated || !user?.id) {
            console.error('User not authenticated');
            return;
        }

        setCartItems((prev) => prev.filter((item) => item.id !== productId));
        // Backend'ten kaldırma işlemi burada implement edilebilir
        // Şimdilik sadece frontend state'ini güncelliyoruz
    };

    const changeQuantity = (productId, amount) => {
        if (!isAuthenticated || !user?.id) {
            console.error('User not authenticated');
            return;
        }

        setCartItems((prev) => prev.map((item) => {
            if (item.id === productId) {
                const newQuantity = item.quantity + amount;
                if (newQuantity < 1) {
                    return item; 
                }
                return { ...item, quantity: newQuantity };
            }
            return item;
        }));
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
