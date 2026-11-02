import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard.jsx";
import { getProducts } from "../services/productService.js";

const CATEGORIES = ['Semua', 'Elektronik', 'Fashion', 'Makanan', 'Kesehatan', 'Rumah Tangga'];

export default function Products() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [activeCategory, setActiveCategory] = useState('Semua');
    const navigate = useNavigate();

    useEffect(() => {
        let active = true;
        getProducts()
            .then((data) => { if (active) setProducts(data); })
            .catch((err) => { if (active) setError(err.message); })
            .finally(() => { if (active) setLoading(false); });
        return () => { active = false; };
    }, []);

    const filtered = products.filter(p => {
        const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
        const matchCategory = activeCategory === 'Semua' || (p.category && p.category === activeCategory);
        return matchSearch && matchCategory;
    });

    if (loading) return (
        <div className="auth-loading">
            <div className="spinner"></div>
            <p>Memuat produk...</p>
        </div>
    );

    if (error) return (
        <div className="page-section" style={{ textAlign: 'center', paddingTop: '80px' }}>
            <div className="empty-state-icon">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
            </div>
            <p style={{ color: 'var(--color-secondary)', marginTop: '16px' }}>{error}</p>
        </div>
    );

    return (
        <section className="page-section">
            <div className="toolbar">
                <h2>Semua Produk</h2>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <div className="search-wrapper">
                        <span className="search-icon">
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="11" cy="11" r="8"></circle>
                                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                            </svg>
                        </span>
                        <input
                            id="product-search"
                            type="text"
                            placeholder="Cari produk..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="search-input-icon"
                        />
                    </div>
                    <span>{filtered.length} produk</span>
                </div>
            </div>

            {/* Category Filter */}
            <div className="category-filter">
                {CATEGORIES.map(cat => (
                    <button
                        key={cat}
                        id={`category-${cat.toLowerCase().replace(' ', '-')}`}
                        className={`category-btn ${activeCategory === cat ? 'active' : ''}`}
                        onClick={() => setActiveCategory(cat)}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {filtered.length === 0 && (
                <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--color-text-muted)' }}>
                    <div className="empty-state-icon">
                        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                    </div>
                    <p style={{ marginTop: '16px' }}>Produk tidak ditemukan.</p>
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