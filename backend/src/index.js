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
const kvitelRoutes = require('./routes/kvitel');

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
app.use('/api/kvitel', kvitelRoutes);
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

// Seed database with sample content
app.post('/api/seed', async (req, res) => {
  try {
    // Sample Books
    const books = [
      { title: 'Mevaser Tov al HaTorah - Bereishis', hebrew_title: 'מבשר טוב על התורה - בראשית', description: 'Profound insights on Parshas Bereishis through Vayechi, illuminating the weekly Torah portions with Chassidic wisdom.', price: 45, category: 'Torah', available: 1, pages: 450, binding: 'Hardcover', language: 'Hebrew', year: 2020 },
      { title: 'Mevaser Tov al HaTorah - Shemos', hebrew_title: 'מבשר טוב על התורה - שמות', description: 'Deep Torah teachings on the Book of Exodus, exploring themes of redemption and divine service.', price: 45, category: 'Torah', available: 1, pages: 420, binding: 'Hardcover', language: 'Hebrew', year: 2021 },
      { title: 'Mevaser Tov al HaMoadim', hebrew_title: 'מבשר טוב על המועדים', description: 'Chassidic perspectives on the Jewish holidays, bringing new depth to our celebration of the festivals.', price: 50, category: 'Holidays', available: 1, pages: 380, binding: 'Hardcover', language: 'Hebrew', year: 2019 },
      { title: 'Sichos Kodesh - Volume 1', hebrew_title: 'שיחות קודש - כרך א', description: 'Sacred talks and teachings delivered by the Rebbe on various occasions throughout the year.', price: 35, category: 'Chassidus', available: 1, pages: 320, binding: 'Hardcover', language: 'Hebrew', year: 2022 },
      { title: 'Letters of Light', hebrew_title: 'אגרות אור', description: 'A collection of letters containing personal guidance, blessings, and Torah insights from the Rebbe.', price: 40, category: 'Letters', available: 0, pages: 280, binding: 'Hardcover', language: 'Hebrew/English', year: 2023 },
      { title: 'The Path of the Tzaddik', hebrew_title: 'דרך הצדיק', description: 'English translation of selected teachings, making the wisdom accessible to English speakers.', price: 32, category: 'English', available: 1, pages: 250, binding: 'Hardcover', language: 'English', year: 2023 }
    ];

    for (const book of books) {
      await pool.query(
        `INSERT INTO books (title, hebrew_title, description, price, category, available, pages, binding, language, year)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
         ON CONFLICT DO NOTHING`,
        [book.title, book.hebrew_title, book.description, book.price, book.category, book.available, book.pages, book.binding, book.language, book.year]
      );
    }

    // Sample News
    const news = [
      { title: 'New Sefer Released: Mevaser Tov al HaTorah Volume 3', excerpt: 'We are pleased to announce the release of the third volume in the Mevaser Tov al HaTorah series.', content: 'After years of careful preparation, we are honored to present the latest addition to our library of sacred texts.', category: 'New Release', featured: 1, date: '2024-01-15' },
      { title: 'Upcoming Yahrtzeit Gathering', excerpt: 'Join us for a special gathering commemorating the yahrtzeit of the Mevaser Tov.', content: 'The community is invited to participate in learning, tefillos, and a seudah in memory of our holy Rebbe.', category: 'Event', featured: 0, date: '2024-01-10' },
      { title: 'Weekly Shiur Series Launched', excerpt: 'A new weekly shiur on the teachings of the Mevaser Tov has begun.', content: 'Every Thursday evening, join us for an in-depth exploration of Chassidic teachings.', category: 'Announcement', featured: 0, date: '2024-01-05' }
    ];

    for (const item of news) {
      await pool.query(
        `INSERT INTO news (title, excerpt, content, category, featured, date)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT DO NOTHING`,
        [item.title, item.excerpt, item.content, item.category, item.featured, item.date]
      );
    }

    // Sample Media
    const media = [
      { title: 'Tish Recording - Parshas Bereishis', description: 'Recording of the Rebbe\'s tish from Parshas Bereishis 5784', type: 'audio', duration: '45:00', date: '2024-01-12' },
      { title: 'Shiur on Avodas Hashem', description: 'A profound teaching on serving Hashem with joy and sincerity', type: 'video', duration: '32:15', date: '2024-01-08' },
      { title: 'Niggun Collection - Volume 1', description: 'Beautiful niggunim sung at the Rebbe\'s tish', type: 'audio', duration: '1:15:00', date: '2024-01-01' }
    ];

    for (const item of media) {
      await pool.query(
        `INSERT INTO media (title, description, type, duration, date)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT DO NOTHING`,
        [item.title, item.description, item.type, item.duration, item.date]
      );
    }

    // Sample Publications
    const publications = [
      { title: 'Weekly Parsha Sheet - Bereishis', hebrew_title: 'עלון פרשת בראשית', description: 'Insights and stories for Parshas Bereishis', category: 'Weekly', pages: 4, date: '2024-01-12' },
      { title: 'Weekly Parsha Sheet - Noach', hebrew_title: 'עלון פרשת נח', description: 'Insights and stories for Parshas Noach', category: 'Weekly', pages: 4, date: '2024-01-05' },
      { title: 'Chanukah Special Edition', hebrew_title: 'מהדורה מיוחדת לחנוכה', description: 'Special collection of teachings for Chanukah', category: 'Holiday Special', pages: 12, date: '2023-12-15' }
    ];

    for (const item of publications) {
      await pool.query(
        `INSERT INTO publications (title, hebrew_title, description, category, pages, date)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT DO NOTHING`,
        [item.title, item.hebrew_title, item.description, item.category, item.pages, item.date]
      );
    }

    res.json({ 
      message: 'Database seeded successfully',
      counts: {
        books: books.length,
        news: news.length,
        media: media.length,
        publications: publications.length
      }
    });
  } catch (error) {
    console.error('Seed error:', error);
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
