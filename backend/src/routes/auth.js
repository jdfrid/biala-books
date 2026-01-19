const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const db = require('../config/database');
const { authenticateToken, generateToken } = require('../middleware/auth');
const { sendEmail } = require('../services/email');

// Request login code (2FA)
router.post('/request-code', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Check if user exists
    const user = db.prepare('SELECT * FROM users WHERE email = ? AND status = ?').get(email, 'active');
    
    if (!user) {
      return res.status(404).json({ message: 'No admin account found with this email' });
    }

    // Generate 6-digit code
    const code = crypto.randomInt(100000, 999999).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Save code to database
    db.prepare(`
      INSERT INTO auth_codes (email, code, expires_at) VALUES (?, ?, ?)
    `).run(email, code, expiresAt.toISOString());

    // Send email with code
    await sendEmail({
      to: email,
      subject: 'Your Biala Publishing Login Code',
      html: `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
          <h1 style="color: #1A2035; font-size: 24px; margin-bottom: 20px;">Login Verification</h1>
          <p style="color: #4A5568; font-size: 16px; line-height: 1.6;">
            Your verification code is:
          </p>
          <div style="background: #FDF9F0; border: 2px solid #C9A008; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #1A2035;">${code}</span>
          </div>
          <p style="color: #718096; font-size: 14px;">
            This code will expire in 10 minutes. If you didn't request this code, please ignore this email.
          </p>
          <hr style="border: none; border-top: 1px solid #E2E8F0; margin: 30px 0;">
          <p style="color: #A0AEC0; font-size: 12px; text-align: center;">
            Biala Publishing - Torah Writings of the Mevaser Tov
          </p>
        </div>
      `
    });

    res.json({ message: 'Verification code sent to your email' });
  } catch (error) {
    console.error('Request code error:', error);
    res.status(500).json({ message: 'Failed to send verification code' });
  }
});

// Verify code and login
router.post('/verify-code', (req, res) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({ message: 'Email and code are required' });
    }

    // Find valid code
    const authCode = db.prepare(`
      SELECT * FROM auth_codes 
      WHERE email = ? AND code = ? AND used = 0 AND expires_at > datetime('now')
      ORDER BY created_at DESC LIMIT 1
    `).get(email, code);

    if (!authCode) {
      return res.status(400).json({ message: 'Invalid or expired code' });
    }

    // Mark code as used
    db.prepare('UPDATE auth_codes SET used = 1 WHERE id = ?').run(authCode.id);

    // Get user
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);

    // Update last login
    db.prepare('UPDATE users SET last_login = datetime("now") WHERE id = ?').run(user.id);

    // Generate token
    const token = generateToken(user.id);

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Verify code error:', error);
    res.status(500).json({ message: 'Verification failed' });
  }
});

// Get current user
router.get('/me', authenticateToken, (req, res) => {
  res.json({
    user: {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role
    }
  });
});

module.exports = router;

