/**
 * E-Voting Local System Backend (Google Apps Script API)
 */

const SHEET_NAMES = {
  USERS: 'Users',
  ELECTIONS: 'Elections',
  CANDIDATES: 'Candidates',
  VOTERS: 'Voters_DPT',
  VOTES: 'Votes',
  LOGS: 'Audit_Logs'
};

function doGet(e) {
  // 1. Jika dipanggil dari sistem Frontend (membawa parameter action) -> Kembalikan Data JSON
  if (e && e.parameter && e.parameter.action) {
    const action = e.parameter.action;
    let result = { success: false, message: 'Action tidak valid' };
    try {
      switch (action) {
        case 'getInitialData':
          result = getInitialData();
          break;
        case 'getAnalytics':
          result = getAnalytics(e.parameter.id_pemilihan);
          break;
        case 'getAuditLogs':
          result = getAuditLogs();
          break;
        default:
          result = { success: false, message: 'Endpoint GET tidak ditemukan' };
      }
    } catch (err) {
      result = { success: false, message: err.toString() };
    }
    return responseJSON(result);
  }

  // 2. Jika diakses langsung via browser tanpa parameter -> Tampilkan Halaman Web UI (index.html)
  return HtmlService.createHtmlOutputFromFile('index')
    .setTitle('Sistem E-Voting Pemilihan Lokal')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function doPost(e) {
  let requestData = {};
  try {
    requestData = JSON.parse(e.postData.contents);
  } catch (err) {
    return responseJSON({ success: false, message: 'Payload JSON tidak valid' });
  }

  const action = requestData.action;
  let result = { success: false, message: 'Action tidak valid' };

  try {
    switch (action) {
      case 'login':
        result = handleLogin(requestData.payload);
        break;
      case 'createElection':
        result = createElection(requestData.payload);
        break;
      case 'addCandidate':
        result = addCandidate(requestData.payload);
        break;
      case 'updateCandidate':
        result = updateCandidate(requestData.payload);
        break;
      case 'deleteCandidate':
        result = deleteCandidate(requestData.payload);
        break;
      case 'addVoter':
        result = addVoter(requestData.payload);
        break;
      case 'deleteVoter':
        result = deleteVoter(requestData.payload);
        break;
      case 'verifyAndSubmitVote':
        result = verifyAndSubmitVote(requestData.payload);
        break;
      default:
        result = { success: false, message: 'Endpoint POST tidak ditemukan' };
    }
  } catch (err) {
    result = { success: false, message: err.toString() };
  }

  return responseJSON(result);
}

// ==================== HELPER FUNCTIONS ====================

function responseJSON(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function getSheetData(sheetName) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) return [];
  const headers = data[0];
  return data.slice(1)
    .filter(row => {
      // Filter baris kosong atau invalid (tanpa ID utama)
      if (sheetName === SHEET_NAMES.CANDIDATES) {
        const idIndex = headers.indexOf('ID_Kandidat');
        const noUrutIndex = headers.indexOf('No_Urut');
        return row[idIndex] && row[noUrutIndex];
      }
      if (sheetName === SHEET_NAMES.VOTERS) {
        const idIndex = headers.indexOf('ID_Pemilih');
        const nikIndex = headers.indexOf('NIK');
        return row[idIndex] && row[nikIndex];
      }
      if (sheetName === SHEET_NAMES.ELECTIONS) {
        const idIndex = headers.indexOf('ID_Pemilihan');
        return row[idIndex];
      }
      if (sheetName === SHEET_NAMES.USERS) {
        const idIndex = headers.indexOf('ID');
        return row[idIndex];
      }
      return true;
    })
    .map(row => {
      let obj = {};
      headers.forEach((h, i) => obj[h] = row[i]);
      return obj;
    });
}

function writeAuditLog(accountId, role, actionType, description, ipUserAgent = 'Client-Browser') {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAMES.LOGS);
  const timestamp = new Date().toISOString();
  sheet.appendRow([timestamp, accountId, role, actionType, description, ipUserAgent]);
}

// ==================== API HANDLERS ====================

function handleLogin(payload) {
  const { username, password } = payload;
  const users = getSheetData(SHEET_NAMES.USERS);
  const user = users.find(u => String(u.Username).toLowerCase() === String(username).toLowerCase() && String(u.Password) === String(password));

  if (user) {
    if (user.Status !== 'Aktif') {
      return { success: false, message: 'Akun Anda dinonaktifkan.' };
    }
    writeAuditLog(user.ID, user.Role, 'LOGIN', `User ${user.Username} berhasil login`);
    return {
      success: true,
      user: {
        id: user.ID,
        username: user.Username,
        role: user.Role,
        nama: user.Nama_Petugas
      }
    };
  }
  return { success: false, message: 'Username atau Password salah!' };
}

function getInitialData() {
  return {
    success: true,
    elections: getSheetData(SHEET_NAMES.ELECTIONS),
    candidates: getSheetData(SHEET_NAMES.CANDIDATES),
    voters: getSheetData(SHEET_NAMES.VOTERS)
  };
}

function createElection(payload) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAMES.ELECTIONS);
  const id = 'ELC-' + Date.now();
  sheet.appendRow([id, payload.kategori, payload.tanggal, 'Aktif']);
  writeAuditLog(payload.user_id, payload.role, 'CREATE_ELECTION', `Membuat pemilihan kategori: ${payload.kategori}`);
  return { success: true, message: 'Pemilihan baru berhasil dibuat' };
}

function addCandidate(payload) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAMES.CANDIDATES);
  const id = 'CND-' + Date.now();
  sheet.appendRow([id, payload.id_pemilihan, payload.no_urut, payload.nama, payload.foto_url, payload.visi_misi, payload.kandidat_jabatan || '']);
  writeAuditLog(payload.user_id, payload.role, 'ADD_CANDIDATE', `Menambahkan paslon No ${payload.no_urut}: ${payload.nama}`);
  return { success: true, message: 'Kandidat berhasil ditambahkan' };
}

/**
 * Menambahkan DPT Baru dengan Validasi Cegah NIK Ganda
 */
function addVoter(payload) {
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(5000)) {
    return { success: false, message: 'Sistem sedang sibuk. Silakan coba beberapa saat lagi.' };
  }

  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(SHEET_NAMES.VOTERS);
    const data = sheet.getDataRange().getValues();

    if (data.length > 1) {
      const headers = data[0];
      const nikIndex = headers.indexOf('NIK');
      const electionIndex = headers.indexOf('ID_Pemilihan');

      const inputNik = String(payload.nik).trim();
      const inputElectionId = String(payload.id_pemilihan).trim();

      // Cek apakah NIK sudah terdaftar pada pemilihan yang sama
      for (let i = 1; i < data.length; i++) {
        const existingNik = String(data[i][nikIndex]).trim();
        const existingElection = String(data[i][electionIndex]).trim();

        if (existingNik === inputNik && existingElection === inputElectionId) {
          return { 
            success: false, 
            message: `GAGAL: NIK ${inputNik} sudah terdaftar dalam DPT pada pemilihan ini!` 
          };
        }
      }
    }

    const id = 'VTR-' + Date.now();
    sheet.appendRow([
      id, 
      payload.id_pemilihan, 
      String(payload.nik).trim(), 
      payload.nama, 
      payload.rt_rw, 
      'Belum', 
      ''
    ]);

    writeAuditLog(
      payload.user_id, 
      payload.role, 
      'ADD_VOTER', 
      `Menambahkan DPT Baru NIK: ${payload.nik} (${payload.nama})`
    );

    return { success: true, message: 'Data DPT berhasil disimpan!' };

  } catch (err) {
    return { success: false, message: 'Terjadi kesalahan sistem: ' + err.toString() };
  } finally {
    lock.releaseLock();
  }
}

/**
 * Transaksi Pencoblosan Aman (LockService & Anti-Double Vote)
 */
function verifyAndSubmitVote(payload) {
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(10000)) {
    return { success: false, message: 'Sistem sedang sibuk memproses suara lain. Silakan coba lagi.' };
  }

  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const votersSheet = ss.getSheetByName(SHEET_NAMES.VOTERS);
    const votesSheet = ss.getSheetByName(SHEET_NAMES.VOTES);

    const votersData = votersSheet.getDataRange().getValues();
    const headers = votersData[0];
    const nikIndex = headers.indexOf('NIK');
    const statusIndex = headers.indexOf('Status_Memilih');
    const staffIndex = headers.indexOf('ID_Staff_Verifikator');
    const electionIndex = headers.indexOf('ID_Pemilihan');

    let rowIndex = -1;
    for (let i = 1; i < votersData.length; i++) {
      if (String(votersData[i][nikIndex]) === String(payload.nik) && String(votersData[i][electionIndex]) === String(payload.id_pemilihan)) {
        rowIndex = i + 1;
        if (votersData[i][statusIndex] === 'Sudah') {
          return { success: false, message: 'PERINGATAN: NIK ini sudah menggunakan hak pilihnya!' };
        }
        break;
      }
    }

    if (rowIndex === -1) {
      return { success: false, message: 'NIK tidak terdaftar dalam DPT!' };
    }

    votersSheet.getRange(rowIndex, statusIndex + 1).setValue('Sudah');
    votersSheet.getRange(rowIndex, staffIndex + 1).setValue(payload.staff_id);

    const voteId = 'VOT-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
    const timestamp = new Date().toISOString();
    votesSheet.appendRow([voteId, payload.id_pemilihan, payload.id_kandidat, timestamp]);

    writeAuditLog(payload.staff_id, 'Staff', 'SUBMIT_VOTE', `Pencoblosan berhasil difasilitasi untuk Pemilihan ${payload.id_pemilihan}`);

    return { success: true, message: 'Suara berhasil disimpan secara sah!' };

  } catch (err) {
    return { success: false, message: 'Terjadi kesalahan sistem: ' + err.toString() };
  } finally {
    lock.releaseLock();
  }
}

function getAnalytics(idPemilihan) {
  const votes = getSheetData(SHEET_NAMES.VOTES).filter(v => String(v.ID_Pemilihan) === String(idPemilihan));
  const candidates = getSheetData(SHEET_NAMES.CANDIDATES).filter(c => String(c.ID_Pemilihan) === String(idPemilihan));
  const voters = getSheetData(SHEET_NAMES.VOTERS).filter(v => String(v.ID_Pemilihan) === String(idPemilihan));

  const totalDPT = voters.length;
  const totalVotesCast = votes.length;
  const participationRate = totalDPT > 0 ? ((totalVotesCast / totalDPT) * 100).toFixed(2) : 0;

  const results = candidates.map(c => {
    const candidateVotes = votes.filter(v => String(v.ID_Kandidat) === String(c.ID_Kandidat)).length;
    return {
      no_urut: c.No_Urut,
      nama: c.Nama_Kandidat,
      total_suara: candidateVotes,
      persentase: totalVotesCast > 0 ? ((candidateVotes / totalVotesCast) * 100).toFixed(2) : 0
    };
  });

  return {
    success: true,
    summary: {
      totalDPT,
      totalVotesCast,
      participationRate: participationRate + '%'
    },
    results
  };
}

function getAuditLogs() {
  const logs = getSheetData(SHEET_NAMES.LOGS);
  return { success: true, logs: logs.slice(-50).reverse() };
}

/**
 * CRUD CANDIDATES (UPDATE & DELETE)
 */
function updateCandidate(payload) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_NAMES.CANDIDATES);
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const idIndex = headers.indexOf('ID_Kandidat');

  for (let i = 1; i < data.length; i++) {
    if (String(data[i][idIndex]) === String(payload.id_kandidat)) {
      sheet.getRange(i + 1, headers.indexOf('No_Urut') + 1).setValue(payload.no_urut);
      sheet.getRange(i + 1, headers.indexOf('Nama_Kandidat') + 1).setValue(payload.nama);
      sheet.getRange(i + 1, headers.indexOf('Foto_URL') + 1).setValue(payload.foto_url);
      sheet.getRange(i + 1, headers.indexOf('Visi_Misi') + 1).setValue(payload.visi_misi);
      sheet.getRange(i + 1, headers.indexOf('Kandidat') + 1).setValue(payload.kandidat_jabatan || '');

      writeAuditLog(payload.user_id, payload.role, 'UPDATE_CANDIDATE', `Memperbarui Kandidat ID: ${payload.id_kandidat}`);
      return { success: true, message: 'Data Paslon berhasil diperbarui!' };
    }
  }
  return { success: false, message: 'Kandidat tidak ditemukan!' };
}

function deleteCandidate(payload) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_NAMES.CANDIDATES);
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const idIndex = headers.indexOf('ID_Kandidat');

  for (let i = 1; i < data.length; i++) {
    if (String(data[i][idIndex]) === String(payload.id_kandidat)) {
      sheet.deleteRow(i + 1);
      writeAuditLog(payload.user_id, payload.role, 'DELETE_CANDIDATE', `Menghapus Paslon ID: ${payload.id_kandidat}`);
      return { success: true, message: 'Kandidat berhasil dihapus!' };
    }
  }
  return { success: false, message: 'Kandidat tidak ditemukan!' };
}

/**
 * CRUD VOTERS (DELETE)
 */
function deleteVoter(payload) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_NAMES.VOTERS);
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const idIndex = headers.indexOf('ID_Pemilih');

  for (let i = 1; i < data.length; i++) {
    if (String(data[i][idIndex]) === String(payload.id_pemilih)) {
      sheet.deleteRow(i + 1);
      writeAuditLog(payload.user_id, payload.role, 'DELETE_VOTER', `Menghapus DPT ID: ${payload.id_pemilih}`);
      return { success: true, message: 'Data DPT berhasil dihapus!' };
    }
  }
  return { success: false, message: 'Data DPT tidak ditemukan!' };
}

/**
 * Fungsi Seed / Inisialisasi Data Awal (Run Once untuk Testing)
 */
function seedInitialData() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  const usersSheet = getOrCreateSheet(ss, SHEET_NAMES.USERS);
  usersSheet.clear();
  usersSheet.appendRow(['ID', 'Username', 'Password', 'Role', 'Nama_Petugas', 'Status']);
  usersSheet.appendRow(['USR-001', 'admin', 'admin123', 'Admin', 'Achmad Faris (Panitia Core)', 'Aktif']);
  usersSheet.appendRow(['USR-002', 'staff_tps1', 'staff123', 'Staff', 'Petugas TPS 01 (Desa)', 'Aktif']);
  usersSheet.appendRow(['USR-003', 'staff_tps2', 'staff123', 'Staff', 'Petugas TPS 02 (Desa)', 'Aktif']);

  const electionsSheet = getOrCreateSheet(ss, SHEET_NAMES.ELECTIONS);
  electionsSheet.clear();
  electionsSheet.appendRow(['ID_Pemilihan', 'Kategori', 'Tanggal', 'Status']);
  electionsSheet.appendRow(['ELC-2026-001', 'Pemilihan Kepala Desa / Lurah', '2026-11-10', 'Aktif']);
  electionsSheet.appendRow(['ELC-2026-002', 'Pemilihan Ketua RW 03', '2026-11-15', 'Draft']);

  const candidatesSheet = getOrCreateSheet(ss, SHEET_NAMES.CANDIDATES);
  candidatesSheet.clear();
  candidatesSheet.appendRow(['ID_Kandidat', 'ID_Pemilihan', 'No_Urut', 'Nama_Kandidat', 'Foto_URL', 'Visi_Misi', 'Kandidat']);
  candidatesSheet.appendRow([
    'CND-001',
    'ELC-2026-001',
    1,
    'H. Ahmad Dahlan, S.T.',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300',
    'Visi: Mewujudkan Desa Digital Mandiri dan Transparan.\nMisi: Digitalisasi pelayanan umum dan peningkatan UMKM.',
    'Kepala Desa'
  ]);
  candidatesSheet.appendRow([
    'CND-002',
    'ELC-2026-001',
    2,
    'Budi Santoso, S.Pd.',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300',
    'Visi: Desa Sejahtera, Gotong Royong, dan Berkelanjutan.\nMisi: Peningkatan sarana olahraga & ruang hijau.',
    'Kepala Desa'
  ]);
  candidatesSheet.appendRow([
    'CND-003',
    'ELC-2026-001',
    3,
    'Siti Nurhaliza, S.E.',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300',
    'Visi: Pemberdayaan Perempuan dan Ekonomi Kreatif Desa.\nMisi: Pelatihan keterampilan dan bantuan modal usaha.',
    'Kepala Desa'
  ]);

  const votersSheet = getOrCreateSheet(ss, SHEET_NAMES.VOTERS);
  votersSheet.clear();
  votersSheet.appendRow(['ID_Pemilih', 'ID_Pemilihan', 'NIK', 'Nama_Pemilih', 'RT_RW', 'Status_Memilih', 'ID_Staff_Verifikator']);
  votersSheet.appendRow(['VTR-001', 'ELC-2026-001', '3525011307950001', 'Muhammad Alvarisi', 'RT 01 / RW 03', 'Belum', '']);
  votersSheet.appendRow(['VTR-002', 'ELC-2026-001', '3525011307950002', 'Arifah Zain', 'RT 01 / RW 03', 'Belum', '']);
  votersSheet.appendRow(['VTR-003', 'ELC-2026-001', '3525011307950003', 'Mohammad Sahri', 'RT 02 / RW 03', 'Belum', '']);
  votersSheet.appendRow(['VTR-004', 'ELC-2026-001', '3525011307950004', 'Deni Estu Prasetyo', 'RT 02 / RW 03', 'Belum', '']);
  votersSheet.appendRow(['VTR-005', 'ELC-2026-001', '3525011307950005', 'Intan Vindia Kumala', 'RT 03 / RW 03', 'Belum', '']);

  const votesSheet = getOrCreateSheet(ss, SHEET_NAMES.VOTES);
  votesSheet.clear();
  votesSheet.appendRow(['ID_Vote', 'ID_Pemilihan', 'ID_Kandidat', 'Waktu_Mencoblos']);

  const logsSheet = getOrCreateSheet(ss, SHEET_NAMES.LOGS);
  logsSheet.clear();
  logsSheet.appendRow(['Timestamp', 'Account_ID', 'Role', 'Action_Type', 'Description', 'IP_UserAgent']);
  
  writeAuditLog('SYSTEM', 'System', 'SEED_DATA', 'Inisialisasi header dan dummy data awal berhasil dilakukan');

  Logger.log('Inisialisasi Data Dummy Berhasil!');
}

function getOrCreateSheet(ss, sheetName) {
  let sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
  }
  return sheet;
}