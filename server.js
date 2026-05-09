require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const helmet  = require('helmet');
const path    = require('path');

const app  = express();
const PORT = process.env.PORT || 3000;

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// API Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    platform: 'REALFACE',
    version: '1.0.0',
    message: 'The Internet Trust Layer',
    timestamp: new Date().toISOString(),
  });
});

// Verification Stats API
app.get('/api/stats', (req, res) => {
  res.json({
    verifiedHumans: 247000 + Math.floor(Math.random() * 100),
    fakeAccountsBlocked: 0,
    countries: 142,
    todayVerifications: 2841 + Math.floor(Math.random() * 50),
  });
});

// Mock Auth API
app.post('/api/auth/register', (req, res) => {
  const { firstName, email } = req.body;
  if (!firstName || !email)
    return res.status(400).json({ error: 'Name and email required' });
  res.status(201).json({
    message: `Welcome to REALFACE, ${firstName}! 🎉`,
    user: { id: 'user_' + Date.now(), firstName, email, verified: false },
    token: 'rf_token_' + Math.random().toString(36).slice(2),
  });
});

app.post('/api/auth/login', (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email required' });
  res.json({
    message: 'Welcome back!',
    user: { id: 'user_demo', firstName: 'Yasir', email, verified: true },
    token: 'rf_token_' + Math.random().toString(36).slice(2),
  });
});

// Verification API
app.post('/api/verify', (req, res) => {
  res.json({
    success: true,
    verified: true,
    badge: 'HUMAN_VERIFIED',
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    trustScore: Math.floor(Math.random() * 100) + 800,
    message: 'You are now a verified human on REALFACE ✓',
  });
});

// Catch all — serve frontend
app.get('*', (req, res) => {
  if (req.path.startsWith('/api'))
    return res.status(404).json({ error: 'API endpoint not found' });
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`
  ╔══════════════════════════════════════╗
  ║   ✓ REALFACE Server Running          ║
  ║   🌐 http://localhost:${PORT}            ║
  ║   The Internet's Trust Layer         ║
  ╚══════════════════════════════════════╝
  `);
});
