const nodemailer = require('nodemailer');

// Create transporter only if SMTP is configured
let transporter = null;

const initTransporter = () => {
  if (process.env.SMTP_USER && process.env.SMTP_PASS) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
    console.log('✅ SMTP configured for:', process.env.SMTP_USER);
  } else {
    console.log('⚠️ SMTP not configured - emails will be logged only');
  }
};

// Initialize on load
initTransporter();

const sendEmail = async ({ to, subject, html }) => {
  console.log(`📧 Attempting to send email to: ${to}`);
  
  // If SMTP not configured, just log
  if (!transporter) {
    console.log('📧 [DEV MODE] Email would be sent:');
    console.log(`   To: ${to}`);
    console.log(`   Subject: ${subject}`);
    return { messageId: 'dev-' + Date.now(), devMode: true };
  }

  try {
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || `"Biala Publishing" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html
    });
    console.log('✅ Email sent successfully:', info.messageId);
    return info;
  } catch (error) {
    console.error('❌ Email error:', error.message);
    console.error('   Full error:', error);
    throw error;
  }
};

// Test SMTP connection
const testConnection = async () => {
  if (!transporter) {
    return { success: false, message: 'SMTP not configured' };
  }
  
  try {
    await transporter.verify();
    console.log('✅ SMTP connection verified');
    return { success: true, message: 'SMTP connection OK' };
  } catch (error) {
    console.error('❌ SMTP connection failed:', error.message);
    return { success: false, message: error.message };
  }
};

module.exports = { sendEmail, testConnection };
