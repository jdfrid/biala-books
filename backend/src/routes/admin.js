const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// Apply auth middleware to all admin routes
router.use(authenticateToken);

// Dashboard stats
router.get('/stats', (req, res) => {
  try {
    const totalBooks = db.prepare('SELECT COUNT(*) as count FROM books').get().count;
    const totalOrders = db.prepare('SELECT COUNT(*) as count FROM orders').get().count;
    const totalDonations = db.prepare('SELECT COALESCE(SUM(amount), 0) as total FROM donations').get().total;
    const subscribers = db.prepare('SELECT COUNT(*) as count FROM subscribers').get().count;
    const waitlistCount = db.prepare('SELECT COUNT(*) as count FROM waitlist WHERE notified = 0').get().count;
    
    const ordersThisMonth = db.prepare(`
      SELECT COUNT(*) as count FROM orders 
      WHERE date >= date('now', 'start of month')
    `).get().count;
    
    const donationsThisMonth = db.prepare(`
      SELECT COALESCE(SUM(amount), 0) as total FROM donations 
      WHERE date >= date('now', 'start of month')
    `).get().total;

    res.json({
      totalBooks,
      totalOrders,
      totalDonations,
      subscribers,
      waitlistCount,
      ordersThisMonth,
      donationsThisMonth,
      visitorsThisWeek: 0, // Placeholder
      ordersChange: 12.5,
      donationsChange: -3.2
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ message: 'Failed to fetch stats' });
  }
});

// Books CRUD
router.get('/books', (req, res) => {
  try {
    const books = db.prepare(`
      SELECT id, title, hebrew_title as hebrewTitle, price, category, available, orders_count as orders
      FROM books ORDER BY created_at DESC
    `).all();
    res.json({ books });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch books' });
  }
});

router.post('/books', (req, res) => {
  try {
    const { title, hebrewTitle, description, longDescription, price, category, available, pages, binding, language, isbn, year } = req.body;
    const result = db.prepare(`
      INSERT INTO books (title, hebrew_title, description, long_description, price, category, available, pages, binding, language, isbn, year)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(title, hebrewTitle, description, longDescription, price, category, available ? 1 : 0, pages, binding, language, isbn, year);
    res.json({ id: result.lastInsertRowid, message: 'Book created' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create book' });
  }
});

router.put('/books/:id', (req, res) => {
  try {
    const { title, hebrewTitle, description, longDescription, price, category, available, pages, binding, language, isbn, year } = req.body;
    db.prepare(`
      UPDATE books SET title=?, hebrew_title=?, description=?, long_description=?, price=?, category=?, available=?, pages=?, binding=?, language=?, isbn=?, year=?, updated_at=datetime('now')
      WHERE id=?
    `).run(title, hebrewTitle, description, longDescription, price, category, available ? 1 : 0, pages, binding, language, isbn, year, req.params.id);
    res.json({ message: 'Book updated' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update book' });
  }
});

router.delete('/books/:id', (req, res) => {
  try {
    db.prepare('DELETE FROM books WHERE id = ?').run(req.params.id);
    res.json({ message: 'Book deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete book' });
  }
});

// News CRUD
router.get('/news', (req, res) => {
  try {
    const news = db.prepare('SELECT * FROM news ORDER BY date DESC').all();
    res.json({ news });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch news' });
  }
});

router.post('/news', (req, res) => {
  try {
    const { title, excerpt, content, category, featured, date } = req.body;
    const result = db.prepare(`
      INSERT INTO news (title, excerpt, content, category, featured, date) VALUES (?, ?, ?, ?, ?, ?)
    `).run(title, excerpt, content, category, featured ? 1 : 0, date);
    res.json({ id: result.lastInsertRowid });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create news' });
  }
});

router.put('/news/:id', (req, res) => {
  try {
    const { title, excerpt, content, category, featured, date } = req.body;
    db.prepare(`
      UPDATE news SET title=?, excerpt=?, content=?, category=?, featured=?, date=? WHERE id=?
    `).run(title, excerpt, content, category, featured ? 1 : 0, date, req.params.id);
    res.json({ message: 'News updated' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update news' });
  }
});

router.delete('/news/:id', (req, res) => {
  try {
    db.prepare('DELETE FROM news WHERE id = ?').run(req.params.id);
    res.json({ message: 'News deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete news' });
  }
});

// Media CRUD
router.get('/media', (req, res) => {
  try {
    const media = db.prepare('SELECT * FROM media ORDER BY date DESC').all();
    res.json({ media });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch media' });
  }
});

router.post('/media', (req, res) => {
  try {
    const { title, description, type, duration, url, date } = req.body;
    const result = db.prepare(`
      INSERT INTO media (title, description, type, duration, url, date) VALUES (?, ?, ?, ?, ?, ?)
    `).run(title, description, type, duration, url, date);
    res.json({ id: result.lastInsertRowid });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create media' });
  }
});

router.delete('/media/:id', (req, res) => {
  try {
    db.prepare('DELETE FROM media WHERE id = ?').run(req.params.id);
    res.json({ message: 'Media deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete media' });
  }
});

// Subscribers
router.get('/subscribers', (req, res) => {
  try {
    const subscribers = db.prepare('SELECT * FROM subscribers ORDER BY subscribed_at DESC').all();
    res.json({ subscribers });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch subscribers' });
  }
});

router.delete('/subscribers/:id', (req, res) => {
  try {
    db.prepare('DELETE FROM subscribers WHERE id = ?').run(req.params.id);
    res.json({ message: 'Subscriber removed' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to remove subscriber' });
  }
});

// Waitlist
router.get('/waitlist', (req, res) => {
  try {
    const waitlist = db.prepare(`
      SELECT w.*, b.title as bookTitle FROM waitlist w
      JOIN books b ON w.book_id = b.id
      ORDER BY w.added_at DESC
    `).all();
    res.json({ waitlist });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch waitlist' });
  }
});

router.delete('/waitlist/:id', (req, res) => {
  try {
    db.prepare('DELETE FROM waitlist WHERE id = ?').run(req.params.id);
    res.json({ message: 'Removed from waitlist' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to remove from waitlist' });
  }
});

// Orders
router.get('/orders', (req, res) => {
  try {
    const orders = db.prepare('SELECT * FROM orders ORDER BY date DESC').all();
    res.json({ orders: orders.map(o => ({ ...o, items: JSON.parse(o.items || '[]') })) });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
});

router.get('/orders/recent', (req, res) => {
  try {
    const orders = db.prepare('SELECT * FROM orders ORDER BY date DESC LIMIT 5').all();
    res.json({ orders: orders.map(o => ({ ...o, items: JSON.parse(o.items || '[]') })) });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
});

router.put('/orders/:id/status', (req, res) => {
  try {
    const { status, trackingNumber } = req.body;
    db.prepare('UPDATE orders SET status=?, tracking_number=? WHERE id=?').run(status, trackingNumber || null, req.params.id);
    res.json({ message: 'Order updated' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update order' });
  }
});

// Donations
router.get('/donations', (req, res) => {
  try {
    const donations = db.prepare('SELECT * FROM donations ORDER BY date DESC').all();
    res.json({ donations });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch donations' });
  }
});

router.get('/donations/recent', (req, res) => {
  try {
    const donations = db.prepare('SELECT * FROM donations ORDER BY date DESC LIMIT 5').all();
    res.json({ donations });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch donations' });
  }
});

// Admin Users (admin only)
router.get('/users', requireAdmin, (req, res) => {
  try {
    const users = db.prepare('SELECT id, name, email, role, status, last_login as lastLogin FROM users').all();
    res.json({ users });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch users' });
  }
});

router.post('/users', requireAdmin, (req, res) => {
  try {
    const { name, email, role } = req.body;
    const result = db.prepare('INSERT INTO users (name, email, role) VALUES (?, ?, ?)').run(name, email, role);
    res.json({ id: result.lastInsertRowid });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create user' });
  }
});

router.put('/users/:id', requireAdmin, (req, res) => {
  try {
    const { name, email, role } = req.body;
    db.prepare('UPDATE users SET name=?, email=?, role=? WHERE id=?').run(name, email, role, req.params.id);
    res.json({ message: 'User updated' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update user' });
  }
});

router.delete('/users/:id', requireAdmin, (req, res) => {
  try {
    if (req.params.id == req.user.id) {
      return res.status(400).json({ message: 'Cannot delete yourself' });
    }
    db.prepare('DELETE FROM users WHERE id = ?').run(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete user' });
  }
});

module.exports = router;

