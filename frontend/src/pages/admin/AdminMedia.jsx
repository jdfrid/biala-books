import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Edit, Trash2, X, Save, Video, Headphones, Play } from 'lucide-react';
import api from '../../services/api';

export default function AdminMedia() {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    type: 'video',
    url: '',
    duration: '',
    category: 'Shiur'
  });

  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
    try {
      const res = await api.get('/media');
      setMedia(res.data.media || []);
    } catch (err) {
      setMedia([
        { id: 1, title: 'Friday Night Tish', type: 'video', duration: '45:30', category: 'Tish' },
        { id: 2, title: 'Torah Shiur - Emunah', type: 'video', duration: '32:15', category: 'Shiur' },
        { id: 3, title: 'Niggun Collection', type: 'audio', duration: '25:00', category: 'Niggunim' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await api.put(`/media/${editingItem.id}`, formData);
      } else {
        await api.post('/media', formData);
      }
      fetchMedia();
      closeModal();
    } catch (err) {
      console.error('Error saving media:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this media item?')) return;
    try {
      await api.delete(`/media/${id}`);
      fetchMedia();
    } catch (err) {
      console.error('Error deleting media:', err);
    }
  };

  const openModal = (item = null) => {
    if (item) {
      setEditingItem(item);
      setFormData({ title: item.title, type: item.type, url: item.url || '', duration: item.duration, category: item.category });
    } else {
      setEditingItem(null);
      setFormData({ title: '', type: 'video', url: '', duration: '', category: 'Shiur' });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingItem(null);
  };

  const filteredMedia = media.filter(item => item.title.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Media</h1>
          <p className="text-gray-500">Manage videos and audio recordings</p>
        </div>
        <button onClick={() => openModal()} className="btn-gold"><Plus size={20} />Add Media</button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input type="text" placeholder="Search media..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="form-input pl-12" />
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full text-center py-12 text-gray-400">Loading...</div>
        ) : filteredMedia.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-400">No media found</div>
        ) : (
          filteredMedia.map((item) => (
            <motion.div key={item.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center relative">
                {item.type === 'video' ? <Video size={48} className="text-gray-600" /> : <Headphones size={48} className="text-gray-600" />}
                <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/70 rounded text-white text-xs">{item.duration}</div>
              </div>
              <div className="p-4">
                <span className="text-xs text-amber-600 font-medium uppercase">{item.category}</span>
                <h3 className="font-semibold text-gray-900 mt-1">{item.title}</h3>
                <div className="flex items-center justify-between mt-3">
                  <span className={`px-2 py-1 rounded-full text-xs ${item.type === 'video' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                    {item.type}
                  </span>
                  <div className="flex gap-1">
                    <button onClick={() => openModal(item)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-amber-600"><Edit size={16} /></button>
                    <button onClick={() => handleDelete(item.id)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-red-600"><Trash2 size={16} /></button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-2xl shadow-xl max-w-lg w-full">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">{editingItem ? 'Edit Media' : 'Add Media'}</h2>
              <button onClick={closeModal} className="p-2 rounded-lg hover:bg-gray-100"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="form-input" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} className="form-input">
                    <option value="video">Video</option>
                    <option value="audio">Audio</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="form-input">
                    <option value="Shiur">Shiur</option>
                    <option value="Tish">Tish</option>
                    <option value="Niggunim">Niggunim</option>
                    <option value="Events">Events</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">URL</label>
                <input type="url" value={formData.url} onChange={(e) => setFormData({ ...formData, url: e.target.value })} className="form-input" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                <input type="text" placeholder="e.g. 45:30" value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: e.target.value })} className="form-input" />
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={closeModal} className="btn-secondary flex-1">Cancel</button>
                <button type="submit" className="btn-gold flex-1"><Save size={18} />Save</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
