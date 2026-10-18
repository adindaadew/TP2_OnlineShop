import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext.jsx';
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Home from "./pages/Home.jsx";
import Products from "./pages/Products.jsx";
import ProductDetail from "./pages/ProductDetail.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import './App.css'

// Google Analytics page-view tracker
function AnalyticsTracker() {
  const location = useLocation();
  useEffect(() => {
    if (window.gtag) {
      window.gtag('config', import.meta.env.VITE_GA_MEASUREMENT_ID || 'G-XXXXXXXXXX', {
        page_path: location.pathname + location.search,
      });
    }
  }, [location]);
  return null;
}

function App() {
  return (
    <AuthProvider>
      <AnalyticsTracker />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: '12px',
            padding: '14px 18px',
            fontFamily: 'Inter, sans-serif',
          },
          success: { iconTheme: { primary: '#6c63ff', secondary: '#fff' } },
          error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
        }}
      />
      <Header />
      <main>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected routes */}
          <Route
            path="/products"
            element={
              <ProtectedRoute>
                <Products />
              </ProtectedRoute>
            }
          />
          <Route
            path="/products/:id"
            element={
              <ProtectedRoute>
                <ProductDetail />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
      <Footer />
    </AuthProvider>
  );
}

export default App
