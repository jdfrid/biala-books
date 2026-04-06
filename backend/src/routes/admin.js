const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// Apply auth middleware to all admin routes
router.use(authenticateToken);

// Dashboard stats
router.get('/stats', async (req, res) => {
  try {
    const totalBooks = (await pool.query('SELECT COUNT(*) as count FROM books')).rows[0].count;
    const totalOrders = (await pool.query('SELECT COUNT(*) as count FROM orders')).rows[0].count;
    const totalDonations = (await pool.query('SELECT COALESCE(SUM(amount), 0) as total FROM donations')).rows[0].total;
    const subscribers = (await pool.query('SELECT COUNT(*) as count FROM subscribers')).rows[0].count;
    const waitlistCount = (await pool.query('SELECT COUNT(*) as count FROM waitlist WHERE notified = 0')).rows[0].count;
    
    const ordersThisMonth = (await pool.query(`
      SELECT COUNT(*) as count FROM orders 
      WHERE date >= date_trunc('month', CURRENT_DATE)
    `)).rows[0].count;
    
    const donationsThisMonth = (await pool.query(`
      SELECT COALESCE(SUM(amount), 0) as total FROM donations 
      WHERE date >= date_trunc('month', CURRENT_DATE)
    `)).rows[0].total;

    res.json({
      totalBooks: parseInt(totalBooks),
      totalOrders: parseInt(totalOrders),
      totalDonations: parseFloat(totalDonations),
      subscribers: parseInt(subscribers),
      waitlistCount: parseInt(waitlistCount),
      ordersThisMonth: parseInt(ordersThisMonth),
      donationsThisMonth: parseFloat(donationsThisMonth),
      visitorsThisWeek: 0,
      ordersChange: 12.5,
      donationsChange: -3.2
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ message: 'Failed to fetch stats' });
  }
});

// Books CRUD
router.get('/books', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, title, hebrew_title as "hebrewTitle", price, category, available, orders_count as orders
      FROM books ORDER BY created_at DESC
    `);
    res.json({ books: result.rows });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch books' });
  }
});

router.post('/books', async (req, res) => {
  try {
    const { title, hebrewTitle, description, longDescription, price, category, available, pages, binding, language, isbn, year } = req.body;
    const result = await pool.query(`
      INSERT INTO books (title, hebrew_title, description, long_description, price, category, available, pages, binding, language, isbn, year)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING id
    `, [title, hebrewTitle, description, longDescription, price, category, available ? 1 : 0, pages, binding, language, isbn, year]);
    res.json({ id: result.rows[0].id, message: 'Book created' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create book' });
  }
});

router.put('/books/:id', async (req, res) => {
  try {
    const { title, hebrewTitle, description, longDescription, price, category, available, pages, binding, language, isbn, year } = req.body;
    await pool.query(`
      UPDATE books SET title=$1, hebrew_title=$2, description=$3, long_description=$4, price=$5, category=$6, available=$7, pages=$8, binding=$9, language=$10, isbn=$11, year=$12, updated_at=NOW()
      WHERE id=$13
    `, [title, hebrewTitle, description, longDescription, price, category, available ? 1 : 0, pages, binding, language, isbn, year, req.params.id]);
    res.json({ message: 'Book updated' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update book' });
  }
});

router.delete('/books/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM books WHERE id = $1', [req.params.id]);
    res.json({ message: 'Book deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete book' });
  }
});

// News CRUD
router.get('/news', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM news ORDER BY date DESC');
    res.json({ news: result.rows });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch news' });
  }
});

router.post('/news', async (req, res) => {
  try {
    const { title, excerpt, content, category, featured, date } = req.body;
    const result = await pool.query(`
      INSERT INTO news (title, excerpt, content, category, featured, date) VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id
    `, [title, excerpt, content, category, featured ? 1 : 0, date]);
    res.json({ id: result.rows[0].id });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create news' });
  }
});

router.put('/news/:id', async (req, res) => {
  try {
    const { title, excerpt, content, category, featured, date } = req.body;
    await pool.query(`
      UPDATE news SET title=$1, excerpt=$2, content=$3, category=$4, featured=$5, date=$6 WHERE id=$7
    `, [title, excerpt, content, category, featured ? 1 : 0, date, req.params.id]);
    res.json({ message: 'News updated' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update news' });
  }
});

router.delete('/news/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM news WHERE id = $1', [req.params.id]);
    res.json({ message: 'News deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete news' });
  }
});

// Media CRUD
router.get('/media', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM media ORDER BY date DESC');
    res.json({ media: result.rows });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch media' });
  }
});

router.post('/media', async (req, res) => {
  try {
    const { title, description, type, duration, url, date } = req.body;
    const result = await pool.query(`
      INSERT INTO media (title, description, type, duration, url, date) VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id
    `, [title, description, type, duration, url, date]);
    res.json({ id: result.rows[0].id });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create media' });
  }
});

router.delete('/media/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM media WHERE id = $1', [req.params.id]);
    res.json({ message: 'Media deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete media' });
  }
});

// Subscribers
router.get('/subscribers', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM subscribers ORDER BY subscribed_at DESC');
    res.json({ subscribers: result.rows });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch subscribers' });
  }
});

router.delete('/subscribers/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM subscribers WHERE id = $1', [req.params.id]);
    res.json({ message: 'Subscriber removed' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to remove subscriber' });
  }
});

// Waitlist
router.get('/waitlist', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT w.*, b.title as "bookTitle" FROM waitlist w
      JOIN books b ON w.book_id = b.id
      ORDER BY w.added_at DESC
    `);
    res.json({ waitlist: result.rows });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch waitlist' });
  }
});

router.delete('/waitlist/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM waitlist WHERE id = $1', [req.params.id]);
    res.json({ message: 'Removed from waitlist' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to remove from waitlist' });
  }
});

// Orders
router.get('/orders', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM orders ORDER BY date DESC');
    res.json({ orders: result.rows.map(o => ({ ...o, items: JSON.parse(o.items || '[]') })) });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
});

router.get('/orders/recent', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM orders ORDER BY date DESC LIMIT 5');
    res.json({ orders: result.rows.map(o => ({ ...o, items: JSON.parse(o.items || '[]') })) });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
});

router.put('/orders/:id/status', async (req, res) => {
  try {
    const { status, trackingNumber } = req.body;
    await pool.query('UPDATE orders SET status=$1, tracking_number=$2 WHERE id=$3', [status, trackingNumber || null, req.params.id]);
    res.json({ message: 'Order updated' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update order' });
  }
});

// Donations
router.get('/donations', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM donations ORDER BY date DESC');
    res.json({ donations: result.rows });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch donations' });
  }
});

router.get('/donations/recent', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM donations ORDER BY date DESC LIMIT 5');
    res.json({ donations: result.rows });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch donations' });
  }
});

// Admin Users (admin only)
router.get('/users', requireAdmin, async (req, res) => {
  try {
    const result = await pool.query('SELECT id, name, email, role, status, last_login as "lastLogin" FROM users');
    res.json({ users: result.rows });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch users' });
  }
});

router.post('/users', requireAdmin, async (req, res) => {
  try {
    const { name, email, role } = req.body;
    const result = await pool.query('INSERT INTO users (name, email, role) VALUES ($1, $2, $3) RETURNING id', [name, email, role]);
    res.json({ id: result.rows[0].id });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create user' });
  }
});

router.put('/users/:id', requireAdmin, async (req, res) => {
  try {
    const { name, email, role } = req.body;
    await pool.query('UPDATE users SET name=$1, email=$2, role=$3 WHERE id=$4', [name, email, role, req.params.id]);
    res.json({ message: 'User updated' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update user' });
  }
});

router.delete('/users/:id', requireAdmin, async (req, res) => {
  try {
    if (req.params.id == req.user.id) {
      return res.status(400).json({ message: 'Cannot delete yourself' });
    }
    await pool.query('DELETE FROM users WHERE id = $1', [req.params.id]);
    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete user' });
  }
});

// Kvitel (Prayer Requests)
router.get('/kvitel', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM kvitel ORDER BY created_at DESC');
    const kvitelList = result.rows.map(k => ({
      ...k,
      additional_names: JSON.parse(k.additional_names || '[]')
    }));
    res.json({ kvitel: kvitelList });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch kvitel' });
  }
});

router.delete('/kvitel/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM kvitel WHERE id = $1', [req.params.id]);
    res.json({ message: 'Kvitel deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete kvitel' });
  }
});

module.exports = router;
