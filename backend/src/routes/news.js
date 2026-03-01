const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');

// Get all news
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, title, excerpt, category, image_url as image, featured, views, date
      FROM news ORDER BY date DESC
    `);
    res.json({ news: result.rows });
  } catch (error) {
    console.error('Get news error:', error);
    res.status(500).json({ message: 'Failed to fetch news' });
  }
});

// Get latest news
router.get('/latest', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, title, excerpt, category, image_url as image, date
      FROM news ORDER BY date DESC LIMIT 3
    `);
    res.json({ news: result.rows });
  } catch (error) {
    console.error('Get latest news error:', error);
    res.status(500).json({ message: 'Failed to fetch latest news' });
  }
});

// Get single news item
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM news WHERE id = $1', [req.params.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'News item not found' });
    }

    // Increment views
    await pool.query('UPDATE news SET views = views + 1 WHERE id = $1', [req.params.id]);

    res.json({ news: result.rows[0] });
  } catch (error) {
    console.error('Get news item error:', error);
    res.status(500).json({ message: 'Failed to fetch news item' });
  }
});

module.exports = router;
