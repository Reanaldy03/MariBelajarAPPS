# 🚀 Quick Deployment Guide - MariBelajar

## Deployment Cepat ke cPanel (Web Version)

### Step 1: Build Production
```bash
# Build aplikasi untuk production
ionic build --prod

# atau menggunakan npm
npm run build
```

### Step 2: Upload ke cPanel

**Cara 1: Via File Manager cPanel**
1. Login ke cPanel: `https://maribelajar.rplbc-23.com:2083`
2. Buka **File Manager**
3. Navigate ke folder `public_html`
4. Upload semua file dari folder `www` ke `public_html`
5. Copy file `.htaccess.template` dan rename menjadi `.htaccess` di `public_html`

**Cara 2: Via FTP (FileZilla)**
1. Connect ke FTP server Anda
2. Upload semua file dari folder `www` ke folder `public_html`
3. Upload file `.htaccess.template` dan rename menjadi `.htaccess`

### Step 3: Verifikasi
Buka browser dan akses: `https://maribelajar.rplbc-23.com`

---

## Build Android APK

### Prerequisites
- Install Android Studio terlebih dahulu

### Commands
```bash
# 1. Add Android platform (hanya sekali)
npx cap add android

# 2. Build & sync
ionic build --prod
npx cap sync android

# 3. Open di Android Studio
npx cap open android

# 4. Di Android Studio: Build → Generate Signed Bundle/APK → APK
```

APK akan tersimpan di: `android/app/build/outputs/apk/release/`

---

## Troubleshooting

### CORS Error
Pastikan di folder API (`api-maribelajar`) sudah ada file `.htaccess` dengan CORS headers atau tambahkan di file PHP:
```php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
```

### 404 saat Refresh
Pastikan file `.htaccess` sudah ada di `public_html` dengan konfigurasi yang benar.

### API URL Salah
Check file `src/environments/environment.prod.ts` dan pastikan `apiUrl` sudah benar.

---

## Checklist Sebelum Deploy

- [ ] Test semua API endpoint di domain production
- [ ] Update `environment.prod.ts` dengan URL yang benar
- [ ] Build dengan flag `--prod`
- [ ] Upload file `.htaccess`
- [ ] Test di browser (Chrome, Firefox, Safari)
- [ ] Test di mobile browser
- [ ] Verifikasi HTTPS aktif

---

## File Penting

- `www/` - Hasil build (upload ke cPanel)
- `.htaccess.template` - Config Apache (copy ke cPanel)
- `src/environments/environment.prod.ts` - Production config

---

**Untuk panduan lengkap, lihat file:** `deployment_guide.md` di folder artifacts
