# DOKUMENTASI LAPORAN PROYEK: ONLINE MARKETPLACE (WEB & MOBILE)
**Integrasi Keterampilan Lab Modul 1 – 5**

---

## BAB I. RINGKASAN PROYEK & TAUTAN DEPLOYMENT

Proyek ini mengimplementasikan sistem Online Marketplace terpadu yang dapat diakses secara publik melalui platform web dan mobile. Sistem ini didukung oleh backend API mandiri berbasis cloud serta basis data MongoDB Atlas yang mengelola data produk dan pengguna secara aman.

1. **Tautan Frontend Web (Production):** [https://tp-2-online-shop-xnck.vercel.app](https://tp-2-online-shop-xnck.vercel.app)
2. **Tautan Backend API Publik:** [https://tp-2-online-shop.vercel.app/api](https://tp-2-online-shop.vercel.app/api)
3. **Tautan Pemeriksaan Kesehatan API:** [https://tp-2-online-shop.vercel.app/api/health](https://tp-2-online-shop.vercel.app/api/health)
4. **Aplikasi Mobile (Expo Go):** Project Slug "tp1-online-shop-mobile" yang dapat langsung diakses melalui aplikasi Expo Go di smartphone dengan memindai QR Code interaktif yang dihasilkan oleh Expo CLI.
5. **Integrasi Monitoring:** Menggunakan Google Analytics 4 (GA4) dengan Measurement ID `G-72QV55DWHW` untuk memantau lalu lintas pengunjung dan interaksi halaman web secara real-time.

---

## BAB II. DESKRIPSI FITUR SISTEM

### A. Fitur Aplikasi Web (Soal 1 & Soal 4)
- **Halaman Beranda (Home):** Menyajikan pengenalan platform belanja online, informasi statistik kepercayaan konsumen, dan navigasi langsung ke halaman katalog produk.
- **Halaman Daftar Produk:** Menampilkan katalog produk dalam format tata letak kotak responsif (CSS Grid dan Flexbox). Dilengkapi dengan kotak pencarian instan dan penyaring (filter) kategori produk seperti Fashion, Elektronik, Makanan, Kesehatan, dan Rumah Tangga.
- **Halaman Detail Produk:** Memuat foto produk beresolusi tinggi, nama barang, harga resmi dalam format mata uang Rupiah, deskripsi spesifikasi produk, label jaminan keaslian barang dan gratis ongkos kirim, serta tombol untuk menambah kuantitas pesanan.
- **Halaman Keranjang Belanja (Cart):** Mengelola daftar barang yang telah dipilih pembeli, tombol penyesuaian kuantitas (menambah atau mengurangi jumlah barang), opsi penghapusan item dari keranjang, dan kalkulasi subtotal harga pesanan secara otomatis.
- **Halaman Checkout & Pembayaran:** Formulir pengisian data pengiriman lengkap meliputi nama penerima, alamat surat elektronik, nomor kontak, alamat domisili, kode pos, dan pilihan metode pembayaran, diikuti simulasi konfirmasi pesanan berhasil.
- **Autentikasi & Proteksi Rute:** Fasilitas pendaftaran pengguna baru (Registrasi) dan login akun menggunakan token keamanan JWT. Halaman katalog produk, keranjang belanja, dan proses checkout diproteksi sehingga pengguna yang belum login akan otomatis diarahkan ke formulir masuk terlebih dahulu.
- **Standar Tampilan Antarmuka:** Desain antarmuka dirancang bersih dengan skema warna utama putih dan biru, tanpa gradasi warna yang mencolok, dan seluruh ikon menggunakan bentuk geometris SVG modern tanpa memanfaatkan simbol emoticon.

### B. Fitur Backend RESTful API (Soal 2)
- **Manajemen Produk (Operasi CRUD):** Menyediakan layanan membaca seluruh produk, mengambil detail satu produk berdasarkan identitas unik (ID), menambah produk baru, mengubah data produk, dan menghapus produk dengan validasi ketat.
- **Autentikasi Pengguna & Enkripsi Kata Sandi:** Layanan pendaftaran akun dengan enkripsi kata sandi satu arah melalui algoritma Bcrypt, pengecekan duplikasi alamat email, verifikasi kredensial saat login, dan penerbitan token sesi JSON Web Token (JWT).
- **Basis Data Cloud MongoDB Atlas:** Seluruh data entitas pengguna dan produk tersimpan secara persisten pada klaster cloud MongoDB Atlas dengan skema data terstruktur.
- **Pengaturan Akses Lintas Domain (CORS):** Dikonfigurasi secara fleksibel agar dapat diakses tanpa hambatan oleh aplikasi web yang berjalan di hosting publik (Vercel) maupun aplikasi mobile Expo di smartphone.

### C. Fitur Aplikasi Mobile (Soal 3 & Soal 4)
- **Penjelajahan Katalog Mobile:** Mengambil data produk secara langsung dari backend cloud dengan fitur tarik-ke-bawah untuk memuat ulang data (Pull-to-Refresh), bilah pencarian produk cepat, dan pil penyaring kategori produk.
- **Informasi Detail Produk:** Menampilkan gambar produk proporsional, harga, label kategori, deskripsi lengkap, serta aksi langsung menambahkan produk ke keranjang belanja pengguna.
- **Penyimpanan Token JWT di Perangkat:** Mendukung login dan pendaftaran pengguna baru di mana token sesi JWT disimpan secara persisten di media penyimpanan perangkat seluler. Menyediakan tab profil anggota dan opsi keluar akun (Logout).
- **Proteksi Transaksi:** Menjaga keamanan pesanan dengan membatasi proses checkout hanya untuk pengguna yang telah terautentikasi dan login di aplikasi.

---

## BAB III. ARSITEKTUR SISTEM

Sistem Online Marketplace ini dibangun menggunakan pendekatan Arsitektur Tiga Tingkat (Three-Tier Architecture) yang terdistribusi dan mandiri:

1. **Tingkat Presentasi (Presentation Tier / Frontend):** Terdiri dari aplikasi web berbasis React dan aplikasi mobile berbasis React Native (Expo). Lapisan ini bertugas menyajikan antarmuka visual yang intuitif, menangani interaksi pengguna, mengelola status lokal keranjang belanja, serta berkomunikasi dengan backend melalui permintaan HTTP.
2. **Tingkat Aplikasi (Application Tier / Backend API):** Dibangun dengan Node.js dan kerangka Express yang berperan sebagai pusat pengendali logika bisnis. Lapisan ini memvalidasi data masukan dari klien, memverifikasi tanda tangan digital token JWT pengguna, mengenkripsi kata sandi, dan menghubungkan komunikasi ke basis data.
3. **Tingkat Data (Data Tier / Database):** Menggunakan MongoDB Atlas yang ditempatkan pada infrastruktur cloud. Menyimpan koleksi data produk (nama, deskripsi, gambar, kategori, harga) dan data akun pengguna secara terstruktur dan aman.
4. **Tingkat Pemantauan (Observability Tier):** Layanan Google Analytics 4 (GA4) terpasang pada aplikasi web untuk mencatat kunjungan halaman (pageviews), durasi sesi pengguna, dan pola penjelajahan halaman katalog.

---

## BAB IV. PANDUAN INSTALASI & PENGOPERASIAN LOKAL

Untuk menguji dan menjalankan aplikasi di lingkungan komputer lokal penguji, ikuti urutan langkah naratif berikut:

- **Prasyarat Sistem Komputer:** Pastikan komputer telah terpasang aplikasi Node.js (versi 18 atau yang lebih baru) dan pengelola paket npm. Untuk pengujian mobile, persiapkan smartphone dengan aplikasi Expo Go yang terpasang dari Google Play Store atau Apple App Store.
- **Langkah Pengoperasian Server Backend:** Buka jendela terminal dan arahkan ke direktori server proyek. Pasang dependensi yang dibutuhkan dengan perintah instalasi paket npm. Lakukan proses pemuatan data awal (seeding) untuk memasukkan contoh katalog produk ke basis data. Jalankan server backend dalam mode pengembang sehingga server lokal aktif melayani permintaan pada port 5000.
- **Langkah Pengoperasian Frontend Web:** Buka jendela terminal baru dan arahkan ke direktori client proyek. Pasang pustaka dependensi web melalui perintah instalasi paket. Jalankan server pengembang web Vite sehingga aplikasi marketplace web dapat langsung dibuka di peramban pada port 5173.
- **Langkah Pengoperasian Aplikasi Mobile:** Buka terminal baru dan arahkan ke direktori mobile proyek. Pasang paket modul yang diperlukan menggunakan perintah instalasi npm. Mulai server Expo, kemudian buka aplikasi Expo Go pada smartphone Anda, pilih menu pindai kode QR (Scan QR Code), lalu arahkan kamera ke kode QR di layar terminal untuk menjalankan aplikasi secara langsung di ponsel.

---

## BAB V. PANDUAN PENGARSIPAN & PENYERAHAN TUGAS

Sesuai petunjuk penugasan, jika dibutuhkan pengumpulan berkas fisik proyek dalam bentuk arsip terkompresi:

1. Pastikan seluruh folder proyek (folder client, folder server, dan folder mobile) berada dalam kondisi lengkap dan rapi.
2. Sertakan berkas laporan dokumentasi Word ini di dalam direktori utama proyek.
3. Kompresi keseluruhan folder proyek ke dalam satu berkas berformat .rar atau .zip dengan nama arsip tugas yang telah ditentukan, lalu unggah ke portal tugas akademik yang disediakan.
