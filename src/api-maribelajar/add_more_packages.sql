-- ================================================
-- Add More Package Data for MariBelajar
-- Total New Packages: 24 (making total 27 with existing 3)
-- Categories: SD (7), SMP (7), SMA (10)
-- ================================================
-- Run this script after setup_database.sql
-- Execute in MySQL/phpMyAdmin

USE maribelajar_db;

-- ================================================
-- SD PACKAGES (7 new packages)
-- ================================================

INSERT INTO packages (name, description, price, subjects, level, duration, is_active) VALUES

('Paket Literasi SD', 'Program peningkatan kemampuan membaca dan menulis untuk siswa SD', 400000, 'Bahasa Indonesia, Membaca, Menulis', 'SD', '1 Bulan', 1),

('Paket Math Fun SD', 'Belajar matematika dengan cara menyenangkan dan interaktif', 450000, 'Matematika', 'SD', '1 Bulan', 1),

('Paket English for Kids', 'Bahasa Inggris dasar untuk anak-anak dengan metode fun learning', 500000, 'Bahasa Inggris', 'SD', '1 Bulan', 1),

('Paket Sains Eksperimen SD', 'Belajar sains dengan eksperimen sederhana dan menarik', 550000, 'Sains, IPA', 'SD', '1 Bulan', 1),

('Paket Intensif SD Semester', 'Paket lengkap semua mata pelajaran untuk persiapan semester', 800000, 'Matematika, B. Indonesia, B. Inggris, IPA, IPS', 'SD', '3 Bulan', 1),

('Paket Olimpiade Matematika SD', 'Persiapan olimpiade matematika tingkat SD/MI', 900000, 'Matematika', 'SD', '2 Bulan', 1),

('Paket Calistung Pra-SD', 'Program membaca, menulis, berhitung untuk persiapan masuk SD', 350000, 'Bahasa Indonesia, Matematika', 'SD', '1 Bulan', 1),

-- ================================================
-- SMP PACKAGES (7 new packages)
-- ================================================

('Paket Fokus Matematika SMP', 'Bimbingan khusus matematika untuk siswa SMP', 600000, 'Matematika', 'SMP', '1 Bulan', 1),

('Paket Sains Terpadu SMP', 'Program IPA terpadu: Biologi, Fisika, Kimia', 700000, 'IPA, Biologi, Fisika, Kimia', 'SMP', '1 Bulan', 1),

('Paket Bahasa SMP', 'Bimbingan Bahasa Indonesia dan Bahasa Inggris', 650000, 'Bahasa Indonesia, Bahasa Inggris', 'SMP', '1 Bulan', 1),

('Paket UN SMP Intensif', 'Persiapan intensif Ujian Nasional SMP', 1000000, 'Matematika, Bahasa Indonesia, Bahasa Inggris, IPA', 'SMP', '3 Bulan', 1),

('Paket IPS Lengkap SMP', 'Belajar Geografi, Ekonomi, Sejarah, Sosiologi', 550000, 'IPS, Geografi, Ekonomi, Sejarah', 'SMP', '1 Bulan', 1),

('Paket Kompetitif SMP', 'Persiapan OSN dan kompetisi akademik SMP', 900000, 'Matematika, IPA', 'SMP', '2 Bulan', 1),

('Paket All-in-One SMP', 'Paket lengkap semua mata pelajaran SMP', 1100000, 'Matematika, IPA, Bahasa Indonesia, Bahasa Inggris, IPS', 'SMP', '3 Bulan', 1),

-- ================================================
-- SMA PACKAGES (10 new packages)
-- ================================================

('Paket IPA UTBK Premium', 'Persiapan UTBK SBMPTN jurusan IPA dengan drilling soal', 1500000, 'Matematika, Fisika, Kimia, Biologi', 'SMA', '3 Bulan', 1),

('Paket IPS UTBK Premium', 'Persiapan UTBK SBMPTN jurusan IPS dengan strategi jitu', 1500000, 'Ekonomi, Geografi, Sosiologi, Sejarah', 'SMA', '3 Bulan', 1),

('Paket Matematika Wajib SMA', 'Bimbingan matematika wajib untuk semua jurusan', 700000, 'Matematika', 'SMA', '1 Bulan', 1),

('Paket Saintek UTBK', 'Fokus TPS, Matematika, Fisika, Kimia, Biologi', 1800000, 'Matematika, Fisika, Kimia, Biologi', 'SMA', '4 Bulan', 1),

('Paket Soshum UTBK', 'Fokus TPS, Ekonomi, Geografi, Sosiologi, Sejarah', 1800000, 'Ekonomi, Geografi, Sosiologi, Sejarah', 'SMA', '4 Bulan', 1),

('Paket Fisika Mendalam SMA', 'Penguasaan konsep fisika dari dasar hingga advance', 800000, 'Fisika', 'SMA', '1 Bulan', 1),

('Paket Kimia Organik-Anorganik', 'Belajar kimia dengan pendekatan konseptual', 800000, 'Kimia', 'SMA', '1 Bulan', 1),

('Paket Biologi UTBK', 'Biologi untuk UTBK dengan mind mapping dan trik cepat', 750000, 'Biologi', 'SMA', '1 Bulan', 1),

('Paket Ekonomi Bisnis SMA', 'Ekonomi mikro, makro, dan akuntansi', 650000, 'Ekonomi', 'SMA', '1 Bulan', 1),

('Paket Olimpiade Sains SMA', 'Persiapan OSN Matematika, Fisika, Kimia, atau Biologi', 1200000, 'Matematika, Fisika, Kimia, Biologi', 'SMA', '2 Bulan', 1);

-- ================================================
-- VERIFICATION QUERY
-- ================================================
-- Check total packages after insert
-- Should show 27 packages (3 original + 24 new)

SELECT COUNT(*) as total_packages FROM packages;
SELECT level, COUNT(*) as count FROM packages GROUP BY level;

-- ================================================
-- NOTES
-- ================================================
-- 1. Harga range: Rp 350,000 - Rp 1,800,000
-- 2. Duration range: 1-4 bulan
-- 3. Subjects bervariasi untuk memudahkan filtering
-- 4. All packages set to is_active = 1
-- 5. Categories covered:
--    - Matematika (multiple)
--    - Bahasa Inggris, Bahasa Indonesia
--    - IPA, Fisika, Kimia, Biologi
--    - IPS, Ekonomi, Geografi, Sejarah, Sosiologi
--    - Sains
-- 6. Special programs included: UTBK, Olimpiade, UN
