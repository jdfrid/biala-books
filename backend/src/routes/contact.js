const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { sendEmail } = require('../services/email');

// Send contact message
router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Save to database
    db.prepare(`
      INSERT INTO contact_messages (name, email, subject, message) VALUES (?, ?, ?, ?)
    `).run(name, email, subject, message);

    // Send notification to admin
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@bialapublishing.com';
    await sendEmail({
      to: adminEmail,
      subject: `New Contact Message: ${subject}`,
      html: `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
          <h1 style="color: #1A2035; font-size: 24px; margin-bottom: 20px;">New Contact Message</h1>
          <p><strong>From:</strong> ${name} (${email})</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <hr style="margin: 20px 0;">
          <p style="white-space: pre-wrap;">${message}</p>
        </div>
      `
    });

    // Send confirmation to sender
    await sendEmail({
      to: email,
      subject: 'We received your message',
      html: `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
          <h1 style="color: #1A2035; font-size: 24px; margin-bottom: 20px;">Thank you for reaching out!</h1>
          <p style="color: #4A5568; font-size: 16px; line-height: 1.6;">
            Dear ${name},
          </p>
          <p style="color: #4A5568; font-size: 16px; line-height: 1.6;">
            We've received your message and will get back to you as soon as possible.
          </p>
          <p style="color: #4A5568; font-size: 16px; line-height: 1.6;">
            Best regards,<br>
            Biala Publishing Team
          </p>
        </div>
      `
    });

    res.json({ message: 'Message sent successfully' });
  } catch (error) {
    console.error('Contact error:', error);
    res.status(500).json({ message: 'Failed to send message' });
  }
});

module.exports = router;

