import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Home() {
    const { user } = useAuth();

    return (
        <section className="hero-section">
            <div className="hero-content">
                <div className="hero-badge">
                    Toko Online Terpercaya
                </div>

                <h1 className="hero-title">
                    Belanja Lebih Mudah,<br />Harga Lebih Terjangkau
                </h1>

                <p className="hero-subtitle">
                    Temukan ribuan produk berkualitas dengan pengiriman cepat dan aman.<br />
                    Bergabunglah dengan jutaan pelanggan puas kami.
                </p>

                <div className="hero-actions">
                    <Link to="/products" id="hero-shop-now" className="btn btn-primary">
                        Mulai Belanja
                    </Link>
                    {!user && (
                        <Link to="/register" id="hero-register" className="btn btn-outline">
                            Daftar Gratis
                        </Link>
                    )}
                </div>

                <div className="hero-stats">
                    <div className="stat-item">
                        <span className="stat-number">500+</span>
                        <span className="stat-label">Produk Tersedia</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-number">10K+</span>
                        <span className="stat-label">Pelanggan Aktif</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-number">4.9</span>
                        <span className="stat-label">Rating Kepuasan</span>
                    </div>
                </div>
            </div>
        </section>
    );
}
