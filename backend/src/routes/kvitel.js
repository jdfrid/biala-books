const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');
const { sendEmail } = require('../services/email');
const PDFDocument = require('pdfkit');

// Generate PDF with names table (English headers, Hebrew names supported)
const generateKvitelPDF = (kvitelId, firstName, ben, familyName, blessingFor, additionalNames) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ 
        size: 'A4', 
        margin: 40,
        info: {
          Title: `Kvitel #${kvitelId}`,
          Author: 'Biala Publishing'
        }
      });
      
      const chunks = [];
      doc.on('data', chunk => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      // Title
      doc.fontSize(22).font('Helvetica-Bold')
         .text('KVITEL - Prayer Request', { align: 'center' });
      doc.moveDown(0.3);
      doc.fontSize(12).font('Helvetica')
         .text(`Kvitel #${kvitelId} | Date: ${new Date().toLocaleDateString('en-US')}`, { align: 'center' });
      doc.moveDown(1.5);

      // Build all names array
      const allNames = [
        { 
          name: firstName || '', 
          ben: ben || '', 
          family: familyName || '', 
          blessing: blessingFor || '' 
        }
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

      // Table configuration
      const startX = 40;
      const colWidths = [120, 100, 120, 170];
      const headers = ['Name', 'Ben (son of)', 'Family Name', 'Blessing For'];
      const rowHeight = 28;
      let y = doc.y;

      // Draw header row with background
      doc.rect(startX, y, colWidths.reduce((a, b) => a + b, 0), rowHeight).fill('#f0f0f0').stroke('#333');
      
      doc.font('Helvetica-Bold').fontSize(11).fillColor('#333');
      let x = startX;
      headers.forEach((header, i) => {
        doc.text(header, x + 5, y + 8, { width: colWidths[i] - 10 });
        x += colWidths[i];
      });
      
      y += rowHeight;

      // Draw data rows
      doc.font('Helvetica').fontSize(11).fillColor('#000');
      
      allNames.forEach((row, rowIndex) => {
        // Alternate row colors
        if (rowIndex % 2 === 0) {
          doc.rect(startX, y, colWidths.reduce((a, b) => a + b, 0), rowHeight).fill('#fafafa');
        }
        
        // Draw row border
        doc.rect(startX, y, colWidths.reduce((a, b) => a + b, 0), rowHeight).stroke('#ccc');
        
        // Draw cell borders and content
        x = startX;
        const rowData = [row.name, row.ben, row.family, row.blessing];
        doc.fillColor('#000');
        
        rowData.forEach((cell, i) => {
          // Vertical line
          if (i > 0) {
            doc.moveTo(x, y).lineTo(x, y + rowHeight).stroke('#ccc');
          }
          doc.text(cell || '-', x + 5, y + 8, { width: colWidths[i] - 10 });
          x += colWidths[i];
        });
        
        y += rowHeight;
      });

      // Summary
      doc.moveDown(2);
      doc.fontSize(10).fillColor('#666')
         .text(`Total names: ${allNames.length}`, startX);

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
        
        // Send email to admin with PDF attachment - minimal body
        await sendEmail({
          to: 'jdfrid@gmail.com',
          subject: `Kvitel #${kvitelId} - ${totalNames} names`,
          html: `
            <div style="font-family: Arial, sans-serif; padding: 15px;">
              <p><strong>Kvitel #${kvitelId}</strong> - ${totalNames} name(s) for prayer</p>
              <p style="color: #666; font-size: 13px;">PDF attached with names table for printing.</p>
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
