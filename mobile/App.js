import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Image,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  Alert,
  Platform,
  RefreshControl,
} from 'react-native';
import {
  loginApi,
  registerApi,
  getProfileApi,
  getProductsApi,
  getProductByIdApi,
} from './src/services/apiService';
import storage from './src/services/storage';

// Helper format Rupiah
const formatRupiah = (number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(number || 0);
};

// Fallback products if backend is cold-starting or initial load
const FALLBACK_PRODUCTS = [
  {
    _id: 'fb-1',
    name: 'Kemeja Flanel Pria',
    price: 150000,
    image: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=500&auto=format&fit=crop&q=60',
    description: 'Kemeja flanel berkualitas tinggi, nyaman dipakai untuk berbagai aktivitas sehari-hari.',
    category: 'Fashion',
  },
  {
    _id: 'fb-2',
    name: 'Celana Jeans Slim Fit',
    price: 250000,
    image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500&auto=format&fit=crop&q=60',
    description: 'Celana jeans slim fit warna navy dengan bahan stretch berkualitas premium.',
    category: 'Fashion',
  },
  {
    _id: 'fb-3',
    name: 'Sepatu Sneakers Putih',
    price: 300000,
    image: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=500&auto=format&fit=crop&q=60',
    description: 'Sneakers putih klasik, sol empuk, ringan dan sangat nyaman dipakai beraktivitas.',
    category: 'Fashion',
  },
  {
    _id: 'fb-4',
    name: 'Kaos Polos Katun Bambu',
    price: 75000,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&auto=format&fit=crop&q=60',
    description: 'Kaos polos adem dibuat dari 100% serat katun bambu asli ramah lingkungan.',
    category: 'Fashion',
  },
];

export default function App() {
  // Navigation State: 'products' | 'detail' | 'cart' | 'auth' | 'checkout-success'
  const [currentScreen, setCurrentScreen] = useState('products');
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Authentication State
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'
  const [authName, setAuthName] = useState('');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  // Products State
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');

  // Cart State
  const [cart, setCart] = useState([]);
  const [bannerMessage, setBannerMessage] = useState('');

  // Check stored JWT token on launch
  useEffect(() => {
    const bootstrapAuth = async () => {
      try {
        const savedToken = await storage.getItem('token');
        const savedUser = await storage.getItem('user');
        if (savedToken) {
          setToken(savedToken);
          if (savedUser) {
            setUser(JSON.parse(savedUser));
          }
          // Optionally verify with /auth/me
          try {
            const profile = await getProfileApi();
            if (profile) {
              setUser(profile);
              await storage.setItem('user', JSON.stringify(profile));
            }
          } catch {
            // Keep cached user if offline
          }
        }
      } catch (err) {
        console.log('Error bootstrapping auth:', err);
      }
    };

    bootstrapAuth();
    loadProducts();
  }, []);

  // Fetch products from backend
  const loadProducts = async () => {
    setLoadingProducts(true);
    try {
      const data = await getProductsApi();
      if (Array.isArray(data) && data.length > 0) {
        setProducts(data);
      } else {
        setProducts(FALLBACK_PRODUCTS);
      }
    } catch {
      // Fallback if backend is cold
      setProducts(FALLBACK_PRODUCTS);
    } finally {
      setLoadingProducts(false);
      setRefreshing(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadProducts();
  }, []);

  // Show temporary banner
  const showBanner = (text) => {
    setBannerMessage(text);
    setTimeout(() => {
      setBannerMessage('');
    }, 2800);
  };

  // Auth Handlers
  const handleLogin = async () => {
    if (!authEmail.trim() || !authPassword.trim()) {
      setAuthError('Email dan password harus diisi.');
      return;
    }
    setAuthLoading(true);
    setAuthError('');
    try {
      const res = await loginApi(authEmail.trim(), authPassword.trim());
      setToken(res.token);
      setUser(res.user);
      await storage.setItem('token', res.token);
      await storage.setItem('user', JSON.stringify(res.user));
      setAuthPassword('');
      showBanner(`Selamat datang kembali, ${res.user.name}!`);
      setCurrentScreen('products');
    } catch (err) {
      setAuthError(err.message || 'Login gagal. Periksa email dan password.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!authName.trim() || !authEmail.trim() || !authPassword.trim()) {
      setAuthError('Semua field harus diisi.');
      return;
    }
    if (authPassword.length < 6) {
      setAuthError('Password minimal 6 karakter.');
      return;
    }
    setAuthLoading(true);
    setAuthError('');
    try {
      const res = await registerApi(authName.trim(), authEmail.trim(), authPassword.trim());
      setToken(res.token);
      setUser(res.user);
      await storage.setItem('token', res.token);
      await storage.setItem('user', JSON.stringify(res.user));
      setAuthName('');
      setAuthPassword('');
      showBanner(`Pendaftaran berhasil! Halo, ${res.user.name}.`);
      setCurrentScreen('products');
    } catch (err) {
      setAuthError(err.message || 'Pendaftaran gagal. Coba lagi.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert('Konfirmasi Keluar', 'Apakah Anda yakin ingin keluar dari akun?', [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Keluar',
        style: 'destructive',
        onPress: async () => {
          await storage.removeItem('token');
          await storage.removeItem('user');
          setToken(null);
          setUser(null);
          showBanner('Anda telah berhasil keluar.');
        },
      },
    ]);
  };

  // Cart Handlers
  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item._id === product._id);
      if (existing) {
        return prev.map((item) =>
          item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    showBanner(`"${product.name}" ditambahkan ke keranjang.`);
  };

  const updateCartQuantity = (id, delta) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item._id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item._id !== id));
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Protected checkout handler
  const handleProceedCheckout = () => {
    if (cart.length === 0) {
      Alert.alert('Keranjang Kosong', 'Pilih produk terlebih dahulu sebelum checkout.');
      return;
    }
    // Route Protection: user must be logged in
    if (!user || !token) {
      Alert.alert(
        'Login Diperlukan',
        'Anda harus login terlebih dahulu untuk melanjutkan ke proses checkout.',
        [
          { text: 'Batal', style: 'cancel' },
          { text: 'Masuk Sekarang', onPress: () => setCurrentScreen('auth') },
        ]
      );
      return;
    }

    // Process checkout
    Alert.alert(
      'Konfirmasi Pesanan',
      `Lanjutkan pembelian senilai ${formatRupiah(cartTotal)}?`,
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Bayar Sekarang',
          onPress: () => {
            setCart([]);
            setCurrentScreen('checkout-success');
          },
        },
      ]
    );
  };

  // Filtered products list
  const filteredProducts = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCategory =
      selectedCategory === 'Semua' || (p.category && p.category === selectedCategory);
    return matchSearch && matchCategory;
  });

  const categories = ['Semua', 'Fashion', 'Elektronik', 'Kesehatan', 'Rumah Tangga'];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* TOP HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            setSelectedProduct(null);
            setCurrentScreen('products');
          }}
          style={styles.logoRow}
        >
          <View style={styles.logoBox}>
            <Text style={styles.logoBoxText}>S</Text>
          </View>
          <Text style={styles.logoTitle}>ShopNow</Text>
        </TouchableOpacity>

        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.cartHeaderButton}
            onPress={() => setCurrentScreen('cart')}
          >
            <Text style={styles.cartHeaderIcon}>Keranjang</Text>
            {cartItemCount > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{cartItemCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* NOTIFICATION BANNER */}
      {bannerMessage !== '' && (
        <View style={styles.banner}>
          <Text style={styles.bannerText}>{bannerMessage}</Text>
        </View>
      )}

      {/* SCREEN ROUTING */}
      <View style={styles.contentContainer}>
        {/* SCREEN 1: PRODUCTS LIST */}
        {currentScreen === 'products' && (
          <View style={styles.screenWrapper}>
            {/* Search Bar */}
            <View style={styles.searchContainer}>
              <TextInput
                style={styles.searchInput}
                placeholder="Cari produk impian..."
                placeholderTextColor="#94a3b8"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearSearchBtn}>
                  <Text style={styles.clearSearchText}>Reset</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Category Pills */}
            <View style={styles.categoryContainer}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {categories.map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    style={[
                      styles.categoryPill,
                      selectedCategory === cat && styles.categoryPillActive,
                    ]}
                    onPress={() => setSelectedCategory(cat)}
                  >
                    <Text
                      style={[
                        styles.categoryPillText,
                        selectedCategory === cat && styles.categoryPillTextActive,
                      ]}
                    >
                      {cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Product Grid / List */}
            {loadingProducts ? (
              <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#2563eb" />
                <Text style={styles.loadingText}>Memuat produk...</Text>
              </View>
            ) : filteredProducts.length === 0 ? (
              <View style={styles.centerContainer}>
                <Text style={styles.emptyTitle}>Produk Tidak Ditemukan</Text>
                <Text style={styles.emptySubtitle}>
                  Coba kata kunci lain atau pilih kategori yang berbeda.
                </Text>
              </View>
            ) : (
              <FlatList
                data={filteredProducts}
                keyExtractor={(item) => item._id || item.id || item.name}
                refreshControl={
                  <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#2563eb']} />
                }
                contentContainerStyle={styles.productList}
                renderItem={({ item }) => (
                  <View style={styles.productCard}>
                    <TouchableOpacity
                      onPress={() => {
                        setSelectedProduct(item);
                        setCurrentScreen('detail');
                      }}
                    >
                      <Image
                        source={{ uri: item.image }}
                        style={styles.productImage}
                        resizeMode="cover"
                      />
                    </TouchableOpacity>

                    <View style={styles.productInfo}>
                      <Text style={styles.productName} numberOfLines={2}>
                        {item.name}
                      </Text>
                      <Text style={styles.productPrice}>{formatRupiah(item.price)}</Text>

                      <View style={styles.productCardButtons}>
                        <TouchableOpacity
                          style={styles.detailBtn}
                          onPress={() => {
                            setSelectedProduct(item);
                            setCurrentScreen('detail');
                          }}
                        >
                          <Text style={styles.detailBtnText}>Detail</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={styles.buyBtn}
                          onPress={() => addToCart(item)}
                        >
                          <Text style={styles.buyBtnText}>+ Beli</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                )}
              />
            )}
          </View>
        )}

        {/* SCREEN 2: PRODUCT DETAIL */}
        {currentScreen === 'detail' && selectedProduct && (
          <ScrollView style={styles.screenWrapper} contentContainerStyle={styles.detailContainer}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => setCurrentScreen('products')}
            >
              <Text style={styles.backButtonText}>[ Kembali ke Daftar Produk ]</Text>
            </TouchableOpacity>

            <Image
              source={{ uri: selectedProduct.image }}
              style={styles.detailImage}
              resizeMode="cover"
            />

            <View style={styles.detailContent}>
              <View style={styles.detailBadge}>
                <Text style={styles.detailBadgeText}>{selectedProduct.category || 'Produk Unggulan'}</Text>
              </View>

              <Text style={styles.detailTitle}>{selectedProduct.name}</Text>
              <Text style={styles.detailPrice}>{formatRupiah(selectedProduct.price)}</Text>

              <View style={styles.divider} />

              <Text style={styles.sectionHeading}>Deskripsi Produk</Text>
              <Text style={styles.detailDescription}>{selectedProduct.description}</Text>

              <View style={styles.divider} />

              <TouchableOpacity
                style={styles.addToCartLargeBtn}
                onPress={() => addToCart(selectedProduct)}
              >
                <Text style={styles.addToCartLargeBtnText}>Tambahkan ke Keranjang</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        )}

        {/* SCREEN 3: CART */}
        {currentScreen === 'cart' && (
          <View style={styles.screenWrapper}>
            <Text style={styles.pageHeading}>Keranjang Belanja</Text>

            {cart.length === 0 ? (
              <View style={styles.centerContainer}>
                <Text style={styles.emptyTitle}>Keranjang Masih Kosong</Text>
                <Text style={styles.emptySubtitle}>
                  Jelajahi produk berkualitas kami dan tambahkan ke keranjang belanja Anda.
                </Text>
                <TouchableOpacity
                  style={styles.primaryActionButton}
                  onPress={() => setCurrentScreen('products')}
                >
                  <Text style={styles.primaryActionButtonText}>Mulai Belanja</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={{ flex: 1 }}>
                <FlatList
                  data={cart}
                  keyExtractor={(item) => item._id}
                  contentContainerStyle={styles.cartList}
                  renderItem={({ item }) => (
                    <View style={styles.cartItemCard}>
                      <Image source={{ uri: item.image }} style={styles.cartItemImage} />
                      <View style={styles.cartItemDetails}>
                        <Text style={styles.cartItemName} numberOfLines={1}>
                          {item.name}
                        </Text>
                        <Text style={styles.cartItemPrice}>{formatRupiah(item.price)}</Text>

                        <View style={styles.cartItemQuantityRow}>
                          <TouchableOpacity
                            style={styles.qtyBtn}
                            onPress={() => updateCartQuantity(item._id, -1)}
                          >
                            <Text style={styles.qtyBtnText}>-</Text>
                          </TouchableOpacity>
                          <Text style={styles.qtyText}>{item.quantity}</Text>
                          <TouchableOpacity
                            style={styles.qtyBtn}
                            onPress={() => updateCartQuantity(item._id, 1)}
                          >
                            <Text style={styles.qtyBtnText}>+</Text>
                          </TouchableOpacity>

                          <TouchableOpacity
                            style={styles.removeBtn}
                            onPress={() => removeFromCart(item._id)}
                          >
                            <Text style={styles.removeBtnText}>Hapus</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  )}
                />

                {/* Summary Box */}
                <View style={styles.cartSummaryBox}>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Total Pembayaran</Text>
                    <Text style={styles.summaryValue}>{formatRupiah(cartTotal)}</Text>
                  </View>

                  {!user && (
                    <Text style={styles.loginPromptHint}>
                      * Anda harus login terlebih dahulu sebelum checkout.
                    </Text>
                  )}

                  <TouchableOpacity
                    style={styles.checkoutBtn}
                    onPress={handleProceedCheckout}
                  >
                    <Text style={styles.checkoutBtnText}>
                      {user ? 'Lanjutkan ke Checkout' : 'Login untuk Checkout'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        )}

        {/* SCREEN 4: AUTHENTICATION / PROFILE (Protected / Login / Register) */}
        {currentScreen === 'auth' && (
          <ScrollView style={styles.screenWrapper} contentContainerStyle={styles.authContainer}>
            {user ? (
              // Logged in Profile View
              <View style={styles.profileCard}>
                <View style={styles.profileAvatarBox}>
                  <Text style={styles.profileAvatarText}>
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </Text>
                </View>

                <Text style={styles.profileName}>{user.name}</Text>
                <Text style={styles.profileEmail}>{user.email}</Text>

                <View style={styles.profileBadge}>
                  <Text style={styles.profileBadgeText}>Role: {user.role || 'Member'}</Text>
                </View>

                <View style={styles.divider} />

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Status Akun</Text>
                  <Text style={styles.infoValueActive}>Terverifikasi (JWT Aktif)</Text>
                </View>

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Token Tersimpan</Text>
                  <Text style={styles.infoValue}>Ya (Secure Storage)</Text>
                </View>

                <TouchableOpacity
                  style={styles.logoutButton}
                  onPress={handleLogout}
                >
                  <Text style={styles.logoutButtonText}>Keluar dari Akun</Text>
                </TouchableOpacity>
              </View>
            ) : (
              // Login & Register Form
              <View style={styles.authCard}>
                <View style={styles.authTabs}>
                  <TouchableOpacity
                    style={[styles.authTab, authMode === 'login' && styles.authTabActive]}
                    onPress={() => {
                      setAuthMode('login');
                      setAuthError('');
                    }}
                  >
                    <Text
                      style={[
                        styles.authTabText,
                        authMode === 'login' && styles.authTabTextActive,
                      ]}
                    >
                      Masuk
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.authTab, authMode === 'register' && styles.authTabActive]}
                    onPress={() => {
                      setAuthMode('register');
                      setAuthError('');
                    }}
                  >
                    <Text
                      style={[
                        styles.authTabText,
                        authMode === 'register' && styles.authTabTextActive,
                      ]}
                    >
                      Daftar
                    </Text>
                  </TouchableOpacity>
                </View>

                <Text style={styles.authHeaderTitle}>
                  {authMode === 'login' ? 'Masuk ke Akun Anda' : 'Buat Akun Baru'}
                </Text>
                <Text style={styles.authHeaderSubtitle}>
                  {authMode === 'login'
                    ? 'Gunakan email dan password terdaftar Anda.'
                    : 'Lengkapi formulir pendaftaran untuk mulai berbelanja.'}
                </Text>

                {authError !== '' && (
                  <View style={styles.errorBox}>
                    <Text style={styles.errorText}>{authError}</Text>
                  </View>
                )}

                {authMode === 'register' && (
                  <View style={styles.formGroup}>
                    <Text style={styles.formLabel}>Nama Lengkap</Text>
                    <TextInput
                      style={styles.formInput}
                      placeholder="Masukkan nama lengkap"
                      placeholderTextColor="#94a3b8"
                      value={authName}
                      onChangeText={setAuthName}
                    />
                  </View>
                )}

                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>Alamat Email</Text>
                  <TextInput
                    style={styles.formInput}
                    placeholder="nama@email.com"
                    placeholderTextColor="#94a3b8"
                    autoCapitalize="none"
                    keyboardType="email-address"
                    value={authEmail}
                    onChangeText={setAuthEmail}
                  />
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>Kata Sandi</Text>
                  <TextInput
                    style={styles.formInput}
                    placeholder="Minimal 6 karakter"
                    placeholderTextColor="#94a3b8"
                    secureTextEntry
                    value={authPassword}
                    onChangeText={setAuthPassword}
                  />
                </View>

                <TouchableOpacity
                  style={styles.authSubmitBtn}
                  onPress={authMode === 'login' ? handleLogin : handleRegister}
                  disabled={authLoading}
                >
                  {authLoading ? (
                    <ActivityIndicator color="#ffffff" />
                  ) : (
                    <Text style={styles.authSubmitBtnText}>
                      {authMode === 'login' ? 'Masuk Sekarang' : 'Daftar Akun'}
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        )}

        {/* SCREEN 5: CHECKOUT SUCCESS */}
        {currentScreen === 'checkout-success' && (
          <View style={[styles.screenWrapper, styles.centerContainer]}>
            <View style={styles.successIconBox}>
              <Text style={styles.successIconText}>OK</Text>
            </View>
            <Text style={styles.successTitle}>Pesanan Berhasil Dibuat!</Text>
            <Text style={styles.successSubtitle}>
              Terima kasih telah berbelanja di ShopNow. Pesanan Anda sedang diproses oleh penjual.
            </Text>
            <TouchableOpacity
              style={styles.primaryActionButton}
              onPress={() => setCurrentScreen('products')}
            >
              <Text style={styles.primaryActionButtonText}>Kembali ke Belanja</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* BOTTOM TAB NAVIGATION */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.tabButton}
          onPress={() => {
            setSelectedProduct(null);
            setCurrentScreen('products');
          }}
        >
          <Text
            style={[
              styles.tabButtonText,
              currentScreen === 'products' && styles.tabButtonTextActive,
            ]}
          >
            Produk
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabButton}
          onPress={() => setCurrentScreen('cart')}
        >
          <Text
            style={[
              styles.tabButtonText,
              currentScreen === 'cart' && styles.tabButtonTextActive,
            ]}
          >
            Keranjang ({cartItemCount})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabButton}
          onPress={() => setCurrentScreen('auth')}
        >
          <Text
            style={[
              styles.tabButtonText,
              currentScreen === 'auth' && styles.tabButtonTextActive,
            ]}
          >
            {user ? 'Profil' : 'Masuk'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoBox: {
    width: 30,
    height: 30,
    backgroundColor: '#2563eb',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  logoBoxText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  logoTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    letterSpacing: 0.2,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cartHeaderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    backgroundColor: '#f1f5f9',
  },
  cartHeaderIcon: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2563eb',
  },
  cartBadge: {
    marginLeft: 6,
    backgroundColor: '#2563eb',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  cartBadgeText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: 'bold',
  },
  banner: {
    backgroundColor: '#2563eb',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  bannerText: {
    color: '#ffffff',
    fontSize: 13,
    textAlign: 'center',
    fontWeight: '500',
  },
  contentContainer: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  screenWrapper: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#64748b',
  },
  searchContainer: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  searchInput: {
    flex: 1,
    height: 42,
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    paddingHorizontal: 14,
    fontSize: 14,
    color: '#1e293b',
  },
  clearSearchBtn: {
    marginLeft: 8,
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  clearSearchText: {
    color: '#2563eb',
    fontSize: 13,
    fontWeight: '600',
  },
  categoryContainer: {
    backgroundColor: '#ffffff',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  categoryPill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
    marginRight: 8,
  },
  categoryPillActive: {
    backgroundColor: '#2563eb',
  },
  categoryPillText: {
    fontSize: 13,
    color: '#475569',
    fontWeight: '500',
  },
  categoryPillTextActive: {
    color: '#ffffff',
    fontWeight: '600',
  },
  productList: {
    padding: 12,
  },
  productCard: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: 180,
    backgroundColor: '#f1f5f9',
  },
  productInfo: {
    padding: 14,
  },
  productName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2563eb',
    marginBottom: 12,
  },
  productCardButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  detailBtn: {
    flex: 1,
    paddingVertical: 8,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 6,
    alignItems: 'center',
  },
  detailBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
  },
  buyBtn: {
    flex: 1,
    paddingVertical: 8,
    backgroundColor: '#2563eb',
    borderRadius: 6,
    alignItems: 'center',
  },
  buyBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#ffffff',
  },
  detailContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  backButton: {
    marginBottom: 12,
  },
  backButtonText: {
    color: '#2563eb',
    fontSize: 14,
    fontWeight: '600',
  },
  detailImage: {
    width: '100%',
    height: 260,
    borderRadius: 10,
    backgroundColor: '#f1f5f9',
    marginBottom: 16,
  },
  detailContent: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 18,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  detailBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#eff6ff',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 8,
  },
  detailBadgeText: {
    color: '#2563eb',
    fontSize: 12,
    fontWeight: '600',
  },
  detailTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 8,
  },
  detailPrice: {
    fontSize: 22,
    fontWeight: '800',
    color: '#2563eb',
    marginBottom: 16,
  },
  divider: {
    height: 1,
    backgroundColor: '#e2e8f0',
    marginVertical: 14,
  },
  sectionHeading: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 6,
  },
  detailDescription: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 22,
  },
  addToCartLargeBtn: {
    backgroundColor: '#2563eb',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  addToCartLargeBtnText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
  pageHeading: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
    padding: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  cartList: {
    padding: 12,
  },
  cartItemCard: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  cartItemImage: {
    width: 70,
    height: 70,
    borderRadius: 6,
    backgroundColor: '#f1f5f9',
  },
  cartItemDetails: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
  },
  cartItemName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
  },
  cartItemPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2563eb',
  },
  cartItemQuantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  qtyBtn: {
    width: 28,
    height: 28,
    backgroundColor: '#f1f5f9',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyBtnText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#334155',
  },
  qtyText: {
    fontSize: 14,
    fontWeight: '600',
    minWidth: 20,
    textAlign: 'center',
  },
  removeBtn: {
    marginLeft: 'auto',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  removeBtnText: {
    color: '#ef4444',
    fontSize: 12,
    fontWeight: '600',
  },
  cartSummaryBox: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#475569',
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#2563eb',
  },
  loginPromptHint: {
    fontSize: 12,
    color: '#ef4444',
    marginBottom: 8,
  },
  checkoutBtn: {
    backgroundColor: '#2563eb',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  checkoutBtnText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 16,
  },
  primaryActionButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  primaryActionButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14,
  },
  authContainer: {
    padding: 16,
  },
  authCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  authTabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    marginBottom: 16,
  },
  authTab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
  },
  authTabActive: {
    borderBottomWidth: 2,
    borderBottomColor: '#2563eb',
  },
  authTabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
  },
  authTabTextActive: {
    color: '#2563eb',
  },
  authHeaderTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 4,
  },
  authHeaderSubtitle: {
    fontSize: 13,
    color: '#64748b',
    marginBottom: 16,
  },
  errorBox: {
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fca5a5',
    borderRadius: 6,
    padding: 10,
    marginBottom: 14,
  },
  errorText: {
    color: '#b91c1c',
    fontSize: 13,
  },
  formGroup: {
    marginBottom: 14,
  },
  formLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 6,
  },
  formInput: {
    height: 44,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 14,
    color: '#1e293b',
    backgroundColor: '#ffffff',
  },
  authSubmitBtn: {
    backgroundColor: '#2563eb',
    paddingVertical: 13,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  authSubmitBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  profileCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 24,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    alignItems: 'center',
  },
  profileAvatarBox: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#eff6ff',
    borderWidth: 2,
    borderColor: '#2563eb',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  profileAvatarText: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#2563eb',
  },
  profileName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 2,
  },
  profileEmail: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 8,
  },
  profileBadge: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 16,
  },
  profileBadgeText: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '600',
  },
  infoRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  infoLabel: {
    fontSize: 13,
    color: '#64748b',
  },
  infoValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
  },
  infoValueActive: {
    fontSize: 13,
    fontWeight: '600',
    color: '#16a34a',
  },
  logoutButton: {
    width: '100%',
    marginTop: 20,
    backgroundColor: '#fee2e2',
    borderWidth: 1,
    borderColor: '#fca5a5',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#dc2626',
    fontWeight: '700',
    fontSize: 14,
  },
  successIconBox: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#2563eb',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  successIconText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 20,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 8,
    textAlign: 'center',
  },
  successSubtitle: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  bottomNav: {
    flexDirection: 'row',
    height: 56,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabButtonText: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '600',
  },
  tabButtonTextActive: {
    color: '#2563eb',
    fontWeight: '700',
  },
});
