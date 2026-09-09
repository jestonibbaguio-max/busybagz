const http = require('http');
const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const port = process.env.PORT || 3000;
const dataDir = path.join(rootDir, 'data');
const reviewerCsvPath = path.join(dataDir, 'ecommerce-cloud.csv');
const reviewerResultsCsvPath = path.join(dataDir, 'reviewer-results.csv');
const haniyyahCourtsCsvPath = path.join(dataDir, 'court-haniyyah.csv');
const haniyyahReceiptsDir = path.join(rootDir, 'uploads', 'haniyyah-receipts');
const haniyyahQrDir = path.join(rootDir, 'uploads', 'haniyyah-qr');
const haniyyahQrConfigPath = path.join(dataDir, 'court-haniyyah-qr.json');

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.csv': 'text/csv; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.pdf': 'application/pdf'
};

function ensureDataFiles() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  if (!fs.existsSync(reviewerCsvPath)) {
    fs.writeFileSync(reviewerCsvPath, 'id,question,answer,option1,option2,option3,option4,correctIndex\n');
  }

  if (!fs.existsSync(reviewerResultsCsvPath)) {
    fs.writeFileSync(reviewerResultsCsvPath, 'id,date,reviewerName,documentName,documentType,status,rating,summary,tags,pdfText\n');
  }
}

function csvEscape(value) {
  const safeValue = value === null || value === undefined ? '' : String(value);
  return `"${safeValue.replace(/"/g, '""')}"`;
}

function parseCsvLine(line) {
  const values = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];

    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      values.push(current);
      current = '';
    } else {
      current += char;
    }
  }

  values.push(current);
  return values;
}

function readReviews() {
  ensureDataFiles();
  const content = fs.readFileSync(reviewerResultsCsvPath, 'utf8').trim();

  if (!content) {
    return [];
  }

  const lines = content.split(/\r?\n/).filter(Boolean);
  if (lines.length < 2) {
    return [];
  }

  const headers = parseCsvLine(lines[0]);
  return lines.slice(1).map((line) => {
    const values = parseCsvLine(line);
    const record = {};

    headers.forEach((header, index) => {
      record[header] = values[index] || '';
    });

    return record;
  });
}

function readQuestionBank() {
  ensureDataFiles();
  const content = fs.readFileSync(reviewerCsvPath, 'utf8').trim();

  if (!content) {
    return [];
  }

  const lines = content.split(/\r?\n/).filter(Boolean);
  if (lines.length < 2) {
    return [];
  }

  const headers = parseCsvLine(lines[0]);

  return lines.slice(1).map((line) => {
    const values = parseCsvLine(line);
    const record = {};

    headers.forEach((header, index) => {
      record[header] = values[index] || '';
    });

    const parsedOptions = [record.option1, record.option2, record.option3, record.option4]
      .map((option) => option ? option.trim() : '')
      .filter(Boolean);
    const options = parsedOptions.length > 0
      ? parsedOptions
      : (record.answer ? [record.answer.trim()] : []);

    return {
      id: Number(record.id) || 0,
      prompt: record.question || '',
      options,
      correctIndex: Number(record.correctIndex ?? 0),
      explanation: record.answer || ''
    };
  }).filter((question) => question.prompt && question.options.length > 0);
}

function writeReviews(reviews) {
  ensureDataFiles();
  const headers = ['id', 'date', 'reviewerName', 'documentName', 'documentType', 'status', 'rating', 'summary', 'tags', 'pdfText'];
  const csvRows = reviews.map((review) => headers.map((header) => csvEscape(review[header] ?? '')).join(','));
  const csvContent = [headers.join(','), ...csvRows].join('\n') + '\n';
  fs.writeFileSync(reviewerResultsCsvPath, csvContent, 'utf8');
}

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(payload));
}

function handleReviewerApi(req, res) {
  if (req.method === 'GET') {
    const reviews = readReviews().sort((a, b) => Number(b.id) - Number(a.id));
    sendJson(res, 200, reviews);
    return;
  }

  if (req.method === 'POST') {
    let body = '';

    req.on('data', (chunk) => {
      body += chunk;
    });

    req.on('end', () => {
      try {
        const payload = JSON.parse(body || '{}');
        const sanitized = {
          id: String(Date.now()),
          date: new Date().toISOString(),
          reviewerName: payload.reviewerName || 'Anonymous reviewer',
          documentName: payload.documentName || 'Untitled document',
          documentType: payload.documentType || 'Review',
          status: payload.status || 'In review',
          rating: String(payload.rating ?? 0),
          summary: payload.summary || '',
          tags: payload.tags || '',
          pdfText: payload.pdfText || ''
        };

        const reviews = readReviews();
        reviews.unshift(sanitized);
        writeReviews(reviews);
        sendJson(res, 201, { success: true, record: sanitized });
      } catch (error) {
        sendJson(res, 400, { success: false, message: 'Invalid reviewer payload.' });
      }
    });

    return;
  }

  sendJson(res, 405, { success: false, message: 'Method not allowed.' });
}

function handleQuestionBankApi(req, res) {
  if (req.method !== 'GET') {
    sendJson(res, 405, { success: false, message: 'Method not allowed.' });
    return;
  }

  sendJson(res, 200, { success: true, questions: readQuestionBank() });
}

function readHaniyyahCourts() {
  const courtNames = ['Court 1', 'Court 2', 'Court 3'];
  if (!fs.existsSync(haniyyahCourtsCsvPath)) {
    const rows = courtNames.flatMap((court) => Array.from({ length: 8 }, (_, index) => `${court},${index + 1},,`));
    fs.writeFileSync(haniyyahCourtsCsvPath, `court,slot,name,updatedAt\n${rows.join('\n')}\n`, 'utf8');
  }
  const lines = fs.readFileSync(haniyyahCourtsCsvPath, 'utf8').trim().split(/\r?\n/).slice(1);
  const records = lines.map(parseCsvLine).map(([court, slot, name, updatedAt, receipt]) => ({ court, slot: Number(slot), name, updatedAt, receipt: receipt || '' }));
  return courtNames.map((name) => ({ name, players: Array.from({ length: 8 }, (_, index) => {
    const record = records.find((entry) => entry.court === name && entry.slot === index + 1);
    return { name: record?.name || '', receipt: record?.receipt || '' };
  }) }));
}

function getHaniyyahCourtRecords() {
  const lines = fs.readFileSync(haniyyahCourtsCsvPath, 'utf8').trim().split(/\r?\n/).slice(1);
  return lines.map(parseCsvLine).map(([court, slot, name, updatedAt, receipt]) => ({ court, slot: Number(slot), name, updatedAt, receipt: receipt || '' }));
}

function writeHaniyyahCourtRecords(records) {
  const rows = records.map((record) => [record.court, record.slot, record.name, record.updatedAt, record.receipt].map(csvEscape).join(','));
  fs.writeFileSync(haniyyahCourtsCsvPath, `court,slot,name,updatedAt,receipt\n${rows.join('\n')}\n`, 'utf8');
}

function handleHaniyyahCourtsApi(req, res) {
  if (req.method === 'GET') {
    sendJson(res, 200, { courts: readHaniyyahCourts(), updatedAt: fs.statSync(haniyyahCourtsCsvPath).mtime.toISOString() });
    return;
  }
  if (req.method !== 'POST') {
    sendJson(res, 405, { success: false, message: 'Method not allowed.' });
    return;
  }
  let body = '';
  req.on('data', (chunk) => { body += chunk; });
  req.on('end', () => {
    try {
      const payload = JSON.parse(body || '{}');
      const allowedCourts = ['Court 1', 'Court 2', 'Court 3'];
      if (!Array.isArray(payload.courts) || payload.courts.length !== 3) throw new Error('Invalid court roster.');
      const previousRecords = getHaniyyahCourtRecords();
      const updatedAt = new Date().toISOString();
      const rows = allowedCourts.flatMap((courtName) => {
        const court = payload.courts.find((entry) => entry.name === courtName);
        if (!court || !Array.isArray(court.players) || court.players.length !== 8) throw new Error('Invalid court roster.');
        return court.players.map((player, index) => {
          const previous = previousRecords.find((record) => record.court === courtName && record.slot === index + 1);
          const name = typeof player === 'string' ? player : player?.name;
          if (typeof name !== 'string' || (previous?.receipt && name !== previous.name)) throw new Error('Paid player entries cannot be changed.');
          return { court: courtName, slot: index + 1, name: name.slice(0, 60), updatedAt, receipt: previous?.receipt || '' };
        });
      });
      writeHaniyyahCourtRecords(rows);
      sendJson(res, 200, { success: true, updatedAt });
    } catch {
      sendJson(res, 400, { success: false, message: 'Invalid court roster.' });
    }
  });
}

function handleHaniyyahReceiptApi(req, res) {
  if (req.method !== 'POST') {
    sendJson(res, 405, { success: false, message: 'Method not allowed.' });
    return;
  }
  let body = '';
  req.on('data', (chunk) => { body += chunk; });
  req.on('end', () => {
    try {
      const { court, slot, dataUrl } = JSON.parse(body || '{}');
      if (!['Court 1', 'Court 2', 'Court 3'].includes(court) || !Number.isInteger(slot) || slot < 1 || slot > 8) throw new Error('Invalid court slot.');
      const imageMatch = /^data:(image\/(?:png|jpeg|webp));base64,([A-Za-z0-9+/=]+)$/.exec(dataUrl || '');
      if (!imageMatch) throw new Error('Only PNG, JPG, and WebP images are accepted.');
      const imageData = Buffer.from(imageMatch[2], 'base64');
      if (imageData.length > 5 * 1024 * 1024) throw new Error('Receipt image is too large.');
      const records = getHaniyyahCourtRecords();
      const record = records.find((entry) => entry.court === court && entry.slot === slot);
      if (!record?.name || record.receipt) throw new Error('This receipt slot is unavailable.');
      fs.mkdirSync(haniyyahReceiptsDir, { recursive: true });
      const extension = { 'image/png': 'png', 'image/jpeg': 'jpg', 'image/webp': 'webp' }[imageMatch[1]];
      const fileName = `${court.toLowerCase().replace(' ', '-')}-slot-${slot}-${Date.now()}.${extension}`;
      fs.writeFileSync(path.join(haniyyahReceiptsDir, fileName), imageData);
      record.receipt = `/uploads/haniyyah-receipts/${fileName}`;
      record.updatedAt = new Date().toISOString();
      writeHaniyyahCourtRecords(records);
      sendJson(res, 201, { success: true, receipt: record.receipt, updatedAt: record.updatedAt });
    } catch (error) {
      sendJson(res, 400, { success: false, message: error.message || 'Could not upload receipt.' });
    }
  });
}

function readHaniyyahQr() {
  try {
    return JSON.parse(fs.readFileSync(haniyyahQrConfigPath, 'utf8'));
  } catch {
    return { qr: '' };
  }
}

function handleHaniyyahQrApi(req, res) {
  if (req.method === 'GET') {
    sendJson(res, 200, readHaniyyahQr());
    return;
  }
  if (req.method === 'DELETE') {
    let body = '';
    req.on('data', (chunk) => { body += chunk; });
    req.on('end', () => {
      try {
        const { code } = JSON.parse(body || '{}');
        if (code !== '676767') throw new Error('Incorrect update code.');
        const { qr } = readHaniyyahQr();
        const fileName = qr ? path.basename(qr) : '';
        const filePath = fileName ? path.join(haniyyahQrDir, fileName) : '';
        if (filePath && fs.existsSync(filePath)) fs.unlinkSync(filePath);
        fs.writeFileSync(haniyyahQrConfigPath, JSON.stringify({ qr: '', updatedAt: new Date().toISOString() }, null, 2), 'utf8');
        sendJson(res, 200, { success: true });
      } catch (error) {
        sendJson(res, 400, { success: false, message: error.message || 'Could not empty GCash QR.' });
      }
    });
    return;
  }
  if (req.method !== 'POST') {
    sendJson(res, 405, { success: false, message: 'Method not allowed.' });
    return;
  }
  let body = '';
  req.on('data', (chunk) => { body += chunk; });
  req.on('end', () => {
    try {
      const { code, dataUrl } = JSON.parse(body || '{}');
      if (code !== '676767') throw new Error('Incorrect update code.');
      const imageMatch = /^data:(image\/(?:png|jpeg|webp));base64,([A-Za-z0-9+/=]+)$/.exec(dataUrl || '');
      if (!imageMatch) throw new Error('Only PNG, JPG, and WebP images are accepted.');
      const imageData = Buffer.from(imageMatch[2], 'base64');
      if (imageData.length > 5 * 1024 * 1024) throw new Error('QR image is too large.');
      fs.mkdirSync(haniyyahQrDir, { recursive: true });
      const extension = { 'image/png': 'png', 'image/jpeg': 'jpg', 'image/webp': 'webp' }[imageMatch[1]];
      const fileName = `gcash-qr-${Date.now()}.${extension}`;
      const qr = `/uploads/haniyyah-qr/${fileName}`;
      fs.writeFileSync(path.join(haniyyahQrDir, fileName), imageData);
      fs.writeFileSync(haniyyahQrConfigPath, JSON.stringify({ qr, updatedAt: new Date().toISOString() }, null, 2), 'utf8');
      sendJson(res, 201, { success: true, qr });
    } catch (error) {
      sendJson(res, 400, { success: false, message: error.message || 'Could not update GCash QR.' });
    }
  });
}

function handleHaniyyahResetApi(req, res) {
  if (req.method !== 'POST') {
    sendJson(res, 405, { success: false, message: 'Method not allowed.' });
    return;
  }
  let body = '';
  req.on('data', (chunk) => { body += chunk; });
  req.on('end', () => {
    try {
      const { code } = JSON.parse(body || '{}');
      if (code !== '676767') throw new Error('Incorrect update code.');
      const updatedAt = new Date().toISOString();
      const records = ['Court 1', 'Court 2', 'Court 3'].flatMap((court) => Array.from({ length: 8 }, (_, index) => ({ court, slot: index + 1, name: '', receipt: '', updatedAt })));
      writeHaniyyahCourtRecords(records);
      fs.rmSync(haniyyahReceiptsDir, { recursive: true, force: true });
      fs.rmSync(haniyyahQrDir, { recursive: true, force: true });
      fs.writeFileSync(haniyyahQrConfigPath, JSON.stringify({ qr: '', updatedAt }, null, 2), 'utf8');
      sendJson(res, 200, { success: true, updatedAt });
    } catch (error) {
      sendJson(res, 400, { success: false, message: error.message || 'Could not reset roster.' });
    }
  });
}

function sendFile(res, filePath) {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Internal Server Error');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = mimeTypes[ext] || 'application/octet-stream';

    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
}

function sendStorePage(res, storeSlug) {
  const filePath = path.join(rootDir, 'store.html');
  fs.readFile(filePath, 'utf8', (err, html) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Internal Server Error');
      return;
    }

    const metadataBySlug = {
      'cebu-camping-hub': {
        title: 'Cebu Camping Hub | BusyBagz',
        description: "Premium camping gears and equipment's available for sale in Cebu.",
        url: 'https://busybagz.com/store/cebu-camping-hub',
        image: 'https://res.cloudinary.com/sjnrfmjm/image/upload/v1788621861/store_3.jpg'
      },
      'all-in-the-van': {
        title: 'All in the Van | BusyBagz',
        description: 'Private van rentals and customized travel and tour packages from All in the Van in Cebu.',
        url: 'https://busybagz.com/store/all-in-the-van',
        image: 'https://res.cloudinary.com/sjnrfmjm/image/upload/v1788542559/store_van_logo.jpg'
      }
    };
    const metadata = metadataBySlug[storeSlug] || null;

    if (!metadata) {
      sendFile(res, filePath);
      return;
    }

    const escaped = value => value.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
    const page = html
      .replace(/<title>[^<]*<\/title>/, `<title>${escaped(metadata.title)}</title>`)
      .replace(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${escaped(metadata.description)}">`)
      .replace(/<link rel="canonical" href="[^"]*">/, `<link rel="canonical" href="${metadata.url}">`)
      .replace(/<meta property="og:title" content="[^"]*">/, `<meta property="og:title" content="${escaped(metadata.title)}">`)
      .replace(/<meta property="og:description" content="[^"]*">/, `<meta property="og:description" content="${escaped(metadata.description)}">`)
      .replace(/<meta property="og:url" content="[^"]*">/, `<meta property="og:url" content="${metadata.url}">`)
      .replace(/<meta property="og:image" content="[^"]*">/, `<meta property="og:image" content="${metadata.image}">`);

    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(page);
  });
}

const server = http.createServer((req, res) => {
  const reqUrl = new URL(req.url, 'http://localhost');
  const pathname = decodeURIComponent(reqUrl.pathname);

  if (pathname === '/api/reviewer') {
    handleReviewerApi(req, res);
    return;
  }

  if (pathname === '/api/ecommerce-cloud' || pathname === '/api/questions') {
    handleQuestionBankApi(req, res);
    return;
  }

  if (pathname === '/api/courts/haniyyah') {
    handleHaniyyahCourtsApi(req, res);
    return;
  }

  if (pathname === '/api/courts/haniyyah/receipt') {
    handleHaniyyahReceiptApi(req, res);
    return;
  }

  if (pathname === '/api/courts/haniyyah/qr') {
    handleHaniyyahQrApi(req, res);
    return;
  }

  if (pathname === '/api/courts/haniyyah/reset') {
    handleHaniyyahResetApi(req, res);
    return;
  }

  let safePath = pathname;

  if (safePath === '/') {
    safePath = '/index.html';
  }

  if (safePath === '/reviewer' || safePath === '/reviewer/') {
    safePath = '/reviewer-index.html';
  }

  if (safePath === '/reservation/court/haniyyah' || safePath === '/reservation/court/haniyyah/') {
    safePath = '/court-haniyyah.html';
  }

  if (/^\/store\/[^/]+\/?$/.test(safePath)) {
    const storeSlug = safePath.split('/').filter(Boolean)[1].toLowerCase().replace(/_/g, '-');
    sendStorePage(res, storeSlug);
    return;
  }

  if (safePath === '/reviewer/ecommerce-cloud' || safePath === '/reviewer/ecommerce-cloud/') {
    safePath = '/reviewer.html';
  }

  const normalizedPath = path.normalize(safePath).replace(/^\/+/, '');
  const filePath = path.join(rootDir, normalizedPath);

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      if (safePath.endsWith('/')) {
        const indexPath = path.join(filePath, 'index.html');
        fs.stat(indexPath, (indexErr, indexStats) => {
          if (!indexErr && indexStats.isFile()) {
            sendFile(res, indexPath);
            return;
          }
        });
      }

      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('404 - Not Found');
      return;
    }

    sendFile(res, filePath);
  });
});

server.listen(port, () => {
  console.log(`BusyBagz is running at http://localhost:${port}`);
});
