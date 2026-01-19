const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Get all media
router.get('/', (req, res) => {
  try {
    const media = db.prepare(`
      SELECT id, title, description, type, duration, url, thumbnail_url as thumbnail, views, date
      FROM media ORDER BY date DESC
    `).all();
    res.json({ media });
  } catch (error) {
    console.error('Get media error:', error);
    res.status(500).json({ message: 'Failed to fetch media' });
  }
});

// Get single media item
router.get('/:id', (req, res) => {
  try {
    const item = db.prepare('SELECT * FROM media WHERE id = ?').get(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Media not found' });
    }
    // Increment views
    db.prepare('UPDATE media SET views = views + 1 WHERE id = ?').run(req.params.id);
    res.json({ media: item });
  } catch (error) {
    console.error('Get media error:', error);
    res.status(500).json({ message: 'Failed to fetch media' });
  }
});

module.exports = router;

