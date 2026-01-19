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

// Middleware
app.use(cors());
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
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Biala Books API running on port ${PORT}`);
});

