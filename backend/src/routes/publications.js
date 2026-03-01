const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');

// Get all publications
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, title, hebrew_title as "hebrewTitle", description, category, pages, 
             download_url as "downloadUrl", date
      FROM publications ORDER BY date DESC
    `);
    res.json({ publications: result.rows });
  } catch (error) {
    console.error('Get publications error:', error);
    res.status(500).json({ message: 'Failed to fetch publications' });
  }
});

module.exports = router;
