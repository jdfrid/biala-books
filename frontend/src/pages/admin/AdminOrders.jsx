import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Eye, Download, Filter, Package, Truck, Check, X } from 'lucide-react';
import api from '../../services/api';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await api.get('/admin/orders');
      setOrders(res.data.orders || []);
    } catch (error) {
      setOrders(placeholderOrders);
    } finally {
      setLoading(false);
    }
  };

  const placeholderOrders = [
    { id: 'ORD-001', customer: 'John Doe', email: 'john@example.com', items: [{ title: 'Mevaser Tov - Bereishis', qty: 2, price: 35 }], total: 70, status: 'completed', date: '2026-01-18', shipping: { address: '123 Main St, Brooklyn, NY 11211' } },
    { id: 'ORD-002', customer: 'Sarah Cohen', email: 'sarah@example.com', items: [{ title: 'Maamar HaTorah', qty: 1, price: 25 }], total: 25, status: 'processing', date: '2026-01-18', shipping: { address: '456 Oak Ave, Jerusalem, Israel' } },
    { id: 'ORD-003', customer: 'David Levy', email: 'david@example.com', items: [{ title: 'Mevaser Tov - Shemos', qty: 1, price: 35 }, { title: 'Mevaser Tov - Vayikra', qty: 1, price: 35 }], total: 70, status: 'shipped', date: '2026-01-17', shipping: { address: '789 Cedar Ln, London, UK', tracking: 'TRK123456' } },
    { id: 'ORD-004', customer: 'Rachel Green', email: 'rachel@example.com', items: [{ title: 'Mevaser Tov - Moadim', qty: 1, price: 38 }], total: 38, status: 'completed', date: '2026-01-16', shipping: { address: '321 Elm St, Antwerp, Belgium' } },
  ];

  const displayOrders = orders.length > 0 ? orders : placeholderOrders;

  const filteredOrders = displayOrders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const updateStatus = async (orderId, newStatus) => {
    try {
      await api.put(`/admin/orders/${orderId}/status`, { status: newStatus });
      fetchOrders();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const statusOptions = ['all', 'processing', 'shipped', 'completed', 'cancelled'];

  const getStatusBadge = (status) => {
    const styles = {
      completed: 'badge-success',
      processing: 'badge-warning',
      shipped: 'badge-info',
      cancelled: 'badge-danger',
    };
    return styles[status] || 'badge-info';
  };

  const getStatusIcon = (status) => {
    const icons = {
      processing: Package,
      shipped: Truck,
      completed: Check,
      cancelled: X,
    };
    return icons[status] || Package;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-navy-900">Orders</h1>
          <p className="text-navy-600">Manage customer orders</p>
        </div>
        <button className="btn-secondary flex items-center gap-2">
          <Download size={18} />
          Export
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-navy-400" size={20} />
          <input
            type="text"
            placeholder="Search orders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-input pl-12"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {statusOptions.map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-lg font-display text-sm uppercase tracking-wider ${
                filterStatus === status
                  ? 'bg-gold-500 text-navy-950'
                  : 'bg-cream-200 text-navy-700 hover:bg-cream-300'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(4)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td><div className="h-6 bg-cream-200 rounded w-24"></div></td>
                    <td><div className="h-6 bg-cream-200 rounded w-32"></div></td>
                    <td><div className="h-6 bg-cream-200 rounded w-16"></div></td>
                    <td><div className="h-6 bg-cream-200 rounded w-16"></div></td>
                    <td><div className="h-6 bg-cream-200 rounded w-24"></div></td>
                    <td><div className="h-6 bg-cream-200 rounded w-24"></div></td>
                    <td><div className="h-6 bg-cream-200 rounded w-20"></div></td>
                  </tr>
                ))
              ) : filteredOrders.length > 0 ? (
                filteredOrders.map((order) => {
                  const StatusIcon = getStatusIcon(order.status);
                  return (
                    <tr key={order.id}>
                      <td className="font-mono font-semibold text-navy-900">{order.id}</td>
                      <td>
                        <div className="font-semibold text-navy-900">{order.customer}</div>
                        <div className="text-navy-500 text-sm">{order.email}</div>
                      </td>
                      <td>{order.items?.length || 0} items</td>
                      <td className="font-semibold text-green-600">${order.total}</td>
                      <td>
                        <span className={`badge ${getStatusBadge(order.status)} flex items-center gap-1 w-fit`}>
                          <StatusIcon size={12} />
                          {order.status}
                        </span>
                      </td>
                      <td className="text-navy-600">{order.date}</td>
                      <td>
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="p-2 rounded-lg hover:bg-cream-200 transition-colors"
                        >
                          <Eye size={16} className="text-navy-600" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-navy-500">
                    No orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/60">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-cream-50 rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-2xl font-bold text-navy-900">
                Order {selectedOrder.id}
              </h2>
              <button onClick={() => setSelectedOrder(null)} className="p-2 rounded-lg hover:bg-cream-200">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-6">
              {/* Customer Info */}
              <div>
                <h3 className="font-semibold text-navy-900 mb-2">Customer</h3>
                <p className="text-navy-700">{selectedOrder.customer}</p>
                <p className="text-navy-500">{selectedOrder.email}</p>
              </div>

              {/* Items */}
              <div>
                <h3 className="font-semibold text-navy-900 mb-2">Items</h3>
                <div className="space-y-2">
                  {selectedOrder.items?.map((item, i) => (
                    <div key={i} className="flex justify-between py-2 border-b border-cream-200">
                      <span>{item.title} x{item.qty}</span>
                      <span className="font-semibold">${item.price * item.qty}</span>
                    </div>
                  ))}
                  <div className="flex justify-between pt-2 font-bold text-lg">
                    <span>Total</span>
                    <span className="text-green-600">${selectedOrder.total}</span>
                  </div>
                </div>
              </div>

              {/* Shipping */}
              <div>
                <h3 className="font-semibold text-navy-900 mb-2">Shipping</h3>
                <p className="text-navy-700">{selectedOrder.shipping?.address}</p>
                {selectedOrder.shipping?.tracking && (
                  <p className="text-gold-600 mt-1">Tracking: {selectedOrder.shipping.tracking}</p>
                )}
              </div>

              {/* Status Update */}
              <div>
                <h3 className="font-semibold text-navy-900 mb-2">Update Status</h3>
                <select
                  value={selectedOrder.status}
                  onChange={(e) => {
                    updateStatus(selectedOrder.id, e.target.value);
                    setSelectedOrder({ ...selectedOrder, status: e.target.value });
                  }}
                  className="form-input"
                >
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <button onClick={() => setSelectedOrder(null)} className="btn-secondary w-full">
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

