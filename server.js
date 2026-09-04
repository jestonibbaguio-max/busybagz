const http = require('http');
const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const port = process.env.PORT || 3000;
const dataDir = path.join(rootDir, 'data');
const reviewerCsvPath = path.join(dataDir, 'ecommerce-cloud.csv');
const reviewerResultsCsvPath = path.join(dataDir, 'reviewer-results.csv');

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

  let safePath = pathname;

  if (safePath === '/') {
    safePath = '/index.html';
  }

  if (safePath === '/reviewer' || safePath === '/reviewer/') {
    safePath = '/reviewer-index.html';
  }

  if (/^\/store\/[^/]+\/?$/.test(safePath)) {
    safePath = '/store.html';
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
