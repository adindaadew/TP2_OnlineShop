import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import toast from 'react-hot-toast';

export default function ProductCard({ product, onClick }) {
    const { addToCart } = useCart();

    const handleAddToCart = (e) => {
        e.stopPropagation();
        addToCart(product, 1);
        toast.success(`"${product.name}" ditambahkan ke keranjang!`);
    };

    return (
        <div
            className="product-card"
            id={`product-card-${product._id || product.id}`}
            onClick={onClick}
            style={{ cursor: 'pointer' }}
        >
            <img src={product.image} alt={product.name} className="product-image" />

            <div className="product-info">
                <h3>{product.name}</h3>
                <p>Rp {product.price?.toLocaleString('id-ID')}</p>
                <div className="product-card-actions">
                    <button
                        className="btn btn-primary"
                        id={`view-detail-${product._id || product.id}`}
                        onClick={(e) => { e.stopPropagation(); onClick(); }}
                    >
                        Detail
                    </button>
                    <button
                        className="btn btn-cart"
                        id={`add-cart-${product._id || product.id}`}
                        onClick={handleAddToCart}
                        aria-label={`Tambah ${product.name} ke keranjang`}
                        title="Tambah ke keranjang"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="9" cy="21" r="1"></circle>
                            <circle cx="20" cy="21" r="1"></circle>
                            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}