import { useState } from 'react';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function Checkout() {
    const { cartItems, cartTotal, clearCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [orderPlaced, setOrderPlaced] = useState(false);

    const [form, setForm] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: '',
        address: '',
        city: '',
        postalCode: '',
        paymentMethod: 'transfer',
    });

    const handleChange = (e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (cartItems.length === 0) {
            toast.error('Keranjang kosong!');
            return;
        }
        setLoading(true);

        // Simulate order processing (no real payment gateway for now)
        await new Promise(resolve => setTimeout(resolve, 1500));

        setOrderPlaced(true);
        clearCart();
        setLoading(false);
        toast.success('Pesanan berhasil dibuat!');
    };

    if (orderPlaced) {
        return (
            <section className="page-section">
                <div className="order-success">
                    <div className="success-icon">
                        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                            <polyline points="22 4 12 14.01 9 11.01"></polyline>
                        </svg>
                    </div>
                    <h2>Pesanan Berhasil Dibuat!</h2>
                    <p>Terima kasih, <strong>{form.name}</strong>. Pesanan Anda sedang diproses dan akan segera dikirimkan.</p>
                    <p className="order-email-note">Konfirmasi pesanan telah dikirim ke <strong>{form.email}</strong>.</p>
                    <div className="success-actions">
                        <button
                            id="order-go-products"
                            className="btn btn-primary"
                            onClick={() => navigate('/products')}
                        >
                            Belanja Lagi
                        </button>
                        <button
                            id="order-go-home"
                            className="btn btn-secondary"
                            onClick={() => navigate('/')}
                        >
                            Ke Beranda
                        </button>
                    </div>
                </div>
            </section>
        );
    }

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
                    <p>Tidak ada produk untuk di-checkout.</p>
                    <button
                        id="checkout-go-shop"
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
            <button
                id="checkout-back"
                className="back-link"
                onClick={() => navigate('/cart')}
                style={{ background: 'none', border: 'none', cursor: 'pointer', font: 'inherit' }}
            >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}>
                    <line x1="19" y1="12" x2="5" y2="12"></line>
                    <polyline points="12 19 5 12 12 5"></polyline>
                </svg>
                Kembali ke Keranjang
            </button>

            <h1 className="page-title" style={{ marginBottom: '32px', marginTop: '8px' }}>Checkout</h1>

            <div className="checkout-layout">
                {/* Shipping Form */}
                <div className="checkout-form-wrapper">
                    <form id="checkout-form" onSubmit={handleSubmit}>
                        {/* Shipping Info */}
                        <div className="checkout-section-card">
                            <h2 className="checkout-section-title">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                    <circle cx="12" cy="10" r="3"></circle>
                                </svg>
                                Informasi Pengiriman
                            </h2>

                            <div className="form-grid-2">
                                <div className="form-group">
                                    <label htmlFor="checkout-name" className="form-label">Nama Lengkap</label>
                                    <input
                                        id="checkout-name"
                                        name="name"
                                        type="text"
                                        className="form-input"
                                        placeholder="Nama penerima"
                                        value={form.name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="checkout-phone" className="form-label">Nomor Telepon</label>
                                    <input
                                        id="checkout-phone"
                                        name="phone"
                                        type="tel"
                                        className="form-input"
                                        placeholder="08xx-xxxx-xxxx"
                                        value={form.phone}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="checkout-email" className="form-label">Email</label>
                                <input
                                    id="checkout-email"
                                    name="email"
                                    type="email"
                                    className="form-input"
                                    placeholder="email@contoh.com"
                                    value={form.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="checkout-address" className="form-label">Alamat Lengkap</label>
                                <textarea
                                    id="checkout-address"
                                    name="address"
                                    className="form-input form-textarea"
                                    placeholder="Jl. Contoh No. 123, RT/RW, Kelurahan, Kecamatan"
                                    value={form.address}
                                    onChange={handleChange}
                                    required
                                    rows={3}
                                />
                            </div>

                            <div className="form-grid-2">
                                <div className="form-group">
                                    <label htmlFor="checkout-city" className="form-label">Kota</label>
                                    <input
                                        id="checkout-city"
                                        name="city"
                                        type="text"
                                        className="form-input"
                                        placeholder="Nama kota"
                                        value={form.city}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="checkout-postal" className="form-label">Kode Pos</label>
                                    <input
                                        id="checkout-postal"
                                        name="postalCode"
                                        type="text"
                                        className="form-input"
                                        placeholder="12345"
                                        value={form.postalCode}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Payment Method */}
                        <div className="checkout-section-card">
                            <h2 className="checkout-section-title">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                                    <line x1="1" y1="10" x2="23" y2="10"></line>
                                </svg>
                                Metode Pembayaran
                            </h2>

                            <div className="payment-options">
                                {[
                                    { value: 'transfer', label: 'Transfer Bank', desc: 'BCA / BNI / Mandiri / BRI' },
                                    { value: 'ewallet', label: 'E-Wallet', desc: 'GoPay / OVO / Dana / ShopeePay' },
                                    { value: 'cod', label: 'Bayar di Tempat (COD)', desc: 'Bayar saat paket tiba' },
                                ].map(opt => (
                                    <label key={opt.value} id={`payment-${opt.value}`} className={`payment-option ${form.paymentMethod === opt.value ? 'selected' : ''}`}>
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value={opt.value}
                                            checked={form.paymentMethod === opt.value}
                                            onChange={handleChange}
                                        />
                                        <div className="payment-option-content">
                                            <span className="payment-option-label">{opt.label}</span>
                                            <span className="payment-option-desc">{opt.desc}</span>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <button
                            id="checkout-submit-btn"
                            type="submit"
                            className="btn btn-primary checkout-btn"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <span className="btn-spinner"></span>
                                    Memproses Pesanan...
                                </>
                            ) : (
                                <>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M9 12l2 2 4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"></path>
                                    </svg>
                                    Buat Pesanan — Rp {cartTotal.toLocaleString('id-ID')}
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Order Summary */}
                <div className="cart-summary checkout-order-summary">
                    <h2 className="summary-title">Ringkasan Pesanan</h2>
                    <div className="checkout-summary-items">
                        {cartItems.map(item => (
                            <div key={item._id} className="checkout-summary-item">
                                <img src={item.image} alt={item.name} className="checkout-summary-img" />
                                <div className="checkout-summary-info">
                                    <span className="checkout-summary-name">{item.name}</span>
                                    <span className="checkout-summary-qty">x{item.quantity}</span>
                                </div>
                                <span className="checkout-summary-price">
                                    Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                                </span>
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
                        <span id="checkout-total" className="total-amount">Rp {cartTotal.toLocaleString('id-ID')}</span>
                    </div>
                    <div className="checkout-guarantee">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                        </svg>
                        Transaksi aman &amp; terenkripsi SSL
                    </div>
                </div>
            </div>
        </section>
    );
}
