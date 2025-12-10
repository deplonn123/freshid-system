# 🌐 PANDUAN DEPLOY WEBSITE KE INTERNET

Website FRESH-ID dapat diakses dari mana saja dengan menggunakan **GitHub Pages** (GRATIS & MUDAH).

---

## 📋 PERSIAPAN

### 1. Buat Akun GitHub (jika belum punya)
- Kunjungi: https://github.com/signup
- Daftar dengan email Anda
- Verifikasi email

### 2. Install Git (jika belum ada)
- Download: https://git-scm.com/download/win
- Install dengan Next-Next-Finish
- Restart komputer

---

## 🚀 LANGKAH DEPLOYMENT

### STEP 1: Setup Git Repository

Buka **PowerShell/Terminal** di folder website Anda:

```powershell
# Pindah ke folder website
cd "d:\TA.1 Daffa\WEBSITE TA 1"

# Initialize Git
git init

# Konfigurasi Git (ganti dengan data Anda)
git config user.name "Nama Anda"
git config user.email "email@anda.com"

# Add semua file
git add .

# Commit pertama
git commit -m "Initial commit - FRESH-ID System"
```

---

### STEP 2: Buat Repository di GitHub

1. **Login ke GitHub**: https://github.com
2. **Klik tombol "+" di kanan atas** → New repository
3. **Isi detail repository:**
   - Repository name: `freshid-system` (atau nama lain)
   - Description: `Food Freshness Detection System`
   - Public (pilih ini agar bisa di-deploy)
   - **JANGAN** centang "Add README"
4. **Klik "Create repository"**

---

### STEP 3: Push ke GitHub

Copy command yang muncul di GitHub, atau jalankan:

```powershell
# Ganti [username] dengan username GitHub Anda
# Ganti [repository-name] dengan nama repo Anda

git remote add origin https://github.com/[username]/[repository-name].git
git branch -M main
git push -u origin main
```

**Contoh:**
```powershell
git remote add origin https://github.com/daffa/freshid-system.git
git branch -M main
git push -u origin main
```

**Note:** Akan diminta login GitHub, masukkan:
- Username: [username GitHub Anda]
- Password: [Gunakan Personal Access Token]

---

### STEP 4: Aktifkan GitHub Pages

1. **Buka repository di GitHub**
2. **Klik tab "Settings"** (pojok kanan atas)
3. **Scroll ke bawah**, klik **"Pages"** di sidebar kiri
4. **Di section "Source":**
   - Branch: pilih `main`
   - Folder: pilih `/ (root)`
5. **Klik "Save"**

⏳ **Tunggu 1-3 menit**, GitHub akan build website Anda.

---

### STEP 5: Akses Website Anda! 🎉

Website akan tersedia di:
```
https://[username].github.io/[repository-name]/
```

**Contoh:**
```
https://daffa.github.io/freshid-system/
```

---

## 🔑 CARA BUAT PERSONAL ACCESS TOKEN

(Untuk login git push)

1. GitHub → Settings (profile, bukan repository)
2. Developer settings (paling bawah sidebar kiri)
3. Personal access tokens → Tokens (classic)
4. Generate new token (classic)
5. Centang: `repo` (full control)
6. Generate token
7. **COPY TOKEN** (hanya muncul sekali!)
8. Gunakan sebagai password saat git push

---

## 📱 AKSES DARI HP/LAPTOP LAIN

Setelah deploy, siapapun bisa akses website Anda dengan URL:
```
https://[username].github.io/[repository-name]/
```

Bagikan URL ini ke teman/dosen/siapa saja!

---

## 🔄 UPDATE WEBSITE

Setiap kali ada perubahan:

```powershell
cd "d:\TA.1 Daffa\WEBSITE TA 1"

git add .
git commit -m "Update: deskripsi perubahan"
git push
```

Website akan otomatis update dalam 1-3 menit.

---

## ⚠️ TROUBLESHOOTING

### Error: "Authentication failed"
→ Gunakan Personal Access Token sebagai password

### Website 404 Not Found
→ Tunggu 3-5 menit setelah push pertama
→ Pastikan GitHub Pages sudah aktif di Settings

### Login tidak berfungsi di website live
→ Normal, karena localStorage bersifat lokal per browser
→ Setiap user harus register akun sendiri

### File images/logo.svg tidak muncul
→ Pastikan path file benar (case-sensitive di GitHub)
→ Cek di browser DevTools → Console untuk error

---

## 💡 TIPS

✅ Gunakan nama repository yang pendek & mudah diingat
✅ Selalu test di localhost sebelum push
✅ Commit dengan message yang jelas
✅ Backup file website Anda secara berkala

---

## 🎯 ALTERNATIF LAIN (Lebih Advanced)

Jika ingin custom domain (misal: freshid.com):

1. **Netlify** - https://netlify.com (Gratis, drag & drop)
2. **Vercel** - https://vercel.com (Gratis, untuk React/Next.js)
3. **Cloudflare Pages** - https://pages.cloudflare.com (Gratis + CDN)

Semua support static HTML website seperti punya Anda.

---

## 📞 BANTUAN

Jika ada error, kirim screenshot ke:
- GitHub Discussions
- Stack Overflow
- Chat GPT

---

**Good Luck! 🚀**
