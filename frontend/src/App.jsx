import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Public pages
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import BooksPage from './pages/BooksPage';
import BookDetailPage from './pages/BookDetailPage';
import AboutRebbePage from './pages/AboutRebbePage';
import AboutBialaPage from './pages/AboutBialaPage';
import NewsPage from './pages/NewsPage';
import MediaPage from './pages/MediaPage';
import PublicationsPage from './pages/PublicationsPage';
import DonatePage from './pages/DonatePage';
import ContactPage from './pages/ContactPage';

// Admin pages
import AdminLayout from './pages/admin/AdminLayout';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminBooks from './pages/admin/AdminBooks';
import AdminNews from './pages/admin/AdminNews';
import AdminMedia from './pages/admin/AdminMedia';
import AdminSubscribers from './pages/admin/AdminSubscribers';
import AdminWaitlist from './pages/admin/AdminWaitlist';
import AdminOrders from './pages/admin/AdminOrders';
import AdminUsers from './pages/admin/AdminUsers';
import AdminDonations from './pages/admin/AdminDonations';
import AdminSocial from './pages/admin/AdminSocial';
import AdminSettings from './pages/admin/AdminSettings';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="books" element={<BooksPage />} />
            <Route path="books/:id" element={<BookDetailPage />} />
            <Route path="about/rebbe" element={<AboutRebbePage />} />
            <Route path="about/biala" element={<AboutBialaPage />} />
            <Route path="news" element={<NewsPage />} />
            <Route path="media" element={<MediaPage />} />
            <Route path="publications" element={<PublicationsPage />} />
            <Route path="donate" element={<DonatePage />} />
            <Route path="contact" element={<ContactPage />} />
          </Route>

          {/* Admin routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="books" element={<AdminBooks />} />
            <Route path="news" element={<AdminNews />} />
            <Route path="media" element={<AdminMedia />} />
            <Route path="subscribers" element={<AdminSubscribers />} />
            <Route path="waitlist" element={<AdminWaitlist />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="donations" element={<AdminDonations />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="social" element={<AdminSocial />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

