-- MariBelajar Database Setup Script
-- Database Schema untuk Aplikasi MariBelajar
-- Dibuat: 2026-01-12

-- Buat database baru
CREATE DATABASE IF NOT EXISTS maribelajar_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE maribelajar_db;

-- ================================================
-- 1. TABEL USERS
-- ================================================
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('siswa', 'admin') DEFAULT 'siswa',
    phone VARCHAR(20) DEFAULT NULL,
    avatar VARCHAR(255) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================
-- 2. TABEL PACKAGES (Paket Belajar)
-- ================================================
CREATE TABLE IF NOT EXISTS packages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    subjects VARCHAR(255),
    level VARCHAR(50),
    duration VARCHAR(50),
    is_active TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_is_active (is_active),
    INDEX idx_level (level)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================
-- 3. TABEL PENDAFTARAN (Registrasi Siswa)
-- ================================================
CREATE TABLE IF NOT EXISTS pendaftaran (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT DEFAULT NULL,
    package_id INT DEFAULT NULL,
    nama_siswa VARCHAR(100) NOT NULL,
    nomor_telepon VARCHAR(20) NOT NULL,
    mata_pelajaran VARCHAR(255) NOT NULL,
    tingkat_pendidikan VARCHAR(50) NOT NULL,
    jadwal_pilihan VARCHAR(100) NOT NULL,
    metode_pembelajaran VARCHAR(100) NOT NULL,
    paket VARCHAR(50) DEFAULT NULL,
    program_khusus VARCHAR(100) DEFAULT NULL,
    payment_proof VARCHAR(255) DEFAULT NULL,
    status ENUM('pending_payment', 'verification', 'active', 'rejected') DEFAULT 'pending_payment',
    rejection_reason TEXT DEFAULT NULL,
    tanggal_pembayaran DATETIME DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (package_id) REFERENCES packages(id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_package_id (package_id),
    INDEX idx_status (status),
    INDEX idx_tingkat (tingkat_pendidikan)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================
-- 4. TABEL CHAT_MESSAGES (Live Chat)
-- ================================================
CREATE TABLE IF NOT EXISTS chat_messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    sender_role ENUM('user', 'admin') NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================
-- 5. DATA AWAL (SEEDING)
-- ================================================

-- Insert Admin User (Password: admin123)
INSERT INTO users (full_name, email, password, role, phone) VALUES
('Admin MariBelajar', 'admin@maribelajar.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', '081234567890');

-- Insert Sample Student User (Password: student123)
INSERT INTO users (full_name, email, password, role, phone) VALUES
('Siswa Demo', 'siswa@example.com', '$2y$10$BhZ7qWXp8vH0eRzqY1Y4gOqKGJZH0sT3VmB6oWJv2YqS8OHx4KZHm', 'siswa', '081234567891');

-- Insert Sample Packages
INSERT INTO packages (name, description, price, subjects, level, duration, is_active) VALUES
('Paket Basic SD', 'Paket belajar dasar untuk siswa SD', 500000, 'Matematika, B. Inggris, Sains', 'SD', '1 Bulan', 1),
('Paket Intensif SMP', 'Paket intensif untuk persiapan ujian SMP', 750000, 'Matematika, IPA, Bahasa Inggris', 'SMP', '1 Bulan', 1),
('Paket Premium SMA', 'Paket premium untuk persiapan UTBK', 1200000, 'Matematika, Fisika, Kimia, Biologi', 'SMA', '1 Bulan', 1);

-- ================================================
-- CATATAN PENTING
-- ================================================
-- 1. Password default admin: admin123
-- 2. Password default siswa demo: student123
-- 3. Untuk production, ganti password admin dan hapus akun demo
-- 4. Pastikan folder uploads/ memiliki permission write (777)
-- 5. Update konfigurasi database di config.php sesuai environment Anda
