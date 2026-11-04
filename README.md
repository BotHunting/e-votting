# 🗳️ E-Voting Sistem Pemilihan Lokal

<div align="center">

![E-Voting](https://img.shields.io/badge/version-1.2.0-blue)
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
- ✏️ **CRUD Lengkap** - Kelola kandidat dan DPT dengan fitur tambah, edit, dan hapus

---

## 🎯 Fitur

### 🔐 Sistem Autentikasi
- Login multi-role: **Admin Panitia** dan **Staff TPS**
- Manajemen akun dengan status aktif/nonaktif
- Session management dan logout

### 👨‍💼 Dashboard Admin
- **Manajemen Pemilihan**
  - Buat pemilihan baru (Kepala Desa, RW, RT, BPD, dll)
  - Atur tanggal dan status pemilihan

- **Manajemen Kandidat (CRUD Lengkap)**
  - Tambah pasangan calon
  - Edit data kandidat
  - Hapus kandidat
  - Upload foto kandidat
  - Input visi & misi
  - Atur nomor urut
  - Input jabatan/lembaga (Kepala Desa, BPD, RW, RT)

- **Manajemen DPT (Daftar Pemilih Tetap)**
  - Tambah data pemilih baru
  - Hapus data pemilih
  - Input RT dan RW terpisah
  - Validasi NIK unik per pemilihan (mencegah duplikasi)
  - Tracking status pemilih
  - Tampilan kategori pemilihan di tabel DPT

- **Real-time Analytics (Multi-Chart)**
  - Total DPT terdaftar (akumulasi semua pemilihan)
  - Suara masuk secara live (akumulasi semua pemilihan)
  - Tingkat partisipasi
  - Grafik perolehan suara terpisah untuk setiap pemilihan
  - Visualisasi data per kategori pemilihan

- **Audit Log Security**
  - Log semua aktivitas sistem
  - Timestamp otomatis
  - Track user dan aksi yang dilakukan

- **Ekspor Data**
  - Export hasil ke Excel (.xlsx)
  - Export berita acara ke PDF

### 🗳️ Dashboard Staff TPS
- **Verifikasi Pemilih**
  - Cek NIK dari DPT
  - Validasi status pemilih (belum/sudah memilih)
  - Notifikasi jika NIK tidak valid
  - Pilih agenda pemilihan dari dropdown

- **Bilik Suara Digital**
  - Tampilan kandidat dengan foto
  - Tampilan jabatan/lembaga kandidat
  - Visi & misi kandidat
  - Tombol coblos untuk setiap paslon
  - Konfirmasi sebelum submit

- **Pencoblosan Aman**
  - Validasi NIK sebelum vote
  - Validasi NIK per pemilihan (support multi-election)
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
                       │ HTTP Request (GET/POST)
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
ID | Username | Password | Role | Nama_Petugas | Status
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
ID_Pemilih | ID_Pemilihan | NIK | Nama_Pemilih | RT_RW | Status_Memilih | ID_Staff_Verifikator
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

#### Langkah 8: Update URL di Frontend

1. Copy URL deployment dari Langkah 7
2. Buka file `script/index.html`
3. Cari baris: `const GAS_API_URL = '...';`
4. Ganti URL lama dengan URL deployment baru
5. Push update via CLASP:
```bash
clasp push
clasp deploy
```

#### Langkah 9: Update Wrapper (Root index.html)

1. Buka file `index.html` di root
2. Pastikan iframe src menunjuk ke `script/index.html`
3. Deploy wrapper ke hosting Anda (Vercel, Netlify, GitHub Pages, dll)

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
- Pastikan URL deployment di `GAS_API_URL` sudah benar
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

### Error: Deploy gagal via CLASP
- Pastikan sudah login: `clasp login`
- Pastikan `scriptId` di `.clasp.json` benar
- Pastikan di folder `script/` saat menjalankan command

---

## 📝 Catatan Penting

### URL Deployment Setiap Deploy
Setiap kali deploy baru, URL akan berubah. Pastikan:
1. Copy URL deployment baru
2. Update `GAS_API_URL` di `script/index.html`
3. Push dan deploy ulang

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

1. **LockService**
   - Mencegah race condition saat pencoblosan
   - Timeout 5-10 detik untuk operasi kritis

2. **Validasi NIK Unik**
   - Cek duplikasi NIK per pemilihan (bukan global)
   - 1 NIK dapat terdaftar di beberapa pemilihan berbeda
   - Cek status pemilih sebelum vote

3. **Audit Logging**
   - Log semua aktivitas sistem
   - Track user, timestamp, dan aksi
   - Log tidak bisa dihapus oleh user biasa

4. **Anti-Double Vote**
   - Validasi status pemilih sebelum vote
   - Mencegah double vote pada pemilihan yang SAMA
   - Mengizinkan vote di pemilihan BERBEDA
   - Update status otomatis setelah vote
   - Validasi ganda di backend

5. **Role-Based Access**
   - Admin: Full access (CRUD lengkap)
   - Staff: Hanya verifikasi & pencoblosan

6. **Data Validation**
   - Filter baris kosong/invalid di backend
   - Validasi input form di frontend
   - Error handling dengan try-catch

---

## 📊 Contoh Data

### Struktur Tabel Users
```
ID      | Username  | Password | Role  | Nama_Petugas            | Status
--------|-----------|----------|-------|-------------------------|--------
USR-001 | admin     | admin123 | Admin | Achmad Faris            | Aktif
USR-002 | staff_tps1| staff123 | Staff | Petugas TPS 01          | Aktif
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

### v1.2.0 (Terbaru)
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
