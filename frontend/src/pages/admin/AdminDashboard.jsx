import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Users, 
  ShoppingCart, 
  Heart,
  TrendingUp,
  Calendar,
  Bell,
  Eye,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import api from '../../services/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [recentDonations, setRecentDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/admin/stats').catch(() => ({ data: {} })),
      api.get('/admin/orders/recent').catch(() => ({ data: { orders: [] } })),
      api.get('/admin/donations/recent').catch(() => ({ data: { donations: [] } })),
    ]).then(([statsRes, ordersRes, donationsRes]) => {
      setStats(statsRes.data || placeholderStats);
      setRecentOrders(ordersRes.data.orders || placeholderOrders);
      setRecentDonations(donationsRes.data.donations || placeholderDonations);
    }).finally(() => setLoading(false));
  }, []);

  const placeholderStats = {
    totalBooks: 25,
    totalOrders: 1234,
    totalDonations: 45678,
    subscribers: 2345,
    waitlistCount: 89,
    ordersThisMonth: 56,
    donationsThisMonth: 12340,
    visitorsThisWeek: 8765,
    ordersChange: 12.5,
    donationsChange: -3.2,
  };

  const placeholderOrders = [
    { id: 'ORD-001', customer: 'John Doe', items: 2, total: 70, date: '2026-01-18', status: 'completed' },
    { id: 'ORD-002', customer: 'Sarah Cohen', items: 1, total: 35, date: '2026-01-18', status: 'processing' },
    { id: 'ORD-003', customer: 'David Levy', items: 3, total: 105, date: '2026-01-17', status: 'shipped' },
    { id: 'ORD-004', customer: 'Rachel Green', items: 1, total: 28, date: '2026-01-17', status: 'completed' },
    { id: 'ORD-005', customer: 'Michael Brown', items: 2, total: 63, date: '2026-01-16', status: 'completed' },
  ];

  const placeholderDonations = [
    { id: 'DON-001', donor: 'Anonymous', amount: 500, cause: 'General Fund', date: '2026-01-18' },
    { id: 'DON-002', donor: 'Moshe Goldstein', amount: 180, cause: 'Book Publishing', date: '2026-01-18' },
    { id: 'DON-003', donor: 'Chaim Weiss', amount: 360, cause: 'Institutions', date: '2026-01-17' },
    { id: 'DON-004', donor: 'Anonymous', amount: 100, cause: 'General Fund', date: '2026-01-17' },
  ];

  const displayStats = stats || placeholderStats;
  const displayOrders = recentOrders.length > 0 ? recentOrders : placeholderOrders;
  const displayDonations = recentDonations.length > 0 ? recentDonations : placeholderDonations;

  const statCards = [
    { 
      title: 'Total Books', 
      value: displayStats.totalBooks, 
      icon: BookOpen, 
      color: 'bg-blue-500',
      link: '/admin/books'
    },
    { 
      title: 'Orders This Month', 
      value: displayStats.ordersThisMonth, 
      icon: ShoppingCart, 
      color: 'bg-green-500',
      change: displayStats.ordersChange,
      link: '/admin/orders'
    },
    { 
      title: 'Donations This Month', 
      value: `$${displayStats.donationsThisMonth?.toLocaleString()}`, 
      icon: Heart, 
      color: 'bg-pink-500',
      change: displayStats.donationsChange,
      link: '/admin/donations'
    },
    { 
      title: 'Subscribers', 
      value: displayStats.subscribers?.toLocaleString(), 
      icon: Users, 
      color: 'bg-purple-500',
      link: '/admin/subscribers'
    },
    { 
      title: 'Waitlist', 
      value: displayStats.waitlistCount, 
      icon: Bell, 
      color: 'bg-orange-500',
      link: '/admin/waitlist'
    },
    { 
      title: 'Weekly Visitors', 
      value: displayStats.visitorsThisWeek?.toLocaleString(), 
      icon: Eye, 
      color: 'bg-indigo-500',
    },
  ];

  const getStatusBadge = (status) => {
    const styles = {
      completed: 'badge-success',
      processing: 'badge-warning',
      shipped: 'badge-info',
      cancelled: 'badge-danger',
    };
    return styles[status] || 'badge-info';
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="card p-6">
              <div className="h-10 w-10 bg-cream-200 rounded-lg mb-4"></div>
              <div className="h-8 bg-cream-200 rounded mb-2"></div>
              <div className="h-4 bg-cream-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page title */}
      <div>
        <h1 className="font-display text-3xl font-bold text-navy-900">Dashboard</h1>
        <p className="text-navy-600">Welcome back! Here's what's happening.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Link 
              to={stat.link || '#'}
              className="card p-4 block hover:shadow-lg transition-shadow"
            >
              <div className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center mb-3`}>
                <stat.icon size={20} className="text-white" />
              </div>
              <div className="font-display text-2xl font-bold text-navy-900">
                {stat.value}
              </div>
              <div className="text-navy-600 text-sm">{stat.title}</div>
              {stat.change !== undefined && (
                <div className={`flex items-center gap-1 mt-1 text-xs ${stat.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.change >= 0 ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
                  {Math.abs(stat.change)}% vs last month
                </div>
              )}
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-xl font-bold text-navy-900">Recent Orders</h2>
            <Link to="/admin/orders" className="text-gold-600 text-sm hover:text-gold-700">
              View All
            </Link>
          </div>
          <div className="space-y-4">
            {displayOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between py-3 border-b border-cream-200 last:border-0">
                <div>
                  <div className="font-semibold text-navy-900">{order.id}</div>
                  <div className="text-navy-600 text-sm">{order.customer}</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-navy-900">${order.total}</div>
                  <span className={`badge ${getStatusBadge(order.status)}`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Donations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-xl font-bold text-navy-900">Recent Donations</h2>
            <Link to="/admin/donations" className="text-gold-600 text-sm hover:text-gold-700">
              View All
            </Link>
          </div>
          <div className="space-y-4">
            {displayDonations.map((donation) => (
              <div key={donation.id} className="flex items-center justify-between py-3 border-b border-cream-200 last:border-0">
                <div>
                  <div className="font-semibold text-navy-900">{donation.donor}</div>
                  <div className="text-navy-600 text-sm">{donation.cause}</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-green-600">${donation.amount}</div>
                  <div className="text-navy-500 text-xs">{donation.date}</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="card p-6"
      >
        <h2 className="font-display text-xl font-bold text-navy-900 mb-4">Quick Actions</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
          <Link to="/admin/books" className="btn-primary text-center">
            Add New Book
          </Link>
          <Link to="/admin/news" className="btn-secondary text-center">
            Post Update
          </Link>
          <Link to="/admin/social" className="btn-secondary text-center">
            Share to Social
          </Link>
          <Link to="/admin/subscribers" className="btn-secondary text-center">
            Send Newsletter
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

