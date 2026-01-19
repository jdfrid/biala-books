import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Edit, Trash2, Eye, X, Upload, Calendar, Star } from 'lucide-react';
import api from '../../services/api';

export default function AdminNews() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: 'General',
    featured: false,
    date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const res = await api.get('/admin/news');
      setNews(res.data.news || []);
    } catch (error) {
      setNews(placeholderNews);
    } finally {
      setLoading(false);
    }
  };

  const placeholderNews = [
    { id: 1, title: 'New Volume Released', category: 'Publications', date: '2026-01-15', featured: true, views: 234 },
    { id: 2, title: 'Annual Gathering Announced', category: 'Events', date: '2026-01-10', featured: true, views: 189 },
    { id: 3, title: 'Sponsorship Opportunity', category: 'Opportunities', date: '2026-01-05', featured: false, views: 156 },
    { id: 4, title: 'New Kollel Opened', category: 'Community', date: '2025-12-20', featured: false, views: 123 },
  ];

  const displayNews = news.length > 0 ? news : placeholderNews;

  const filteredNews = displayNews.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await api.put(`/admin/news/${editingItem.id}`, formData);
      } else {
        await api.post('/admin/news', formData);
      }
      fetchNews();
      closeModal();
    } catch (error) {
      console.error('Error saving news:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this news item?')) return;
    try {
      await api.delete(`/admin/news/${id}`);
      fetchNews();
    } catch (error) {
      console.error('Error deleting news:', error);
    }
  };

  const openModal = (item = null) => {
    if (item) {
      setEditingItem(item);
      setFormData(item);
    } else {
      setEditingItem(null);
      setFormData({
        title: '',
        excerpt: '',
        content: '',
        category: 'General',
        featured: false,
        date: new Date().toISOString().split('T')[0],
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingItem(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-navy-900">News & Updates</h1>
          <p className="text-navy-600">Manage news articles and announcements</p>
        </div>
        <button onClick={() => openModal()} className="btn-primary flex items-center gap-2">
          <Plus size={18} />
          Add News
        </button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-navy-400" size={20} />
        <input
          type="text"
          placeholder="Search news..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="form-input pl-12"
        />
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Date</th>
                <th>Featured</th>
                <th>Views</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(4)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td><div className="h-6 bg-cream-200 rounded w-48"></div></td>
                    <td><div className="h-6 bg-cream-200 rounded w-20"></div></td>
                    <td><div className="h-6 bg-cream-200 rounded w-24"></div></td>
                    <td><div className="h-6 bg-cream-200 rounded w-16"></div></td>
                    <td><div className="h-6 bg-cream-200 rounded w-12"></div></td>
                    <td><div className="h-6 bg-cream-200 rounded w-24"></div></td>
                  </tr>
                ))
              ) : filteredNews.length > 0 ? (
                filteredNews.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div className="font-semibold text-navy-900">{item.title}</div>
                    </td>
                    <td>
                      <span className="badge badge-info">{item.category}</span>
                    </td>
                    <td>
                      <span className="flex items-center gap-1 text-navy-600">
                        <Calendar size={14} />
                        {item.date}
                      </span>
                    </td>
                    <td>
                      {item.featured && (
                        <Star size={16} className="text-gold-500" fill="currentColor" />
                      )}
                    </td>
                    <td>{item.views || 0}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => window.open(`/news/${item.id}`, '_blank')}
                          className="p-2 rounded-lg hover:bg-cream-200 transition-colors"
                        >
                          <Eye size={16} className="text-navy-600" />
                        </button>
                        <button
                          onClick={() => openModal(item)}
                          className="p-2 rounded-lg hover:bg-cream-200 transition-colors"
                        >
                          <Edit size={16} className="text-navy-600" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-2 rounded-lg hover:bg-red-100 transition-colors"
                        >
                          <Trash2 size={16} className="text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-navy-500">
                    No news items found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/60">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-cream-50 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-2xl font-bold text-navy-900">
                {editingItem ? 'Edit News' : 'Add News'}
              </h2>
              <button onClick={closeModal} className="p-2 rounded-lg hover:bg-cream-200">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-navy-700 text-sm font-medium mb-2">Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="form-input"
                  required
                />
              </div>

              <div>
                <label className="block text-navy-700 text-sm font-medium mb-2">Excerpt *</label>
                <textarea
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  className="form-input min-h-[80px]"
                  required
                />
              </div>

              <div>
                <label className="block text-navy-700 text-sm font-medium mb-2">Full Content *</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="form-input min-h-[200px]"
                  required
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-navy-700 text-sm font-medium mb-2">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="form-input"
                  >
                    <option value="General">General</option>
                    <option value="Publications">Publications</option>
                    <option value="Events">Events</option>
                    <option value="Community">Community</option>
                    <option value="Opportunities">Opportunities</option>
                  </select>
                </div>
                <div>
                  <label className="block text-navy-700 text-sm font-medium mb-2">Date</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="w-5 h-5 rounded border-cream-300 text-gold-500 focus:ring-gold-400"
                />
                <span className="text-navy-700">Featured article</span>
              </label>

              <div>
                <label className="block text-navy-700 text-sm font-medium mb-2">Cover Image</label>
                <div className="border-2 border-dashed border-cream-300 rounded-lg p-8 text-center">
                  <Upload size={32} className="mx-auto text-navy-400 mb-2" />
                  <p className="text-navy-600 text-sm">Click or drag to upload image</p>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button type="button" onClick={closeModal} className="btn-secondary flex-1">
                  Cancel
                </button>
                <button type="submit" className="btn-primary flex-1">
                  {editingItem ? 'Update' : 'Publish'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}

