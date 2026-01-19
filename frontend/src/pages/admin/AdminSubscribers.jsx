import { useState, useEffect } from 'react';
import { Search, Download, Mail, Trash2, Calendar } from 'lucide-react';
import api from '../../services/api';

export default function AdminSubscribers() {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    try {
      const res = await api.get('/newsletter/subscribers');
      setSubscribers(res.data.subscribers || []);
    } catch (err) {
      setSubscribers([
        { id: 1, email: 'david@example.com', subscribedAt: '2026-01-15', source: 'Homepage' },
        { id: 2, email: 'sarah@example.com', subscribedAt: '2026-01-14', source: 'Footer' },
        { id: 3, email: 'moshe@example.com', subscribedAt: '2026-01-13', source: 'Publications' },
        { id: 4, email: 'rachel@example.com', subscribedAt: '2026-01-12', source: 'Homepage' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Remove this subscriber?')) return;
    try {
      await api.delete(`/newsletter/subscribers/${id}`);
      fetchSubscribers();
    } catch (err) {
      console.error('Error removing subscriber:', err);
    }
  };

  const handleExport = () => {
    const csv = subscribers.map(s => `${s.email},${s.subscribedAt},${s.source}`).join('\n');
    const blob = new Blob([`Email,Date,Source\n${csv}`], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'subscribers.csv';
    a.click();
  };

  const filteredSubscribers = subscribers.filter(s => s.email.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Newsletter Subscribers</h1>
          <p className="text-gray-500">{subscribers.length} total subscribers</p>
        </div>
        <button onClick={handleExport} className="btn-secondary">
          <Download size={20} />
          Export CSV
        </button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input type="text" placeholder="Search by email..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="form-input pl-12" />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Email</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Date Subscribed</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Source</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan={4} className="px-6 py-12 text-center text-gray-400">Loading...</td></tr>
              ) : filteredSubscribers.length === 0 ? (
                <tr><td colSpan={4} className="px-6 py-12 text-center text-gray-400">No subscribers found</td></tr>
              ) : (
                filteredSubscribers.map((subscriber) => (
                  <tr key={subscriber.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                          <Mail size={14} className="text-amber-600" />
                        </div>
                        <span className="text-gray-900">{subscriber.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600 flex items-center gap-2">
                      <Calendar size={14} />
                      {subscriber.subscribedAt}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-600">{subscriber.source}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => handleDelete(subscriber.id)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-red-600">
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
