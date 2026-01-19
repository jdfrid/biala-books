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

// Test login endpoint (for debugging)
app.get('/api/test-login/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const crypto = require('crypto');
    const db = require('./config/database');
    
    // Create user if not exists
    let user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (!user) {
      db.prepare('INSERT INTO users (name, email, role) VALUES (?, ?, ?)').run(
        email.split('@')[0], email, 'admin'
      );
    }
    
    // Generate code
    const code = crypto.randomInt(100000, 999999).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    
    db.prepare('INSERT INTO auth_codes (email, code, expires_at) VALUES (?, ?, ?)').run(
      email, code, expiresAt.toISOString()
    );
    
    res.json({ 
      success: true,
      email,
      code,
      message: 'Use this code to login'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Biala Books API running on port ${PORT}`);
});
