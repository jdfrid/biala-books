import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Edit, Trash2, Play, Music, Video, Upload, X } from 'lucide-react';
import api from '../../services/api';

export default function AdminMedia() {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'video',
    duration: '',
    url: '',
    date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
    try {
      const res = await api.get('/admin/media');
      setMedia(res.data.media || []);
    } catch (error) {
      setMedia(placeholderMedia);
    } finally {
      setLoading(false);
    }
  };

  const placeholderMedia = [
    { id: 1, title: 'Friday Night Tish', type: 'video', duration: '1:23:45', date: '2026-01-12', views: 1234 },
    { id: 2, title: 'Torah Shiur - Emunah', type: 'video', duration: '45:30', date: '2026-01-10', views: 567 },
    { id: 3, title: 'Nigun - Keili Ata', type: 'audio', duration: '8:20', date: '2026-01-08', plays: 890 },
    { id: 4, title: 'Recorded Shiur', type: 'audio', duration: '52:10', date: '2025-12-28', plays: 456 },
  ];

  const displayMedia = media.length > 0 ? media : placeholderMedia;

  const filteredMedia = displayMedia.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || item.type === filterType;
    return matchesSearch && matchesType;
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await api.put(`/admin/media/${editingItem.id}`, formData);
      } else {
        await api.post('/admin/media', formData);
      }
      fetchMedia();
      closeModal();
    } catch (error) {
      console.error('Error saving media:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this media?')) return;
    try {
      await api.delete(`/admin/media/${id}`);
      fetchMedia();
    } catch (error) {
      console.error('Error deleting media:', error);
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
        description: '',
        type: 'video',
        duration: '',
        url: '',
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
          <h1 className="font-display text-3xl font-bold text-navy-900">Media</h1>
          <p className="text-navy-600">Manage videos and audio recordings</p>
        </div>
        <button onClick={() => openModal()} className="btn-primary flex items-center gap-2">
          <Plus size={18} />
          Add Media
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-navy-400" size={20} />
          <input
            type="text"
            placeholder="Search media..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-input pl-12"
          />
        </div>
        <div className="flex gap-2">
          {['all', 'video', 'audio'].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-4 py-2 rounded-lg font-display text-sm uppercase tracking-wider ${
                filterType === type
                  ? 'bg-gold-500 text-navy-950'
                  : 'bg-cream-200 text-navy-700 hover:bg-cream-300'
              }`}
            >
              {type === 'all' ? 'All' : type === 'video' ? <Video size={16} /> : <Music size={16} />}
            </button>
          ))}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          [...Array(6)].map((_, i) => (
            <div key={i} className="card animate-pulse">
              <div className="aspect-video bg-cream-200"></div>
              <div className="p-4 space-y-2">
                <div className="h-5 bg-cream-200 rounded"></div>
                <div className="h-4 bg-cream-200 rounded w-2/3"></div>
              </div>
            </div>
          ))
        ) : filteredMedia.length > 0 ? (
          filteredMedia.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card overflow-hidden"
            >
              <div className="aspect-video bg-navy-900 relative flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-gold-500/20 flex items-center justify-center">
                  {item.type === 'video' ? (
                    <Video size={24} className="text-gold-400" />
                  ) : (
                    <Music size={24} className="text-gold-400" />
                  )}
                </div>
                <div className="absolute top-2 left-2">
                  <span className={`badge ${item.type === 'video' ? 'badge-info' : 'badge-success'}`}>
                    {item.type}
                  </span>
                </div>
                <div className="absolute bottom-2 right-2 px-2 py-1 rounded bg-navy-950/80 text-cream-100 text-sm">
                  {item.duration}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-navy-900 mb-1">{item.title}</h3>
                <div className="flex items-center justify-between text-navy-500 text-sm">
                  <span>{item.date}</span>
                  <span>{item.views || item.plays || 0} {item.type === 'video' ? 'views' : 'plays'}</span>
                </div>
                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-cream-200">
                  <button
                    onClick={() => openModal(item)}
                    className="flex-1 btn-secondary py-2 text-sm"
                  >
                    <Edit size={14} className="inline mr-1" /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2 rounded-lg hover:bg-red-100 text-red-600"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-navy-500">
            No media found
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/60">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-cream-50 rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-2xl font-bold text-navy-900">
                {editingItem ? 'Edit Media' : 'Add Media'}
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
                <label className="block text-navy-700 text-sm font-medium mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="form-input min-h-[80px]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-navy-700 text-sm font-medium mb-2">Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="form-input"
                  >
                    <option value="video">Video</option>
                    <option value="audio">Audio</option>
                  </select>
                </div>
                <div>
                  <label className="block text-navy-700 text-sm font-medium mb-2">Duration</label>
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="form-input"
                    placeholder="1:23:45"
                  />
                </div>
              </div>

              <div>
                <label className="block text-navy-700 text-sm font-medium mb-2">URL</label>
                <input
                  type="url"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  className="form-input"
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="block text-navy-700 text-sm font-medium mb-2">Thumbnail</label>
                <div className="border-2 border-dashed border-cream-300 rounded-lg p-8 text-center">
                  <Upload size={32} className="mx-auto text-navy-400 mb-2" />
                  <p className="text-navy-600 text-sm">Upload thumbnail image</p>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button type="button" onClick={closeModal} className="btn-secondary flex-1">
                  Cancel
                </button>
                <button type="submit" className="btn-primary flex-1">
                  {editingItem ? 'Update' : 'Add Media'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}

