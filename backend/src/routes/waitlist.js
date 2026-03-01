const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');
const { sendEmail } = require('../services/email');

// Join waitlist
router.post('/', async (req, res) => {
  try {
    const { bookId, email } = req.body;

    if (!bookId || !email) {
      return res.status(400).json({ message: 'Book ID and email are required' });
    }

    // Check if book exists
    const bookResult = await pool.query('SELECT * FROM books WHERE id = $1', [bookId]);
    if (bookResult.rows.length === 0) {
      return res.status(404).json({ message: 'Book not found' });
    }
    const book = bookResult.rows[0];

    // Check if already on waitlist
    const existing = await pool.query('SELECT * FROM waitlist WHERE book_id = $1 AND email = $2', [bookId, email]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ message: 'Already on waitlist for this book' });
    }

    // Add to waitlist
    await pool.query('INSERT INTO waitlist (book_id, email) VALUES ($1, $2)', [bookId, email]);

    // Send confirmation email
    await sendEmail({
      to: email,
      subject: `Waitlist Confirmation - ${book.title}`,
      html: `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
          <h1 style="color: #1A2035; font-size: 24px; margin-bottom: 20px;">You're on the Waitlist!</h1>
          <p style="color: #4A5568; font-size: 16px; line-height: 1.6;">
            Thank you for your interest in <strong>${book.title}</strong>.
          </p>
          <p style="color: #4A5568; font-size: 16px; line-height: 1.6;">
            We'll notify you as soon as this book becomes available. In the meantime, feel free to browse our other publications.
          </p>
          <hr style="border: none; border-top: 1px solid #E2E8F0; margin: 30px 0;">
          <p style="color: #A0AEC0; font-size: 12px; text-align: center;">
            Biala Publishing - Torah Writings of the Mevaser Tov
          </p>
        </div>
      `
    });

    res.json({ message: 'Successfully added to waitlist' });
  } catch (error) {
    console.error('Waitlist error:', error);
    res.status(500).json({ message: 'Failed to join waitlist' });
  }
});

module.exports = router;
