import { Link } from 'react-router-dom';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-brand">
                    <div className="footer-logo">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                            <line x1="3" y1="6" x2="21" y2="6"></line>
                            <path d="M16 10a4 4 0 0 1-8 0"></path>
                        </svg>
                        <strong>ShopNow</strong>
                    </div>
                    <p className="footer-tagline">Belanja mudah, aman, dan terpercaya.</p>
                </div>

                <div className="footer-links">
                    <Link to="/" id="footer-home">Beranda</Link>
                    <Link to="/products" id="footer-products">Produk</Link>
                    <Link to="/cart" id="footer-cart">Keranjang</Link>
                </div>
            </div>

            <div className="footer-bottom">
                <p>&copy; {currentYear} ShopNow. Hak cipta dilindungi.</p>
            </div>
        </footer>
    );
}