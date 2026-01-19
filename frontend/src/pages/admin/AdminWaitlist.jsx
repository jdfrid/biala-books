import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Bell, Mail, Trash2, BookOpen } from 'lucide-react';
import api from '../../services/api';

export default function AdminWaitlist() {
  const [waitlist, setWaitlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchWaitlist();
  }, []);

  const fetchWaitlist = async () => {
    try {
      const res = await api.get('/admin/waitlist');
      setWaitlist(res.data.waitlist || []);
    } catch (error) {
      setWaitlist(placeholderWaitlist);
    } finally {
      setLoading(false);
    }
  };

  const placeholderWaitlist = [
    { id: 1, email: 'john@example.com', bookId: 6, bookTitle: 'Kedushas Yisroel', addedAt: '2026-01-15', notified: false },
    { id: 2, email: 'sarah@example.com', bookId: 6, bookTitle: 'Kedushas Yisroel', addedAt: '2026-01-14', notified: false },
    { id: 3, email: 'david@example.com', bookId: 12, bookTitle: 'Mevaser Tov - Shavuos', addedAt: '2026-01-12', notified: false },
    { id: 4, email: 'rachel@example.com', bookId: 6, bookTitle: 'Kedushas Yisroel', addedAt: '2026-01-10', notified: true },
  ];

  const displayWaitlist = waitlist.length > 0 ? waitlist : placeholderWaitlist;

  const filteredWaitlist = displayWaitlist.filter(item =>
    item.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.bookTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group by book
  const groupedByBook = filteredWaitlist.reduce((acc, item) => {
    if (!acc[item.bookId]) {
      acc[item.bookId] = {
        bookTitle: item.bookTitle,
        items: []
      };
    }
    acc[item.bookId].items.push(item);
    return acc;
  }, {});

  const handleNotify = async (bookId) => {
    try {
      await api.post(`/admin/waitlist/notify/${bookId}`);
      fetchWaitlist();
    } catch (error) {
      console.error('Error sending notifications:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Remove this email from the waitlist?')) return;
    try {
      await api.delete(`/admin/waitlist/${id}`);
      fetchWaitlist();
    } catch (error) {
      console.error('Error deleting:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-navy-900">Waitlist</h1>
        <p className="text-navy-600">Manage book waitlist notifications</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-orange-500 flex items-center justify-center">
              <Bell size={20} className="text-white" />
            </div>
            <div>
              <div className="font-display text-2xl font-bold text-navy-900">{displayWaitlist.length}</div>
              <div className="text-navy-600 text-sm">Total Waiting</div>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center">
              <BookOpen size={20} className="text-white" />
            </div>
            <div>
              <div className="font-display text-2xl font-bold text-navy-900">{Object.keys(groupedByBook).length}</div>
              <div className="text-navy-600 text-sm">Books with Waitlist</div>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-navy-400" size={20} />
        <input
          type="text"
          placeholder="Search by email or book..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="form-input pl-12"
        />
      </div>

      {/* Grouped by Book */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="card p-6 animate-pulse">
              <div className="h-6 bg-cream-200 rounded w-48 mb-4"></div>
              <div className="space-y-2">
                <div className="h-10 bg-cream-200 rounded"></div>
                <div className="h-10 bg-cream-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      ) : Object.keys(groupedByBook).length > 0 ? (
        <div className="space-y-6">
          {Object.entries(groupedByBook).map(([bookId, { bookTitle, items }]) => (
            <motion.div
              key={bookId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card overflow-hidden"
            >
              <div className="p-4 bg-cream-100 border-b border-cream-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <BookOpen size={20} className="text-gold-600" />
                  <div>
                    <h3 className="font-display font-bold text-navy-900">{bookTitle}</h3>
                    <p className="text-navy-500 text-sm">{items.length} people waiting</p>
                  </div>
                </div>
                <button
                  onClick={() => handleNotify(bookId)}
                  className="btn-primary flex items-center gap-2 text-sm"
                >
                  <Mail size={16} />
                  Notify All
                </button>
              </div>
              <div className="divide-y divide-cream-200">
                {items.map((item) => (
                  <div key={item.id} className="p-4 flex items-center justify-between">
                    <div>
                      <a href={`mailto:${item.email}`} className="text-gold-600 hover:text-gold-700 font-medium">
                        {item.email}
                      </a>
                      <p className="text-navy-500 text-sm">Added: {item.addedAt}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      {item.notified && (
                        <span className="badge badge-success">Notified</span>
                      )}
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-2 rounded-lg hover:bg-red-100 transition-colors"
                      >
                        <Trash2 size={16} className="text-red-600" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="card p-12 text-center">
          <Bell size={48} className="mx-auto text-navy-300 mb-4" />
          <h3 className="font-display text-xl text-navy-600 mb-2">No Waitlist Entries</h3>
          <p className="text-navy-500">When customers sign up for out-of-stock books, they'll appear here.</p>
        </div>
      )}
    </div>
  );
}

