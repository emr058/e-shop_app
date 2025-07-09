import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
    const [cartItems, setCartItems] = useState(() => { const saved = localStorage.getItem('cart');
        return saved ? JSON.parse(saved) : [];
    });

useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
}, [cartItems]);

const addToCart = (product) => {
    setCartItems((prev) => {
        const existing = prev.find((item) => item.id === product.id);
        if (existing) {
            return prev.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
        } else {
            return [...prev, { ...product, quantity: 1 }];
        }
    });
};

const removeFromCart = (productId) => {
    setCartItems((prev) => prev.filter((item) => item.id !== productId));
};

const changeQuantity = (productId, amount) => {
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
const clearCart = () => {
    setCartItems([]);
};

const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, changeQuantity, clearCart, total }}>{children}</CartContext.Provider> 
    );
}

export function useCart() { 
    return useContext(CartContext);
}
