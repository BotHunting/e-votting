# Security Migration Guide (v1.2.0 → v2.0.0)

## ⚠️ PENTING: BACA SEBELUM MIGRASI

Upgrade ini mengubah sistem keamanan secara signifikan. **Semua password akan di-hash** dan sistem sekarang menggunakan session-based authentication.

---

## 🔍 Apa yang Berubah?

### 1. Password Hashing
- **Sebelum**: Password disimpan dalam plaintext
- **Sekarang**: Password di-hash dengan SHA-256 + salt
- **Dampak**: Password lama tidak akan bekerja setelah migrasi

### 2. Session Management
- **Sebelum**: Tidak ada session, login berbasis password sederhana
- **Sekarang**: Token-based authentication dengan expiry 120 menit
- **Dampak**: User perlu login ulang setelah session kadaluarsa

### 3. Rate Limiting
- **Sebelum**: Tidak ada rate limiting
- **Sekarang**: 30 req/min dan 100 req/hour per client
- **Dampak**: Automated scripts mungkin terkena rate limit

### 4. Access Control
- **Sebelum**: Public access (ANYONE_ANONYMOUS)
- **Sekarang**: Private access (MYSELF)
- **Dampak**: Hanya deployer yang bisa mengakses API

---

## 📋 Langkah Migrasi

### Step 1: Backup Data

**CRITICAL**: Backup semua data sebelum migrasi!

1. Buka Google Sheets database
2. Download sebagai Excel/CSV:
   - Sheet `Users`
   - Sheet `Elections`
   - Sheet `Candidates`
   - Sheet `Voters_DPT`
   - Sheet `Votes`
   - Sheet `Audit_Logs`

### Step 2: Update Code

1. Pull latest code dari repository:
```bash
git pull origin main
```

2. Update file di Google Apps Script:
   - `Code.js` - Ganti dengan versi baru
   - `appsscript.json` - Ganti dengan versi baru
   - `index.html` - Ganti dengan versi baru

3. Push ke Apps Script:
```bash
cd script
clasp push
```

### Step 3: Re-Hash Passwords

**PERINGATAN**: Ini akan menghapus semua data dan reset dengan password default!

**Option A: Reset ke Default (Disarankan untuk Testing)**
1. Buka Google Apps Script Editor
2. Pilih fungsi `seedInitialData`
3. Klik **Run**
4. Approve permissions jika diminta
5. Data akan di-reset dengan:
   - Admin: admin / admin123
   - Staff: staff_tps1 / staff123
   - Staff: staff_tps2 / staff123

**Option B: Manual Migration (Untuk Production)**
Jika Anda ingin mempertahankan data yang ada:

1. Buka sheet `Users`
2. Buat kolom baru `Password_Hashed`
3. Jalankan script ini di Apps Script untuk hash password lama:

```javascript
function migratePasswords() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Users');
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const passwordIndex = headers.indexOf('Password');
  const idIndex = headers.indexOf('ID');
  
  for (let i = 1; i < data.length; i++) {
    const oldPassword = data[i][passwordIndex];
    const hashedPassword = hashPassword(oldPassword);
    sheet.getRange(i + 1, passwordIndex + 1).setValue(hashedPassword);
  }
  
  Logger.log('Password migration completed!');
}
```

4. Jalankan fungsi `migratePasswords`
5. Verifikasi semua password sudah ter-hash

### Step 4: Deploy dengan Access Baru

1. Di Google Apps Script Editor
2. Klik **Deploy** → **Manage Deployments**
3. Arsipkan deployment lama
4. Buat deployment baru:
   - Type: **Web App**
   - Description: "Security Upgrade v2.0.0"
   - Execute as: **Me**
   - Who has access: **MYSELF** (penting!)
5. Klik **Deploy**
6. Copy URL deployment baru

### Step 5: Deploy Frontend

Frontend memakai `google.script.run` dan harus dibuka melalui URL Web App Apps Script. URL deployment tidak perlu ditambahkan ke `script/index.html`.

Push dan deploy ulang:
```bash
clasp push
clasp deploy --description "Deploy frontend and API v2.0.0"
```

### Step 6: Grant Access untuk User

Karena sekarang access = "MYSELF", Anda perlu:

1. Buka Google Apps Script Project
2. Klik **Share** (pojok kanan atas)
3. Tambahkan email user yang perlu akses:
   - Admin utama
   - Staff TPS
4. Set permission: **Editor**
5. Setiap user akan menggunakan deploy mereka sendiri

---

## ✅ Verifikasi Migrasi

### 1. Test Login Admin
- Buka URL deployment
- Login dengan: admin / admin123
- Pastikan dashboard admin muncul
- Cek session tersimpan di localStorage

### 2. Test Login Staff
- Logout
- Login dengan: staff_tps1 / staff123
- Pastikan dashboard staff muncul
- Cek verifikasi NIK berfungsi

### 3. Test Rate Limiting
- Buka browser dev tools (F12)
- Refresh halaman > 30 kali dalam 1 menit
- Pastikan muncul error rate limit

### 4. Test Audit Logs
- Login sebagai admin
- Buka tab Audit Log
- Pastikan aktivitas tercatat dengan timestamp

### 5. Test Session Expiry
- Login sebagai admin
- Tunggu 120 menit (atau ubah config untuk testing)
- Refresh halaman
- Pastikan auto-logout muncul

---

## 🔧 Troubleshooting

### Error: "Session tidak valid atau telah kadaluarsa"
**Solusi**: Clear localStorage dan login ulang

### Error: "Terlalu banyak request"
**Solusi**: Tunggu 1 menit sebelum mencoba lagi

### Error: "Akun Anda dinonaktifkan"
**Solusi**: Cek sheet `Users`, pastikan kolom `Status` = "Aktif"

### User tidak bisa akses setelah deploy
**Solusi**: Tambahkan email user ke Share settings di Apps Script

### Password lama tidak bekerja
**Solusi**: Jalankan fungsi `seedInitialData` untuk reset ke default

---

## 📝 Checklist Migrasi

- [ ] Backup semua data Google Sheets
- [ ] Update file Code.js, appsscript.json, index.html
- [ ] Push ke Apps Script dengan clasp
- [ ] Jalankan seedInitialData atau migratePasswords
- [ ] Deploy dengan access = "MYSELF"
- [ ] Buka aplikasi melalui URL Web App Apps Script
- [ ] Share Apps Script ke user yang perlu akses
- [ ] Test login admin
- [ ] Test login staff
- [ ] Test rate limiting
- [ ] Test audit logs
- [ ] Test session expiry
- [ ] Verifikasi semua fitur berfungsi

---

## 🆘 Bantuan

Jika mengalami masalah:
1. Cek Stackdriver logs di Apps Script
2. Cek Audit Logs di sheet `Audit_Logs`
3. Review error message di browser console (F12)
4. Hubungi: bot.hunting101@gmail.com

---

## ⚠️ Catatan Penting

1. **JANGAN** menjalankan `seedInitialData` di production jika sudah ada data
2. **SELALU** backup sebelum migrasi
3. **VERIFIKASI** semua fitur setelah migrasi
4. **MONITOR** audit logs setelah beberapa hari
5. **DOKUMENTASIKAN** custom password jika manual migration

---

© 2026 E-Voting System v2.0.0 - Security First
