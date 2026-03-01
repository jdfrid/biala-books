const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');

// Get all media
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, title, description, type, duration, url, thumbnail_url as thumbnail, views, date
      FROM media ORDER BY date DESC
    `);
    res.json({ media: result.rows });
  } catch (error) {
    console.error('Get media error:', error);
    res.status(500).json({ message: 'Failed to fetch media' });
  }
});

// Get single media item
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM media WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Media not found' });
    }
    // Increment views
    await pool.query('UPDATE media SET views = views + 1 WHERE id = $1', [req.params.id]);
    res.json({ media: result.rows[0] });
  } catch (error) {
    console.error('Get media error:', error);
    res.status(500).json({ message: 'Failed to fetch media' });
  }
});

module.exports = router;
