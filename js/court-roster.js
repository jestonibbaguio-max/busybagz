const grid = document.getElementById('court-grid');
const template = document.getElementById('court-template');
const status = document.getElementById('save-status');
const qrImage = document.getElementById('qr-image');
const qrDownload = document.getElementById('qr-download');
const qrEmpty = document.getElementById('qr-empty');
const qrDialog = document.getElementById('qr-dialog');
const qrCode = document.getElementById('qr-code');
const qrCodeError = document.getElementById('qr-code-error');
const qrUpload = document.getElementById('qr-upload');
const qrAlert = document.getElementById('qr-alert');
const qrDialogTitle = document.getElementById('qr-dialog-title');
const qrDialogCopy = document.getElementById('qr-dialog-copy');
let saveTimer;
let isSaving = false;
let qrUpdateCode = '';
let qrAction = 'change';
let courtsReserved = false;

function setStatus(message, state = '') {
  status.textContent = message;
  status.className = `save-status ${state}`;
}

function renderCourts(courts) {
  grid.innerHTML = '';
  courts.forEach((court, courtIndex) => {
    const card = template.content.cloneNode(true);
    card.querySelector('.court-number').textContent = `Court 0${courtIndex + 1}`;
    card.querySelector('h2').textContent = court.name;
    card.querySelector('.reserved-badge').hidden = !courtsReserved;
    const list = card.querySelector('.player-list');
    court.players.forEach((player, playerIndex) => {
      const field = document.createElement('div');
      const safeName = player.name.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
      const playerLocked = courtsReserved || Boolean(player.receipt);
      field.className = `player-field${playerLocked ? ' is-locked' : ''}`;
      field.innerHTML = `<span>${String(playerIndex + 1).padStart(2, '0')}</span><input type="text" maxlength="60" placeholder="Add player name" value="${safeName}"${playerLocked ? ' readonly aria-label="Player name locked"' : ''}><label class="receipt-upload">${player.receipt ? `<a href="${player.receipt}" target="_blank" rel="noopener">Receipt locked</a>` : courtsReserved ? 'Court locked' : 'Upload GCash<input type="file" accept="image/png,image/jpeg,image/webp" aria-label="Upload GCash transaction for player ' + (playerIndex + 1) + '">'}</label>`;
      const input = field.querySelector('input[type="text"]');
      input.addEventListener('input', () => scheduleSave());
      const upload = field.querySelector('input[type="file"]');
      if (upload) upload.addEventListener('change', () => uploadReceipt(upload, court.name, playerIndex + 1, input));
      list.appendChild(field);
    });
    grid.appendChild(card);
  });
}

function getPayload() {
  return [...document.querySelectorAll('.court-card')].map((card) => ({
    name: card.querySelector('h2').textContent,
    players: [...card.querySelectorAll('input[type="text"]')].map((input) => ({ name: input.value.trim() }))
  }));
}

async function loadRoster(showLoading = true) {
  if (isSaving) return;
  if (showLoading) setStatus('Loading roster...');
  const response = await fetch('/api/courts/haniyyah');
  if (!response.ok) throw new Error('Unable to load roster.');
  const data = await response.json();
  courtsReserved = Boolean(data.courtsReserved);
  document.getElementById('lock-courts-button').textContent = courtsReserved ? 'Unlock courts' : 'Lock courts';
  renderCourts(data.courts);
  setStatus(`Updated ${new Intl.DateTimeFormat('en-PH', { hour: 'numeric', minute: '2-digit' }).format(new Date(data.updatedAt))}`, 'is-saved');
}

async function loadQrCode() {
  const response = await fetch('/api/courts/haniyyah/qr');
  if (!response.ok) throw new Error('Unable to load QR code.');
  const data = await response.json();
  if (data.qr) {
    qrImage.src = data.qr;
    qrDownload.href = data.qr;
    qrDownload.download = data.qr.split('/').pop();
    qrDownload.hidden = false;
    qrEmpty.hidden = true;
  } else {
    showQrAlert();
  }
}

function showQrAlert() {
  qrAlert.hidden = false;
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function scheduleSave() {
  clearTimeout(saveTimer);
  setStatus('Saving changes...', 'is-saving');
  saveTimer = setTimeout(saveRoster, 700);
}

async function saveRoster() {
  isSaving = true;
  try {
    const response = await fetch('/api/courts/haniyyah', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ courts: getPayload() }) });
    if (!response.ok) throw new Error('Unable to save roster.');
    const data = await response.json();
    setStatus(`Saved ${new Intl.DateTimeFormat('en-PH', { hour: 'numeric', minute: '2-digit' }).format(new Date(data.updatedAt))}`, 'is-saved');
  } catch {
    setStatus('Could not save. Check the server and try again.');
  } finally {
    isSaving = false;
  }
}

async function uploadReceipt(fileInput, court, slot, nameInput) {
  const file = fileInput.files[0];
  if (!file) return;
  if (!nameInput.value.trim()) {
    fileInput.value = '';
    setStatus('Add a player name before uploading a GCash receipt.');
    return;
  }
  clearTimeout(saveTimer);
  await saveRoster();
  setStatus('Uploading GCash receipt...', 'is-saving');
  const dataUrl = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
  try {
    const response = await fetch('/api/courts/haniyyah/receipt', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ court, slot, dataUrl }) });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message);
    await loadRoster(false);
    setStatus('GCash receipt uploaded. This player entry is now locked.', 'is-saved');
  } catch (error) {
    fileInput.value = '';
    setStatus(error.message || 'Could not upload GCash receipt.');
  }
}

loadRoster().catch(() => setStatus('Could not load the roster. Check the server and refresh.'));
loadQrCode().catch(() => setStatus('Could not load the GCash QR code.'));
setInterval(() => loadRoster(false).catch(() => setStatus('Could not refresh the roster.')), 15000);

function openQrDialog(action) {
  qrAction = action;
  qrCode.value = '';
  qrCodeError.textContent = '';
  qrDialogTitle.textContent = action === 'reset' ? 'Reset all data' : action === 'unlock' ? 'Unlock all courts' : action === 'lock' ? 'Lock all courts' : action === 'empty' ? 'Empty QR code' : 'Enter update code';
  qrDialogCopy.textContent = action === 'reset' ? 'Enter the authorized code to permanently clear all player names, receipts, and GCash QR images.' : action === 'unlock' ? 'Enter the authorized code to make all unpaid court fields available again.' : action === 'lock' ? 'Enter the authorized code to mark every court as reserved and lock all fields.' : action === 'empty' ? 'Enter the authorized code to remove the active GCash QR image.' : 'Enter the authorized code to select a new GCash QR image.';
  qrDialog.hidden = false;
  qrCode.focus();
}

document.getElementById('change-qr-button').addEventListener('click', () => {
  openQrDialog('change');
});

document.getElementById('empty-qr-button').addEventListener('click', () => { openQrDialog('empty'); });

document.getElementById('lock-courts-button').addEventListener('click', () => { openQrDialog(courtsReserved ? 'unlock' : 'lock'); });

document.getElementById('reset-button').addEventListener('click', () => { openQrDialog('reset'); });

document.getElementById('qr-cancel').addEventListener('click', () => { qrDialog.hidden = true; });
document.getElementById('qr-alert-close').addEventListener('click', () => { qrAlert.hidden = true; });

document.getElementById('qr-code-form').addEventListener('submit', (event) => {
  event.preventDefault();
  if (qrCode.value !== '676767') {
    qrCodeError.textContent = 'Incorrect update code.';
    return;
  }
  qrUpdateCode = qrCode.value;
  qrDialog.hidden = true;
  if (qrAction === 'empty') {
    emptyQrCode();
    return;
  }
  if (qrAction === 'reset') {
    resetRoster();
    return;
  }
  if (qrAction === 'lock') {
    setCourtsReserved(true);
    return;
  }
  if (qrAction === 'unlock') {
    setCourtsReserved(false);
    return;
  }
  qrUpload.click();
});

async function setCourtsReserved(reserved) {
  setStatus(reserved ? 'Locking all courts...' : 'Unlocking courts...', 'is-saving');
  try {
    const endpoint = reserved ? '/api/courts/haniyyah/lock' : '/api/courts/haniyyah/unlock';
    const response = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code: qrUpdateCode }) });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message);
    courtsReserved = reserved;
    document.getElementById('lock-courts-button').textContent = reserved ? 'Unlock courts' : 'Lock courts';
    await loadRoster(false);
    setStatus(reserved ? 'All courts are marked reserved.' : 'Courts unlocked. Unpaid fields are available.', 'is-saved');
  } catch (error) {
    setStatus(error.message || 'Could not lock courts.');
  } finally {
    qrUpdateCode = '';
  }
}

function clearQrDisplay() {
  qrImage.removeAttribute('src');
  qrDownload.removeAttribute('href');
  qrDownload.hidden = true;
  qrEmpty.hidden = false;
}

async function emptyQrCode() {
  setStatus('Removing GCash QR...', 'is-saving');
  try {
    const response = await fetch('/api/courts/haniyyah/qr', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code: qrUpdateCode }) });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message);
    clearQrDisplay();
    showQrAlert();
    setStatus('GCash QR emptied.', 'is-saved');
  } catch (error) {
    setStatus(error.message || 'Could not empty GCash QR.');
  } finally {
    qrUpdateCode = '';
  }
}

async function resetRoster() {
  setStatus('Resetting roster...', 'is-saving');
  try {
    const response = await fetch('/api/courts/haniyyah/reset', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code: qrUpdateCode }) });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message);
    clearQrDisplay();
    showQrAlert();
    await loadRoster(false);
    setStatus('Roster, receipts, and QR images have been reset.', 'is-saved');
  } catch (error) {
    setStatus(error.message || 'Could not reset roster.');
  } finally {
    qrUpdateCode = '';
  }
}

qrUpload.addEventListener('change', async () => {
  const file = qrUpload.files[0];
  if (!file) return;
  setStatus('Uploading GCash QR...', 'is-saving');
  try {
    const dataUrl = await readFileAsDataUrl(file);
    const response = await fetch('/api/courts/haniyyah/qr', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code: qrUpdateCode, dataUrl }) });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message);
    qrImage.src = `${data.qr}?updated=${Date.now()}`;
    qrDownload.href = data.qr;
    qrDownload.download = data.qr.split('/').pop();
    qrDownload.hidden = false;
    qrEmpty.hidden = true;
    setStatus('GCash QR updated.', 'is-saved');
  } catch (error) {
    setStatus(error.message || 'Could not update GCash QR.');
  } finally {
    qrUpload.value = '';
    qrUpdateCode = '';
  }
});