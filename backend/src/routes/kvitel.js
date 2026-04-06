const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');
const { sendEmail } = require('../services/email');

// Submit kvitel (prayer request)
router.post('/', async (req, res) => {
  try {
    const { firstName, ben, familyName, email, phone, address, blessingFor, additionalNames, language } = req.body;

    if (!firstName) {
      return res.status(400).json({ message: language === 'he' ? 'שם פרטי נדרש' : 'First name is required' });
    }

    // Save to database
    const result = await pool.query(`
      INSERT INTO kvitel (first_name, ben, family_name, email, phone, address, blessing_for, additional_names, language)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING id
    `, [firstName, ben, familyName, email, phone, address, blessingFor, JSON.stringify(additionalNames || []), language || 'he']);

    // Build email content
    const isHebrew = language === 'he';
    
    let namesHtml = '';
    if (additionalNames && additionalNames.length > 0) {
      namesHtml = `
        <h3>${isHebrew ? 'שמות נוספים להזכרה:' : 'Additional Names:'}</h3>
        <table style="border-collapse: collapse; width: 100%;">
          <tr style="background: #f5f5f5;">
            <th style="border: 1px solid #ddd; padding: 8px;">${isHebrew ? 'שם פרטי' : 'First Name'}</th>
            <th style="border: 1px solid #ddd; padding: 8px;">${isHebrew ? 'בן' : 'Ben'}</th>
            <th style="border: 1px solid #ddd; padding: 8px;">${isHebrew ? 'משפחה' : 'Family'}</th>
            <th style="border: 1px solid #ddd; padding: 8px;">${isHebrew ? 'ברכה ל...' : 'Blessing For'}</th>
          </tr>
          ${additionalNames.map(n => `
            <tr>
              <td style="border: 1px solid #ddd; padding: 8px;">${n.firstName || ''}</td>
              <td style="border: 1px solid #ddd; padding: 8px;">${n.ben || ''}</td>
              <td style="border: 1px solid #ddd; padding: 8px;">${n.familyName || ''}</td>
              <td style="border: 1px solid #ddd; padding: 8px;">${n.blessingFor || ''}</td>
            </tr>
          `).join('')}
        </table>
      `;
    }

    // Send email to admin
    await sendEmail({
      to: 'jdfrid@gmail.com',
      subject: isHebrew ? `בקשת הזכרה חדשה - ${firstName} ${familyName || ''}` : `New Prayer Request - ${firstName} ${familyName || ''}`,
      html: `
        <div style="font-family: ${isHebrew ? 'Arial, sans-serif' : 'Georgia, serif'}; max-width: 600px; margin: 0 auto; padding: 20px; direction: ${isHebrew ? 'rtl' : 'ltr'};">
          <h1 style="color: #1A2035; border-bottom: 2px solid #D4AF37; padding-bottom: 10px;">
            ${isHebrew ? 'בקשת הזכרה על ציון הרבי זצ"ל' : 'Prayer Request at the Rebbe\'s Tziun'}
          </h1>
          
          <h2>${isHebrew ? 'פרטי השולח:' : 'Sender Details:'}</h2>
          <table style="width: 100%; margin-bottom: 20px;">
            <tr><td><strong>${isHebrew ? 'שם פרטי:' : 'First Name:'}</strong></td><td>${firstName}</td></tr>
            <tr><td><strong>${isHebrew ? 'בן:' : 'Ben:'}</strong></td><td>${ben || '-'}</td></tr>
            <tr><td><strong>${isHebrew ? 'משפחה:' : 'Family Name:'}</strong></td><td>${familyName || '-'}</td></tr>
            <tr><td><strong>${isHebrew ? 'דוא"ל:' : 'Email:'}</strong></td><td>${email || '-'}</td></tr>
            <tr><td><strong>${isHebrew ? 'טלפון:' : 'Phone:'}</strong></td><td>${phone || '-'}</td></tr>
            <tr><td><strong>${isHebrew ? 'כתובת:' : 'Address:'}</strong></td><td>${address || '-'}</td></tr>
            <tr><td><strong>${isHebrew ? 'ברכה ל...:' : 'Blessing For:'}</strong></td><td>${blessingFor || '-'}</td></tr>
          </table>
          
          ${namesHtml}
          
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
          <p style="color: #666; font-size: 12px;">
            ${isHebrew ? 'התקבל בתאריך:' : 'Received on:'} ${new Date().toLocaleString(isHebrew ? 'he-IL' : 'en-US')}
          </p>
        </div>
      `
    });

    // Send confirmation to sender if email provided
    if (email) {
      await sendEmail({
        to: email,
        subject: isHebrew ? 'בקשת ההזכרה התקבלה' : 'Your Prayer Request Has Been Received',
        html: `
          <div style="font-family: ${isHebrew ? 'Arial, sans-serif' : 'Georgia, serif'}; max-width: 600px; margin: 0 auto; padding: 20px; direction: ${isHebrew ? 'rtl' : 'ltr'};">
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
    }

    res.json({ 
      message: isHebrew ? 'בקשת ההזכרה נשלחה בהצלחה' : 'Prayer request submitted successfully',
      id: result.rows[0].id 
    });
  } catch (error) {
    console.error('Kvitel error:', error);
    res.status(500).json({ message: 'Failed to submit prayer request', error: error.message });
  }
});

module.exports = router;
