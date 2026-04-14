const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');
const { sendEmail } = require('../services/email');

// Generate PDF with Hebrew support using Puppeteer
const generateKvitelPDF = async (kvitelId, firstName, ben, familyName, blessingFor, additionalNames) => {
  const puppeteer = require('puppeteer');
  
  // Build all names array
  const allNames = [
    { name: firstName || '', ben: ben || '', family: familyName || '', blessing: blessingFor || '' }
  ];
  
  if (additionalNames && additionalNames.length > 0) {
    additionalNames.forEach(n => {
      allNames.push({
        name: n.firstName || '',
        ben: n.ben || '',
        family: n.familyName || '',
        blessing: n.blessingFor || ''
      });
    });
  }

  // Generate HTML with Hebrew support
  const html = `
    <!DOCTYPE html>
    <html dir="rtl" lang="he">
    <head>
      <meta charset="UTF-8">
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Heebo:wght@400;700&display=swap');
        * { font-family: 'Heebo', Arial, sans-serif; }
        body { padding: 40px; direction: rtl; }
        h1 { text-align: center; color: #1a2035; margin-bottom: 5px; }
        .subtitle { text-align: center; color: #666; margin-bottom: 30px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        th { background: #f5f5f5; padding: 12px 8px; border: 1px solid #ddd; text-align: right; font-weight: 700; }
        td { padding: 10px 8px; border: 1px solid #ddd; text-align: right; }
        tr:nth-child(even) { background: #fafafa; }
        .footer { color: #999; font-size: 12px; margin-top: 20px; }
      </style>
    </head>
    <body>
      <h1>קוויטל להזכרה</h1>
      <p class="subtitle">Kvitel #${kvitelId} | ${new Date().toLocaleDateString('he-IL')}</p>
      
      <table>
        <thead>
          <tr>
            <th>שם</th>
            <th>בן</th>
            <th>משפחה</th>
            <th>ברכה ל</th>
          </tr>
        </thead>
        <tbody>
          ${allNames.map(row => `
            <tr>
              <td>${row.name || '-'}</td>
              <td>${row.ben || '-'}</td>
              <td>${row.family || '-'}</td>
              <td>${row.blessing || '-'}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      
      <p class="footer">סה"כ שמות: ${allNames.length}</p>
    </body>
    </html>
  `;

  // Launch browser and generate PDF
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0' });
  
  const pdfBuffer = await page.pdf({
    format: 'A4',
    printBackground: true,
    margin: { top: '20px', right: '20px', bottom: '20px', left: '20px' }
  });
  
  await browser.close();
  
  return pdfBuffer;
};

// Submit kvitel (prayer request)
router.post('/', async (req, res) => {
  try {
    const { firstName, ben, familyName, email, phone, address, blessingFor, additionalNames, language } = req.body;

    if (!firstName) {
      return res.status(400).json({ message: language === 'he' ? 'שם פרטי נדרש' : 'First name is required' });
    }

    // Save to database first
    const result = await pool.query(`
      INSERT INTO kvitel (first_name, ben, family_name, email, phone, address, blessing_for, additional_names, language)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING id
    `, [firstName, ben, familyName, email, phone, address, blessingFor, JSON.stringify(additionalNames || []), language || 'he']);

    const kvitelId = result.rows[0].id;
    const isHebrew = language === 'he';
    const totalNames = 1 + (additionalNames?.length || 0);

    // Send response immediately - don't wait for emails
    res.json({ 
      message: isHebrew ? 'בקשת ההזכרה נשלחה בהצלחה' : 'Prayer request submitted successfully',
      id: kvitelId 
    });

    // Send emails in background (don't block response)
    setImmediate(async () => {
      try {
        // Generate PDF with names only
        const pdfBuffer = await generateKvitelPDF(kvitelId, firstName, ben, familyName, blessingFor, additionalNames);
        
        // Send email to admin with PDF attachment
        await sendEmail({
          to: 'jdfrid@gmail.com',
          subject: `קוויטל #${kvitelId} - ${totalNames} שמות`,
          html: `
            <div style="font-family: Arial, sans-serif; padding: 15px; direction: rtl; text-align: right;">
              <p><strong>קוויטל #${kvitelId}</strong> - ${totalNames} שמות להזכרה</p>
              <p style="color: #666; font-size: 13px;">מצורף PDF עם טבלת השמות להדפסה.</p>
            </div>
          `,
          attachments: [
            {
              filename: `kvitel_${kvitelId}.pdf`,
              content: pdfBuffer
            }
          ]
        });
        console.log('✅ Admin email sent with PDF for kvitel #' + kvitelId);

        // Send confirmation to sender if email provided
        if (email) {
          await sendEmail({
            to: email,
            subject: isHebrew ? 'בקשת ההזכרה התקבלה' : 'Your Prayer Request Has Been Received',
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; direction: ${isHebrew ? 'rtl' : 'ltr'};">
                <h1 style="color: #1A2035;">
                  ${isHebrew ? 'בקשת ההזכרה התקבלה בהצלחה' : 'Your Prayer Request Has Been Received'}
                </h1>
                <p style="color: #4A5568; font-size: 16px; line-height: 1.6;">
                  ${isHebrew 
                    ? 'תודה רבה על פנייתך. השמות יוזכרו על ציון הרבי מבשר טוב זצ"ל.' 
                    : 'Thank you for your submission. The names will be mentioned at the Tziun of the Mevaser Tov zt"l.'}
                </p>
                <p style="color: #4A5568; font-size: 16px; line-height: 1.6;">
                  ${isHebrew ? 'בברכה,' : 'With blessings,'}
                  <br>
                  ${isHebrew ? 'הוצאת ביאלא' : 'Biala Publishing'}
                </p>
              </div>
            `
          });
          console.log('✅ Confirmation email sent to ' + email);
        }
      } catch (emailError) {
        console.error('❌ Email error for kvitel #' + kvitelId + ':', emailError.message);
      }
    });

  } catch (error) {
    console.error('Kvitel error:', error);
    res.status(500).json({ message: 'Failed to submit prayer request', error: error.message });
  }
});

module.exports = router;
