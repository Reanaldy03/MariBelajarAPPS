# 📁 Folder Foto Guru

## Cara Menambahkan Foto Guru

1. **Siapkan foto guru** dengan format:
   - Format: JPG, PNG, atau WebP
   - Ukuran: Disarankan 400x400px atau lebih besar (square/1:1)
   - Nama file: Gunakan nama yang jelas, contoh: `guru-matematika.jpg`

2. **Copy foto ke folder ini:**
   ```
   assets/guru/
   ```

3. **Update path di `tab5.page.ts`:**
   Edit array `guruList` dan update property `foto`:
   ```typescript
   {
     id: 1,
     nama: 'Budi Santoso, S.Pd',
     mataPelajaran: ['Matematika', 'Fisika'],
     pengalaman: '10 tahun',
     foto: 'assets/guru/budi-santoso.jpg' // Path ke foto Anda
   }
   ```

## Contoh Struktur File

```
assets/
└── guru/
    ├── budi-santoso.jpg
    ├── siti-nurhaliza.jpg
    ├── ahmad-fauzi.jpg
    ├── dewi-sartika.jpg
    └── rizki-pratama.jpg
```

## Catatan

- Jika foto tidak ditemukan, akan menggunakan default avatar
- Pastikan nama file sesuai dengan path yang ada di `tab5.page.ts`
- Foto akan otomatis di-resize dan di-crop untuk tampilan yang rapi



