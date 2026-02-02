# MariBelajar - Backend API

Backend REST API untuk aplikasi MariBelajar, platform bimbingan belajar online yang menghubungkan siswa dengan tutor berkualitas.

## 🚀 Quick Start

### Prerequisites
- PHP 7.4+
- MySQL 5.7+
- Apache/Nginx dengan mod_rewrite
- XAMPP/WAMPP (untuk development lokal)

### Installation

1. **Clone atau Copy folder ini** ke direktori web server Anda:
   ```
   C:\xampp\htdocs\api-maribelajar\
   ```

2. **Import Database:**
   - Buka phpMyAdmin
   - Buat database baru bernama `maribelajar_db`
   - Import file `setup_database.sql`
   
   Atau via command line:
   ```bash
   mysql -u root -p < setup_database.sql
   ```

3. **Konfigurasi Database:**
   - Edit file `config.php`
   - Sesuaikan kredensial database:
     ```php
     $host = 'localhost';
     $db_name = 'maribelajar_db';
     $username = 'root';
     $password = '';
     ```

4. **Set Permission untuk Upload:**
   ```bash
   mkdir -p uploads/avatars uploads/payments
   chmod -R 777 uploads/
   ```

5. **Test API:**
   - Buka: `http://localhost/api-maribelajar/login.php`
   - Seharusnya return error "Method not allowed" (berarti API berjalan)

## 📁 Struktur File

```
api-maribelajar/
├── config.php                 # Konfigurasi database & CORS
├── setup_database.sql         # SQL untuk setup database
├── API_DOCUMENTATION.md       # Dokumentasi lengkap API
├── README.md                  # File ini
│
├── Authentication
│   ├── login.php              # Login endpoint
│   └── register.php           # Register endpoint
│
├── API Endpoints
│   ├── api-packages.php       # CRUD paket belajar
│   ├── api-pendaftaran.php    # CRUD pendaftaran siswa
│   ├── api-profile.php        # Manage user profile
│   ├── api-chat.php           # Live chat endpoint
│   └── api-upload.php         # File upload handler
│
└── uploads/                   # Folder penyimpanan file
    ├── avatars/               # Avatar user
    └── payments/              # Bukti pembayaran
```

## 🔑 Default Credentials

Setelah import database, gunakan akun berikut untuk testing:

**Admin:**
- Email: `admin@maribelajar.com`
- Password: `admin123`

**Siswa Demo:**
- Email: `siswa@example.com`
- Password: `student123`

⚠️ **PENTING:** Ganti password default sebelum production!

## 📚 Dokumentasi API

Dokumentasi lengkap tersedia di [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

### API Endpoints Overview

| Endpoint | Method | Deskripsi |
|----------|--------|-----------|
| `/login.php` | POST | Login user |
| `/register.php` | POST | Register user baru |
| `/api-packages.php` | GET/POST/PUT/DELETE | Manage paket belajar |
| `/api-pendaftaran.php` | GET/POST/PUT/DELETE | Manage pendaftaran |
| `/api-profile.php` | GET/POST | Manage profil user |
| `/api-chat.php` | GET/POST | Live chat |
| `/api-upload.php` | POST | Upload file |

## 🗄️ Database Schema

### Tables:
1. **users** - Data pengguna (siswa & admin)
2. **packages** - Paket belajar yang tersedia
3. **pendaftaran** - Data pendaftaran siswa
4. **chat_messages** - Pesan live chat

Lihat `setup_database.sql` untuk detail lengkap schema.

## 🔒 Security Features

- ✅ Password hashing dengan bcrypt
- ✅ SQL injection protection (PDO Prepared Statements)
- ✅ XSS protection (htmlspecialchars, strip_tags)
- ✅ CORS configuration
- ✅ File upload validation
- ✅ Input validation

## 🧪 Testing API

### Menggunakan cURL:

**Login:**
```bash
curl -X POST http://localhost/api-maribelajar/login.php \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@maribelajar.com","password":"admin123"}'
```

**Get Packages:**
```bash
curl http://localhost/api-maribelajar/api-packages.php
```

### Menggunakan Postman:
1. Import collection dari file dokumentasi
2. Set base URL: `http://localhost/api-maribelajar`
3. Test setiap endpoint

## 🚨 Troubleshooting

### CORS Error
- Pastikan header CORS sudah diset di `config.php`
- Untuk production, restrict origin spesifik

### Database Connection Error
- Cek kredensial di `config.php`
- Pastikan MySQL service running
- Cek nama database sudah benar

### Upload Error
- Pastikan folder `uploads/` ada dan writable
- Cek PHP upload settings di `php.ini`:
  ```ini
  upload_max_filesize = 10M
  post_max_size = 10M
  ```

### 404 Error
- Pastikan mod_rewrite enabled
- Cek path file sudah benar
- Restart Apache

## 📱 Frontend Integration

API ini dirancang untuk digunakan dengan:
- **Ionic/Angular** - Aplikasi mobile/web
- **React/Vue** - Web application
- **Flutter/React Native** - Mobile apps

Base URL: `http://localhost/api-maribelajar/`

Untuk production, deploy ke:
- Shared hosting (cPanel)
- VPS (DigitalOcean, AWS, etc)
- Cloud hosting (Firebase, Heroku)

## 🔄 Updates & Migrations

Untuk update schema database yang sudah ada, lihat file migration di:
- `update-database.sql` - Update incremental

## 📞 Support

Jika menemukan bug atau ada pertanyaan:
1. Check dokumentasi lengkap di `API_DOCUMENTATION.md`
2. Review error logs di Apache
3. Cek $_SERVER variables untuk debugging

## 📝 License

Private - MariBelajar Platform

## 🎯 Version

**Current Version:** 1.0.0  
**Last Updated:** 12 Januari 2026

---

**Happy Coding! 🚀**
