import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import toast from 'react-hot-toast';

export default function Header() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        toast.success('Berhasil keluar.');
        navigate('/');
    };

    return (
        <header className="header">
            <Link to="/" id="header-logo" className="header-logo">
                <strong>Online Shop</strong>
            </Link>

            <nav className="nav" aria-label="Main navigation">
                <Link to="/" id="nav-home" className="nav-link">Beranda</Link>
                <Link to="/products" id="nav-products" className="nav-link">Produk</Link>
            </nav>

            <div className="header-auth">
                {user ? (
                    <div className="user-menu">
                        <span className="user-greeting">
                            <span id="user-name-display">{user.name}</span>
                        </span>
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