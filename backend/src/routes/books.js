const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Get all books
router.get('/', (req, res) => {
  try {
    const books = db.prepare(`
      SELECT id, title, hebrew_title as hebrewTitle, description, price, category, 
             available, image_url as image, pages, binding, language, year
      FROM books ORDER BY created_at DESC
    `).all();
    res.json({ books });
  } catch (error) {
    console.error('Get books error:', error);
    res.status(500).json({ message: 'Failed to fetch books' });
  }
});

// Get featured books
router.get('/featured', (req, res) => {
  try {
    const books = db.prepare(`
      SELECT id, title, hebrew_title as hebrewTitle, description, price, category, 
             available, image_url as image
      FROM books WHERE available = 1 ORDER BY orders_count DESC LIMIT 4
    `).all();
    res.json({ books });
  } catch (error) {
    console.error('Get featured books error:', error);
    res.status(500).json({ message: 'Failed to fetch featured books' });
  }
});

// Get single book
router.get('/:id', (req, res) => {
  try {
    const book = db.prepare(`
      SELECT id, title, hebrew_title as hebrewTitle, description, long_description as longDescription,
             price, category, available, image_url as image, pages, binding, language, isbn, year
      FROM books WHERE id = ?
    `).get(req.params.id);

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.json({ book });
  } catch (error) {
    console.error('Get book error:', error);
    res.status(500).json({ message: 'Failed to fetch book' });
  }
});

// Get related books
router.get('/related/:id', (req, res) => {
  try {
    const book = db.prepare('SELECT category FROM books WHERE id = ?').get(req.params.id);
    
    if (!book) {
      return res.json({ books: [] });
    }

    const books = db.prepare(`
      SELECT id, title, hebrew_title as hebrewTitle, price, image_url as image
      FROM books WHERE category = ? AND id != ? LIMIT 4
    `).all(book.category, req.params.id);

    res.json({ books });
  } catch (error) {
    console.error('Get related books error:', error);
    res.status(500).json({ message: 'Failed to fetch related books' });
  }
});

module.exports = router;

