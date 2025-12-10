# FRESH-ID - Gas Monitoring System

Website monitoring kandungan gas real-time untuk NH₃, H₂S, dan CH₄ dengan parameter suhu dan kelembaban.

## 🚀 Fitur Utama

- ✅ **Login dengan Email** - Sistem autentikasi yang aman
- 📊 **Monitoring Real-Time** - Grafik interaktif untuk semua sensor
- 📈 **Visualisasi Data** - Chart.js untuk tampilan data yang menarik
- 👥 **Halaman Tim** - Informasi lengkap tim dan pembimbing
- 📱 **Responsive Design** - Tampilan optimal di semua perangkat
- 🎨 **Design Modern** - UI/UX profesional dengan animasi smooth
- 💾 **Export Data** - Download data monitoring dalam format CSV

## 📁 Struktur Folder

```
WEBSITE TA 1/
├── index.html              # Halaman login
├── dashboard.html          # Dashboard utama
├── monitoring.html         # Halaman monitoring real-time
├── team.html              # Halaman informasi tim
├── css/
│   └── style.css          # Stylesheet utama
├── js/
│   ├── login.js           # JavaScript login
│   ├── dashboard.js       # JavaScript dashboard
│   └── monitoring.js      # JavaScript monitoring & charts
└── images/
    ├── logo.svg           # Logo FRESH-ID (SVG)
    ├── create-logo.html   # Generator logo PNG
    └── logo-generator.html # Visualisasi logo animasi
```

## 🎨 Cara Membuat Logo

Logo sudah tersedia dalam format SVG. Jika ingin membuat versi PNG:

1. Buka file `images/create-logo.html` di browser
2. Klik tombol "Download Logo PNG"
3. Logo akan terdownload otomatis

## 🖥️ Cara Menggunakan Website

### 1. Membuka Website
- Buka file `index.html` di browser Anda
- Atau jalankan dengan Live Server di VS Code

### 2. Login
- Masukkan email (contoh: user@email.com)
- Masukkan password (bebas untuk demo)
- Klik tombol "Masuk"

### 3. Navigasi
- **Dashboard**: Tampilan ringkasan semua sensor
- **Monitoring**: Grafik real-time dengan data history
- **Tim Kami**: Informasi lengkap tim dan pembimbing

### 4. Export Data
- Di halaman Monitoring, klik tombol "Export Data"
- Data akan terdownload dalam format CSV

## ⚙️ Kustomisasi

### Mengubah Informasi Tim

Edit file `team.html` pada bagian:

```html
<!-- Anggota Tim -->
<div class="member-card">
    <h3 class="member-name">Nama Lengkap Anda</h3>
    <p class="member-nim">NIM: 123456789</p>
    <p class="member-role">Posisi (Ketua/Anggota)</p>
</div>

<!-- Dosen Pembimbing -->
<div class="supervisor-card">
    <h3 class="supervisor-name">Nama Dosen</h3>
    <p class="supervisor-nip">NIP: 198501012010011001</p>
    <p class="supervisor-title">Dosen Pembimbing 1</p>
</div>
```

### Mengubah Warna Theme

Edit file `css/style.css` pada bagian `:root`:

```css
:root {
    --primary-color: #6366f1;      /* Warna utama */
    --secondary-color: #ec4899;    /* Warna sekunder */
    --accent-color: #f59e0b;       /* Warna aksen */
    /* ... */
}
```

### Mengubah Interval Update Data

Edit file `js/monitoring.js`:

```javascript
// Ubah interval update (dalam milidetik)
setInterval(updateMonitoringData, 2000); // Default: 2 detik
```

## 🔧 Teknologi yang Digunakan

- **HTML5** - Struktur website
- **CSS3** - Styling dengan Flexbox & Grid
- **JavaScript (ES6+)** - Interaktivitas
- **Chart.js** - Visualisasi grafik
- **Font Awesome** - Icon library
- **Google Fonts (Poppins)** - Typography

## 📊 Fitur Monitoring

### Gas yang Dimonitor:
1. **NH₃ (Ammonia)** - Warna Ungu
2. **H₂S (Hydrogen Sulfide)** - Warna Pink
3. **CH₄ (Methane)** - Warna Orange

### Parameter Lingkungan:
1. **Suhu** - Dalam Celcius (°C)
2. **Kelembaban** - Dalam Persen (%)

### Status Monitoring:
- 🟢 **Normal** - Nilai di bawah threshold
- 🟡 **Perhatian** - Nilai mendekati threshold (70-100%)
- 🔴 **Tinggi** - Nilai di atas threshold

## 📱 Responsive Breakpoints

- **Desktop**: > 1024px
- **Tablet**: 768px - 1024px
- **Mobile**: < 768px

## 🎯 Tips Penggunaan

1. **Untuk Presentasi**:
   - Gunakan mode fullscreen (F11)
   - Buka halaman Monitoring untuk demo real-time
   - Data akan ter-update otomatis setiap 2 detik

2. **Untuk Development**:
   - Edit data di `js/monitoring.js` fungsi `generateSensorData()`
   - Sesuaikan threshold di `js/dashboard.js` fungsi `updateStatus()`

3. **Untuk Custom Logo**:
   - Ganti file `images/logo.svg` dengan logo Anda
   - Pastikan ukuran minimal 200x200px untuk kualitas terbaik

## 🌐 Browser Support

Website ini support di:
- ✅ Google Chrome (Recommended)
- ✅ Mozilla Firefox
- ✅ Microsoft Edge
- ✅ Safari
- ✅ Opera

## 📝 Catatan Penting

- Website ini menggunakan **demo data** yang di-generate secara random
- Untuk koneksi ke sensor real, edit fungsi `generateSensorData()` dengan API endpoint
- Session login tersimpan di sessionStorage (hilang saat browser ditutup)
- Data monitoring tersimpan sementara (tidak persisten)

## 🎓 Untuk Keperluan Akademik

Website ini dibuat untuk Tugas Akhir dengan fitur:
- Monitoring real-time
- Visualisasi data yang informatif
- Design profesional dan modern
- Responsive untuk semua perangkat
- User-friendly interface

## 👨‍💻 Pengembangan Lebih Lanjut

Untuk integrasi dengan hardware:
1. Setup backend server (Node.js/Python)
2. Koneksi sensor ke microcontroller (Arduino/ESP32)
3. Kirim data via HTTP/WebSocket
4. Update fungsi `generateSensorData()` dengan fetch API

Contoh:
```javascript
async function fetchSensorData() {
    const response = await fetch('http://your-api.com/sensor-data');
    const data = await response.json();
    return data;
}
```

## 📞 Support

Jika ada pertanyaan atau issue:
- Edit informasi kontak di halaman Team
- Tambahkan email atau media sosial Anda

---

**FRESH-ID** - Gas Monitoring System for Better Air Quality
© 2025 Tim FRESH-ID. All rights reserved.
