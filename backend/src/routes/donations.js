const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { sendEmail } = require('../services/email');

// Process donation (placeholder - integrate with Stripe)
router.post('/', async (req, res) => {
  try {
    const { name, email, amount, cause, dedication, recurring } = req.body;

    if (!name || !amount || !cause) {
      return res.status(400).json({ message: 'Name, amount, and cause are required' });
    }

    // Save donation
    const result = db.prepare(`
      INSERT INTO donations (donor_name, email, amount, cause, dedication, recurring)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(name, email || null, amount, cause, dedication || null, recurring ? 1 : 0);

    // Send confirmation email
    if (email) {
      await sendEmail({
        to: email,
        subject: 'Thank You for Your Donation',
        html: `
          <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
            <h1 style="color: #1A2035; font-size: 24px; margin-bottom: 20px;">Thank You for Your Generous Donation!</h1>
            <p style="color: #4A5568; font-size: 16px; line-height: 1.6;">
              Dear ${name},
            </p>
            <p style="color: #4A5568; font-size: 16px; line-height: 1.6;">
              We gratefully acknowledge your donation of <strong>$${amount}</strong> to ${cause}.
            </p>
            ${dedication ? `<p style="color: #4A5568; font-size: 16px; line-height: 1.6;"><em>${dedication}</em></p>` : ''}
            <p style="color: #4A5568; font-size: 16px; line-height: 1.6;">
              Your support helps us spread Torah and Chassidus throughout the world. May you be blessed with all good things.
            </p>
            <p style="color: #718096; font-size: 14px; margin-top: 30px;">
              Biala Publishing is a 501(c)(3) organization. This receipt serves as documentation of your tax-deductible contribution.
            </p>
          </div>
        `
      });
    }

    // Notify admin
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@bialapublishing.com';
    await sendEmail({
      to: adminEmail,
      subject: `New Donation: $${amount}`,
      html: `<p>New donation from ${name}: $${amount} to ${cause}</p>`
    });

    res.json({ message: 'Donation processed successfully', id: result.lastInsertRowid });
  } catch (error) {
    console.error('Donation error:', error);
    res.status(500).json({ message: 'Failed to process donation' });
  }
});

module.exports = router;

