require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/auth');
const booksRoutes = require('./routes/books');
const newsRoutes = require('./routes/news');
const mediaRoutes = require('./routes/media');
const publicationsRoutes = require('./routes/publications');
const newsletterRoutes = require('./routes/newsletter');
const waitlistRoutes = require('./routes/waitlist');
const contactRoutes = require('./routes/contact');
const donationsRoutes = require('./routes/donations');
const ordersRoutes = require('./routes/orders');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 5000;

// CORS - allow all origins
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/books', booksRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/publications', publicationsRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/waitlist', waitlistRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/donations', donationsRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || 'development',
    smtp: process.env.SMTP_USER ? 'configured' : 'not configured'
  });
});

// SMTP test endpoint
app.get('/api/test-smtp', async (req, res) => {
  const { testConnection } = require('./services/email');
  const result = await testConnection();
  res.json(result);
});

// Debug endpoint - show auth codes
app.get('/api/debug/codes/:email', (req, res) => {
  try {
    const db = require('./config/database');
    const email = req.params.email.toLowerCase().trim();
    
    const codes = db.prepare(`
      SELECT id, email, code, used, expires_at, created_at 
      FROM auth_codes 
      WHERE email = ? 
      ORDER BY created_at DESC 
      LIMIT 10
    `).all(email);
    
    const users = db.prepare('SELECT id, name, email, role FROM users WHERE email = ?').all(email);
    
    res.json({ 
      email,
      codesCount: codes.length,
      codes,
      users,
      serverTime: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Direct login endpoint (bypass 2FA for testing)
app.post('/api/direct-login', (req, res) => {
  try {
    const db = require('./config/database');
    const { generateToken } = require('./middleware/auth');
    let { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }
    
    email = email.toLowerCase().trim();
    
    // Create user if not exists
    let user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (!user) {
      db.prepare('INSERT INTO users (name, email, role) VALUES (?, ?, ?)').run(
        email.split('@')[0], email, 'admin'
      );
      user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    }
    
    // Generate token directly
    const token = generateToken(user.id);
    
    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Biala Books API running on port ${PORT}`);
});
