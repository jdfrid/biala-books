import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Edit, Trash2, X, Save, Calendar } from 'lucide-react';
import api from '../../services/api';
import { useAdminLang } from '../../context/AdminLangContext';

export default function AdminNews() {
  const { t } = useAdminLang();
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: 'Announcements',
    featured: false
  });

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const res = await api.get('/news');
      setNews(res.data.news || []);
    } catch (err) {
      setNews([
        { id: 1, title: 'New Volume Released', category: 'Publications', date: '2026-01-15', featured: true },
        { id: 2, title: 'Annual Gathering Announced', category: 'Events', date: '2026-01-10', featured: true },
        { id: 3, title: 'Sponsorship Opportunity', category: 'Announcements', date: '2026-01-05', featured: false },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await api.put(`/news/${editingItem.id}`, formData);
      } else {
        await api.post('/news', formData);
      }
      fetchNews();
      closeModal();
    } catch (err) {
      console.error('Error saving news:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm(t.news.confirmDelete)) return;
    try {
      await api.delete(`/news/${id}`);
      fetchNews();
    } catch (err) {
      console.error('Error deleting news:', err);
    }
  };

  const openModal = (item = null) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        title: item.title,
        excerpt: item.excerpt || '',
        content: item.content || '',
        category: item.category || 'Announcements',
        featured: item.featured || false
      });
    } else {
      setEditingItem(null);
      setFormData({
        title: '',
        excerpt: '',
        content: '',
        category: 'Announcements',
        featured: false
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingItem(null);
  };

  const filteredNews = news.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t.news.title}</h1>
          <p className="text-gray-500">{t.news.subtitle}</p>
        </div>
        <button onClick={() => openModal()} className="btn-gold">
          <Plus size={20} />
          {t.news.addNews}
        </button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder={t.news.searchNews}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="form-input pl-12"
        />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">{t.news.newsTitle}</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">{t.books.category}</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">{t.news.date}</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">{t.news.status}</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase">{t.news.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-400">{t.common.loading}</td></tr>
              ) : filteredNews.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-400">{t.news.noNews}</td></tr>
              ) : (
                filteredNews.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{item.title}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-700">{item.category}</span>
                    </td>
                    <td className="px-6 py-4 text-gray-600 flex items-center gap-2">
                      <Calendar size={14} />
                      {item.date}
                    </td>
                    <td className="px-6 py-4">
                      {item.featured && <span className="px-2 py-1 rounded-full text-xs bg-amber-100 text-amber-700">{t.news.published}</span>}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openModal(item)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-amber-600">
                          <Edit size={18} />
                        </button>
                        <button onClick={() => handleDelete(item.id)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-red-600">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">{editingItem ? t.news.editNews : t.news.addNewNews}</h2>
              <button onClick={closeModal} className="p-2 rounded-lg hover:bg-gray-100"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t.news.newsTitle}</label>
                <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="form-input" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t.news.content}</label>
                <textarea value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })} className="form-input resize-none" rows={5} />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="featured" checked={formData.featured} onChange={(e) => setFormData({ ...formData, featured: e.target.checked })} className="w-4 h-4 rounded border-gray-300 text-amber-600" />
                <label htmlFor="featured" className="text-sm text-gray-700">{t.news.publishNow}</label>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={closeModal} className="btn-secondary flex-1">{t.common.cancel}</button>
                <button type="submit" className="btn-gold flex-1"><Save size={18} />{t.common.save}</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
