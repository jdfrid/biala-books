const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Get all publications
router.get('/', (req, res) => {
  try {
    const publications = db.prepare(`
      SELECT id, title, hebrew_title as hebrewTitle, description, category, pages, 
             download_url as downloadUrl, date
      FROM publications ORDER BY date DESC
    `).all();
    res.json({ publications });
  } catch (error) {
    console.error('Get publications error:', error);
    res.status(500).json({ message: 'Failed to fetch publications' });
  }
});

module.exports = router;

