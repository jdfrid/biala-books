const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');

// Get all books
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, title, hebrew_title as "hebrewTitle", description, price, category, 
             available, image_url as image, pages, binding, language, year
      FROM books ORDER BY created_at DESC
    `);
    res.json({ books: result.rows });
  } catch (error) {
    console.error('Get books error:', error);
    res.status(500).json({ message: 'Failed to fetch books' });
  }
});

// Get featured books
router.get('/featured', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, title, hebrew_title as "hebrewTitle", description, price, category, 
             available, image_url as image
      FROM books WHERE available = 1 ORDER BY orders_count DESC LIMIT 4
    `);
    res.json({ books: result.rows });
  } catch (error) {
    console.error('Get featured books error:', error);
    res.status(500).json({ message: 'Failed to fetch featured books' });
  }
});

// Get single book
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, title, hebrew_title as "hebrewTitle", description, long_description as "longDescription",
             price, category, available, image_url as image, pages, binding, language, isbn, year
      FROM books WHERE id = $1
    `, [req.params.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.json({ book: result.rows[0] });
  } catch (error) {
    console.error('Get book error:', error);
    res.status(500).json({ message: 'Failed to fetch book' });
  }
});

// Get related books
router.get('/related/:id', async (req, res) => {
  try {
    const bookResult = await pool.query('SELECT category FROM books WHERE id = $1', [req.params.id]);
    
    if (bookResult.rows.length === 0) {
      return res.json({ books: [] });
    }

    const result = await pool.query(`
      SELECT id, title, hebrew_title as "hebrewTitle", price, image_url as image
      FROM books WHERE category = $1 AND id != $2 LIMIT 4
    `, [bookResult.rows[0].category, req.params.id]);

    res.json({ books: result.rows });
  } catch (error) {
    console.error('Get related books error:', error);
    res.status(500).json({ message: 'Failed to fetch related books' });
  }
});

module.exports = router;
