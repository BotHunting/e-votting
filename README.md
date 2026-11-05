# 🗳️ E-Voting Sistem Pemilihan Lokal

<div align="center">

![E-Voting](https://img.shields.io/badge/version-2.2.0-green)
![License](https://img.shields.io/badge/license-MIT-green)
![Google Apps Script](https://img.shields.io/badge/Google%20Apps%20Script-yellow)

**Sistem E-Voting Digital untuk Pemilihan Lokal**
[Kepala Desa/Lurah, RW, dll]

[Fitur](#-fitur) • [Instalasi](#-instalasi) • [Panduan](#-panduan-penggunaan) • [Keamanan](#-keamanan)

</div>

---

## 📖 Tentang

E-Voting adalah sistem pemilihan digital berbasis web yang dirancang untuk pemilihan lokal di tingkat kelurahan/desa. Sistem ini menggunakan **Google Apps Script** sebagai backend dan **Google Sheets** sebagai database, memberikan solusi yang aman, transparan, dan mudah diakses tanpa biaya server.

### ✨ Keunggulan

- 🚀 **Tanpa Biaya Server** - Menggunakan Google Apps Script dan Google Sheets
- 🔒 **Aman & Transparan** - Dengan log audit dan validasi ganda
- 📱 **Responsif** - Bisa diakses dari berbagai perangkat
- 📊 **Real-time Analytics** - Hasil pemilihan langsung terupdate dengan multi-chart per pemilihan
- 🛡️ **Anti-Double Vote** - Sistem lock untuk mencegah kecurangan
- 📤 **Ekspor Data** - Excel dan PDF untuk dokumentasi
- 🔄 **Multi-Election Support** - 1 NIK dapat memilih di berbagai pemilihan berbeda
- ✏️ **CRUD Lengkap** - Kelola kandidat, DPT, pemilihan, dan akun dengan fitur tambah, edit, dan hapus
- 📥 **Bulk Import DPT** - Unggah ribuan data pemilih sekaligus via Excel/CSV
- 🔍 **Pencarian & Filter DPT** - Search real-time NIK/nama, filter pemilihan/RT/RW, dan pagination
- 📊 **Rincian DPT per Pemilihan** - Breakdown jumlah pemilih untuk tiap jenis pemilihan
- 📍 **Multi-TPS Support** - Pembagian DPT per TPS dengan validasi Staff TPS
- 📺 **Live Count Publik** - Dashboard publik real-time dengan auto-refresh 15 detik
- 🔐 **Modal Verifikasi** - Konfirmasi sebelum buka bilik suara digital
- 👥 **Manajemen Akun** - CRUD lengkap untuk Admin dan Staff dengan assignment TPS

---

## 🎯 Fitur

### 🔐 Sistem Autentikasi
- Login multi-role: **Admin Panitia** dan **Staff TPS**
- Manajemen akun dengan status aktif/nonaktif
- Session management dan logout

### 👨‍💼 Dashboard Admin
- **Manajemen Pemilihan (CRUD Lengkap)**
  - Buat pemilihan baru (Kepala Desa, RW, RT, BPD, dll)
  - Edit data pemilihan
  - Hapus pemilihan
  - Atur tanggal dan status pemilihan
  - Dropdown kategori pemilihan

- **Manajemen Kandidat (CRUD Lengkap)**
  - Tambah pasangan calon
  - Edit data kandidat
  - Hapus kandidat
  - Upload foto kandidat
  - Input visi & misi
  - Atur nomor urut
  - Input jabatan/lembaga (Kepala Desa, BPD, RW, RT) via dropdown

- **Manajemen DPT (Daftar Pemilih Tetap)**
  - Tambah data pemilih baru
  - Edit data pemilih yang sudah ada
  - Hapus data pemilih
  - Import massal DPT dari file Excel/CSV (kolom: NIK, Nama_Pemilih, RT, RW, ID_Pemilihan, TPS)
  - Input RT dan RW via dropdown (01–05) dengan format gabungan "RT xx / RW yy"
  - Input TPS via dropdown (TPS 01-05)
  - Pencarian real-time berdasarkan NIK atau nama pemilih
  - Filter berdasarkan pemilihan, RT, RW, dan TPS
  - Pagination data (10/25/50 per halaman)
  - Validasi NIK unik per pemilihan (mencegah duplikasi, termasuk saat import massal)
  - Tracking status pemilih
  - Tampilan kategori pemilihan di tabel DPT

- **Manajemen Akun (CRUD Lengkap)**
  - Tambah akun Admin dan Staff baru
  - Edit data akun (username, password, role, status, TPS)
  - Hapus akun (dengan proteksi untuk Admin utama)
  - Assignment TPS untuk Staff
  - Dropdown Role (Admin/Staff) dan Status (Aktif/Nonaktif)

- **Real-time Analytics (Multi-Chart)**
  - Total DPT terdaftar (akumulasi semua pemilihan) beserta rincian per jenis pemilihan
  - Suara masuk secara live (akumulasi semua pemilihan)
  - Tingkat partisipasi
  - Grafik perolehan suara terpisah untuk setiap pemilihan
  - Visualisasi data per kategori pemilihan

- **Live Count Publik**
  - Tab "Live Public" untuk memantau tampilan publik dari panel Admin
  - Modal popup fullscreen dengan grafik real-time
  - Auto-refresh 10 detik tanpa iframe (native components)
  - Statistik: Total DPT, Suara Masuk, Partisipasi
  - Grafik per kategori pemilihan

- **Audit Log Security**
  - Log semua aktivitas sistem
  - Timestamp otomatis
  - Track user dan aksi yang dilakukan

- **Ekspor Data**
  - Export hasil ke Excel (.xlsx)
  - Export berita acara ke PDF

### 🗳️ Dashboard Staff TPS
- **Badge TPS Assignment**
  - Tampilkan lokasi TPS tugas Staff di header
  - Filter DPT berdasarkan TPS Staff yang bertugas

- **Verifikasi Pemilih**
  - Cek NIK dari DPT
  - Validasi status pemilih (belum/sudah memilih)
  - Notifikasi jika NIK tidak valid
  - Pilih agenda pemilihan dari dropdown
  - Modal konfirmasi sebelum buka bilik suara (tampilkan NIK, Nama, RT/RW, TPS)

- **Bilik Suara Digital**
  - Tampilan kandidat dengan foto
  - Tampilan jabatan/lembaga kandidat
  - Visi & misi kandidat
  - Tombol coblos untuk setiap paslon
  - Konfirmasi sebelum submit

- **Pencoblosan Aman**
  - Validasi NIK sebelum vote
  - Validasi NIK per pemilihan (support multi-election)
  - Validasi TPS Staff vs TPS Pemilih
  - LockService mencegah double vote
  - Update status pemilih otomatis
  - Log audit untuk setiap vote

---

## 🏗️ Arsitektur Sistem

```
┌─────────────────────────────────────────────────────────┐
│                     Frontend (index.html)                │
│              - Login UI                                  │
│              - Admin Dashboard                           │
│              - Staff TPS Dashboard                       │
│              - Digital Ballot Box                        │
└──────────────────────┬──────────────────────────────────┘
                       │
                       │ google.script.run RPC
                       │ (tanpa hardcode URL)
                       │
┌──────────────────────▼──────────────────────────────────┐
│              Backend (Google Apps Script)                │
│                   - doGet(e) / doPost(e)                 │
│                   - Business Logic                        │
│                   - LockService (Concurrency Control)    │
│                   - Audit Logging                        │
└──────────────────────┬──────────────────────────────────┘
                       │
                       │ Read/Write Operations
                       │
┌──────────────────────▼──────────────────────────────────┐
│               Database (Google Sheets)                   │
│  ┌─────────────┬─────────────┬─────────────┬──────────┐ │
│  │   Users     │  Elections  │ Candidates  │  Voters   │ │
│  └─────────────┴─────────────┴─────────────┴──────────┘ │
│  ┌─────────────┬─────────────┐                           │
│  │    Votes    │  Audit_Logs │                           │
│  └─────────────┴─────────────┘                           │
└─────────────────────────────────────────────────────────┘
```

---

## 🛠️ Teknologi

| Komponen | Teknologi |
|----------|-----------|
| **Frontend** | HTML5, Tailwind CSS, JavaScript |
| **Backend** | Google Apps Script |
| **Database** | Google Sheets |
| **Charts** | Chart.js |
| **Export** | SheetJS (Excel), jsPDF (PDF) |
| **Deployment** | CLASP (Command Line Apps Script Projects) |
| **Security** | SHA-256 Hashing, Session Management, Rate Limiting |

---

## 📦 Instalasi & Setup Lengkap

### 📁 Struktur Project

```
e-votting/
├── index.html              ← Wrapper/Frame untuk deployment (SEO metadata)
├── script/                 ← Folder utama (untuk Google Apps Script)
│   ├── Code.js            ← Backend (API handlers, business logic)
│   ├── index.html         ← Frontend (UI lengkap e-voting)
│   ├── appsscript.json     ← Konfigurasi Apps Script
│   └── .clasp.json        ← Konfigurasi CLASP deployment
├── README.md              ← Dokumentasi ini
├── LICENSE                ← MIT License
└── .gitignore             ← File yang diabaikan git
```

### 🚀 Panduan Setup untuk Akun Baru (Handover)

#### Langkah 1: Clone Repository
```bash
git clone https://github.com/BotHunting/e-votting.git
cd e-votting
```

#### Langkah 2: Setup Google Sheets

1. Buka [Google Sheets](https://sheets.google.com/)
2. Buat spreadsheet baru dengan nama: `e-voting-database`
3. Buat 6 sheet dengan nama EXACT seperti ini:
   - `Users`
   - `Elections`
   - `Candidates`
   - `Voters_DPT`
   - `Votes`
   - `Audit_Logs`

4. Setup header untuk setiap sheet:

**Sheet `Users`:**
```
ID | Username | Password | Role | Nama_Petugas | Status | TPS
```

**Sheet `Elections`:**
```
ID_Pemilihan | Kategori | Tanggal | Status
```

**Sheet `Candidates`:**
```
ID_Kandidat | ID_Pemilihan | No_Urut | Nama_Kandidat | Foto_URL | Visi_Misi | Kandidat
```

**Sheet `Voters_DPT`:**
```
ID_Pemilih | ID_Pemilihan | NIK | Nama_Pemilih | RT_RW | Status_Memilih | ID_Staff_Verifikator | TPS
```

**Sheet `Votes`:**
```
ID_Vote | ID_Pemilihan | ID_Kandidat | Waktu_Mencoblos
```

**Sheet `Audit_Logs`:**
```
Timestamp | Account_ID | Role | Action_Type | Description | IP_UserAgent
```

#### Langkah 3: Setup Google Apps Script

1. Buka [Google Apps Script](https://script.google.com/)
2. Buat project baru
3. Di project editor:
   - Buat file `Code.js` (copy isi dari `script/Code.js`)
   - Buat file `appsscript.json` (copy isi dari `script/appsscript.json`)
   - Buat file `index.html` (copy isi dari `script/index.html`)

4. Klik tombol **Add-ons** → **Sheets** (atau ikon sheets)
5. Pilih spreadsheet yang dibuat di Langkah 2

#### Langkah 4: Jalankan Fungsi Seed Data (Opsional)

Untuk data testing awal:
1. Di Google Apps Script Editor
2. Pilih fungsi `seedInitialData` dari dropdown function
3. Klik **Run**
4. Spreadsheet akan otomatis terisi data dummy

#### Langkah 5: Install CLASP (Opsional - untuk deployment via terminal)

```bash
npm install -g @google/clasp
```

#### Langkah 6: Clone Project ke Lokal via CLASP

```bash
cd script
clasp login
clasp clone <SCRIPT_ID_FROM_APPS_SCRIPT_URL>
```

Script ID bisa didapat dari URL Apps Script, format:
`https://script.google.com/d/<SCRIPT_ID>/edit`

#### Langkah 7: Deploy sebagai Web App

**Via Google Apps Script Console:**
1. Klik **Deploy** → **New Deployment**
2. Pilih type: **Web App**
3. Description: "Deployment E-Voting v1.2.0"
4. Execute as: **Me** (akun yang login)
5. Who has access: **Anyone** (penting untuk akses publik)
6. Klik **Deploy**
7. Copy URL deployment yang muncul

**Via Terminal (CLASP):**
```bash
cd script
clasp deploy --description "Deployment E-Voting v1.2.0"
```

#### Langkah 8: Buka Aplikasi

Frontend memanggil backend melalui `google.script.run`, jadi buka URL Web App dari Langkah 7 secara langsung. URL deployment tidak perlu disimpan di `script/index.html`.

Setelah mengubah kode, push dan deploy ulang via CLASP:
```bash
clasp push
clasp deploy
```

#### Langkah 9: Hosting Wrapper Opsional

Wrapper statis di root tidak menyediakan `google.script.run`. Jika wrapper digunakan, arahkan iframe ke URL Web App dari Langkah 7; jangan arahkan ke file lokal `script/index.html`.

---

## 🔄 Workflow Deployment

### Deploy Perubahan Code

1. Edit file di folder `script/`
2. Push ke Google Apps Script:
```bash
cd script
clasp push
```
3. Deploy:
```bash
clasp deploy --description "Deskripsi perubahan"
```
4. Arsipkan deployment lama via Google Apps Script Console

### Update Frontend Tanpa Backend

Jika hanya perubahan UI:
1. Edit `script/index.html`
2. Push dan deploy seperti biasa
3. URL deployment tetap sama

---

## 📋 Panduan Penggunaan

### 🔑 Login Default

| Role | Username | Password |
|------|----------|----------|
| Admin | admin | admin123 |
| Staff TPS 1 | staff_tps1 | staff123 |
| Staff TPS 2 | staff_tps2 | staff123 |

### 👨‍💼 Workflow Admin

1. **Login** sebagai Admin
2. **Buat Pemilihan** baru di menu Elections
3. **Tambah Kandidat** dengan foto dan visi misi
4. **Import DPT** melalui menu Voters
5. **Monitoring** hasil real-time di Dashboard
6. **Ekspor** hasil ke Excel/PDF setelah pemilihan selesai

### 🗳️ Workflow Staff TPS

1. **Login** sebagai Staff TPS
2. **Pilih Pemilihan** yang aktif
3. **Input NIK** pemilih yang datang
4. **Verifikasi** NIK di DPT
5. **Buka Bilik Suara Digital** jika NIK valid
6. **Pandu pemilih** untuk memilih kandidat
7. **Konfirmasi** pencoblosan
8. Sistem otomatis update status pemilih

---

## ⚠️ Troubleshooting

### Error: "Gagal terhubung ke server Google Sheets API"
- Pastikan aplikasi dibuka dari URL Web App Apps Script, bukan file HTML atau hosting statis langsung
- Pastikan deployment sudah diaktifkan sebagai deployment utama
- Pastikan akses diatur ke "Anyone"

### Error: Blank screen setelah login
- Buka Console browser (F12) untuk cek error
- Pastikan backend `doGet(e)` menampilkan HTML saat tanpa parameter
- Pastikan Google Sheets sudah terhubung ke Apps Script

### Error: "NIK tidak ditemukan dalam DPT"
- Pastikan data di sheet `Voters_DPT` sudah ada
- Pastikan NIK dan ID_Pemilihan match persis
- Cek spasi/typo di NIK

### Error: "Endpoint POST tidak ditemukan"
- Deployment `/exec` masih menjalankan versi lama — buat **New Version** di Deploy > Manage Deployments
- Untuk testing tanpa deploy, buka URL `/dev` (selalu menjalankan kode terbaru/head)
- Karena frontend memakai `google.script.run`, error ini hanya muncul jika masih ada kode lama yang memakai fetch ke URL `/exec`

### Error: Deploy gagal via CLASP
- Pastikan sudah login: `clasp login`
- Pastikan `scriptId` di `.clasp.json` benar
- Pastikan di folder `script/` saat menjalankan command

---

## 📝 Catatan Penting

### URL Deployment
Buka aplikasi dari URL Web App Apps Script. URL ini tidak perlu ditanam di `script/index.html`; jika memakai wrapper statis, URL hanya digunakan sebagai alamat iframe.

### Struktur Database Harus Konsisten
Nama sheet dan kolom harus EXACT sama:
- Sheet: `Voters_DPT` (bukan `Voters` atau `DPT`)
- Kolom: `ID_Pemilihan`, `NIK`, `Status_Memilih`, dll

### Multi-Election Support
- 1 NIK bisa terdaftar di beberapa pemilihan berbeda
- Validasi double vote hanya per pemilihan yang SAMA
- Di tabel DPT, kolom `Pemilihan` menunjukkan kategori pemilihan

### Seed Data Hanya untuk Testing
Fungsi `seedInitialData()` hanya untuk testing awal. Setelah production, jangan jalankan lagi karena akan menghapus semua data.

---

## 🔐 Keamanan

### Fitur Keamanan yang Diterapkan

1. **Password Hashing (SHA-256)**
   - Password tidak disimpan dalam plaintext
   - Menggunakan SHA-256 dengan salt untuk hashing
   - Backward compatibility dengan password lama (migrasi otomatis)

2. **Session-Based Authentication**
   - Token session dengan expiry (default 120 menit)
   - Session disimpan di PropertiesService (server-side)
   - Auto-logout saat session kadaluarsa
   - Session persistence di browser dengan localStorage

3. **Rate Limiting**
   - Maksimal 30 request per menit per client
   - Maksimal 100 request per jam per client
   - Menggunakan CacheService untuk tracking
   - Mencegah brute force dan DDoS attack

4. **Server-Side Authorization**
   - Role validation di setiap endpoint
   - Admin: Full access (CRUD lengkap)
   - Staff: Hanya verifikasi & pencoblosan
   - Tidak bisa bypass dengan direct API call

5. **LockService**
   - Mencegah race condition saat pencoblosan
   - Timeout 30 detik untuk operasi kritis
   - Anti-double vote dengan atomic operation

6. **Validasi NIK Unik**
   - Cek duplikasi NIK per pemilihan (bukan global)
   - 1 NIK dapat terdaftar di beberapa pemilihan berbeda
   - Cek status pemilih sebelum vote

7. **Audit Logging**
   - Log semua aktivitas sistem
   - Track user, timestamp, dan aksi
   - Log error ke Stackdriver
   - Log tidak bisa dihapus oleh user biasa

8. **Anti-Double Vote**
   - Validasi status pemilih sebelum vote
   - Mencegah double vote pada pemilihan yang SAMA
   - Mengizinkan vote di pemilihan BERBEDA
   - Update status otomatis setelah vote
   - Validasi ganda di backend

9. **Data Validation**
   - Filter baris kosong/invalid di backend
   - Validasi input form di frontend
   - Error handling dengan try-catch
   - Proper error logging untuk debugging

10. **Access Control**
    - Deploy dengan access: "MYSELF" (hanya deployer)
    - Tidak bisa diakses publik tanpa authorization
    - Client-specific access untuk production

### Keamanan Tambahan yang Disarankan

Untuk production environment, disarankan:
- Gunakan domain-specific access di Apps Script
- Implementasi 2FA untuk akun Admin
- Encrypt data di Google Sheets (jika memungkinkan)
- Regular backup database
- Implementasi IP whitelisting
- Gunakan HTTPS enforce
- Monitor audit logs secara berkala

---

## 📊 Contoh Data

### Struktur Tabel Users
```
ID      | Username  | Password | Role  | Nama_Petugas            | Status | TPS
--------|-----------|----------|-------|-------------------------|--------|-------
USR-001 | admin     | admin123 | Admin | Achmad Faris            | Aktif  | -
USR-002 | staff_tps1| staff123 | Staff | Petugas TPS 01          | Aktif  | TPS 01
USR-003 | staff_tps2| staff123 | Staff | Petugas TPS 02          | Aktif  | TPS 02
```

### Struktur Tabel Elections
```
ID_Pemilihan     | Kategori              | Tanggal     | Status
-----------------|-----------------------|-------------|--------
ELC-2026-001     | Pemilihan Kepala Desa | 2026-11-10  | Aktif
```

### Struktur Tabel Candidates
```
ID_Kandidat | ID_Pemilihan | No_Urut | Nama_Kandidat           | Foto_URL | Visi_Misi          | Kandidat
------------|--------------|---------|-------------------------|----------|--------------------|----------------
CND-001     | ELC-2026-001 | 1       | H. Ahmad Dahlan, S.T.   | [URL]    | Visi: ...         | Kepala Desa
```

### Struktur Tabel Voters_DPT
```
ID_Pemilih | ID_Pemilihan | NIK            | Nama_Pemilih    | RT_RW     | Status_Memilih | ID_Staff_Verifikator
-----------|--------------|----------------|-----------------|-----------|----------------|----------------------
VTR-001    | ELC-2026-001 | 352501130795...| Muhammad Alvarisi| RT 01/RW 03| Belum          |
```

---

## 📝 Changelog

### v2.2.0 (Multi-TPS, Live Count Publik & UI Enhancements)
- ✨ **Multi-TPS Support**: Pembagian DPT per TPS dengan kolom TPS di Users dan Voters_DPT
- ✨ **Validasi TPS Staff**: Staff hanya dapat melayani pemilih di TPS yang ditugaskan
- ✨ **CRUD Pemilihan Lengkap**: Tambah fitur Edit dan Hapus untuk Elections dengan dropdown kategori
- ✨ **CRUD Akun Lengkap**: Manajemen akun Admin dan Staff dengan assignment TPS
- ✨ **Live Count Publik**: Dashboard publik tanpa login dengan auto-refresh 15 detik
- ✨ **Modal Live Public**: Popup fullscreen native (tanpa iframe) untuk Admin memantau tampilan publik
- ✨ **Modal Verifikasi**: Konfirmasi sebelum buka bilik suara dengan tampilan data pemilih lengkap (NIK, Nama, RT/RW, TPS)
- ✨ **Badge TPS Staff**: Tampilkan lokasi TPS tugas Staff di header dashboard
- ✨ **Dropdown Konsisten**: Semua input kategori/jabatan/role menggunakan dropdown untuk konsistensi data
- 🔧 **Hard-Reload Logout**: Logout melakukan hard-reload penuh untuk membersihkan session
- 🔧 **Refresh Spesifik CRUD**: Setelah CRUD, hanya refresh data spesifik (bukan full reload) untuk performa
- 🔧 **Error Handling Public.html**: Try-catch pada chart rendering dan data fetching
- 🔧 **Protection Admin Utama**: Cegah penghapusan akun Admin utama (USR-001)
- 🐛 **Bug Fix**: Perbaiki redeclaration variable electionIndex di Code.js
- 🐛 **Bug Fix**: Perbaiki tab navigation untuk semua tab (elections, users, live)
- 🐛 **Bug Fix**: Perbaiki payload conflict (role vs current_role) di CRUD operations

### v2.1.0 (Manajemen DPT & Integrasi Terbaru)
- ✨ **Edit Data DPT**: Fitur update pemilih existing (`updateVoter`) dengan validasi NIK ganda per pemilihan
- ✨ **Bulk Import DPT**: Import massal via Excel/CSV (`bulkAddVoters`) dengan LockService, validasi in-memory, dan penulisan `setValues` sekaligus
- ✨ **Search, Filter & Pagination DPT**: Pencarian real-time NIK/nama, filter pemilihan/RT/RW, pagination 10/25/50
- ✨ **Dropdown RT/RW**: Input RT dan RW di form DPT menjadi dropdown 01–05 untuk konsistensi data
- ✨ **Rincian DPT per Pemilihan**: Breakdown jumlah DPT per kategori di kartu Total DPT dashboard
- 🔧 **Migrasi ke `google.script.run`**: Frontend memanggil `handleApiRequest` langsung tanpa fetch/hardcode `GAS_API_URL`; selalu memakai kode terbaru tanpa deploy ulang
- 🔧 **Audit Log Import**: Pencatatan `BULK_IMPORT_VOTER` dan pesan audit update DPT yang lebih informatif

### v2.0.0 (Security Overhaul)
- 🔒 **Password Hashing**: Implementasi SHA-256 hashing untuk password
- 🔒 **Session Management**: Token-based authentication dengan expiry
- 🔒 **Rate Limiting**: 30 req/min dan 100 req/hour per client
- 🔒 **Server-Side Authorization**: Role validation di semua endpoint
- 🔒 **Error Logging**: Log error ke Stackdriver dan audit logs
- 🔒 **Access Control**: Ubah access dari ANYONE_ANONYMOUS ke MYSELF
- 🔧 **LockService Timeout**: Naikkan dari 10s ke 30s untuk better concurrency
- 🔧 **Session Persistence**: Auto-login dengan localStorage
- 🐛 **Security Fix**: Hapus user_id/role dari payload frontend (gunakan session)
- 🐛 **Security Fix**: Tambah client fingerprinting untuk rate limiting

### v1.2.0
- ✨ **Multi-Election Support**: 1 NIK dapat memilih di berbagai pemilihan berbeda
- ✨ **CRUD Lengkap**: Tambah fitur Edit dan Hapus untuk kandidat dan DPT
- ✨ **Multi-Chart Analytics**: Grafik perolehan suara terpisah untuk setiap pemilihan
- ✨ **Kolom Jabatan**: Tambah kolom Kandidat (Jabatan/Lembaga) di form dan tabel paslon
- ✨ **Input RT/RW Terpisah**: Pisahkan input RT dan RW di form DPT untuk akurasi
- 🔧 **Error Handling**: Perbaiki error handling dengan try-catch di semua fungsi
- 🔧 **Data Filtering**: Filter baris kosong/invalid di getSheetData
- 🐛 **Bug Fix**: Perbaiki blank screen setelah login
- 🐛 **Bug Fix**: Perbaiki validasi NIK ganda per pemilihan

### v1.1.0
- ✨ **Tab Navigation**: Tambah tab navigasi di Admin Dashboard
- ✨ **Audit Log Tab**: Tampilkan audit log di tab terpisah
- ✨ **Export Functions**: Tambah export Excel dan PDF
- 🔧 **UI Improvements**: Perbaiki tampilan dashboard admin

### v1.0.1
- 🎉 **Initial Release**: Fitur dasar e-voting
- 🔐 **Login System**: Autentikasi Admin dan Staff
- 🗳️ **Voting System**: Pencoblosan digital dengan validasi
- 📊 **Basic Analytics**: Grafik perolehan suara sederhana

---

## 🤝 Kontribusi

Kontribusi sangat diapresiasi! Silakan:

1. Fork repository
2. Buat branch fitur (`git checkout -b fitur-baru`)
3. Commit perubahan (`git commit -m 'Tambah fitur baru'`)
4. Push ke branch (`git push origin fitur-baru`)
5. Buka Pull Request

---

## 📝 License

Proyek ini dilisensikan di bawah **MIT License** - lihat file [LICENSE](LICENSE) untuk detail.

---

## 📞 Kontak

Untuk pertanyaan atau dukungan, silakan hubungi:

- **Email**: bot.hunting101@gmail.com
- **GitHub Issues**: [Buka Issue](https://github.com/BotHunting/e-votting/issues)

---

<div align="center">

**Dibuat dengan ❤️ untuk Demokrasi Digital Indonesia**

© 2026 E-Voting System. All rights reserved.

</div>
