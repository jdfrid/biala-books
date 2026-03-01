require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const { pool, initDatabase } = require('./config/database');
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
    database: process.env.DATABASE_URL ? 'PostgreSQL' : 'not configured',
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
app.get('/api/debug/codes/:email', async (req, res) => {
  try {
    const email = req.params.email.toLowerCase().trim();
    
    const codes = await pool.query(`
      SELECT id, email, code, used, expires_at, created_at 
      FROM auth_codes 
      WHERE email = $1 
      ORDER BY created_at DESC 
      LIMIT 10
    `, [email]);
    
    const users = await pool.query('SELECT id, name, email, role FROM users WHERE email = $1', [email]);
    
    res.json({ 
      email,
      codesCount: codes.rows.length,
      codes: codes.rows,
      users: users.rows,
      serverTime: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Direct login endpoint (bypass 2FA for testing)
app.post('/api/direct-login', async (req, res) => {
  try {
    const { generateToken } = require('./middleware/auth');
    let { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }
    
    email = email.toLowerCase().trim();
    
    // Create user if not exists
    let userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    let user = userResult.rows[0];
    
    if (!user) {
      await pool.query('INSERT INTO users (name, email, role) VALUES ($1, $2, $3)', [email.split('@')[0], email, 'admin']);
      userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
      user = userResult.rows[0];
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

// Initialize database and start server
async function startServer() {
  try {
    await initDatabase();
    app.listen(PORT, () => {
      console.log(`🚀 Biala Books API running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
