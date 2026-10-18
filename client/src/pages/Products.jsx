import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard.jsx";
import { getProducts } from "../services/productService.js";

export default function Products() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        let active = true;
        getProducts()
            .then((data) => { if (active) setProducts(data); })
            .catch((err) => { if (active) setError(err.message); })
            .finally(() => { if (active) setLoading(false); });
        return () => { active = false; };
    }, []);

    const filtered = products.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) return (
        <div className="auth-loading">
            <div className="spinner"></div>
            <p>Memuat produk...</p>
        </div>
    );

    if (error) return (
        <div className="page-section" style={{ textAlign: 'center', paddingTop: '80px' }}>
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>⚠️</div>
            <p style={{ color: 'var(--color-secondary)' }}>{error}</p>
        </div>
    );

    return (
        <section className="page-section">
            <div className="toolbar">
                <h2>Semua Produk</h2>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <input
                        id="product-search"
                        type="text"
                        placeholder="🔍 Cari produk..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{
                            padding: '8px 14px',
                            background: 'rgba(255,255,255,0.06)',
                            border: '1px solid var(--color-border)',
                            borderRadius: 'var(--radius-full)',
                            color: 'var(--color-text)',
                            fontFamily: 'var(--font-family)',
                            fontSize: '0.88rem',
                            outline: 'none',
                            minWidth: '200px',
                        }}
                    />
                    <span>{filtered.length} produk</span>
                </div>
            </div>

            {filtered.length === 0 && (
                <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--color-text-muted)' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🔍</div>
                    <p>Produk tidak ditemukan.</p>
                </div>
            )}

            <div className="products-grid">
                {filtered.map((product) => (
                    <ProductCard
                        key={product._id || product.id}
                        product={product}
                        onClick={() => navigate(`/products/${product._id || product.id}`)}
                    />
                ))}
            </div>
        </section>
    );
}