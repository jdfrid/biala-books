const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');
const { sendEmail } = require('../services/email');
const PDFDocument = require('pdfkit');

// Generate PDF with names table
const generateKvitelPDF = (firstName, ben, familyName, blessingFor, additionalNames) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ 
        size: 'A4', 
        margin: 50,
        info: {
          Title: 'Kvitel - Prayer Request',
          Author: 'Biala Publishing'
        }
      });
      
      const chunks = [];
      doc.on('data', chunk => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      // Title
      doc.fontSize(20).font('Helvetica-Bold')
         .text('בקשת הזכרה על ציון הרבי זצ"ל', { align: 'center' });
      doc.moveDown(0.5);
      doc.fontSize(14).font('Helvetica')
         .text('Prayer Request at the Rebbe\'s Tziun', { align: 'center' });
      doc.moveDown(2);

      // Table configuration
      const tableTop = doc.y;
      const colWidths = [100, 80, 100, 100, 120];
      const headers = ['שם / Name', 'בן / Ben', 'אב/אם', 'משפחה / Family', 'ברכה ל / Blessing'];
      const startX = 50;

      // Draw header row
      doc.font('Helvetica-Bold').fontSize(10);
      let x = startX;
      headers.forEach((header, i) => {
        doc.rect(x, tableTop, colWidths[i], 25).stroke();
        doc.text(header, x + 5, tableTop + 8, { width: colWidths[i] - 10 });
        x += colWidths[i];
      });

      // Data rows
      doc.font('Helvetica').fontSize(10);
      let y = tableTop + 25;
      
      // Main person row
      const allRows = [
        { firstName, ben: ben || '', parent: ben || '', familyName: familyName || '', blessingFor: blessingFor || '' }
      ];
      
      // Add additional names
      if (additionalNames && additionalNames.length > 0) {
        additionalNames.forEach(name => {
          allRows.push({
            firstName: name.firstName || '',
            ben: name.ben || '',
            parent: name.ben || '',
            familyName: name.familyName || '',
            blessingFor: name.blessingFor || ''
          });
        });
      }

      // Draw data rows
      allRows.forEach(row => {
        x = startX;
        const rowData = [row.firstName, row.ben, row.parent, row.familyName, row.blessingFor];
        rowData.forEach((cell, i) => {
          doc.rect(x, y, colWidths[i], 22).stroke();
          doc.text(cell, x + 5, y + 6, { width: colWidths[i] - 10 });
          x += colWidths[i];
        });
        y += 22;
      });

      // Footer
      doc.moveDown(3);
      doc.fontSize(9).fillColor('#666')
         .text(`Date: ${new Date().toLocaleDateString('en-US')}`, { align: 'center' });

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
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

    // Send response immediately - don't wait for emails
    res.json({ 
      message: isHebrew ? 'בקשת ההזכרה נשלחה בהצלחה' : 'Prayer request submitted successfully',
      id: kvitelId 
    });

    // Send emails in background (don't block response)
    setImmediate(async () => {
      try {
        // Generate PDF with names only
        const pdfBuffer = await generateKvitelPDF(firstName, ben, familyName, blessingFor, additionalNames);
        
        // Send email to admin with PDF attachment
        await sendEmail({
          to: 'jdfrid@gmail.com',
          subject: `קוויטל חדש - ${firstName} ${familyName || ''} - Kvitel #${kvitelId}`,
          html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; direction: rtl; text-align: right;">
              <h2 style="color: #1A2035;">קוויטל חדש להזכרה</h2>
              <p style="font-size: 16px; color: #333;">
                התקבל קוויטל חדש עם <strong>${1 + (additionalNames?.length || 0)}</strong> שמות להזכרה.
              </p>
              <p style="font-size: 14px; color: #666;">
                מצורף קובץ PDF עם טבלת השמות להדפסה.
              </p>
              <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">
              <p style="font-size: 12px; color: #999;">
                תאריך: ${new Date().toLocaleDateString('he-IL')}
              </p>
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

        // Send confirmation to sender if email provided (no PDF for user)
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
