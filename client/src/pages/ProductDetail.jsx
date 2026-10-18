import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById } from '../services/productService.js';

export default function ProductDetail() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        getProductById(id).then((data) => {
            setProduct(data);
            setLoading(false);
        });
    }, [id]);

    if (loading) return (
        <div className="auth-loading">
            <div className="spinner"></div>
            <p>Memuat detail produk...</p>
        </div>
    );

    if (!product) return (
        <div className="page-section" style={{ textAlign: 'center', paddingTop: '80px' }}>
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📦</div>
            <p style={{ color: 'var(--color-text-muted)' }}>Produk tidak ditemukan.</p>
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
                ← Kembali
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

                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                        <button
                            id="add-to-cart-btn"
                            className="btn btn-primary"
                            onClick={() => alert(`"${product.name}" ditambahkan ke keranjang!`)}
                        >
                            Tambah ke Keranjang
                        </button>
                        <button
                            id="buy-now-btn"
                            className="btn btn-outline"
                            onClick={() => alert('Fitur beli langsung segera hadir!')}
                        >
                            Beli Sekarang
                        </button>
                    </div>

                    <div style={{
                        marginTop: '32px',
                        padding: '16px',
                        background: 'rgba(108,99,255,0.08)',
                        border: '1px solid var(--color-border)',
                        borderRadius: 'var(--radius-md)',
                        display: 'flex',
                        gap: '24px',
                        flexWrap: 'wrap',
                    }}>
                        <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                            ✅ Produk Asli &nbsp;|&nbsp; 🚚 Gratis Ongkir &nbsp;|&nbsp; 🔄 30 Hari Pengembalian
                        </span>
                    </div>
                </div>
            </div>
        </section>
    );
}
