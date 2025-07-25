import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCategory } from '../context/CategoryContext';
import { apiClient } from '../config/api';
import './SellerPanel.css';

const SellerPanel = () => {
    const { user } = useAuth();
    const { categories } = useCategory();
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [activeTab, setActiveTab] = useState('products');
    const [newProduct, setNewProduct] = useState({
        name: '',
        description: '',
        price: '',
        imageUrl: '',
        categoryId: ''
    });
    const [showAddForm, setShowAddForm] = useState(false);

    useEffect(() => {
        if (user && user.role === 'SELLER') {
            fetchSellerProducts();
            fetchSellerOrders();
        }
    }, [user]);

    const fetchSellerProducts = async () => {
        try {
            const response = await apiClient.get(`/products/seller/${user.id}`);
            setProducts(response.data);
        } catch (error) {
            console.error('Ürünler yüklenirken hata:', error);
        }
    };

    const fetchSellerOrders = async () => {
        try {
            const response = await apiClient.get(`/orders/seller/${user.id}`);
            setOrders(response.data);
        } catch (error) {
            console.error('Siparişler yüklenirken hata:', error);
        }
    };

    const handleAddProduct = async (e) => {
        e.preventDefault();
        try {
            const productData = {
                ...newProduct,
                price: parseFloat(newProduct.price),
                categoryId: parseInt(newProduct.categoryId),
                sellerId: user.id
            };
            
            await apiClient.post('/products', productData);
            setNewProduct({ name: '', description: '', price: '', imageUrl: '', categoryId: '' });
            setShowAddForm(false);
            fetchSellerProducts();
            alert('Ürün başarıyla eklendi!');
        } catch (error) {
            console.error('Ürün eklenirken hata:', error);
            alert('Ürün eklenirken hata oluştu!');
        }
    };

    const handleDeleteProduct = async (productId) => {
        if (window.confirm('Bu ürünü silmek istediğinizden emin misiniz?')) {
            try {
                await apiClient.delete(`/products/${productId}`);
                fetchSellerProducts();
                alert('Ürün başarıyla silindi!');
            } catch (error) {
                console.error('Ürün silinirken hata:', error);
                alert('Ürün silinirken hata oluştu!');
            }
        }
    };

    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            await apiClient.put(`/orders/${orderId}/status`, { status: newStatus });
            fetchSellerOrders();
            alert('Sipariş durumu güncellendi!');
        } catch (error) {
            console.error('Sipariş durumu güncellenirken hata:', error);
            alert('Sipariş durumu güncellenirken hata oluştu!');
        }
    };

    // Satıcı kontrolü
    if (!user || user.role !== 'SELLER') {
        return <Navigate to="/shop" />;
    }

    return (
        <div className="seller-panel">
            <div className="seller-panel-header">
                <h1>Satıcı Paneli</h1>
                <p>Hoş geldiniz, {user.username}!</p>
            </div>

            <div className="seller-panel-tabs">
                <button 
                    className={activeTab === 'products' ? 'tab active' : 'tab'} 
                    onClick={() => setActiveTab('products')}
                >
                    Ürünlerim ({products.length})
                </button>
                <button 
                    className={activeTab === 'orders' ? 'tab active' : 'tab'} 
                    onClick={() => setActiveTab('orders')}
                >
                    Siparişlerim ({orders.length})
                </button>
            </div>

            {activeTab === 'products' && (
                <div className="products-section">
                    <div className="section-header">
                        <h2>Ürünlerim</h2>
                        <button 
                            className="add-product-btn" 
                            onClick={() => setShowAddForm(!showAddForm)}
                        >
                            {showAddForm ? 'İptal' : 'Yeni Ürün Ekle'}
                        </button>
                    </div>

                    {showAddForm && (
                        <form className="add-product-form" onSubmit={handleAddProduct}>
                            <div className="form-group">
                                <label>Ürün Adı:</label>
                                <input
                                    type="text"
                                    value={newProduct.name}
                                    onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Açıklama:</label>
                                <textarea
                                    value={newProduct.description}
                                    onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Fiyat (₺):</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={newProduct.price}
                                    onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Kategori:</label>
                                <select
                                    value={newProduct.categoryId}
                                    onChange={(e) => setNewProduct({...newProduct, categoryId: e.target.value})}
                                    required
                                >
                                    <option value="">Kategori seçiniz</option>
                                    {categories.map(category => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Resim URL:</label>
                                <input
                                    type="url"
                                    value={newProduct.imageUrl}
                                    onChange={(e) => setNewProduct({...newProduct, imageUrl: e.target.value})}
                                    required
                                />
                            </div>
                            <button type="submit" className="submit-btn">Ürün Ekle</button>
                        </form>
                    )}

                    <div className="products-grid">
                        {products.map(product => (
                            <div key={product.id} className="product-card">
                                <img src={product.imageUrl} alt={product.name} />
                                <div className="product-info">
                                    <h3>{product.name}</h3>
                                    <p>{product.description}</p>
                                    <div className="product-price">₺{product.price}</div>
                                    <button 
                                        className="delete-btn" 
                                        onClick={() => handleDeleteProduct(product.id)}
                                    >
                                        Sil
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {activeTab === 'orders' && (
                <div className="orders-section">
                    <h2>Siparişlerim</h2>
                    <div className="orders-list">
                        {orders.map(order => (
                            <div key={order.id} className="order-card">
                                <div className="order-header">
                                    <h3>Sipariş #{order.id}</h3>
                                    <span className={`status ${order.status?.toLowerCase()}`}>
                                        {order.status}
                                    </span>
                                </div>
                                <div className="order-details">
                                    <p><strong>Tarih:</strong> {new Date(order.orderDate).toLocaleDateString()}</p>
                                    <p><strong>Toplam:</strong> ₺{order.totalAmount}</p>
                                    <div className="order-items">
                                        <h4>Ürünler:</h4>
                                        {order.orderItems?.map(item => (
                                            <div key={item.id} className="order-item">
                                                <span>{item.product.name} x {item.quantity}</span>
                                                <span>₺{item.unitPrice}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="order-actions">
                                        <select 
                                            value={order.status} 
                                            onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                                        >
                                            <option value="HAZIRLANIYOR">Hazırlanıyor</option>
                                            <option value="KARGODA">Kargoda</option>
                                            <option value="TESLIM_EDILDI">Teslim Edildi</option>
                                            <option value="IPTAL_EDILDI">İptal Edildi</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SellerPanel; 