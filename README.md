# Biala Publishing Website

Official website for Biala Publishing - Torah Writings of the Mevaser Tov.

## Features

### Public Website
- 📚 Book catalog with search and filtering
- 📖 Detailed book pages with purchase/waitlist options
- 👤 About the Rebbe and Biala Hasidism
- 📰 News and updates
- 🎥 Media gallery (videos & audio)
- 📄 Downloadable publications
- 💝 Donation system
- 📧 Newsletter subscription
- 📱 Fully responsive design

### Admin Panel
- 📊 Dashboard with statistics
- 📚 Book management (CRUD)
- 📰 News management
- 🎥 Media management
- 👥 Subscriber management
- 📋 Waitlist management
- 🛒 Order tracking
- 💰 Donation tracking
- 👤 Admin user management with roles
- 🔐 2FA authentication (email code)
- 📤 Social media distribution (Telegram, WhatsApp, Facebook)

## Tech Stack

### Frontend
- React 18
- React Router v6
- Tailwind CSS
- Framer Motion
- Lucide Icons
- Axios

### Backend
- Node.js + Express
- SQLite (better-sqlite3)
- JWT Authentication
- Nodemailer
- Stripe (payments)

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/biala-books.git
cd biala-books
```

2. Install backend dependencies
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your settings
```

3. Install frontend dependencies
```bash
cd ../frontend
npm install
```

4. Start development servers

Backend:
```bash
cd backend
npm run dev
```

Frontend:
```bash
cd frontend
npm run dev
```

The frontend will be available at http://localhost:3000
The backend API will be available at http://localhost:5000

## Deployment

### Render.com
This project includes a `render.yaml` blueprint for easy deployment to Render.

1. Push to GitHub
2. Connect your GitHub repo to Render
3. Render will auto-detect the blueprint and deploy both services

### Environment Variables (Production)
Set these in your Render dashboard:
- `JWT_SECRET` - Secret key for JWT tokens
- `ADMIN_EMAIL` - Admin notification email
- `SMTP_HOST` - SMTP server host
- `SMTP_PORT` - SMTP server port
- `SMTP_USER` - SMTP username
- `SMTP_PASS` - SMTP password

## Default Admin Access
- Email: admin@bialapublishing.com
- A 6-digit code will be sent to this email for login

## License
Private - Biala Publishing


