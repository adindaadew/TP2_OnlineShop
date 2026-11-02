import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import toast from 'react-hot-toast';

export default function Header() {
    const { user, logout } = useAuth();
    const { cartCount } = useCart();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        toast.success('Berhasil keluar.');
        navigate('/');
    };

    return (
        <header className="header">
            <Link to="/" id="header-logo" className="header-logo">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                    <line x1="3" y1="6" x2="21" y2="6"></line>
                    <path d="M16 10a4 4 0 0 1-8 0"></path>
                </svg>
                <strong>ShopNow</strong>
            </Link>

            <nav className="nav" aria-label="Main navigation">
                <Link to="/" id="nav-home" className="nav-link">Beranda</Link>
                <Link to="/products" id="nav-products" className="nav-link">Produk</Link>
            </nav>

            <div className="header-auth">
                {user ? (
                    <div className="user-menu">
                        <span className="user-greeting">
                            Halo, <span id="user-name-display">{user.name}</span>
                        </span>

                        {/* Cart icon with badge */}
                        <Link to="/cart" id="nav-cart" className="cart-icon-btn" aria-label="Keranjang">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="9" cy="21" r="1"></circle>
                                <circle cx="20" cy="21" r="1"></circle>
                                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                            </svg>
                            {cartCount > 0 && (
                                <span className="cart-badge">{cartCount > 99 ? '99+' : cartCount}</span>
                            )}
                        </Link>

                        <button
                            id="logout-btn"
                            className="btn btn-outline"
                            onClick={handleLogout}
                        >
                            Keluar
                        </button>
                    </div>
                ) : (
                    <div className="auth-links">
                        <Link to="/login" id="nav-login" className="btn btn-outline">Masuk</Link>
                        <Link to="/register" id="nav-register" className="btn btn-primary">Daftar</Link>
                    </div>
                )}
            </div>
        </header>
    );
}