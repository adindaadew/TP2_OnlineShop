import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import toast from 'react-hot-toast';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Password dan konfirmasi password tidak cocok!');
      return;
    }
    if (password.length < 6) {
      toast.error('Password minimal 6 karakter!');
      return;
    }

    setLoading(true);
    try {
      await register(name, email, password);
      toast.success('Registrasi berhasil! Akun Anda telah dibuat.');
      navigate('/');
    } catch (err) {
      const msg = err.response?.data?.message || 'Registrasi gagal. Silakan coba lagi.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-section">
      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-title">Buat Akun Baru</h1>
          <p className="auth-subtitle">Bergabung dan mulai belanja sekarang</p>
        </div>

        <form id="register-form" className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="register-name" className="form-label">Nama Lengkap</label>
            <div className="input-wrapper">
              <span className="input-icon">👤</span>
              <input
                id="register-name"
                type="text"
                className="form-input"
                placeholder="Nama"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoComplete="name"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="register-email" className="form-label">Email</label>
            <div className="input-wrapper">
              <span className="input-icon">✉️</span>
              <input
                id="register-email"
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
            <label htmlFor="register-password" className="form-label">Password</label>
            <div className="input-wrapper">
              <span className="input-icon">🔒</span>
              <input
                id="register-password"
                type={showPassword ? 'text' : 'password'}
                className="form-input"
                placeholder="Minimal 6 karakter"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password"
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

          <div className="form-group">
            <label htmlFor="register-confirm-password" className="form-label">Konfirmasi Password</label>
            <div className="input-wrapper">
              <span className="input-icon">🔐</span>
              <input
                id="register-confirm-password"
                type={showPassword ? 'text' : 'password'}
                className="form-input"
                placeholder="Ulangi password Anda"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                autoComplete="new-password"
              />
            </div>
          </div>

          {/* Password strength indicator */}
          {password && (
            <div className="password-strength">
              <div className={`strength-bar ${password.length >= 8 ? 'strong' : password.length >= 6 ? 'medium' : 'weak'}`}></div>
              <span className="strength-label">
                {password.length >= 8 ? 'Kuat' : password.length >= 6 ? 'Sedang' : 'Lemah'}
              </span>
            </div>
          )}

          <button
            id="register-submit-btn"
            type="submit"
            className="auth-btn"
            disabled={loading}
          >
            {loading ? (
              <><span className="btn-spinner"></span> Mendaftar...</>
            ) : (
              'Daftar Sekarang'
            )}
          </button>
        </form>

        <p className="auth-switch">
          Sudah punya akun?{' '}
          <Link to="/login" id="go-to-login" className="auth-link">
            Masuk di sini
          </Link>
        </p>
      </div>
    </section>
  );
}
