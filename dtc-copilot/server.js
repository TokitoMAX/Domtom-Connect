// Serveur autonome DTC Copilot (Zero-dependency Node.js)
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3080;
const PUBLIC_DIR = path.join(__dirname, 'public');
const CONFIG_FILE = path.join(__dirname, 'config', 'rules.json');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png'
};

const server = http.createServer((req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host}`);

  // API : Get Rules
  if (url.pathname === '/api/rules' && req.method === 'GET') {
    if (fs.existsSync(CONFIG_FILE)) {
      const data = fs.readFileSync(CONFIG_FILE, 'utf8');
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(data);
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Rules not found' }));
    }
    return;
  }

  // API : Status Check
  if (url.pathname === '/api/status' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'active',
      uptime: process.uptime(),
      founder: 'Loïc Villeronce',
      organization: 'Domtom Connect',
      monitored_channels: {
        gmail: 'domtomconnect@gmail.com',
        whatsapp: '2 groupes autorisés',
        linkedin: 'Prêt'
      }
    }));
    return;
  }

  // API : Real Emails from Gmail
  if (url.pathname === '/api/real-emails' && req.method === 'GET') {
    const pythonScript = path.join(__dirname, 'backend', 'get_inbox.py');
    const { exec } = require('child_process');
    exec(`python "${pythonScript}"`, { maxBuffer: 1024 * 1024 * 5 }, (error, stdout, stderr) => {
      if (error) {
        console.error('Erreur get_inbox:', stderr);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: stderr || error.message }));
        return;
      }
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(stdout);
    });
    return;
  }

  // API : Send Real Email via SMTP
  if (url.pathname === '/api/send-real-email' && req.method === 'POST') {
    let bodyData = '';
    req.on('data', chunk => { bodyData += chunk; });
    req.on('end', () => {
      const pythonScript = path.join(__dirname, 'backend', 'send_real_email.py');
      const { spawn } = require('child_process');
      const child = spawn('python', [pythonScript, bodyData]);
      let out = '';
      let err = '';

      child.stdout.on('data', d => { out += d; });
      child.stderr.on('data', d => { err += d; });
      child.on('close', code => {
        if (code !== 0) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: err || 'Erreur lors de l\'envoi' }));
        } else {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(out);
        }
      });
    });
    return;
  }

  // Static File Serving
  let filePath = path.join(PUBLIC_DIR, url.pathname === '/' ? 'index.html' : url.pathname);

  // Security check: ensure path stays within PUBLIC_DIR
  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403);
    res.end('Accès refusé');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      // Fallback to index.html for SPA
      filePath = path.join(PUBLIC_DIR, 'index.html');
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(filePath, (err, content) => {
      if (err) {
        res.writeHead(500);
        res.end('Erreur serveur interne');
      } else {
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content);
      }
    });
  });
});

server.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🤖 DTC Copilot — Assistant Exécutif de Loïc Villeronce`);
  console.log(`🌐 Accès local : http://localhost:${PORT}`);
  console.log(`📱 Accès mobile sur le même réseau WiFi :`);
  console.log(`   (Ouvrir sur ton smartphone pour ajouter à l'écran d'accueil)`);
  console.log(`=======================================================`);
});
