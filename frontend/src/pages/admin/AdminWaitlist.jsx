import { useState, useEffect } from 'react';
import { Search, Download, Mail, Trash2, BookOpen, Bell } from 'lucide-react';
import api from '../../services/api';

export default function AdminWaitlist() {
  const [waitlist, setWaitlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchWaitlist();
  }, []);

  const fetchWaitlist = async () => {
    try {
      const res = await api.get('/waitlist');
      setWaitlist(res.data.waitlist || []);
    } catch (err) {
      setWaitlist([
        { id: 1, email: 'david@example.com', bookTitle: 'Mevaser Tov - Bamidbar', date: '2026-01-15' },
        { id: 2, email: 'sarah@example.com', bookTitle: 'Mevaser Tov - Devarim', date: '2026-01-14' },
        { id: 3, email: 'moshe@example.com', bookTitle: 'Kedushas Yisroel', date: '2026-01-13' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Remove from waitlist?')) return;
    try {
      await api.delete(`/waitlist/${id}`);
      fetchWaitlist();
    } catch (err) {
      console.error('Error removing from waitlist:', err);
    }
  };

  const handleNotifyAll = async (bookTitle) => {
    if (!confirm(`Send notification to all waiting for "${bookTitle}"?`)) return;
    try {
      await api.post('/waitlist/notify', { bookTitle });
      alert('Notifications sent!');
    } catch (err) {
      console.error('Error sending notifications:', err);
    }
  };

  const filteredWaitlist = waitlist.filter(w => 
    w.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    w.bookTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Group by book
  const groupedByBook = filteredWaitlist.reduce((acc, item) => {
    if (!acc[item.bookTitle]) acc[item.bookTitle] = [];
    acc[item.bookTitle].push(item);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Book Waitlist</h1>
          <p className="text-gray-500">{waitlist.length} people waiting for books</p>
        </div>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input type="text" placeholder="Search by email or book..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="form-input pl-12" />
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading...</div>
      ) : Object.keys(groupedByBook).length === 0 ? (
        <div className="text-center py-12 text-gray-400">No waitlist entries found</div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedByBook).map(([bookTitle, entries]) => (
            <div key={bookTitle} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                    <BookOpen size={20} className="text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{bookTitle}</h3>
                    <p className="text-sm text-gray-500">{entries.length} people waiting</p>
                  </div>
                </div>
                <button onClick={() => handleNotifyAll(bookTitle)} className="btn-secondary text-sm py-2">
                  <Bell size={16} />
                  Notify All
                </button>
              </div>
              <div className="divide-y divide-gray-100">
                {entries.map((entry) => (
                  <div key={entry.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <Mail size={16} className="text-gray-400" />
                      <span className="text-gray-900">{entry.email}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-gray-500">{entry.date}</span>
                      <button onClick={() => handleDelete(entry.id)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-red-600">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
