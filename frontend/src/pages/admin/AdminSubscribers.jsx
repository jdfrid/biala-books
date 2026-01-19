import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Download, Trash2, Mail, Users, Calendar } from 'lucide-react';
import api from '../../services/api';

export default function AdminSubscribers() {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    try {
      const res = await api.get('/admin/subscribers');
      setSubscribers(res.data.subscribers || []);
    } catch (error) {
      setSubscribers(placeholderSubscribers);
    } finally {
      setLoading(false);
    }
  };

  const placeholderSubscribers = [
    { id: 1, name: 'John Doe', email: 'john@example.com', subscribedAt: '2026-01-15', source: 'Newsletter Popup' },
    { id: 2, name: 'Sarah Cohen', email: 'sarah@example.com', subscribedAt: '2026-01-14', source: 'Footer Form' },
    { id: 3, name: 'David Levy', email: 'david@example.com', subscribedAt: '2026-01-12', source: 'Homepage' },
    { id: 4, name: 'Rachel Green', email: 'rachel@example.com', subscribedAt: '2026-01-10', source: 'Contact Page' },
    { id: 5, name: 'Michael Brown', email: 'michael@example.com', subscribedAt: '2026-01-08', source: 'Newsletter Popup' },
  ];

  const displaySubscribers = subscribers.length > 0 ? subscribers : placeholderSubscribers;

  const filteredSubscribers = displaySubscribers.filter(sub =>
    sub.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sub.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(filteredSubscribers.map(s => s.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to remove this subscriber?')) return;
    try {
      await api.delete(`/admin/subscribers/${id}`);
      fetchSubscribers();
    } catch (error) {
      console.error('Error deleting subscriber:', error);
    }
  };

  const handleExport = () => {
    const data = filteredSubscribers.map(s => `${s.name},${s.email},${s.subscribedAt}`).join('\n');
    const blob = new Blob([`Name,Email,Subscribed At\n${data}`], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'subscribers.csv';
    a.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-navy-900">Subscribers</h1>
          <p className="text-navy-600">Manage mailing list subscribers</p>
        </div>
        <div className="flex gap-2">
          <button onClick={handleExport} className="btn-secondary flex items-center gap-2">
            <Download size={18} />
            Export CSV
          </button>
          <button className="btn-primary flex items-center gap-2">
            <Mail size={18} />
            Send Newsletter
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center">
              <Users size={20} className="text-white" />
            </div>
            <div>
              <div className="font-display text-2xl font-bold text-navy-900">{displaySubscribers.length}</div>
              <div className="text-navy-600 text-sm">Total Subscribers</div>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-500 flex items-center justify-center">
              <Calendar size={20} className="text-white" />
            </div>
            <div>
              <div className="font-display text-2xl font-bold text-navy-900">12</div>
              <div className="text-navy-600 text-sm">This Week</div>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-500 flex items-center justify-center">
              <Mail size={20} className="text-white" />
            </div>
            <div>
              <div className="font-display text-2xl font-bold text-navy-900">45</div>
              <div className="text-navy-600 text-sm">This Month</div>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-navy-400" size={20} />
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="form-input pl-12"
        />
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="admin-table">
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    checked={selectedIds.length === filteredSubscribers.length && filteredSubscribers.length > 0}
                    onChange={handleSelectAll}
                    className="w-4 h-4 rounded border-cream-300 text-gold-500"
                  />
                </th>
                <th>Name</th>
                <th>Email</th>
                <th>Source</th>
                <th>Subscribed</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td><div className="h-4 w-4 bg-cream-200 rounded"></div></td>
                    <td><div className="h-6 bg-cream-200 rounded w-32"></div></td>
                    <td><div className="h-6 bg-cream-200 rounded w-40"></div></td>
                    <td><div className="h-6 bg-cream-200 rounded w-24"></div></td>
                    <td><div className="h-6 bg-cream-200 rounded w-24"></div></td>
                    <td><div className="h-6 bg-cream-200 rounded w-16"></div></td>
                  </tr>
                ))
              ) : filteredSubscribers.length > 0 ? (
                filteredSubscribers.map((sub) => (
                  <tr key={sub.id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(sub.id)}
                        onChange={() => handleSelectOne(sub.id)}
                        className="w-4 h-4 rounded border-cream-300 text-gold-500"
                      />
                    </td>
                    <td className="font-semibold text-navy-900">{sub.name}</td>
                    <td>
                      <a href={`mailto:${sub.email}`} className="text-gold-600 hover:text-gold-700">
                        {sub.email}
                      </a>
                    </td>
                    <td>
                      <span className="badge badge-info">{sub.source}</span>
                    </td>
                    <td className="text-navy-600">{sub.subscribedAt}</td>
                    <td>
                      <button
                        onClick={() => handleDelete(sub.id)}
                        className="p-2 rounded-lg hover:bg-red-100 transition-colors"
                      >
                        <Trash2 size={16} className="text-red-600" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-navy-500">
                    No subscribers found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedIds.length > 0 && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-navy-900 text-cream-100 px-6 py-3 rounded-lg shadow-xl flex items-center gap-4">
          <span>{selectedIds.length} selected</span>
          <button className="text-gold-400 hover:text-gold-300">Send Email</button>
          <button className="text-red-400 hover:text-red-300">Remove</button>
        </div>
      )}
    </div>
  );
}

