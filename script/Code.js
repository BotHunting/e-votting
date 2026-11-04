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
    return responseJSON(handleApiRequest(
      e.parameter.action,
      { id_pemilihan: e.parameter.id_pemilihan },
      'GET'
    ));
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

  return responseJSON(handleApiRequest(requestData.action, requestData.payload, 'POST'));
}

function handleApiRequest(action, payload, method) {
  const result = dispatchApiRequest(action, payload, method);
  // Spreadsheet dates must be converted before google.script.run can return the data.
  return JSON.parse(JSON.stringify(result));
}

function dispatchApiRequest(action, payload, method) {
  try {
    if (method === 'GET') {
      switch (action) {
        case 'getInitialData':
          return getInitialData();
        case 'getAnalytics':
          return getAnalytics(payload && payload.id_pemilihan);
        case 'getAuditLogs':
          return getAuditLogs();
        default:
          return { success: false, message: 'Endpoint GET tidak ditemukan' };
      }
    }

    switch (action) {
      case 'login':
        return handleLogin(payload);
      case 'createElection':
        return createElection(payload);
      case 'addCandidate':
        return addCandidate(payload);
      case 'updateCandidate':
        return updateCandidate(payload);
      case 'deleteCandidate':
        return deleteCandidate(payload);
      case 'addVoter':
        return addVoter(payload);
      case 'updateVoter':
        return updateVoter(payload);
      case 'deleteVoter':
        return deleteVoter(payload);
      case 'assignVoterToElection':
        return assignVoterToElection(payload);
      case 'verifyAndSubmitVote':
        return verifyAndSubmitVote(payload);
      default:
        return { success: false, message: 'Endpoint POST tidak ditemukan' };
    }
  } catch (err) {
    return { success: false, message: err.toString() };
  }
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

function getVoterColumnIndexes(headers) {
  if (!headers || !headers.length) {
    throw new Error('Sheet Voters_DPT belum memiliki header kolom.');
  }
  const indexes = {
    id: headers.indexOf('ID_Pemilih'),
    election: headers.indexOf('ID_Pemilihan'),
    nik: headers.indexOf('NIK'),
    name: headers.indexOf('Nama_Pemilih'),
    rtRw: headers.indexOf('RT_RW'),
    status: headers.indexOf('Status_Memilih'),
    staff: headers.indexOf('ID_Staff_Verifikator')
  };
  if (Object.values(indexes).some(index => index < 0)) {
    throw new Error('Kolom wajib pada sheet Voters_DPT tidak lengkap.');
  }
  return indexes;
}

function normalizeAccountRole(role) {
  const normalizedRole = String(role || '').trim().toLowerCase();
  if (normalizedRole === 'admin') return 'Admin';
  if (normalizedRole === 'staff') return 'Staff';
  return '';
}

// ==================== API HANDLERS ====================

function handleLogin(payload) {
  if (!payload || !String(payload.username || '').trim() || !String(payload.password || '')) {
    return { success: false, message: 'Username dan password wajib diisi.' };
  }
  const { username, password } = payload;
  const users = getSheetData(SHEET_NAMES.USERS);
  const user = users.find(u => String(u.Username).toLowerCase() === String(username).toLowerCase() && String(u.Password) === String(password));

  if (user) {
    if (String(user.Status || '').trim().toLowerCase() !== 'aktif') {
      return { success: false, message: 'Akun Anda dinonaktifkan.' };
    }
    const role = normalizeAccountRole(user.Role);
    if (!role) {
      return { success: false, message: 'Role akun tidak dikenali. Hubungi administrator untuk memperbaiki data akun.' };
    }
    writeAuditLog(user.ID, role, 'LOGIN', `User ${user.Username} berhasil login`);
    return {
      success: true,
      user: {
        id: user.ID,
        username: user.Username,
        role,
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
    const indexes = getVoterColumnIndexes(data[0]);
    const inputNik = String(payload.nik || '').trim();
    const inputElectionId = String(payload.id_pemilihan || '').trim();
    if (!inputNik || !inputElectionId || !String(payload.nama || '').trim() || !String(payload.rt_rw || '').trim()) {
      return { success: false, message: 'NIK, nama, RT/RW, dan pemilihan wajib diisi.' };
    }
    if (!voterElectionExists(inputElectionId)) {
      return { success: false, message: 'Pemilihan tidak ditemukan.' };
    }

    for (let i = 1; i < data.length; i++) {
      if (String(data[i][indexes.nik]).trim() === inputNik &&
          String(data[i][indexes.election]).trim() === inputElectionId) {
        return { success: false, message: 'NIK sudah terdaftar di pemilihan ini' };
      }
    }

    const id = 'VTR-' + Date.now();
    const row = Array(data[0].length).fill('');
    row[indexes.id] = id;
    row[indexes.election] = inputElectionId;
    row[indexes.nik] = inputNik;
    row[indexes.name] = String(payload.nama).trim();
    row[indexes.rtRw] = String(payload.rt_rw).trim();
    row[indexes.status] = 'Belum';
    row[indexes.staff] = '';
    const newRowNumber = sheet.getLastRow() + 1;
    sheet.getRange(newRowNumber, 1, 1, row.length).setValues([row]);
    sheet.getRange(newRowNumber, indexes.nik + 1).setNumberFormat('@').setValue(inputNik);

    writeAuditLog(
      payload.user_id, 
      payload.role, 
      'ADD_VOTER', 
      `Menambahkan DPT Baru NIK: ${inputNik} (${payload.nama})`
    );

    return { success: true, message: 'Data DPT berhasil disimpan!' };

  } catch (err) {
    return { success: false, message: 'Gagal menambahkan DPT: ' + err.toString() };
  } finally {
    lock.releaseLock();
  }
}

function updateVoter(payload) {
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(5000)) {
    return { success: false, message: 'Sistem sedang sibuk. Silakan coba beberapa saat lagi.' };
  }

  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAMES.VOTERS);
    const data = sheet.getDataRange().getValues();
    const indexes = getVoterColumnIndexes(data[0]);
    const id = String(payload.id_pemilih || '').trim();
    const nik = String(payload.nik || '').trim();
    const electionId = String(payload.id_pemilihan || '').trim();
    const name = String(payload.nama || '').trim();
    const rtRw = String(payload.rt_rw || '').trim();
    if (!id || !nik || !electionId || !name || !rtRw) {
      return { success: false, message: 'NIK, nama, RT/RW, dan pemilihan wajib diisi.' };
    }

    const rowIndex = data.findIndex((row, index) => index > 0 && String(row[indexes.id]) === id);
    if (rowIndex < 1) return { success: false, message: 'Data DPT tidak ditemukan!' };
    if (!voterElectionExists(electionId)) {
      return { success: false, message: 'Pemilihan tidak ditemukan.' };
    }
    if (String(data[rowIndex][indexes.election]) !== electionId &&
        String(data[rowIndex][indexes.status]) === 'Sudah') {
      return { success: false, message: 'Hak pilih yang sudah digunakan tidak dapat dipindahkan ke pemilihan lain.' };
    }

    const duplicate = data.some((row, index) =>
      index > 0 && index !== rowIndex &&
      String(row[indexes.nik]).trim() === nik &&
      String(row[indexes.election]).trim() === electionId
    );
    if (duplicate) return { success: false, message: 'NIK sudah terdaftar di pemilihan ini' };

    const sheetRow = rowIndex + 1;
    sheet.getRange(sheetRow, indexes.election + 1).setValue(electionId);
    sheet.getRange(sheetRow, indexes.nik + 1).setNumberFormat('@').setValue(nik);
    sheet.getRange(sheetRow, indexes.name + 1).setValue(name);
    sheet.getRange(sheetRow, indexes.rtRw + 1).setValue(rtRw);
    if (String(data[rowIndex][indexes.election]) !== electionId) {
      sheet.getRange(sheetRow, indexes.status + 1).setValue('Belum');
      sheet.getRange(sheetRow, indexes.staff + 1).setValue('');
    }
    writeAuditLog(payload.user_id, payload.role, 'UPDATE_VOTER', `Memperbarui DPT ID: ${id}`);
    return { success: true, message: 'Data DPT berhasil diperbarui!' };
  } catch (err) {
    return { success: false, message: 'Gagal memperbarui DPT: ' + err.toString() };
  } finally {
    lock.releaseLock();
  }
}

function assignVoterToElection(payload) {
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(5000)) {
    return { success: false, message: 'Sistem sedang sibuk. Silakan coba beberapa saat lagi.' };
  }

  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(SHEET_NAMES.VOTERS);
    const data = sheet.getDataRange().getValues();
    const indexes = getVoterColumnIndexes(data[0]);
    const nik = String(payload.nik || '').trim();
    const electionId = String(payload.id_pemilihan_baru || '').trim();
    if (!nik || !electionId) {
      return { success: false, message: 'NIK dan pemilihan baru wajib diisi.' };
    }

    const sourceRow = data.find((row, index) =>
      index > 0 && String(row[indexes.nik]).trim() === nik
    );
    if (!sourceRow) return { success: false, message: 'NIK tidak ditemukan pada DPT.' };

    if (!voterElectionExists(electionId)) return { success: false, message: 'Pemilihan tidak ditemukan.' };

    const duplicate = data.some((row, index) =>
      index > 0 &&
      String(row[indexes.nik]).trim() === nik &&
      String(row[indexes.election]).trim() === electionId
    );
    if (duplicate) return { success: false, message: 'NIK sudah terdaftar di pemilihan ini' };

    const newRow = Array(data[0].length).fill('');
    newRow[indexes.id] = 'VTR-' + Date.now();
    newRow[indexes.election] = electionId;
    newRow[indexes.nik] = nik;
    newRow[indexes.name] = sourceRow[indexes.name];
    newRow[indexes.rtRw] = sourceRow[indexes.rtRw];
    newRow[indexes.status] = 'Belum';
    newRow[indexes.staff] = '';
    const newRowNumber = sheet.getLastRow() + 1;
    sheet.getRange(newRowNumber, 1, 1, newRow.length).setValues([newRow]);
    sheet.getRange(newRowNumber, indexes.nik + 1).setNumberFormat('@').setValue(nik);
    writeAuditLog(payload.user_id, payload.role, 'ASSIGN_VOTER', `Mendaftarkan NIK ${nik} ke pemilihan ${electionId}`);
    return { success: true, message: 'Hak pilih berhasil ditambahkan ke pemilihan baru!' };
  } catch (err) {
    return { success: false, message: 'Gagal menambahkan hak pilih: ' + err.toString() };
  } finally {
    lock.releaseLock();
  }
}

function voterElectionExists(electionId) {
  return getSheetData(SHEET_NAMES.ELECTIONS)
    .some(election => String(election.ID_Pemilihan) === String(electionId));
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
 * CRUD VOTERS
 */
function deleteVoter(payload) {
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(5000)) {
    return { success: false, message: 'Sistem sedang sibuk. Silakan coba beberapa saat lagi.' };
  }

  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAMES.VOTERS);
    const data = sheet.getDataRange().getValues();
    const indexes = getVoterColumnIndexes(data[0]);
    const id = String(payload.id_pemilih || '').trim();
    const rowIndex = data.findIndex((row, index) => index > 0 && String(row[indexes.id]) === id);
    if (rowIndex < 1) return { success: false, message: 'Data DPT tidak ditemukan!' };

    sheet.deleteRow(rowIndex + 1);
    writeAuditLog(payload.user_id, payload.role, 'DELETE_VOTER', `Menghapus DPT ID: ${id}`);
    return { success: true, message: 'Data DPT berhasil dihapus!' };
  } catch (err) {
    return { success: false, message: 'Gagal menghapus DPT: ' + err.toString() };
  } finally {
    lock.releaseLock();
  }
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
  candidatesSheet.appendRow(['ID_Kandidat', 'ID_Pemilihan', 'No_Urut', 'Nama_Kandidat', 'Foto_URL', 'Visi_Misi']);
  candidatesSheet.appendRow([
    'CND-001',
    'ELC-2026-001',
    1,
    'H. Ahmad Dahlan, S.T.',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300',
    'Visi: Mewujudkan Desa Digital Mandiri dan Transparan.\nMisi: Digitalisasi pelayanan umum dan peningkatan UMKM.'
  ]);
  candidatesSheet.appendRow([
    'CND-002',
    'ELC-2026-001',
    2,
    'Budi Santoso, S.Pd.',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300',
    'Visi: Desa Sejahtera, Gotong Royong, dan Berkelanjutan.\nMisi: Peningkatan sarana olahraga & ruang hijau.'
  ]);
  candidatesSheet.appendRow([
    'CND-003',
    'ELC-2026-001',
    3,
    'Siti Nurhaliza, S.E.',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300',
    'Visi: Pemberdayaan Perempuan dan Ekonomi Kreatif Desa.\nMisi: Pelatihan keterampilan dan bantuan modal usaha.'
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