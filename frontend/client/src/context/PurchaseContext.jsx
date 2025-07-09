import { createContext, useState ,useEffect, useContext} from "react";

const PurchaseContext = createContext();

export function PurchaseProvider({ children }) {
    const [orders, setOrders] = useState(() => {
        const storedOrders = localStorage.getItem('orders');
        return storedOrders ? JSON.parse(storedOrders) : [];
    });

    useEffect(() => {
        localStorage.setItem('orders', JSON.stringify(orders));
    }, [orders]);

    const addOrder = (cartItems) => {
        const order = {
            id: Date.now(),
            date: new Date().toLocaleDateString(),
            items: cartItems,
            total: cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
        };
        setOrders((prev) => [...prev, order]);
    };

    const removeOrder = (orderId) => {
        setOrders((prev) => prev.filter((order) => order.id !== orderId));
    };

    return (
        <PurchaseContext.Provider value={{ orders, addOrder, removeOrder }}>{children}</PurchaseContext.Provider>
    );
}

export const usePurchase = () => { 
    return useContext(PurchaseContext); 
};