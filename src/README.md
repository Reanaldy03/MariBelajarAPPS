# MariBelajar - Platform Bimbingan Belajar Online

Platform bimbingan belajar online yang menghubungkan siswa dengan tutor berkualitas. Aplikasi mobile berbasis Ionic Angular dengan backend PHP REST API.

![MariBelajar](https://img.shields.io/badge/Version-1.0.0-blue) ![Platform](https://img.shields.io/badge/Platform-Ionic-brightgreen) ![Backend](https://img.shields.io/badge/Backend-PHP-777BB4)

## 📱 Fitur Utama

### Untuk Siswa
- ✅ **Registrasi & Login** - Sistem autentikasi yang aman
- ✅ **Pilih Paket Belajar** - Berbagai paket (SD, SMP, SMA) dengan filter kategori
- ✅ **Pendaftaran Online** - Form pendaftaran yang lengkap dengan validasi
- ✅ **Upload Bukti Pembayaran** - Upload dan tracking pembayaran
- ✅ **Live Chat** - Chat real-time dengan admin
- ✅ **Profile Management** - Edit profil dan ganti password
- ✅ **Riwayat Pendaftaran** - Tracking status pendaftaran (Pending, Verifikasi, Active, Rejected)

### Untuk Admin
- ✅ **Dashboard Statistik** - Overview siswa, paket, dan pendaftaran
- ✅ **Manajemen Paket** - CRUD paket belajar
- ✅ **Verifikasi Pendaftaran** - Approve/reject pendaftaran siswa
- ✅ **Chat Management** - Balas chat dari siswa
- ✅ **Profile Management** - Kelola profil admin

## 🛠️ Tech Stack

### Frontend (Mobile App)
- **Framework:** Ionic 7 + Angular 17
- **UI Components:** Ionic Components
- **State Management:** Angular Services
- **HTTP Client:** Angular HttpClient
- **Routing:** Angular Router
- **Form Validation:** Reactive Forms

### Backend (REST API)
- **Language:** PHP 7.4+
- **Database:** MySQL 5.7+
- **Authentication:** Password Hashing (bcrypt)
- **Security:** PDO Prepared Statements, XSS Protection
- **File Upload:** Multipart Form Data
- **CORS:** Configured for Cross-Origin Requests

## 📁 Struktur Project

```
MariBelajar/
├── src/                          # Frontend Ionic App
│   ├── app/
│   │   ├── pages/               # Pages
│   │   │   ├── admin/           # Admin pages
│   │   │   │   ├── dashboard/
│   │   │   │   ├── packages/
│   │   │   │   ├── verification/
│   │   │   │   ├── chat/
│   │   │   │   └── profile/
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── services/            # Services
│   │   │   ├── auth.service.ts
│   │   │   ├── packages.service.ts
│   │   │   ├── pendaftaran.service.ts
│   │   │   └── chat.service.ts
│   │   ├── guards/              # Route Guards
│   │   │   └── auth.guard.ts
│   │   ├── tab1/                # Dashboard Siswa
│   │   ├── tab2/                # Beli Paket
│   │   ├── tab3/                # Riwayat/Aktivitas
│   │   ├── tab4/                # Bantuan/Live Chat
│   │   ├── tab5/                # Profile
│   │   └── tabs/                # Tab Navigation
│   └── api-maribelajar/         # Backend API
│       ├── config.php
│       ├── setup_database.sql
│       ├── login.php
│       ├── register.php
│       ├── api-packages.php
│       ├── api-pendaftaran.php
│       ├── api-profile.php
│       ├── api-chat.php
│       ├── api-upload.php
│       ├── README.md
│       └── API_DOCUMENTATION.md
└── README.md                    # File ini
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ & npm
- Ionic CLI: `npm install -g @ionic/cli`
- XAMPP/WAMP (Apache + MySQL + PHP)
- Git

### 1. Clone Repository
```bash
git clone <repository-url>
cd MariBelajar
```

### 2. Setup Frontend

```bash
cd src
npm install
```

Update environment configuration di `src/environments/environment.ts`:
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost/api-maribelajar'
};
```

### 3. Setup Backend

#### A. Copy API ke Web Server
```bash
# Windows (XAMPP)
copy src\api-maribelajar C:\xampp\htdocs\api-maribelajar

# atau manual copy folder api-maribelajar ke htdocs
```

#### B. Setup Database
1. Buka phpMyAdmin: `http://localhost/phpmyadmin`
2. Import `setup_database.sql`
3. Database `maribelajar_db` akan otomatis terbuat beserta table dan data dummy

#### C. Konfigurasi Database
Edit `api-maribelajar/config.php`:
```php
$host = 'localhost';
$db_name = 'maribelajar_db';
$username = 'root';
$password = '';  // Sesuaikan dengan password MySQL Anda
```

#### D. Set Permission Upload
```bash
cd C:\xampp\htdocs\api-maribelajar
mkdir uploads\avatars uploads\payments
```

### 4. Run Application

#### A. Start Backend
- Start XAMPP (Apache & MySQL)
- Test API: `http://localhost/api-maribelajar/api-packages.php`

#### B. Start Frontend
```bash
cd src
ionic serve
```

Aplikasi akan buka di `http://localhost:8100`

## 👤 Default Credentials

### Admin
- **Email:** admin@maribelajar.com
- **Password:** admin123

### Siswa Demo
- **Email:** siswa@example.com  
- **Password:** student123

⚠️ **PENTING:** Ganti password sebelum production!

## 📚 Dokumentasi

### Frontend
- Lihat folder `src/app/` untuk struktur komponen
- Service documentation dalam komentar di masing-masing service
- Guard documentation di `src/app/guards/`

### Backend API
Dokumentasi lengkap tersedia di:
- **[API Documentation](src/api-maribelajar/API_DOCUMENTATION.md)** - Endpoint details, request/response format
- **[Backend README](src/api-maribelajar/README.md)** - Setup guide dan troubleshooting

## 🎨 UI/UX Design

### Design Principles
- **Modern & Clean:** Gradient backgrounds, smooth shadows
- **User-Friendly:** Intuitive navigation dengan bottom tab bar
- **Responsive:** Optimized untuk mobile devices
- **Interactive:** Hover effects, animations, smooth transitions
- **Accessible:** Clear labels, proper contrast

### Color Palette
- **Primary:** #4A90E2 (Soft Blue)
- **Secondary:** #357ABD (Dark Blue)
- **Success:** #1DD1A1 (Teal Green)
- **Danger:** #FF6B6B (Soft Red)
- **Warning:** #FF9F43 (Orange)
- **Background:** #F8F9FA (Light Gray)

### Key Components
- **Floating Tab Bar** - Modern glassmorphism effect
- **Avatar Upload** - Interactive profile pictures  
- **Package Cards** - Gradient headers dengan smooth shadows
- **Status Timeline** - Visual progress tracker
- **Chat Bubbles** - WhatsApp-style design

## 🔒 Security Features

- ✅ **Password Hashing** - bcrypt algorithm
- ✅ **SQL Injection Protection** - PDO Prepared Statements
- ✅ **XSS Protection** - htmlspecialchars, strip_tags
- ✅ **CORS Configuration** - Controlled cross-origin access
- ✅ **File Upload Validation** - Type and size checking
- ✅ **Route Guards** - Protected admin routes
- ✅ **Input Validation** - Frontend & backend validation

## 📊 Database ERD

```
users (siswa & admin)
  ├─ id (PK)
  ├─ full_name
  ├─ email (UNIQUE)
  ├─ password (HASHED)
  ├─ role (ENUM: siswa, admin)
  ├─ phone
  └─ avatar

packages (paket belajar)
  ├─ id (PK)
  ├─ name
  ├─ price
  ├─ subjects
  ├─ level (SD/SMP/SMA)
  ├─ duration
  └─ is_active

pendaftaran (registrasi siswa)
  ├─ id (PK)
  ├─ user_id (FK → users)
  ├─ package_id (FK → packages)
  ├─ nama_siswa
  ├─ payment_proof
  ├─ status (pending/verification/active/rejected)
  └─ ...

chat_messages (live chat)
  ├─ id (PK)
  ├─ user_id (FK → users)
  ├─ sender_role (ENUM: user, admin)
  ├─ message
  └─ created_at
```

## 🧪 Testing

### Manual Testing
1. **Authentication Flow**
   - Register → Login → Logout
   - Admin & Siswa access
   
2. **Student Flow**
   - Browse packages → Register → Upload payment → Track status
   
3. **Admin Flow**
   - Manage packages → Verify payments → Chat with students

### API Testing
Gunakan Postman atau cURL untuk test endpoints. Lihat [API Documentation](src/api-maribelajar/API_DOCUMENTATION.md).

## 🐛 Troubleshooting

### Frontend Issues

**Error: Cannot find module '@ionic/angular'**
```bash
npm install
```

**CORS Error**
- Pastikan backend API sudah running
- Cek `apiUrl` di `environment.ts`

### Backend Issues

**Database Connection Error**
- Cek MySQL service running
- Verify credentials di `config.php`
- Pastikan database `maribelajar_db` sudah dibuat

**Upload Error**
- Cek folder `uploads/` permission
- Increase PHP upload limit di `php.ini`

**404 API Error**
- Pastikan API folder di `htdocs/`
- Restart Apache

## 📱 Build & Deploy

### Build untuk Production

```bash
# Build Android APK
ionic build --prod
ionic capacitor add android
ionic capacitor copy android
ionic capacitor open android
# Build di Android Studio

# Build iOS (macOS only)
ionic capacitor add ios
ionic capacitor copy ios
ionic capacitor open ios
# Build di Xcode
```

### Deploy Backend

1. **Shared Hosting (cPanel)**
   - Upload folder `api-maribelajar` via FTP
   - Import database via phpMyAdmin
   - Update `config.php`

2. **VPS**
   - Setup LAMP stack
   - Copy files & import database
   - Configure Apache virtual host

## 🔄 Future Enhancements

- [ ] Push Notifications
- [ ] Payment Gateway Integration (Midtrans/Xendit)
- [ ] Video Conference untuk live learning
- [ ] Assignment & Quiz Module
- [ ] Progress Tracking Dashboard
- [ ] Email Notifications
- [ ] WhatsApp Integration
- [ ] Multi-language Support

## 📄 License

Private Project - MariBelajar Platform

## 👥 Contributors

- Development Team MariBelajar

## 📞 Support

Untuk pertanyaan atau issue:
1. Check dokumentasi lengkap
2. Review troubleshooting section
3. Contact developer team

---

**Version:** 1.0.0  
**Last Updated:** 12 Januari 2026  
**Made with ❤️ using Ionic + Angular + PHP**
