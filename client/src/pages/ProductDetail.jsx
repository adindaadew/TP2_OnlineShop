import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById } from '../services/productService.js';
import { useCart } from '../context/CartContext.jsx';
import toast from 'react-hot-toast';

export default function ProductDetail() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const navigate = useNavigate();
    const { addToCart } = useCart();

    useEffect(() => {
        getProductById(id).then((data) => {
            setProduct(data);
            setLoading(false);
        });
    }, [id]);

    const handleAddToCart = () => {
        addToCart(product, quantity);
        toast.success(`"${product.name}" (x${quantity}) ditambahkan ke keranjang!`);
    };

    const handleBuyNow = () => {
        addToCart(product, quantity);
        navigate('/cart');
    };

    if (loading) return (
        <div className="auth-loading">
            <div className="spinner"></div>
            <p>Memuat detail produk...</p>
        </div>
    );

    if (!product) return (
        <div className="page-section" style={{ textAlign: 'center', paddingTop: '80px' }}>
            <div className="empty-state-icon">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                </svg>
            </div>
            <p style={{ color: 'var(--color-text-muted)', marginTop: '16px' }}>Produk tidak ditemukan.</p>
            <button className="btn btn-primary" style={{ marginTop: '20px' }} onClick={() => navigate('/products')}>
                Kembali ke Produk
            </button>
        </div>
    );

    return (
        <section className="page-section">
            <button
                id="product-detail-back"
                className="back-link"
                onClick={() => navigate(-1)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', font: 'inherit' }}
            >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}>
                    <line x1="19" y1="12" x2="5" y2="12"></line>
                    <polyline points="12 19 5 12 12 5"></polyline>
                </svg>
                Kembali
            </button>

            <div className="product-detail-wrapper">
                <div>
                    <img
                        src={product.image}
                        alt={product.name}
                        className="product-detail-image"
                        id="product-detail-image"
                    />
                </div>

                <div className="product-detail-info">
                    <h2 id="product-detail-name">{product.name}</h2>
                    <p className="product-detail-price" id="product-detail-price">
                        Rp {product.price?.toLocaleString('id-ID')}
                    </p>
                    <p className="product-detail-desc" id="product-detail-desc">
                        {product.description}
                    </p>

                    {/* Quantity selector */}
                    <div className="detail-qty-row">
                        <span className="form-label">Jumlah:</span>
                        <div className="qty-control">
                            <button
                                id="detail-qty-decrease"
                                className="qty-btn"
                                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                aria-label="Kurangi jumlah"
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                                    <line x1="5" y1="12" x2="19" y2="12"></line>
                                </svg>
                            </button>
                            <span id="detail-qty-value" className="qty-value">{quantity}</span>
                            <button
                                id="detail-qty-increase"
                                className="qty-btn"
                                onClick={() => setQuantity(q => q + 1)}
                                aria-label="Tambah jumlah"
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                                    <line x1="12" y1="5" x2="12" y2="19"></line>
                                    <line x1="5" y1="12" x2="19" y2="12"></line>
                                </svg>
                            </button>
                        </div>
                        <span className="detail-qty-total">
                            = Rp {(product.price * quantity).toLocaleString('id-ID')}
                        </span>
                    </div>

                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                        <button
                            id="add-to-cart-btn"
                            className="btn btn-primary"
                            onClick={handleAddToCart}
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="9" cy="21" r="1"></circle>
                                <circle cx="20" cy="21" r="1"></circle>
                                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                            </svg>
                            Tambah ke Keranjang
                        </button>
                        <button
                            id="buy-now-btn"
                            className="btn btn-outline"
                            onClick={handleBuyNow}
                        >
                            Beli Sekarang
                        </button>
                    </div>

                    <div className="product-guarantee">
                        <div className="guarantee-item">
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M9 12l2 2 4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"></path>
                            </svg>
                            Produk Asli
                        </div>
                        <div className="guarantee-item">
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="1" y="3" width="15" height="13"></rect>
                                <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                                <circle cx="5.5" cy="18.5" r="2.5"></circle>
                                <circle cx="18.5" cy="18.5" r="2.5"></circle>
                            </svg>
                            Gratis Ongkir
                        </div>
                        <div className="guarantee-item">
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="1 4 1 10 7 10"></polyline>
                                <path d="M3.51 15a9 9 0 1 0 .49-3.51"></path>
                            </svg>
                            30 Hari Pengembalian
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
