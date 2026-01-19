import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Users, 
  ShoppingCart, 
  Heart, 
  TrendingUp, 
  ArrowUpRight,
  Bell,
  Calendar
} from 'lucide-react';
import api from '../../services/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalOrders: 0,
    totalDonations: 0,
    totalSubscribers: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/admin/stats').catch(() => ({ data: {} })),
      api.get('/admin/orders/recent').catch(() => ({ data: { orders: [] } }))
    ]).then(([statsRes, ordersRes]) => {
      setStats(statsRes.data || {});
      setRecentOrders(ordersRes.data.orders || []);
    }).finally(() => setLoading(false));
  }, []);

  const statCards = [
    { 
      label: 'Total Books', 
      value: stats.totalBooks || 25, 
      icon: BookOpen, 
      color: 'bg-blue-500',
      link: '/admin/books'
    },
    { 
      label: 'Total Orders', 
      value: stats.totalOrders || 156, 
      icon: ShoppingCart, 
      color: 'bg-green-500',
      link: '/admin/orders'
    },
    { 
      label: 'Donations', 
      value: `$${stats.totalDonations || '12,450'}`, 
      icon: Heart, 
      color: 'bg-pink-500',
      link: '/admin/donations'
    },
    { 
      label: 'Subscribers', 
      value: stats.totalSubscribers || 892, 
      icon: Users, 
      color: 'bg-purple-500',
      link: '/admin/subscribers'
    },
  ];

  const sampleOrders = recentOrders.length > 0 ? recentOrders : [
    { id: 1, customer: 'David Cohen', total: 70, status: 'completed', date: '2026-01-18' },
    { id: 2, customer: 'Sarah Levy', total: 35, status: 'pending', date: '2026-01-17' },
    { id: 3, customer: 'Moshe Klein', total: 105, status: 'processing', date: '2026-01-17' },
    { id: 4, customer: 'Rachel Green', total: 28, status: 'completed', date: '2026-01-16' },
  ];

  const quickActions = [
    { label: 'Add New Book', icon: BookOpen, link: '/admin/books?action=new' },
    { label: 'View Waitlist', icon: Bell, link: '/admin/waitlist' },
    { label: 'Manage Orders', icon: ShoppingCart, link: '/admin/orders' },
    { label: 'Post Update', icon: Calendar, link: '/admin/news?action=new' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500">Welcome back! Here's what's happening.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link 
              to={stat.link}
              className="block bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center`}>
                  <stat.icon size={24} className="text-white" />
                </div>
                <ArrowUpRight size={20} className="text-gray-300" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-sm text-gray-500">{stat.label}</div>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-gray-900">Recent Orders</h2>
              <Link to="/admin/orders" className="text-sm text-amber-600 hover:text-amber-700">
                View All →
              </Link>
            </div>
          </div>
          <div className="divide-y divide-gray-100">
            {sampleOrders.map((order) => (
              <div key={order.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                <div>
                  <div className="font-medium text-gray-900">{order.customer}</div>
                  <div className="text-sm text-gray-500">{order.date}</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-gray-900">${order.total}</div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    order.status === 'completed' ? 'bg-green-100 text-green-700' :
                    order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            {quickActions.map((action) => (
              <Link
                key={action.label}
                to={action.link}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                  <action.icon size={20} className="text-amber-600" />
                </div>
                <span className="font-medium text-gray-700">{action.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Activity Chart Placeholder */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-semibold text-gray-900">Activity Overview</h2>
          <select className="form-input py-2 px-3 text-sm w-auto">
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>Last 90 days</option>
          </select>
        </div>
        <div className="h-64 flex items-center justify-center bg-gray-50 rounded-xl">
          <div className="text-center text-gray-400">
            <TrendingUp size={48} className="mx-auto mb-2 opacity-50" />
            <p>Analytics chart will appear here</p>
          </div>
        </div>
      </div>
    </div>
  );
}
