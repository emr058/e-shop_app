import axios from "axios";

// Base API URL
const API_BASE_URL = 'http://localhost:8080/api';

// API endpoints
export const API_ENDPOINTS = {
    PRODUCTS: `${API_BASE_URL}/products`,
    CART: `${API_BASE_URL}/cart`,
    FAVORITES: `${API_BASE_URL}/favorites`,
    ORDERS: `${API_BASE_URL}/orders`,
    AUTH: `${API_BASE_URL}/auth`,
    ADMIN: `${API_BASE_URL}/admin`
};

// Axios instance with default config
export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    }
});

// API methods
export const api = {
    // Products
    getAllProducts: async () => {
        try {
            const response = await apiClient.get('/products');
            return response.data;
        } catch (error) {
            console.error('Error fetching products:', error);
            return [];
        }
    },

    // Cart
    getCart: async (userId) => {
        const response = await apiClient.get(`/cart/${userId}`);
        return response.data;
    },
    
    addToCart: async (userId, productId, quantity = 1) => {
        const response = await apiClient.post(`/cart/${userId}/add`, null, {
            params: { productId, quantity }
        });
        return response.data;
    },
    
    updateQuantity: async (userId, productId, quantity) => {
        const response = await apiClient.put(`/cart/${userId}/update`, null, {
            params: { productId, quantity }
        });
        return response.data;
    },
    
    removeFromCartByProductId: async (userId, productId) => {
        const response = await apiClient.delete(`/cart/${userId}/remove`, {
            params: { productId }
        });
        return response.data;
    },
    
    removeFromCart: async (cartId, itemId) => {
        const response = await apiClient.delete(`/cart/${cartId}/remove/${itemId}`);
        return response.data;
    },
    
    clearCart: async (userId) => {
        const response = await apiClient.delete(`/cart/${userId}/clear`);
        return response.data;
    },

    // Favorites
    getAllFavorites: async (userId) => {
        const response = await apiClient.get(`/favorites/user/${userId}`);
        return response.data;
    },
    
    addToFavorites: async (userId, productId) => {
        const response = await apiClient.post(`/favorites/user/${userId}`, { 
            product: { id: productId } 
        });
        return response.data;
    },
    
    removeFromFavorites: async (favoriteId) => {
        const response = await apiClient.delete(`/favorites/${favoriteId}`);
        return response.data;
    },
    
    clearFavorites: async () => {
        const response = await apiClient.delete('/favorites');
        return response.data;
    },

    // Orders
    getAllOrders: async (userId) => {
        const response = await apiClient.get(`/orders/user/${userId}`);
        return response.data;
    },
    
    createOrder: async (userId, orderData) => {
        const response = await apiClient.post(`/orders/user/${userId}`, orderData);
        return response.data;
    },

    // Authentication
    login: async (email, password) => {
        const response = await apiClient.post('/auth/login', { email, password });
        return response.data;
    },
    
    register: async (userData) => {
        const response = await apiClient.post('/auth/register', userData);
        return response.data;
    },
    
    getUserById: async (userId) => {
        const response = await apiClient.get(`/auth/user/${userId}`);
        return response.data;
    },
    
    deleteOrder: async (orderId) => {
        const response = await apiClient.delete(`/orders/${orderId}`);
        return response.data;
    },

    // Admin
    getAllProductsAdmin: async () => {
        try {
            const response = await apiClient.get('/admin/products');
            return response.data;
        } catch (error) {
            console.error('Admin products fetch error:', error);
            throw error;
        }
    },
    createProductAdmin: async (product) => {
        try {
            const response = await apiClient.post('/admin/products', product);
            return response.data;
        } catch (error) {
            console.error('Create product error:', error);
            throw error;
        }
    },
    updateProductAdmin: async (id, product) => {
        try {
            const response = await apiClient.put(`/admin/products/${id}`, product);
            return response.data;
        } catch (error) {
            console.error('Update product error:', error);
            throw error;
        }
    },
    deleteProductAdmin: async (id) => {
        try {
            const response = await apiClient.delete(`/admin/products/${id}`);
            return response.data;
        } catch (error) {
            console.error('Delete product error:', error);
            throw error;
        }
    },

    // Users Admin
    getAllUsersAdmin: async () => {
        try {
            const response = await apiClient.get('/admin/users');
            return response.data;
        } catch (error) {
            console.error('Get users error:', error);
            throw error;
        }
    },
    deleteUserAdmin: async (id) => {
        try {
            const response = await apiClient.delete(`/admin/users/${id}`);
            return response.data;
        } catch (error) {
            console.error('Delete user error:', error);
            throw error;
        }
    },
    updateUserRoleAdmin: async (id, role) => {
        try {
            const response = await apiClient.put(`/admin/users/${id}/role`, { role });
            return response.data;
        } catch (error) {
            console.error('Update user role error:', error);
            throw error;
        }
    },

    // Orders Admin
    getAllOrdersAdmin: async () => {
        try {
            const response = await apiClient.get('/admin/orders');
            return response.data;
        } catch (error) {
            console.error('Get orders error:', error);
            throw error;
        }
    },
    deleteOrderAdmin: async (id) => {
        try {
            const response = await apiClient.delete(`/admin/orders/${id}`);
            return response.data;
        } catch (error) {
            console.error('Delete order error:', error);
            throw error;
        }
    }
}; 