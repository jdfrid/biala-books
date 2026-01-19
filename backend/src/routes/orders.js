const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { v4: uuidv4 } = require('uuid');
const { sendEmail } = require('../services/email');

// Create order
router.post('/', async (req, res) => {
  try {
    const { customerName, email, phone, shippingAddress, items } = req.body;

    if (!customerName || !email || !shippingAddress || !items?.length) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Calculate totals
    let subtotal = 0;
    for (const item of items) {
      const book = db.prepare('SELECT price FROM books WHERE id = ?').get(item.bookId);
      if (book) {
        subtotal += book.price * item.quantity;
      }
    }
    const shipping = 10; // Flat rate
    const total = subtotal + shipping;

    // Generate order number
    const orderNumber = `ORD-${Date.now().toString(36).toUpperCase()}`;

    // Save order
    const result = db.prepare(`
      INSERT INTO orders (order_number, customer_name, email, phone, shipping_address, items, subtotal, shipping, total)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(orderNumber, customerName, email, phone || null, shippingAddress, JSON.stringify(items), subtotal, shipping, total);

    // Update book order counts
    for (const item of items) {
      db.prepare('UPDATE books SET orders_count = orders_count + ? WHERE id = ?').run(item.quantity, item.bookId);
    }

    // Send confirmation email
    await sendEmail({
      to: email,
      subject: `Order Confirmation - ${orderNumber}`,
      html: `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
          <h1 style="color: #1A2035; font-size: 24px; margin-bottom: 20px;">Order Confirmation</h1>
          <p style="color: #4A5568; font-size: 16px; line-height: 1.6;">
            Thank you for your order, ${customerName}!
          </p>
          <p style="color: #4A5568; font-size: 16px;">
            Order Number: <strong>${orderNumber}</strong>
          </p>
          <p style="color: #4A5568; font-size: 16px;">
            Total: <strong>$${total}</strong>
          </p>
          <p style="color: #4A5568; font-size: 16px; line-height: 1.6;">
            We'll send you another email when your order ships.
          </p>
        </div>
      `
    });

    res.json({ 
      message: 'Order created successfully', 
      orderNumber,
      total 
    });
  } catch (error) {
    console.error('Order error:', error);
    res.status(500).json({ message: 'Failed to create order' });
  }
});

// Get order status
router.get('/:orderNumber', (req, res) => {
  try {
    const order = db.prepare(`
      SELECT order_number, customer_name, status, tracking_number, date
      FROM orders WHERE order_number = ?
    `).get(req.params.orderNumber);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({ order });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ message: 'Failed to fetch order' });
  }
});

module.exports = router;

