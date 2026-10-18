import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import toast from 'react-hot-toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Login berhasil!');
      navigate(from, { replace: true });
    } catch (err) {
      const msg = err.response?.data?.message || 'Login gagal. Periksa email dan password.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-section">
      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-title">Masuk ke Akun</h1>
          <p className="auth-subtitle">Selamat datang kembali di Online Shop</p>
        </div>

        <form id="login-form" className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="login-email" className="form-label">Email</label>
            <div className="input-wrapper">
              <span className="input-icon">✉️</span>
              <input
                id="login-email"
                type="email"
                className="form-input"
                placeholder="email@contoh.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="login-password" className="form-label">Password</label>
            <div className="input-wrapper">
              <span className="input-icon">🔒</span>
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                className="form-input"
                placeholder="Masukkan password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <button
            id="login-submit-btn"
            type="submit"
            className="auth-btn"
            disabled={loading}
          >
            {loading ? (
              <><span className="btn-spinner"></span> Memproses...</>
            ) : (
              'Masuk'
            )}
          </button>
        </form>

        <p className="auth-switch">
          Belum punya akun?{' '}
          <Link to="/register" id="go-to-register" className="auth-link">
            Daftar sekarang
          </Link>
        </p>
      </div>
    </section>
  );
}
