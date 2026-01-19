const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { sendEmail } = require('../services/email');

// Subscribe to newsletter
router.post('/subscribe', async (req, res) => {
  try {
    const { email, name, source = 'Website' } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Check if already subscribed
    const existing = db.prepare('SELECT * FROM subscribers WHERE email = ?').get(email);
    if (existing) {
      return res.status(400).json({ message: 'Email already subscribed' });
    }

    // Add subscriber
    db.prepare(`
      INSERT INTO subscribers (name, email, source) VALUES (?, ?, ?)
    `).run(name || null, email, source);

    // Send welcome email
    await sendEmail({
      to: email,
      subject: 'Welcome to Biala Publishing',
      html: `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
          <h1 style="color: #1A2035; font-size: 24px; margin-bottom: 20px;">Welcome${name ? `, ${name}` : ''}!</h1>
          <p style="color: #4A5568; font-size: 16px; line-height: 1.6;">
            Thank you for subscribing to our mailing list. You'll now receive updates about:
          </p>
          <ul style="color: #4A5568; font-size: 16px; line-height: 1.8;">
            <li>New book releases and publications</li>
            <li>Torah teachings and insights</li>
            <li>Community events and gatherings</li>
            <li>Special sponsorship opportunities</li>
          </ul>
          <p style="color: #4A5568; font-size: 16px; line-height: 1.6;">
            Visit our website to explore our collection of sacred writings from the Mevaser Tov.
          </p>
          <hr style="border: none; border-top: 1px solid #E2E8F0; margin: 30px 0;">
          <p style="color: #A0AEC0; font-size: 12px; text-align: center;">
            Biala Publishing - Torah Writings of the Mevaser Tov
          </p>
        </div>
      `
    });

    // Notify admin
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@bialapublishing.com';
    await sendEmail({
      to: adminEmail,
      subject: 'New Newsletter Subscriber',
      html: `<p>New subscriber: ${name || 'N/A'} (${email}) from ${source}</p>`
    });

    res.json({ message: 'Successfully subscribed' });
  } catch (error) {
    console.error('Subscribe error:', error);
    res.status(500).json({ message: 'Failed to subscribe' });
  }
});

module.exports = router;

