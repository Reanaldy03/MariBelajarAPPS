# MariBelajar API Documentation

Dokumentasi lengkap REST API untuk aplikasi MariBelajar - Platform Bimbingan Belajar Online.

## 📋 Daftar Isi

- [Informasi Umum](#informasi-umum)
- [Struktur Database](#struktur-database)
- [Endpoint API](#endpoint-api)
  - [Authentication](#authentication)
  - [Packages](#packages)
  - [Pendaftaran](#pendaftaran)
  - [Profile](#profile)
  - [Chat](#chat)
  - [Upload](#upload)

---

## 🔧 Informasi Umum

**Base URL:** `http://localhost/api-maribelajar/`

**Format Response:** JSON

**Headers yang Diperlukan:**
```
Content-Type: application/json
Access-Control-Allow-Origin: *
```

---

## 🗄️ Struktur Database

### 1. Tabel `users`
Menyimpan data pengguna (siswa dan admin).

| Kolom | Tipe | Keterangan |
|-------|------|------------|
| `id` | INT (PK, AI) | ID unik user |
| `full_name` | VARCHAR(100) | Nama lengkap |
| `email` | VARCHAR(100) | Email (unique) |
| `password` | VARCHAR(255) | Password (hashed) |
| `role` | ENUM('siswa', 'admin') | Role user |
| `phone` | VARCHAR(20) | Nomor telepon |
| `avatar` | VARCHAR(255) | Path file avatar |
| `created_at` | TIMESTAMP | Waktu dibuat |

### 2. Tabel `packages`
Menyimpan paket belajar yang tersedia.

| Kolom | Tipe | Keterangan |
|-------|------|------------|
| `id` | INT (PK, AI) | ID paket |
| `name` | VARCHAR(100) | Nama paket |
| `description` | TEXT | Deskripsi paket |
| `price` | DECIMAL(10,2) | Harga |
| `subjects` | VARCHAR(255) | Mata pelajaran |
| `level` | VARCHAR(50) | Tingkat (SD/SMP/SMA) |
| `duration` | VARCHAR(50) | Durasi paket |
| `is_active` | TINYINT(1) | Status aktif |
| `created_at` | TIMESTAMP | Waktu dibuat |
| `updated_at` | TIMESTAMP | Waktu diupdate |

### 3. Tabel `pendaftaran`
Menyimpan data pendaftaran siswa.

| Kolom | Tipe | Keterangan |
|-------|------|------------|
| `id` | INT (PK, AI) | ID pendaftaran |
| `user_id` | INT (FK) | ID user (siswa) |
| `package_id` | INT (FK) | ID paket |
| `nama_siswa` | VARCHAR(100) | Nama siswa |
| `nomor_telepon` | VARCHAR(20) | No. telepon |
| `mata_pelajaran` | VARCHAR(255) | Mata pelajaran pilihan |
| `tingkat_pendidikan` | VARCHAR(50) | SD/SMP/SMA |
| `jadwal_pilihan` | VARCHAR(100) | Jadwal yang dipilih |
| `metode_pembelajaran` | VARCHAR(100) | Online/Offline |
| `paket` | VARCHAR(50) | Nama paket |
| `program_khusus` | VARCHAR(100) | Program tambahan (opsional) |
| `payment_proof` | VARCHAR(255) | Path bukti pembayaran |
| `status` | ENUM | pending_payment/verification/active/rejected |
| `rejection_reason` | TEXT | Alasan penolakan |
| `tanggal_pembayaran` | DATETIME | Tanggal bayar |
| `created_at` | TIMESTAMP | Waktu dibuat |
| `updated_at` | TIMESTAMP | Waktu diupdate |

### 4. Tabel `chat_messages`
Menyimpan pesan live chat antara siswa dan admin.

| Kolom | Tipe | Keterangan |
|-------|------|------------|
| `id` | INT (PK, AI) | ID pesan |
| `user_id` | INT (FK) | ID user |
| `sender_role` | ENUM('user', 'admin') | Pengirim |
| `message` | TEXT | Isi pesan |
| `created_at` | TIMESTAMP | Waktu kirim |

---

## 🔐 Authentication

### Register
**Endpoint:** `POST /register.php`

**Request Body:**
```json
{
  "fullName": "Nama Lengkap",
  "email": "user@example.com",
  "password": "password123",
  "phone": "081234567890",
  "role": "siswa"
}
```

**Response (201):**
```json
{
  "status": "success",
  "message": "User registered successfully"
}
```

**Error (400):**
```json
{
  "status": "error",
  "message": "Email already registered"
}
```

---

### Login
**Endpoint:** `POST /login.php`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "status": "success",
  "message": "Login successful",
  "user": {
    "id": 1,
    "full_name": "Nama Lengkap",
    "email": "user@example.com",
    "role": "siswa",
    "phone": "081234567890"
  }
}
```

---

## 📦 Packages

### Get All Packages
**Endpoint:** `GET /api-packages.php`

**Query Parameters:**
- `admin=true` - Tampilkan semua paket (termasuk non-aktif)
- `id={id}` - Get paket spesifik

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Paket Basic SD",
      "description": "Paket belajar dasar untuk siswa SD",
      "price": 500000,
      "subjects": "Matematika, B. Inggris, Sains",
      "level": "SD",
      "duration": "1 Bulan",
      "isActive": true,
      "createdAt": "2024-01-01 10:00:00"
    }
  ]
}
```

---

### Create Package (Admin)
**Endpoint:** `POST /api-packages.php`

**Request Body:**
```json
{
  "name": "Paket Premium SMA",
  "description": "Paket premium untuk UTBK",
  "price": 1200000,
  "subjects": "Matematika, Fisika, Kimia",
  "level": "SMA",
  "duration": "1 Bulan",
  "isActive": 1
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Paket berhasil ditambahkan",
  "id": 4
}
```

---

### Update Package (Admin)
**Endpoint:** `PUT /api-packages.php?id={id}`

**Request Body:**
```json
{
  "name": "Paket Premium SMA Updated",
  "price": 1500000,
  "isActive": 1
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Paket berhasil diupdate"
}
```

---

### Delete Package (Soft Delete - Admin)
**Endpoint:** `DELETE /api-packages.php?id={id}`

**Response (200):**
```json
{
  "success": true,
  "message": "Paket dinonaktifkan"
}
```

---

## 📝 Pendaftaran

### Get All Pendaftaran
**Endpoint:** `GET /api-pendaftaran.php`

**Query Parameters:**
- `user_id={id}` - Filter by user ID
- `id={id}` - Get pendaftaran spesifik

**Response (200):**
```json
{
  "success": true,
  "message": "Data berhasil diambil",
  "data": [
    {
      "id": 1,
      "namaSiswa": "John Doe",
      "nomorTelepon": "081234567890",
      "mataPelajaran": "Matematika, IPA",
      "tingkatPendidikan": "SMP",
      "jadwalPilihan": "Pagi (08.00 - 12.00)",
      "metodePembelajaran": "Online (Zoom/GMeet)",
      "paket": "Paket Intensif SMP",
      "status": "pending_payment",
      "createdAt": "2024-01-05 14:30:00"
    }
  ]
}
```

---

### Create Pendaftaran
**Endpoint:** `POST /api-pendaftaran.php`

**Request Body:**
```json
{
  "userId": 2,
  "packageId": 2,
  "namaSiswa": "John Doe",
  "nomorTelepon": "081234567890",
  "mataPelajaran": "Matematika, IPA",
  "tingkatPendidikan": "SMP",
  "jadwalPilihan": "Pagi (08.00 - 12.00)",
  "metodePembelajaran": "Online (Zoom/GMeet)",
  "paket": "Paket Intensif SMP",
  "programKhusus": "Persiapan Olimpiade"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Pendaftaran berhasil disimpan",
  "data": {
    "id": 5,
    "namaSiswa": "John Doe",
    "status": "pending_payment",
    "createdAt": "2024-01-05 14:30:00"
  }
}
```

---

### Update Status Pendaftaran (Admin)
**Endpoint:** `PUT /api-pendaftaran.php?id={id}`

**Request Body:**
```json
{
  "status": "active"
}
```

**Status yang valid:**
- `pending_payment` - Menunggu pembayaran
- `verification` - Sedang diverifikasi
- `active` - Aktif/disetujui
- `rejected` - Ditolak

**Untuk reject, sertakan:**
```json
{
  "status": "rejected",
  "rejectionReason": "Bukti pembayaran tidak jelas"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Status berhasil diperbarui"
}
```

---

### Upload Payment Proof
**Endpoint:** `POST /api-pendaftaran.php?action=upload_payment`

**Content-Type:** `multipart/form-data`

**Form Data:**
- `id`: ID pendaftaran
- `payment_proof`: File gambar (JPG/PNG)

**Response (200):**
```json
{
  "success": true,
  "message": "Bukti pembayaran berhasil diupload",
  "payment_url": "http://localhost/api-maribelajar/uploads/payments/payment_5_1234567890.jpg"
}
```

---

### Delete Pendaftaran
**Endpoint:** `DELETE /api-pendaftaran.php?id={id}`

**Response (200):**
```json
{
  "success": true,
  "message": "Data pendaftaran berhasil dihapus"
}
```

---

## 👤 Profile

### Get Profile
**Endpoint:** `GET /api-profile.php?id={userId}`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 2,
    "full_name": "John Doe",
    "email": "john@example.com",
    "role": "siswa",
    "phone": "081234567890",
    "avatar": "uploads/avatars/avatar_2_1234567890.jpg",
    "avatar_url": "http://localhost/api-maribelajar/uploads/avatars/avatar_2_1234567890.jpg",
    "created_at": "2024-01-01 10:00:00"
  }
}
```

---

### Update Profile
**Endpoint:** `POST /api-profile.php?action=update_profile`

**Request Body:**
```json
{
  "id": 2,
  "name": "John Doe Updated",
  "phone": "081234567891"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Profile updated successfully"
}
```

---

### Change Password
**Endpoint:** `POST /api-profile.php?action=change_password`

**Request Body:**
```json
{
  "id": 2,
  "old_password": "oldpass123",
  "new_password": "newpass456"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

---

### Upload Avatar
**Endpoint:** `POST /api-profile.php?action=upload_avatar`

**Content-Type:** `multipart/form-data`

**Form Data:**
- `id`: User ID
- `avatar`: File gambar (JPG/PNG/GIF)

**Response (200):**
```json
{
  "success": true,
  "message": "Avatar uploaded successfully",
  "avatar_url": "http://localhost/api-maribelajar/uploads/avatars/avatar_2_1234567890.jpg"
}
```

---

## 💬 Chat

### Get Chat Messages
**Endpoint:** `GET /api-chat.php?user_id={userId}`

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "user_id": 2,
      "sender_role": "user",
      "message": "Halo admin",
      "student_name": "John Doe",
      "created_at": "2024-01-05 10:00:00"
    },
    {
      "id": 2,
      "user_id": 2,
      "sender_role": "admin",
      "message": "Halo, ada yang bisa dibantu?",
      "student_name": "John Doe",
      "created_at": "2024-01-05 10:01:00"
    }
  ]
}
```

---

### Get All Chats (Admin)
**Endpoint:** `GET /api-chat.php?action=get_all_chats`

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "user_id": 2,
      "student_id": 2,
      "student_name": "John Doe",
      "sender_role": "user",
      "message": "Halo admin",
      "created_at": "2024-01-05 10:00:00"
    }
  ]
}
```

---

### Send Message
**Endpoint:** `POST /api-chat.php`

**Request Body:**
```json
{
  "user_id": 2,
  "sender_role": "user",
  "message": "Halo admin, saya mau tanya"
}
```

**sender_role:** `user` atau `admin`

**Response (200):**
```json
{
  "success": true,
  "message": "Message sent"
}
```

---

## 📤 Upload

### Upload File (Generic)
**Endpoint:** `POST /api-upload.php`

**Content-Type:** `multipart/form-data`

**Form Data:**
- `id`: ID pendaftaran
- `payment_proof`: File gambar

**Response (200):**
```json
{
  "success": true,
  "message": "File uploaded successfully",
  "file_url": "http://localhost/api-maribelajar/uploads/file_name.jpg"
}
```

---

## 📊 Status Codes

| Code | Keterangan |
|------|------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request - Data tidak valid |
| 401 | Unauthorized - Login gagal |
| 404 | Not Found - Data tidak ditemukan |
| 405 | Method Not Allowed |
| 500 | Internal Server Error |
| 503 | Service Unavailable |

---

## 🔒 Security Notes

1. **Password** di-hash menggunakan `password_hash()` PHP (bcrypt)
2. **CORS** diaktifkan untuk development (production harus di-restrict)
3. **Input Validation** menggunakan `htmlspecialchars()` dan `strip_tags()`
4. **SQL Injection Protection** menggunakan PDO Prepared Statements
5. **File Upload** dibatasi untuk tipe gambar tertentu

---

## 🚀 Setup Instructions

1. Import `setup_database.sql` ke MySQL:
   ```bash
   mysql -u root -p maribelajar_db < setup_database.sql
   ```

2. Update `config.php` dengan konfigurasi database Anda

3. Pastikan folder `uploads/` memiliki permission write:
   ```bash
   chmod -R 777 uploads/
   ```

4. Default credentials:
   - **Admin:** admin@maribelajar.com / admin123
   - **Siswa:** siswa@example.com / student123

---

## 📞 Support

Untuk pertanyaan atau issue, silakan hubungi developer.

**Version:** 1.0.0  
**Last Updated:** 12 Januari 2026
