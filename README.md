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
│              Project Structure (Repository)              │
│  ┌────────────────────────────────────────────────────┐ │
│  │ index.html (Wrapper/Frame)                         │ │
│  │ - SEO metadata                                     │ │
│  │ - Iframe ke script/index.html                      │ │
│  └────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────┐ │
│  │ script/                                           │ │
│  │ ├── index.html (Frontend E-Voting)                │ │
│  │ ├── Code.js (Backend Google Apps Script)          │ │
│  │ ├── appsscript.json                               │ │
│  │ └── .clasp.json                                  │ │
│  └────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│              Frontend (script/index.html)                │
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

## 📦 Instalasi

### Prasyarat
- Akun Google
- Node.js (untuk CLASP)
- Google Sheets dengan struktur tabel

### Langkah 1: Setup Google Apps Script

1. Buka [Google Apps Script](https://script.google.com/)
2. Buat project baru
3. Copy file `script/Code.js` dan `script/appsscript.json` ke project
4. Setup Google Sheets dengan sheet berikut:
   - `Users` - Data akun admin/staff
   - `Elections` - Data pemilihan
   - `Candidates` - Data kandidat (termasuk kolom Kandidat untuk jabatan)
   - `Voters_DPT` - Data pemilih
   - `Votes` - Data suara
   - `Audit_Logs` - Log aktivitas

### Langkah 2: Install CLASP

```bash
npm install -g @google/clasp
```

### Langkah 3: Clone & Setup Project

```bash
# Clone repository
git clone https://github.com/BotHunting/e-votting.git
cd e-votting

# Masuk ke folder script untuk backend deployment
cd script

# Login ke Google
clasp login

# Clone Apps Script project
clasp clone <SCRIPT_ID>

# Push file ke Apps Script
clasp push
```

### Langkah 4: Deploy sebagai Web App

```bash
# Deploy
clasp deploy
```

Atau via Google Apps Script Console:
1. Klik **Deploy** → **New Deployment**
2. Pilih type: **Web App**
3. Execute as: **Me**
4. Who has access: **Anyone**
5. Klik **Deploy**

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

## 🔒 Keamanan

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
