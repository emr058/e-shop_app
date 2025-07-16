import { createContext, useState ,useEffect, useContext} from "react";
import { api } from "../config/api";
import { useAuth } from "./AuthContext";

const PurchaseContext = createContext();

export function PurchaseProvider({ children }) {
    const [orders, setOrders] = useState([]);
    const { user, isAuthenticated, loading: authLoading } = useAuth();

    useEffect(() => {
        // AuthContext loading'i bitene kadar bekle
        if (authLoading) {
            return;
        }

        if (!isAuthenticated || !user?.id) {
            setOrders([]);
            return;
        }

        api.getAllOrders(user.id).then((response) => {
            setOrders(response);
        }).catch((error) => {
            console.error('Error loading orders:', error);
            setOrders([]); // Error durumunda boş array
        });
    }, [isAuthenticated, user?.id, authLoading]); // User değiştiğinde yeniden yükle

    const addOrder = (cartItems) => {
        if (!isAuthenticated || !user?.id) {
            console.error('User not authenticated');
            return;
        }

        const orderData = {
            // Backend Order entity'sine uygun format
            orderDate: new Date().toISOString(),
            totalAmount: cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
            orderItems: cartItems.map(item => ({
                product: { id: item.id },
                quantity: item.quantity,
                price: item.price
            }))
        };
        
        api.createOrder(user.id, orderData).then((newOrder) => {
            setOrders((prev) => [...prev, newOrder]);
        }).catch((error) => {
            console.error('Error adding order:', error);
        });
    };

    const removeOrder = (orderId) => {
        api.deleteOrder(orderId).then(() => {
            setOrders((prev) => prev.filter((order) => order.id !== orderId));
        }).catch((error) => {
            console.error('Error removing order:', error);
        });
    };

    return (
        <PurchaseContext.Provider value={{ orders, addOrder, removeOrder }}>
            {children}
        </PurchaseContext.Provider>
    );
}

export const usePurchase = () => { 
    return useContext(PurchaseContext); 
};