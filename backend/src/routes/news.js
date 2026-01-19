const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Get all news
router.get('/', (req, res) => {
  try {
    const news = db.prepare(`
      SELECT id, title, excerpt, category, image_url as image, featured, views, date
      FROM news ORDER BY date DESC
    `).all();
    res.json({ news });
  } catch (error) {
    console.error('Get news error:', error);
    res.status(500).json({ message: 'Failed to fetch news' });
  }
});

// Get latest news
router.get('/latest', (req, res) => {
  try {
    const news = db.prepare(`
      SELECT id, title, excerpt, category, image_url as image, date
      FROM news ORDER BY date DESC LIMIT 3
    `).all();
    res.json({ news });
  } catch (error) {
    console.error('Get latest news error:', error);
    res.status(500).json({ message: 'Failed to fetch latest news' });
  }
});

// Get single news item
router.get('/:id', (req, res) => {
  try {
    const item = db.prepare(`
      SELECT * FROM news WHERE id = ?
    `).get(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'News item not found' });
    }

    // Increment views
    db.prepare('UPDATE news SET views = views + 1 WHERE id = ?').run(req.params.id);

    res.json({ news: item });
  } catch (error) {
    console.error('Get news item error:', error);
    res.status(500).json({ message: 'Failed to fetch news item' });
  }
});

module.exports = router;

