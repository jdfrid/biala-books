const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');
const { sendEmail } = require('../services/email');

// Generate HTML table for email (Hebrew supported)
const generateNamesTable = (firstName, ben, familyName, blessingFor, additionalNames) => {
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

  return `
    <table style="width: 100%; border-collapse: collapse; direction: rtl; text-align: right; font-family: Arial, sans-serif;">
      <thead>
        <tr style="background: #f5f5f5;">
          <th style="border: 1px solid #ddd; padding: 12px 8px; font-weight: bold;">שם</th>
          <th style="border: 1px solid #ddd; padding: 12px 8px; font-weight: bold;">בן</th>
          <th style="border: 1px solid #ddd; padding: 12px 8px; font-weight: bold;">משפחה</th>
          <th style="border: 1px solid #ddd; padding: 12px 8px; font-weight: bold;">ברכה ל</th>
        </tr>
      </thead>
      <tbody>
        ${allNames.map((row, i) => `
          <tr style="background: ${i % 2 === 0 ? '#fff' : '#fafafa'};">
            <td style="border: 1px solid #ddd; padding: 10px 8px;">${row.name || '-'}</td>
            <td style="border: 1px solid #ddd; padding: 10px 8px;">${row.ben || '-'}</td>
            <td style="border: 1px solid #ddd; padding: 10px 8px;">${row.family || '-'}</td>
            <td style="border: 1px solid #ddd; padding: 10px 8px;">${row.blessing || '-'}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
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
        // Generate names table HTML
        const namesTable = generateNamesTable(firstName, ben, familyName, blessingFor, additionalNames);
        
        // Send email to admin with table in body
        await sendEmail({
          to: 'jdfrid@gmail.com',
          subject: `קוויטל #${kvitelId} - ${totalNames} שמות להזכרה`,
          html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; direction: rtl; text-align: right; max-width: 600px;">
              <h2 style="color: #1a2035; margin-bottom: 5px;">קוויטל להזכרה</h2>
              <p style="color: #666; margin-bottom: 20px;">מספר: ${kvitelId} | תאריך: ${new Date().toLocaleDateString('he-IL')}</p>
              
              ${namesTable}
              
              <p style="color: #666; font-size: 13px; margin-top: 15px;">סה"כ שמות: ${totalNames}</p>
            </div>
          `
        });
        console.log('✅ Admin email sent for kvitel #' + kvitelId);

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
