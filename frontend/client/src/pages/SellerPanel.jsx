import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCategory } from '../context/CategoryContext';
import { apiClient } from '../config/api';
import { useTranslation } from 'react-i18next';

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
    const [showBulkUpload, setShowBulkUpload] = useState(false);
    const [bulkUploadFile, setBulkUploadFile] = useState(null);
    const [bulkUploadStatus, setBulkUploadStatus] = useState('');
    const { t } = useTranslation();

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
                name: newProduct.name,
                description: newProduct.description,
                price: parseFloat(newProduct.price),
                imageUrl: newProduct.imageUrl,
                sellerId: user.id,
                categoryId: parseInt(newProduct.categoryId)
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

    const handleBulkUpload = async (e) => {
        e.preventDefault();
        
        if (!bulkUploadFile) {
            alert('Lütfen bir CSV dosyası seçiniz!');
            return;
        }

        setBulkUploadStatus('Yükleniyor...');

        const formData = new FormData();
        formData.append('file', bulkUploadFile);
        formData.append('sellerId', user.id);

        try {
            const response = await apiClient.post('/products/bulk-upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            const result = response.data;
            
            if (result.success) {
                setBulkUploadStatus(
                    `Başarılı! ${result.successCount} ürün eklendi. ` +
                    (result.errorCount > 0 ? `${result.errorCount} hata var.` : '')
                );
                fetchSellerProducts(); // Ürün listesini yenile
                setBulkUploadFile(null);
                
                if (result.errors && result.errors.length > 0) {
                    console.warn('Bulk upload errors:', result.errors);
                }
            } else {
                setBulkUploadStatus('Hata: ' + (result.message || 'Bilinmeyen hata'));
            }
        } catch (error) {
            console.error('Toplu yükleme hatası:', error);
            setBulkUploadStatus('Hata: ' + (error.response?.data?.message || 'Dosya yüklenirken hata oluştu'));
        }
    };

    // Satıcı kontrolü
    if (!user || user.role !== 'SELLER') {
        return <Navigate to="/shop" />;
    }

    return (
        <div className="seller-panel">
            <div className="seller-panel-header">
                <h1>{t("seller_panel")}</h1>
                <div className="seller-tabs">
                    <button 
                        className={activeTab === 'products' ? 'active' : ''}
                        onClick={() => setActiveTab('products')}
                    >
                        {t("my_products")}
                    </button>
                    <button 
                        className={activeTab === 'orders' ? 'active' : ''}
                        onClick={() => setActiveTab('orders')}
                    >
                        {t("my_orders")}
                    </button>
                </div>
            </div>

            {activeTab === 'products' && (
                <div className="products-section">
                    <div className="section-header">
                        <h2>{t("my_products")} ({products.length})</h2>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button 
                                className="add-btn"
                                onClick={() => setShowAddForm(!showAddForm)}
                            >
                                {showAddForm ? t("cancel") : t("add_new_product")}
                            </button>
                            <button 
                                className="add-btn"
                                onClick={() => setShowBulkUpload(!showBulkUpload)}
                                style={{ backgroundColor: '#4CAF50' }}
                            >
                                {showBulkUpload ? t("cancel") : t("bulk_upload")}
                            </button>
                        </div>
                    </div>

                    {showAddForm && (
                        <form className="add-product-form" onSubmit={handleAddProduct}>
                            <h3>{t("add_new_product")}</h3>
                            
                            <div className="form-group">
                                <label>{t("product_name")}:</label>
                                <input
                                    type="text"
                                    value={newProduct.name}
                                    onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                                    required
                                    placeholder={t("product_name_placeholder")}
                                />
                            </div>
                            
                            <div className="form-group">
                                <label>{t("description")}:</label>
                                <textarea
                                    value={newProduct.description}
                                    onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                                    required
                                    placeholder={t("product_description_placeholder")}
                                />
                            </div>
                            
                            <div className="form-group">
                                <label>{t("price")} (₺):</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={newProduct.price}
                                    onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                                    required
                                    placeholder="0.00"
                                />
                            </div>
                            
                            <div className="form-group">
                                <label>{t("categories")}:</label>
                                <select
                                    value={newProduct.categoryId}
                                    onChange={(e) => setNewProduct({...newProduct, categoryId: e.target.value})}
                                    required
                                >
                                    <option value="">{t("select_category")}...</option>
                                    {categories.length === 0 ? (
                                        <option disabled>{t("categories_loading")}...</option>
                                    ) : (
                                        categories.map(category => (
                                            <option key={category.id} value={category.id}>
                                                {category.name}
                                            </option>
                                        ))
                                    )}
                                </select>
                                {categories.length === 0 && (
                                    <small style={{ color: '#dc3545', fontSize: '0.85rem', marginTop: '8px', display: 'block' }}>
                                        {t("categories_load_error")}
                                    </small>
                                )}
                            </div>
                            
                            <div className="form-group">
                                <label>{t("image_url")}:</label>
                                <input
                                    type="url"
                                    value={newProduct.imageUrl}
                                    onChange={(e) => setNewProduct({...newProduct, imageUrl: e.target.value})}
                                    required
                                    placeholder="https://example.com/image.jpg"
                                />
                                
                                {/* Simple Image Preview */}
                                {newProduct.imageUrl && (
                                    <div className="image-upload-section">
                                        <h4>{t("image_preview")}</h4>
                                        <img 
                                            src={newProduct.imageUrl} 
                                            alt={t("image_preview")} 
                                            className="image-preview"
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                                e.target.nextSibling.style.display = 'block';
                                            }}
                                        />
                                        <p style={{ 
                                            display: 'none', 
                                            color: '#dc3545', 
                                            fontSize: '0.85rem',
                                            textAlign: 'center',
                                            marginTop: '16px'
                                        }}>
                                            {t("image_load_error")}
                                        </p>
                                    </div>
                                )}
                            </div>
                            
                            <button type="submit" className="submit-btn">
                                {t("add_product")}
                            </button>
                        </form>
                    )}

                    {showBulkUpload && (
                        <div className="bulk-upload-form" style={{
                            backgroundColor: '#f9f9f9',
                            border: '2px dashed #ccc',
                            borderRadius: '8px',
                            padding: '24px',
                            marginBottom: '24px',
                            textAlign: 'center'
                        }}>
                            <h3>{t("bulk_upload")}</h3>
                            <p style={{ color: '#666', marginBottom: '16px' }}>
                                {t("bulk_upload_description")}
                            </p>
                            
                            <div style={{ marginBottom: '16px' }}>
                                <strong>{t("csv_format")}:</strong> {t("csv_format_example")}
                            </div>
                            
                            <div style={{ marginBottom: '16px', fontSize: '0.9rem', color: '#888' }}>
                                <strong>{t("example")}:</strong><br/>
                                "{t("iphone_15")}","{t("new_iphone_model")}",50000,"{t("iphone_image_url")}","{t("electronics")}"<br/>
                                "{t("macbook_air")}","{t("m2_chip_laptop")}",35000,"{t("macbook_image_url")}","{t("electronics")}"
                            </div>

                            <form onSubmit={handleBulkUpload} style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
                                <input
                                    type="file"
                                    accept=".csv"
                                    onChange={(e) => {
                                        setBulkUploadFile(e.target.files[0]);
                                        setBulkUploadStatus('');
                                    }}
                                    style={{
                                        padding: '8px',
                                        border: '1px solid #ddd',
                                        borderRadius: '4px',
                                        fontSize: '14px'
                                    }}
                                />
                                
                                <button 
                                    type="submit" 
                                    disabled={!bulkUploadFile || bulkUploadStatus === 'Yükleniyor...'}
                                    style={{
                                        backgroundColor: '#4CAF50',
                                        color: 'white',
                                        border: 'none',
                                        padding: '12px 24px',
                                        borderRadius: '4px',
                                        cursor: bulkUploadFile ? 'pointer' : 'not-allowed',
                                        fontSize: '14px',
                                        opacity: !bulkUploadFile ? 0.6 : 1
                                    }}
                                >
                                    {bulkUploadStatus === 'Yükleniyor...' ? 'Yükleniyor...' : 'CSV Dosyasını Yükle'}
                                </button>
                            </form>

                            {bulkUploadStatus && (
                                <div style={{
                                    marginTop: '16px',
                                    padding: '12px',
                                    borderRadius: '4px',
                                    backgroundColor: bulkUploadStatus.startsWith('Hata') ? '#ffebee' : '#e8f5e8',
                                    color: bulkUploadStatus.startsWith('Hata') ? '#c62828' : '#2e7d32',
                                    border: `1px solid ${bulkUploadStatus.startsWith('Hata') ? '#c62828' : '#2e7d32'}`
                                }}>
                                    {bulkUploadStatus}
                                </div>
                            )}

                            <div style={{ 
                                marginTop: '16px', 
                                padding: '12px', 
                                backgroundColor: '#fff3cd', 
                                border: '1px solid #856404',
                                borderRadius: '4px',
                                fontSize: '0.85rem',
                                color: '#856404'
                            }}>
                                <strong>{t("attention")}:</strong> {t("categories_must_be_pre_defined")}
                            </div>
                        </div>
                    )}

                    <div className="products-grid">
                        {products.length === 0 ? (
                            <div className="empty-state" style={{ gridColumn: '1 / -1' }}>
                                <div className="empty-state-icon">📦</div>
                                <h3>{t("no_products_yet")}</h3>
                                <p>{t("add_your_first_product")}</p>
                            </div>
                        ) : (
                            products.map(product => (
                                <div key={product.id} className="product-card">
                                    <img src={product.imageUrl || product.image} alt={product.name} />
                                    <div className="product-info">
                                        <h3>{product.name}</h3>
                                        <p>{product.description}</p>
                                        <div className="product-price">₺{product.price}</div>
                                        <button 
                                            className="delete-btn" 
                                            onClick={() => handleDeleteProduct(product.id)}
                                        >
                                            {t("delete")}
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}

            {activeTab === 'orders' && (
                <div className="orders-section">
                    <h2>{t("my_orders")} ({orders.length})</h2>
                    
                    {orders.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-state-icon">🛒</div>
                            <h3>{t("no_orders_yet")}</h3>
                            <p>{t("customers_will_see_your_products")}</p>
                        </div>
                    ) : (
                        <div className="orders-list">
                            {orders.map(order => (
                                <div key={order.id} className="order-card">
                                    <div className="order-header">
                                        <h3>{t("order")} #{order.id}</h3>
                                        <span className={`status ${order.status?.toLowerCase()}`}>
                                            {order.status}
                                        </span>
                                    </div>
                                    <div className="order-details">
                                        <p><strong>{t("date")}:</strong> {new Date(order.orderDate).toLocaleDateString('tr-TR')}</p>
                                        <p><strong>{t("total")}:</strong> ₺{order.totalAmount}</p>
                                        <p><strong>{t("customer")}:</strong> {order.user?.username || t("unknown")}</p>
                                        <div className="order-items">
                                            <h4>{t("products")}:</h4>
                                            {order.orderItems?.map(item => (
                                                <div key={item.id} className="order-item">
                                                    <span>{item.productName || item.product?.name || t("product")} × {item.quantity}</span>
                                                    <span><strong>₺{item.unitPrice}</strong></span>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="order-actions">
                                            <label>{t("status")}:</label>
                                            <select 
                                                value={order.status || 'HAZIRLANIYOR'} 
                                                onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                                            >
                                                <option value="HAZIRLANIYOR">{t("preparing")}</option>
                                                <option value="ONAYLANDI">{t("approved")}</option>
                                                <option value="KARGOYA_VERILDI">{t("shipped")}</option>
                                                <option value="KARGODA">{t("in_transit")}</option>
                                                <option value="TESLIM_EDILDI">{t("delivered")}</option>
                                                <option value="IPTAL_EDILDI">{t("cancelled")}</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SellerPanel; 