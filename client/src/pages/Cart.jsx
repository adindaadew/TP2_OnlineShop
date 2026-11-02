import { useState } from 'react';
import { useCart } from '../context/CartContext.jsx';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function Cart() {
    const { cartItems, cartTotal, removeFromCart, updateQuantity, clearCart } = useCart();
    const navigate = useNavigate();
    const [removingId, setRemovingId] = useState(null);

    const handleRemove = (id, name) => {
        setRemovingId(id);
        setTimeout(() => {
            removeFromCart(id);
            setRemovingId(null);
            toast.success(`"${name}" dihapus dari keranjang.`);
        }, 200);
    };

    const handleCheckout = () => {
        if (cartItems.length === 0) {
            toast.error('Keranjang masih kosong!');
            return;
        }
        navigate('/checkout');
    };

    if (cartItems.length === 0) {
        return (
            <section className="page-section">
                <div className="empty-cart">
                    <div className="empty-cart-icon">
                        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="9" cy="21" r="1"></circle>
                            <circle cx="20" cy="21" r="1"></circle>
                            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                        </svg>
                    </div>
                    <h2>Keranjang Kosong</h2>
                    <p>Belum ada produk yang ditambahkan ke keranjang.</p>
                    <button
                        id="cart-go-shop"
                        className="btn btn-primary"
                        onClick={() => navigate('/products')}
                        style={{ marginTop: '16px' }}
                    >
                        Mulai Belanja
                    </button>
                </div>
            </section>
        );
    }

    return (
        <section className="page-section">
            <div className="cart-header-row">
                <h1 className="page-title">Keranjang Belanja</h1>
                <button
                    id="cart-clear-btn"
                    className="btn btn-danger-outline"
                    onClick={() => {
                        clearCart();
                        toast.success('Keranjang dikosongkan.');
                    }}
                >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path>
                        <path d="M10 11v6M14 11v6"></path>
                        <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"></path>
                    </svg>
                    Kosongkan
                </button>
            </div>

            <div className="cart-layout">
                {/* Cart Items */}
                <div className="cart-items">
                    {cartItems.map(item => (
                        <div
                            key={item._id}
                            id={`cart-item-${item._id}`}
                            className={`cart-item ${removingId === item._id ? 'removing' : ''}`}
                        >
                            <img
                                src={item.image}
                                alt={item.name}
                                className="cart-item-image"
                                onClick={() => navigate(`/products/${item._id}`)}
                            />
                            <div className="cart-item-details">
                                <h3
                                    className="cart-item-name"
                                    onClick={() => navigate(`/products/${item._id}`)}
                                >
                                    {item.name}
                                </h3>
                                <p className="cart-item-price">
                                    Rp {item.price?.toLocaleString('id-ID')}
                                </p>
                                <div className="cart-item-controls">
                                    <div className="qty-control">
                                        <button
                                            id={`qty-decrease-${item._id}`}
                                            className="qty-btn"
                                            onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                            aria-label="Kurangi jumlah"
                                        >
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                                                <line x1="5" y1="12" x2="19" y2="12"></line>
                                            </svg>
                                        </button>
                                        <span id={`qty-value-${item._id}`} className="qty-value">{item.quantity}</span>
                                        <button
                                            id={`qty-increase-${item._id}`}
                                            className="qty-btn"
                                            onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                            aria-label="Tambah jumlah"
                                        >
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                                                <line x1="12" y1="5" x2="12" y2="19"></line>
                                                <line x1="5" y1="12" x2="19" y2="12"></line>
                                            </svg>
                                        </button>
                                    </div>
                                    <button
                                        id={`cart-remove-${item._id}`}
                                        className="remove-btn"
                                        onClick={() => handleRemove(item._id, item.name)}
                                        aria-label={`Hapus ${item.name}`}
                                    >
                                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="3 6 5 6 21 6"></polyline>
                                            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path>
                                        </svg>
                                        Hapus
                                    </button>
                                </div>
                            </div>
                            <div className="cart-item-subtotal">
                                Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Order Summary */}
                <div className="cart-summary">
                    <h2 className="summary-title">Ringkasan Pesanan</h2>
                    <div className="summary-rows">
                        {cartItems.map(item => (
                            <div key={item._id} className="summary-row">
                                <span>{item.name} x{item.quantity}</span>
                                <span>Rp {(item.price * item.quantity).toLocaleString('id-ID')}</span>
                            </div>
                        ))}
                    </div>
                    <div className="summary-divider"></div>
                    <div className="summary-row summary-shipping">
                        <span>Ongkos Kirim</span>
                        <span className="free-shipping">GRATIS</span>
                    </div>
                    <div className="summary-total">
                        <span>Total</span>
                        <span id="cart-total" className="total-amount">Rp {cartTotal.toLocaleString('id-ID')}</span>
                    </div>
                    <button
                        id="cart-checkout-btn"
                        className="btn btn-primary checkout-btn"
                        onClick={handleCheckout}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 12l2 2 4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"></path>
                        </svg>
                        Lanjutkan ke Pembayaran
                    </button>
                    <button
                        id="cart-continue-shopping"
                        className="btn btn-secondary continue-btn"
                        onClick={() => navigate('/products')}
                    >
                        Lanjutkan Belanja
                    </button>
                </div>
            </div>
        </section>
    );
}
