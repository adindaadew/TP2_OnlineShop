import zipfile
import os

def create_word_doc(filename="DOKUMENTASI_PROYEK.docx"):
    content_types = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
    <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
    <Default Extension="xml" ContentType="application/xml"/>
    <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
    <Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>
</Types>"""

    rels = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
    <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>"""

    doc_rels = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
    <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
</Relationships>"""

    styles = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
    <w:docDefaults>
        <w:rPrDefault>
            <w:rFonts w:ascii="Calibri" w:hAnsi="Calibri" w:cs="Calibri"/>
            <w:sz w:val="22"/>
            <w:color w:val="1E293B"/>
        </w:rPrDefault>
    </w:docDefaults>
</w:styles>"""

    doc_content = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
<w:body>

    <!-- JUDUL LAPORAN -->
    <w:p>
        <w:pPr>
            <w:jc w:val="center"/>
            <w:spacing w:before="360" w:after="120"/>
        </w:pPr>
        <w:r>
            <w:rPr>
                <w:b/>
                <w:color w:val="1D4ED8"/>
                <w:sz w:val="44"/>
            </w:rPr>
            <w:t>DOKUMENTASI LAPORAN PROYEK</w:t>
        </w:r>
    </w:p>

    <!-- SUBJUDUL -->
    <w:p>
        <w:pPr>
            <w:jc w:val="center"/>
            <w:spacing w:after="240"/>
        </w:pPr>
        <w:r>
            <w:rPr>
                <w:b/>
                <w:color w:val="0F172A"/>
                <w:sz w:val="30"/>
            </w:rPr>
            <w:t>APLIKASI ONLINE MARKETPLACE (WEB &amp; MOBILE)</w:t>
        </w:r>
    </w:p>

    <w:p>
        <w:pPr>
            <w:jc w:val="center"/>
            <w:spacing w:after="480"/>
        </w:pPr>
        <w:r>
            <w:rPr>
                <w:color w:val="64748B"/>
                <w:sz w:val="22"/>
            </w:rPr>
            <w:t>Integrasi Keterampilan Lab Modul 1 – 5: Frontend Web, Mobile Expo, REST API, JWT Authentication, dan Cloud Deployment</w:t>
        </w:r>
    </w:p>

    <!-- ======================================================== -->
    <!-- BAB I: RINGKASAN PROYEK & TAUTAN DEPLOYMENT              -->
    <!-- ======================================================== -->
    <w:p>
        <w:pPr>
            <w:spacing w:before="240" w:after="180"/>
        </w:pPr>
        <w:r>
            <w:rPr><w:b/><w:sz w:val="26"/><w:color w:val="1D4ED8"/></w:rPr>
            <w:t>BAB I. RINGKASAN PROYEK &amp; TAUTAN DEPLOYMENT</w:t>
        </w:r>
    </w:p>

    <w:p>
        <w:pPr><w:spacing w:after="120"/></w:pPr>
        <w:r>
            <w:t>Proyek ini mengimplementasikan sistem Online Marketplace terpadu yang dapat diakses secara publik melalui platform web dan mobile. Sistem ini didukung oleh backend API mandiri berbasis cloud serta basis data MongoDB Atlas yang mengelola data produk dan pengguna secara aman.</w:t>
        </w:r>
    </w:p>

    <w:p>
        <w:pPr><w:spacing w:after="60"/></w:pPr>
        <w:r><w:rPr><w:b/></w:rPr><w:t>1. Tautan Frontend Web (Production): </w:t></w:r>
        <w:r><w:rPr><w:color w:val="1D4ED8"/><w:u w:val="single"/></w:rPr><w:t>https://tp-2-online-shop-xnck.vercel.app</w:t></w:r>
    </w:p>

    <w:p>
        <w:pPr><w:spacing w:after="60"/></w:pPr>
        <w:r><w:rPr><w:b/></w:rPr><w:t>2. Tautan Backend API Publik: </w:t></w:r>
        <w:r><w:rPr><w:color w:val="1D4ED8"/><w:u w:val="single"/></w:rPr><w:t>https://tp-2-online-shop.vercel.app/api</w:t></w:r>
    </w:p>

    <w:p>
        <w:pPr><w:spacing w:after="60"/></w:pPr>
        <w:r><w:rPr><w:b/></w:rPr><w:t>3. Tautan Pemeriksaan Kesehatan API (Health Check): </w:t></w:r>
        <w:r><w:rPr><w:color w:val="1D4ED8"/><w:u w:val="single"/></w:rPr><w:t>https://tp-2-online-shop.vercel.app/api/health</w:t></w:r>
    </w:p>

    <w:p>
        <w:pPr><w:spacing w:after="60"/></w:pPr>
        <w:r><w:rPr><w:b/></w:rPr><w:t>4. Aplikasi Mobile (Expo Go): </w:t></w:r>
        <w:r><w:t>Project Slug "tp1-online-shop-mobile" yang dapat langsung diakses melalui aplikasi Expo Go di smartphone dengan memindai QR Code interaktif yang dihasilkan oleh Expo CLI.</w:t></w:r>
    </w:p>

    <w:p>
        <w:pPr><w:spacing w:after="240"/></w:pPr>
        <w:r><w:rPr><w:b/></w:rPr><w:t>5. Integrasi Monitoring: </w:t></w:r>
        <w:r><w:t>Menggunakan Google Analytics 4 (GA4) dengan Measurement ID G-72QV55DWHW untuk memantau lalu lintas pengunjung dan interaksi halaman web secara real-time.</w:t></w:r>
    </w:p>

    <!-- ======================================================== -->
    <!-- BAB II: DESKRIPSI FITUR SISTEM                           -->
    <!-- ======================================================== -->
    <w:p>
        <w:pPr>
            <w:spacing w:before="300" w:after="180"/>
        </w:pPr>
        <w:r>
            <w:rPr><w:b/><w:sz w:val="26"/><w:color w:val="1D4ED8"/></w:rPr>
            <w:t>BAB II. DESKRIPSI FITUR SISTEM</w:t>
        </w:r>
    </w:p>

    <!-- Bagian A: Fitur Web -->
    <w:p>
        <w:pPr><w:spacing w:before="120" w:after="60"/></w:pPr>
        <w:r><w:rPr><w:b/><w:sz w:val="24"/><w:color w:val="0F172A"/></w:rPr><w:t>A. Fitur Aplikasi Web (Soal 1 &amp; Soal 4)</w:t></w:r>
    </w:p>

    <w:p>
        <w:pPr><w:spacing w:after="60"/></w:pPr>
        <w:r><w:rPr><w:b/></w:rPr><w:t>• Halaman Beranda (Home): </w:t></w:r>
        <w:r><w:t>Menyajikan pengenalan platform belanja online, informasi statistik kepercayaan konsumen, dan navigasi langsung ke halaman katalog produk.</w:t></w:r>
    </w:p>

    <w:p>
        <w:pPr><w:spacing w:after="60"/></w:pPr>
        <w:r><w:rPr><w:b/></w:rPr><w:t>• Halaman Daftar Produk: </w:t></w:r>
        <w:r><w:t>Menampilkan katalog produk dalam format tata letak kotak responsif (CSS Grid dan Flexbox). Dilengkapi dengan kotak pencarian instan dan penyaring (filter) kategori produk seperti Fashion, Elektronik, Makanan, Kesehatan, dan Rumah Tangga.</w:t></w:r>
    </w:p>

    <w:p>
        <w:pPr><w:spacing w:after="60"/></w:pPr>
        <w:r><w:rPr><w:b/></w:rPr><w:t>• Halaman Detail Produk: </w:t></w:r>
        <w:r><w:t>Memuat foto produk beresolusi tinggi, nama barang, harga resmi dalam format mata uang Rupiah, deskripsi spesifikasi produk, label jaminan keaslian barang dan gratis ongkos kirim, serta tombol untuk menambah kuantitas pesanan.</w:t></w:r>
    </w:p>

    <w:p>
        <w:pPr><w:spacing w:after="60"/></w:pPr>
        <w:r><w:rPr><w:b/></w:rPr><w:t>• Halaman Keranjang Belanja (Cart): </w:t></w:r>
        <w:r><w:t>Mengelola daftar barang yang telah dipilih pembeli, tombol penyesuaian kuantitas (menambah atau mengurangi jumlah barang), opsi penghapusan item dari keranjang, dan kalkulasi subtotal harga pesanan secara otomatis.</w:t></w:r>
    </w:p>

    <w:p>
        <w:pPr><w:spacing w:after="60"/></w:pPr>
        <w:r><w:rPr><w:b/></w:rPr><w:t>• Halaman Checkout &amp; Pembayaran: </w:t></w:r>
        <w:r><w:t>Formulir pengisian data pengiriman lengkap meliputi nama penerima, alamat surat elektronik, nomor kontak, alamat domisili, kode pos, dan pilihan metode pembayaran, diikuti simulasi konfirmasi pesanan berhasil.</w:t></w:r>
    </w:p>

    <w:p>
        <w:pPr><w:spacing w:after="60"/></w:pPr>
        <w:r><w:rPr><w:b/></w:rPr><w:t>• Autentikasi &amp; Proteksi Rute: </w:t></w:r>
        <w:r><w:t>Fasilitas pendaftaran pengguna baru (Registrasi) dan login akun menggunakan token keamanan JWT. Halaman katalog produk, keranjang belanja, dan proses checkout diproteksi sehingga pengguna yang belum login akan otomatis diarahkan ke formulir masuk terlebih dahulu.</w:t></w:r>
    </w:p>

    <w:p>
        <w:pPr><w:spacing w:after="180"/></w:pPr>
        <w:r><w:rPr><w:b/></w:rPr><w:t>• Standar Tampilan Antarmuka: </w:t></w:r>
        <w:r><w:t>Desain antarmuka dirancang bersih dengan skema warna utama putih dan biru, tanpa gradasi warna yang mencolok, dan seluruh ikon menggunakan bentuk geometris SVG modern tanpa memanfaatkan simbol emoticon.</w:t></w:r>
    </w:p>

    <!-- Bagian B: Fitur Backend API -->
    <w:p>
        <w:pPr><w:spacing w:before="120" w:after="60"/></w:pPr>
        <w:r><w:rPr><w:b/><w:sz w:val="24"/><w:color w:val="0F172A"/></w:rPr><w:t>B. Fitur Backend RESTful API (Soal 2)</w:t></w:r>
    </w:p>

    <w:p>
        <w:pPr><w:spacing w:after="60"/></w:pPr>
        <w:r><w:rPr><w:b/></w:rPr><w:t>• Manajemen Produk (Operasi CRUD): </w:t></w:r>
        <w:r><w:t>Menyediakan layanan membaca seluruh produk, mengambil detail satu produk berdasarkan identitas unik (ID), menambah produk baru, mengubah data produk, dan menghapus produk dengan validasi ketat.</w:t></w:r>
    </w:p>

    <w:p>
        <w:pPr><w:spacing w:after="60"/></w:pPr>
        <w:r><w:rPr><w:b/></w:rPr><w:t>• Autentikasi Pengguna &amp; Enkripsi Kata Sandi: </w:t></w:r>
        <w:r><w:t>Layanan pendaftaran akun dengan enkripsi kata sandi satu arah melalui algoritma Bcrypt, pengecekan duplikasi alamat email, verifikasi kredensial saat login, dan penerbitan token sesi JSON Web Token (JWT).</w:t></w:r>
    </w:p>

    <w:p>
        <w:pPr><w:spacing w:after="60"/></w:pPr>
        <w:r><w:rPr><w:b/></w:rPr><w:t>• Basis Data Cloud MongoDB Atlas: </w:t></w:r>
        <w:r><w:t>Seluruh data entitas pengguna dan produk tersimpan secara persisten pada klaster cloud MongoDB Atlas dengan skema data terstruktur.</w:t></w:r>
    </w:p>

    <w:p>
        <w:pPr><w:spacing w:after="180"/></w:pPr>
        <w:r><w:rPr><w:b/></w:rPr><w:t>• Pengaturan Akses Lintas Domain (CORS): </w:t></w:r>
        <w:r><w:t>Dikonfigurasi secara fleksibel agar dapat diakses tanpa hambatan oleh aplikasi web yang berjalan di hosting publik (Vercel) maupun aplikasi mobile Expo di smartphone.</w:t></w:r>
    </w:p>

    <!-- Bagian C: Fitur Mobile -->
    <w:p>
        <w:pPr><w:spacing w:before="120" w:after="60"/></w:pPr>
        <w:r><w:rPr><w:b/><w:sz w:val="24"/><w:color w:val="0F172A"/></w:rPr><w:t>C. Fitur Aplikasi Mobile (Soal 3 &amp; Soal 4)</w:t></w:r>
    </w:p>

    <w:p>
        <w:pPr><w:spacing w:after="60"/></w:pPr>
        <w:r><w:rPr><w:b/></w:rPr><w:t>• Penjelajahan Katalog Mobile: </w:t></w:r>
        <w:r><w:t>Mengambil data produk secara langsung dari backend cloud dengan fitur tarik-ke-bawah untuk memuat ulang data (Pull-to-Refresh), bilah pencarian produk cepat, dan pil penyaring kategori produk.</w:t></w:r>
    </w:p>

    <w:p>
        <w:pPr><w:spacing w:after="60"/></w:pPr>
        <w:r><w:rPr><w:b/></w:rPr><w:t>• Informasi Detail Produk: </w:t></w:r>
        <w:r><w:t>Menampilkan gambar produk proporsional, harga, label kategori, deskripsi lengkap, serta aksi langsung menambahkan produk ke keranjang belanja pengguna.</w:t></w:r>
    </w:p>

    <w:p>
        <w:pPr><w:spacing w:after="60"/></w:pPr>
        <w:r><w:rPr><w:b/></w:rPr><w:t>• Penyimpanan Token JWT di Perangkat: </w:t></w:r>
        <w:r><w:t>Mendukung login dan pendaftaran pengguna baru di mana token sesi JWT disimpan secara persisten di media penyimpanan perangkat seluler. Menyediakan tab profil anggota dan opsi keluar akun (Logout).</w:t></w:r>
    </w:p>

    <w:p>
        <w:pPr><w:spacing w:after="240"/></w:pPr>
        <w:r><w:rPr><w:b/></w:rPr><w:t>• Proteksi Transaksi: </w:t></w:r>
        <w:r><w:t>Menjaga keamanan pesanan dengan membatasi proses checkout hanya untuk pengguna yang telah terautentikasi dan login di aplikasi.</w:t></w:r>
    </w:p>

    <!-- ======================================================== -->
    <!-- BAB III: ARSITEKTUR SISTEM                               -->
    <!-- ======================================================== -->
    <w:p>
        <w:pPr>
            <w:spacing w:before="300" w:after="180"/>
        </w:pPr>
        <w:r>
            <w:rPr><w:b/><w:sz w:val="26"/><w:color w:val="1D4ED8"/></w:rPr>
            <w:t>BAB III. ARSITEKTUR SISTEM</w:t>
        </w:r>
    </w:p>

    <w:p>
        <w:pPr><w:spacing w:after="120"/></w:pPr>
        <w:r>
            <w:t>Sistem Online Marketplace ini dibangun menggunakan pendekatan Arsitektur Tiga Tingkat (Three-Tier Architecture) yang terdistribusi dan mandiri:</w:t>
        </w:r>
    </w:p>

    <w:p>
        <w:pPr><w:spacing w:after="60"/></w:pPr>
        <w:r><w:rPr><w:b/></w:rPr><w:t>1. Tingkat Presentasi (Presentation Tier / Frontend):</w:t></w:r>
    </w:p>
    <w:p>
        <w:pPr><w:spacing w:after="120"/></w:pPr>
        <w:r><w:t>Terdiri dari aplikasi web berbasis React dan aplikasi mobile berbasis React Native (Expo). Lapisan ini bertugas menyajikan antarmuka visual yang intuitif, menangani interaksi pengguna, mengelola status lokal keranjang belanja, serta berkomunikasi dengan backend melalui permintaan HTTP.</w:t></w:r>
    </w:p>

    <w:p>
        <w:pPr><w:spacing w:after="60"/></w:pPr>
        <w:r><w:rPr><w:b/></w:rPr><w:t>2. Tingkat Aplikasi (Application Tier / Backend API):</w:t></w:r>
    </w:p>
    <w:p>
        <w:pPr><w:spacing w:after="120"/></w:pPr>
        <w:r><w:t>Dibangun dengan Node.js dan kerangka Express yang berperan sebagai pusat pengendali logika bisnis. Lapisan ini memvalidasi data masukan dari klien, memverifikasi tanda tangan digital token JWT pengguna, mengenkripsi kata sandi, dan menghubungkan komunikasi ke basis data.</w:t></w:r>
    </w:p>

    <w:p>
        <w:pPr><w:spacing w:after="60"/></w:pPr>
        <w:r><w:rPr><w:b/></w:rPr><w:t>3. Tingkat Data (Data Tier / Database):</w:t></w:r>
    </w:p>
    <w:p>
        <w:pPr><w:spacing w:after="180"/></w:pPr>
        <w:r><w:t>Menggunakan MongoDB Atlas yang ditempatkan pada infrastruktur cloud. Menyimpan koleksi data produk (nama, deskripsi, gambar, kategori, harga) dan data akun pengguna secara terstruktur dan aman.</w:t></w:r>
    </w:p>

    <w:p>
        <w:pPr><w:spacing w:after="60"/></w:pPr>
        <w:r><w:rPr><w:b/></w:rPr><w:t>4. Tingkat Pemantauan (Observability Tier):</w:t></w:r>
    </w:p>
    <w:p>
        <w:pPr><w:spacing w:after="240"/></w:pPr>
        <w:r><w:t>Layanan Google Analytics 4 (GA4) terpasang pada aplikasi web untuk mencatat kunjungan halaman (pageviews), durasi sesi pengguna, dan pola penjelajahan halaman katalog.</w:t></w:r>
    </w:p>

    <!-- ======================================================== -->
    <!-- BAB IV: PANDUAN INSTALASI & PENGOPERASIAN LOKAL          -->
    <!-- ======================================================== -->
    <w:p>
        <w:pPr>
            <w:spacing w:before="300" w:after="180"/>
        </w:pPr>
        <w:r>
            <w:rPr><w:b/><w:sz w:val="26"/><w:color w:val="1D4ED8"/></w:rPr>
            <w:t>BAB IV. PANDUAN INSTALASI &amp; PENGOPERASIAN LOKAL</w:t>
        </w:r>
    </w:p>

    <w:p>
        <w:pPr><w:spacing w:after="120"/></w:pPr>
        <w:r>
            <w:t>Untuk menguji dan menjalankan aplikasi di lingkungan komputer lokal penguji, ikuti urutan langkah berikut:</w:t>
        </w:r>
    </w:p>

    <w:p>
        <w:pPr><w:spacing w:after="60"/></w:pPr>
        <w:r><w:rPr><w:b/></w:rPr><w:t>A. Prasyarat Sistem Komputer:</w:t></w:r>
    </w:p>
    <w:p>
        <w:pPr><w:spacing w:after="120"/></w:pPr>
        <w:r><w:t>Pastikan komputer telah terpasang aplikasi Node.js (versi 18 atau yang lebih baru) dan pengelola paket npm. Untuk pengujian mobile, persiapkan smartphone dengan aplikasi Expo Go yang terpasang dari Google Play Store atau Apple App Store.</w:t></w:r>
    </w:p>

    <w:p>
        <w:pPr><w:spacing w:after="60"/></w:pPr>
        <w:r><w:rPr><w:b/></w:rPr><w:t>B. Langkah Pengoperasian Server Backend:</w:t></w:r>
    </w:p>
    <w:p>
        <w:pPr><w:spacing w:after="120"/></w:pPr>
        <w:r><w:t>1. Buka jendela terminal dan arahkan ke direktori server proyek.&#xA;2. Pasang modul dependensi yang dibutuhkan dengan perintah instalasi npm.&#xA;3. Jalankan perintah pemuatan data awal (seeding) untuk memasukkan contoh katalog produk ke basis data.&#xA;4. Jalankan server backend dalam mode pengembang. Server lokal akan aktif dan melayani permintaan di alamat localhost port 5000.</w:t></w:r>
    </w:p>

    <w:p>
        <w:pPr><w:spacing w:after="60"/></w:pPr>
        <w:r><w:rPr><w:b/></w:rPr><w:t>C. Langkah Pengoperasian Frontend Web:</w:t></w:r>
    </w:p>
    <w:p>
        <w:pPr><w:spacing w:after="120"/></w:pPr>
        <w:r><w:t>1. Buka jendela terminal baru dan arahkan ke direktori client proyek.&#xA;2. Pasang pustaka dependensi web melalui perintah instalasi npm.&#xA;3. Jalankan server pengembang web Vite. Aplikasi marketplace web dapat langsung dibuka di peramban (browser) pada alamat localhost port 5173.</w:t></w:r>
    </w:p>

    <w:p>
        <w:pPr><w:spacing w:after="60"/></w:pPr>
        <w:r><w:rPr><w:b/></w:rPr><w:t>D. Langkah Pengoperasian Aplikasi Mobile:</w:t></w:r>
    </w:p>
    <w:p>
        <w:pPr><w:spacing w:after="240"/></w:pPr>
        <w:r><w:t>1. Buka terminal baru dan arahkan ke direktori mobile proyek.&#xA;2. Pasang paket modul yang diperlukan menggunakan perintah instalasi npm.&#xA;3. Mulai server Expo dengan perintah expo start.&#xA;4. Buka aplikasi Expo Go pada smartphone Anda, pilih menu Scan QR Code, lalu arahkan kamera ke kode QR yang muncul di layar terminal untuk menjalankan aplikasi secara langsung di ponsel.</w:t></w:r>
    </w:p>

    <!-- ======================================================== -->
    <!-- BAB V: PANDUAN PENGARSIPAN & PENYERAHAN TUGAS            -->
    <!-- ======================================================== -->
    <w:p>
        <w:pPr>
            <w:spacing w:before="300" w:after="180"/>
        </w:pPr>
        <w:r>
            <w:rPr><w:b/><w:sz w:val="26"/><w:color w:val="1D4ED8"/></w:rPr>
            <w:t>BAB V. PANDUAN PENGARSIPAN &amp; PENYERAHAN TUGAS</w:t>
        </w:r>
    </w:p>

    <w:p>
        <w:pPr><w:spacing w:after="120"/></w:pPr>
        <w:r><w:t>Sesuai petunjuk penugasan, jika dibutuhkan pengumpulan berkas fisik proyek dalam bentuk arsip terkompresi:</w:t></w:r>
    </w:p>

    <w:p>
        <w:pPr><w:spacing w:after="60"/></w:pPr>
        <w:r><w:t>1. Pastikan seluruh folder proyek (folder client, folder server, dan folder mobile) berada dalam kondisi lengkap dan rapi.</w:t></w:r>
    </w:p>
    <w:p>
        <w:pPr><w:spacing w:after="60"/></w:pPr>
        <w:r><w:t>2. Sertakan berkas laporan dokumentasi Word ini di dalam direktori utama proyek.</w:t></w:r>
    </w:p>
    <w:p>
        <w:pPr><w:spacing w:after="120"/></w:pPr>
        <w:r><w:t>3. Kompresi keseluruhan folder proyek ke dalam satu berkas berformat .rar atau .zip dengan nama arsip tugas yang telah ditentukan, lalu unggah ke portal tugas akademik yang disediakan.</w:t></w:r>
    </w:p>

</w:body>
</w:document>"""

    with zipfile.ZipFile(filename, 'w', zipfile.ZIP_DEFLATED) as docx:
        docx.writestr('[Content_Types].xml', content_types)
        docx.writestr('_rels/.rels', rels)
        docx.writestr('word/_rels/document.xml.rels', doc_rels)
        docx.writestr('word/styles.xml', styles)
        docx.writestr('word/document.xml', doc_content)

    print(f"File Word tanpa kode berhasil dibuat: {filename}")

if __name__ == '__main__':
    create_word_doc('DOKUMENTASI_PROYEK.docx')
