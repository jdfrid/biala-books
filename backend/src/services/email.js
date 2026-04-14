// Email service - supports Resend (recommended) or SMTP fallback

let sendEmailFn = null;

// Initialize email service
const initEmailService = () => {
  // Prefer Resend if configured
  if (process.env.RESEND_API_KEY) {
    const { Resend } = require('resend');
    const resend = new Resend(process.env.RESEND_API_KEY);
    
    console.log('✅ Email configured with Resend');
    
    sendEmailFn = async ({ to, subject, html, attachments }) => {
      const emailData = {
        from: process.env.EMAIL_FROM || 'Biala Publishing <onboarding@resend.dev>',
        to: [to],
        subject,
        html
      };
      
      // Add attachments if provided
      if (attachments && attachments.length > 0) {
        emailData.attachments = attachments.map(att => ({
          filename: att.filename,
          content: att.content
        }));
      }
      
      const result = await resend.emails.send(emailData);
      
      if (result.error) {
        throw new Error(result.error.message);
      }
      
      console.log('✅ Email sent via Resend:', result.data?.id);
      return { messageId: result.data?.id };
    };
    return;
  }
  
  // Fallback to SMTP if configured
  if (process.env.SMTP_USER && process.env.SMTP_PASS) {
    const nodemailer = require('nodemailer');
    const port = parseInt(process.env.SMTP_PORT || '465');
    
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: port,
      secure: port === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      },
      tls: { rejectUnauthorized: false }
    });
    
    console.log('✅ Email configured with SMTP:', process.env.SMTP_USER);
    
    sendEmailFn = async ({ to, subject, html, attachments }) => {
      const mailOptions = {
        from: process.env.SMTP_FROM || `"Biala Publishing" <${process.env.SMTP_USER}>`,
        to,
        subject,
        html
      };
      
      // Add attachments if provided
      if (attachments && attachments.length > 0) {
        mailOptions.attachments = attachments.map(att => ({
          filename: att.filename,
          content: att.content,
          contentType: att.contentType || 'application/pdf'
        }));
      }
      
      const info = await transporter.sendMail(mailOptions);
      console.log('✅ Email sent via SMTP:', info.messageId);
      return info;
    };
    return;
  }
  
  // No email service configured - log only
  console.log('⚠️ No email service configured - emails will be logged only');
  sendEmailFn = async ({ to, subject, html, attachments }) => {
    console.log('📧 [DEV MODE] Email would be sent:');
    console.log(`   To: ${to}`);
    console.log(`   Subject: ${subject}`);
    if (attachments) console.log(`   Attachments: ${attachments.length}`);
    return { messageId: 'dev-' + Date.now(), devMode: true };
  };
};

// Initialize on load
initEmailService();

const sendEmail = async ({ to, subject, html, attachments }) => {
  console.log(`📧 Sending email to: ${to}`);
  try {
    return await sendEmailFn({ to, subject, html, attachments });
  } catch (error) {
    console.error('❌ Email error:', error.message);
    throw error;
  }
};

const testConnection = async () => {
  if (process.env.RESEND_API_KEY) {
    return { success: true, service: 'Resend', message: 'Resend API configured' };
  }
  if (process.env.SMTP_USER) {
    return { success: true, service: 'SMTP', message: 'SMTP configured for ' + process.env.SMTP_USER };
  }
  return { success: false, message: 'No email service configured' };
};

module.exports = { sendEmail, testConnection };
