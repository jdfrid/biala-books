const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const { pool } = require('../config/database');
const { authenticateToken, generateToken } = require('../middleware/auth');
const { sendEmail } = require('../services/email');

// Request login code (2FA)
router.post('/request-code', async (req, res) => {
  try {
    let { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    email = email.toLowerCase().trim();
    console.log(`🔐 Login attempt for: ${email}`);

    // Check if user exists
    let userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    let user = userResult.rows[0];
    
    if (!user) {
      console.log(`👤 Creating new admin user: ${email}`);
      await pool.query(
        'INSERT INTO users (name, email, role) VALUES ($1, $2, $3)',
        [email.split('@')[0], email, 'admin']
      );
      userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
      user = userResult.rows[0];
    }

    // Generate 6-digit code
    const code = crypto.randomInt(100000, 999999).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    console.log(`🔑 Generated code: ${code} for ${email}`);

    // Save code to database
    await pool.query(
      'INSERT INTO auth_codes (email, code, expires_at) VALUES ($1, $2, $3)',
      [email, code, expiresAt]
    );

    // Try to send email
    let emailSent = false;
    let emailError = null;
    
    try {
      const result = await sendEmail({
        to: email,
        subject: 'Your Biala Publishing Login Code',
        html: `
          <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
            <h1 style="color: #1A2035; font-size: 24px; margin-bottom: 20px;">Login Verification</h1>
            <p style="color: #4A5568; font-size: 16px; line-height: 1.6;">
              Your verification code is:
            </p>
            <div style="background: #FDF9F0; border: 2px solid #D4AF37; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0;">
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
      emailSent = !result.devMode;
      console.log(`📧 Email ${emailSent ? 'sent' : 'logged (dev mode)'}`);
    } catch (err) {
      emailError = err.message;
      console.error(`❌ Email failed: ${err.message}`);
    }

    res.json({ 
      message: emailSent 
        ? 'Verification code sent to your email' 
        : 'Verification code generated (check below)',
      emailSent,
      emailError: emailError || undefined,
      devCode: code
    });
    
  } catch (error) {
    console.error('❌ Request code error:', error);
    res.status(500).json({ message: 'Failed to generate verification code', error: error.message });
  }
});

// Verify code and login
router.post('/verify-code', async (req, res) => {
  try {
    let { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({ message: 'Email and code are required' });
    }

    email = email.toLowerCase().trim();
    code = code.trim();

    console.log(`🔓 Verifying code for: ${email}, code: ${code}`);

    // Find the most recent code for this email
    const authCodeResult = await pool.query(`
      SELECT * FROM auth_codes 
      WHERE email = $1 AND code = $2 AND used = 0
      ORDER BY created_at DESC LIMIT 1
    `, [email, code]);

    const authCode = authCodeResult.rows[0];
    console.log(`🔍 Found auth code:`, authCode ? 'yes' : 'no');

    if (!authCode) {
      const allCodesResult = await pool.query(
        'SELECT code, used, expires_at FROM auth_codes WHERE email = $1 ORDER BY created_at DESC LIMIT 5',
        [email]
      );
      console.log(`📋 Recent codes for ${email}:`, allCodesResult.rows);
      return res.status(400).json({ message: 'Invalid or expired code' });
    }

    // Check expiration
    const expiresAt = new Date(authCode.expires_at);
    const now = new Date();
    console.log(`⏰ Expires: ${expiresAt.toISOString()}, Now: ${now.toISOString()}`);
    
    if (now > expiresAt) {
      console.log(`❌ Code expired for ${email}`);
      return res.status(400).json({ message: 'Code has expired. Please request a new one.' });
    }

    // Mark code as used
    await pool.query('UPDATE auth_codes SET used = 1 WHERE id = $1', [authCode.id]);

    // Get user
    const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = userResult.rows[0];

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update last login
    await pool.query('UPDATE users SET last_login = NOW() WHERE id = $1', [user.id]);

    // Generate token
    const token = generateToken(user.id);

    console.log(`✅ Login successful for: ${email}`);

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
    console.error('❌ Verify code error:', error);
    res.status(500).json({ message: 'Verification failed', error: error.message });
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
