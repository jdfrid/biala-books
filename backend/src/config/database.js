const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function initDatabase() {
  const client = await pool.connect();
  try {
    await client.query(`
      -- Users table (admin users)
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        role TEXT DEFAULT 'editor',
        status TEXT DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_login TIMESTAMP
      );

      -- Auth codes for 2FA
      CREATE TABLE IF NOT EXISTS auth_codes (
        id SERIAL PRIMARY KEY,
        email TEXT NOT NULL,
        code TEXT NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        used INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Books table
      CREATE TABLE IF NOT EXISTS books (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        hebrew_title TEXT,
        description TEXT,
        long_description TEXT,
        price REAL NOT NULL,
        category TEXT DEFAULT 'Torah',
        available INTEGER DEFAULT 1,
        pages INTEGER,
        binding TEXT DEFAULT 'Hardcover',
        language TEXT DEFAULT 'Hebrew/English',
        isbn TEXT,
        year INTEGER,
        image_url TEXT,
        orders_count INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- News/Updates table
      CREATE TABLE IF NOT EXISTS news (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        excerpt TEXT,
        content TEXT,
        category TEXT DEFAULT 'General',
        image_url TEXT,
        featured INTEGER DEFAULT 0,
        views INTEGER DEFAULT 0,
        date DATE DEFAULT CURRENT_DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Media table
      CREATE TABLE IF NOT EXISTS media (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        type TEXT NOT NULL,
        duration TEXT,
        url TEXT,
        thumbnail_url TEXT,
        views INTEGER DEFAULT 0,
        date DATE DEFAULT CURRENT_DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Publications table
      CREATE TABLE IF NOT EXISTS publications (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        hebrew_title TEXT,
        description TEXT,
        category TEXT DEFAULT 'Weekly',
        pages INTEGER,
        download_url TEXT,
        date DATE DEFAULT CURRENT_DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Newsletter subscribers
      CREATE TABLE IF NOT EXISTS subscribers (
        id SERIAL PRIMARY KEY,
        name TEXT,
        email TEXT UNIQUE NOT NULL,
        source TEXT,
        subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Book waitlist
      CREATE TABLE IF NOT EXISTS waitlist (
        id SERIAL PRIMARY KEY,
        book_id INTEGER NOT NULL REFERENCES books(id),
        email TEXT NOT NULL,
        notified INTEGER DEFAULT 0,
        added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Contact messages
      CREATE TABLE IF NOT EXISTS contact_messages (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        subject TEXT,
        message TEXT NOT NULL,
        read INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Donations
      CREATE TABLE IF NOT EXISTS donations (
        id SERIAL PRIMARY KEY,
        donor_name TEXT NOT NULL,
        email TEXT,
        amount REAL NOT NULL,
        cause TEXT DEFAULT 'General Fund',
        dedication TEXT,
        recurring INTEGER DEFAULT 0,
        stripe_payment_id TEXT,
        date DATE DEFAULT CURRENT_DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Orders
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        order_number TEXT UNIQUE NOT NULL,
        customer_name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT,
        shipping_address TEXT,
        items TEXT NOT NULL,
        subtotal REAL NOT NULL,
        shipping REAL DEFAULT 0,
        total REAL NOT NULL,
        status TEXT DEFAULT 'processing',
        tracking_number TEXT,
        stripe_payment_id TEXT,
        date DATE DEFAULT CURRENT_DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Social posts
      CREATE TABLE IF NOT EXISTS social_posts (
        id SERIAL PRIMARY KEY,
        content TEXT NOT NULL,
        platforms TEXT NOT NULL,
        image_url TEXT,
        link_url TEXT,
        status TEXT DEFAULT 'sent',
        scheduled_for TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Settings
      CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Kvitel (Prayer Requests)
      CREATE TABLE IF NOT EXISTS kvitel (
        id SERIAL PRIMARY KEY,
        first_name TEXT NOT NULL,
        ben TEXT,
        family_name TEXT,
        email TEXT,
        phone TEXT,
        address TEXT,
        blessing_for TEXT,
        additional_names TEXT,
        language TEXT DEFAULT 'he',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create default admin if not exists
    await client.query(`
      INSERT INTO users (name, email, role) 
      VALUES ('Admin', 'admin@bialapublishing.com', 'admin')
      ON CONFLICT (email) DO NOTHING
    `);

    console.log('✅ Database initialized successfully');
  } catch (error) {
    console.error('❌ Database initialization error:', error);
    throw error;
  } finally {
    client.release();
  }
}

module.exports = { pool, initDatabase };
