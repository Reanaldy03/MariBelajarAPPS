# Git Workflow - MariBelajar Project

Panduan lengkap untuk mengelola repository Git project MariBelajar.

## 📋 Prerequisites

1. **Install Git**
   - Download: https://git-scm.com/download/win
   - Atau via command: `winget install Git.Git`

2. **Konfigurasi Git** (jika belum)
   ```bash
   git config --global user.name "Nama Anda"
   git config --global user.email "email@example.com"
   ```

3. **Buat Repository di GitHub**
   - Login ke GitHub
   - Klik "New Repository"
   - Nama: `MariBelajar` (atau sesuai keinginan)
   - Description: "Platform Bimbingan Belajar Online - Ionic Angular"
   - **Jangan** centang "Initialize with README" (kita sudah punya)
   - Klik "Create Repository"

---

## 🚀 Initial Setup (First Time)

### 1. Buat .gitignore

Buat file `.gitignore` di root project untuk exclude file yang tidak perlu:

```bash
cd "c:\Users\reana\OneDrive\Dokumen\Pemograman Mobile\MariBelajar\src"
```

Buat file `.gitignore` dengan isi:

```
# Node
node_modules/
npm-debug.log
yarn-error.log

# Ionic
www/
platforms/
plugins/
.sourcemaps/

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db
desktop.ini

# Logs
*.log
logs/

# Environment
.env
.env.local

# Build
dist/
build/

# Tests
coverage/

# Temporary files
*.tmp
*.temp
```

### 2. Initialize Git Repository

```bash
git init
```

### 3. Add Remote Repository

Ganti `<username>` dengan username GitHub Anda:

```bash
git remote add origin https://github.com/<username>/MariBelajar.git
```

Contoh:
```bash
git remote add origin https://github.com/johndoe/MariBelajar.git
```

### 4. Add All Files

```bash
git add .
```

### 5. First Commit

```bash
git commit -m "Initial commit: MariBelajar Platform v1.0.1

Features:
- Ionic Angular frontend with modern UI
- PHP REST API backend
- User authentication (Admin & Siswa)
- Package management
- Student registration with payment upload
- Live chat functionality
- Profile management

Tech Stack:
- Frontend: Ionic 7 + Angular 17
- Backend: PHP 7.4+ with PDO
- Database: MySQL 5.7+"
```

### 6. Push to GitHub

```bash
git branch -M main
git push -u origin main
```

Jika diminta login:
- Username: GitHub username Anda
- Password: **Gunakan Personal Access Token** (bukan password biasa)

**Cara buat Personal Access Token:**
1. GitHub > Settings > Developer settings > Personal access tokens > Tokens (classic)
2. Generate new token
3. Pilih scope: `repo` (full control)
4. Copy token (simpan di tempat aman!)
5. Gunakan token sebagai password saat push

---

## 🔄 Daily Workflow

Setiap kali ada perubahan:

### 1. Cek Status Changes

```bash
git status
```

Ini akan menampilkan file yang modified, added, atau deleted.

### 2. Add Changes

**Add semua file:**
```bash
git add .
```

**Add file spesifik:**
```bash
git add src/app/tab2/tab2.page.ts
git add src/api-maribelajar/api-pendaftaran.php
```

**Add folder spesifik:**
```bash
git add src/app/tab2/
```

### 3. Commit Changes

**Format commit message yang baik:**
```bash
git commit -m "fix: upload payment endpoint for multipart/form-data

- Skip JSON validation for file upload action
- Add file type and size validation
- Remove tanggal_pembayaran column reference
- Enhanced error messages"
```

**Conventional Commits:**
- `feat:` - Fitur baru
- `fix:` - Bug fix
- `docs:` - Update dokumentasi
- `style:` - Format code (tidak mengubah logic)
- `refactor:` - Refactor code
- `test:` - Menambah test
- `chore:` - Maintenance task

### 4. Push to Remote

```bash
git push
```

Atau jika branch baru:
```bash
git push -u origin nama-branch
```

---

## 🌿 Working with Branches

### Buat Branch Baru

```bash
git checkout -b feature/new-feature-name
```

Contoh:
```bash
git checkout -b feature/whatsapp-integration
git checkout -b fix/payment-upload-bug
```

### Switch Branch

```bash
git checkout main
git checkout feature/whatsapp-integration
```

### List All Branches

```bash
git branch
```

### Merge Branch ke Main

```bash
# 1. Switch ke main
git checkout main

# 2. Merge branch
git merge feature/new-feature-name

# 3. Push
git push
```

### Delete Branch

```bash
# Delete local
git branch -d feature/new-feature-name

# Delete remote
git push origin --delete feature/new-feature-name
```

---

## 🔍 Useful Git Commands

### View Commit History

```bash
git log
git log --oneline
git log --graph --oneline --all
```

### View Changes

```bash
# Changes yang belum di-stage
git diff

# Changes yang sudah di-stage
git diff --staged

# Changes di file tertentu
git diff src/app/tab2/tab2.page.ts
```

### Undo Changes

**Undo unstaged changes:**
```bash
git checkout -- src/app/tab2/tab2.page.ts
```

**Undo staged changes:**
```bash
git reset HEAD src/app/tab2/tab2.page.ts
```

**Undo last commit (keep changes):**
```bash
git reset --soft HEAD~1
```

**Undo last commit (discard changes):**
```bash
git reset --hard HEAD~1
```

### Stash Changes

```bash
# Save changes temporarily
git stash

# List stashes
git stash list

# Apply last stash
git stash pop

# Apply specific stash
git stash apply stash@{0}
```

### Update from Remote

```bash
# Fetch changes
git fetch

# Pull changes
git pull

# Pull with rebase
git pull --rebase
```

---

## 📝 Example Complete Workflow

```bash
# 1. Cek branch saat ini
git branch

# 2. Buat branch baru untuk fitur
git checkout -b feature/payment-gateway

# 3. Lakukan perubahan code...
# ... edit files ...

# 4. Cek status
git status

# 5. Add files
git add .

# 6. Commit
git commit -m "feat: integrate Midtrans payment gateway

- Add Midtrans SDK
- Create payment service
- Update pendaftaran flow
- Add payment callback handler"

# 7. Push ke remote
git push -u origin feature/payment-gateway

# 8. Buat Pull Request di GitHub
# (via web browser)

# 9. Setelah di-merge, switch ke main
git checkout main

# 10. Pull latest changes
git pull

# 11. Delete branch lokal
git branch -d feature/payment-gateway
```

---

## 🔐 .gitignore Important Files

Pastikan file berikut **TIDAK** di-commit:

```gitignore
# Sensitive Config
src/api-maribelajar/config.php    # JANGAN commit jika ada password DB

# Node modules
node_modules/

# Environment
.env
.env.local
.env.production

# Uploads (file user)
src/api-maribelajar/uploads/

# IDE
.vscode/
.idea/

# OS
.DS_Store
Thumbs.db
```

**Untuk config.php:**
Buat `config.example.php` sebagai template:

```php
<?php
$host = 'localhost';
$db_name = 'maribelajar_db';
$username = 'root';
$password = ''; // CHANGE THIS in production

// Copy this file to config.php and update with your settings
?>
```

---

## 🚨 Troubleshooting

### Error: "fatal: not a git repository"

```bash
git init
```

### Error: "failed to push"

```bash
git pull --rebase
git push
```

### Forgot to add files before commit

```bash
git add forgotten-file.ts
git commit --amend --no-edit
git push --force
```

### Remove file from Git but keep locally

```bash
git rm --cached file-to-remove.txt
echo "file-to-remove.txt" >> .gitignore
git commit -m "chore: remove sensitive file from git"
git push
```

### Large file error

```bash
# Install Git LFS
git lfs install

# Track large files
git lfs track "*.psd"
git lfs track "*.mp4"

git add .gitattributes
git commit -m "chore: add Git LFS tracking"
git push
```

---

## 📚 Best Practices

1. **Commit Often** - Small, frequent commits lebih baik dari 1 commit besar
2. **Write Good Commit Messages** - Jelas, deskriptif, menggunakan conventional commits
3. **Branch for Features** - Jangan langsung commit ke main
4. **Pull Before Push** - Selalu pull latest changes sebelum push
5. **Review Before Commit** - Cek `git diff` sebelum commit
6. **Don't Commit Secrets** - Jangan commit password, API keys, tokens
7. **Use .gitignore** - Exclude file yang tidak perlu (node_modules, logs, etc)

---

## 🎯 Quick Reference

| Command | Description |
|---------|-------------|
| `git status` | Cek status changes |
| `git add .` | Add semua changes |
| `git commit -m "message"` | Commit changes |
| `git push` | Push ke remote |
| `git pull` | Pull dari remote |
| `git checkout -b branch-name` | Buat branch baru |
| `git branch` | List branches |
| `git log` | View history |
| `git diff` | View changes |

---

**Happy Coding! 🚀**

Need help? Ask ChatGPT atau lihat: https://git-scm.com/doc
