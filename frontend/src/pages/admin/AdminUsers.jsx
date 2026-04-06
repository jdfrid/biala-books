import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Edit, Trash2, X, Save, Shield } from 'lucide-react';
import api from '../../services/api';
import { useAdminLang } from '../../context/AdminLangContext';

export default function AdminUsers() {
  const { t } = useAdminLang();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', role: 'editor' });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/admin/users');
      setUsers(res.data.users || []);
    } catch (err) {
      setUsers([
        { id: 1, name: 'Admin User', email: 'admin@bialapublishing.com', role: 'admin', lastLogin: '2026-01-18' },
        { id: 2, name: 'Editor User', email: 'editor@bialapublishing.com', role: 'editor', lastLogin: '2026-01-17' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUser) {
        await api.put(`/admin/users/${editingUser.id}`, formData);
      } else {
        await api.post('/admin/users', formData);
      }
      fetchUsers();
      closeModal();
    } catch (err) {
      console.error('Error saving user:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm(t.users.confirmDelete)) return;
    try {
      await api.delete(`/admin/users/${id}`);
      fetchUsers();
    } catch (err) {
      console.error('Error deleting user:', err);
    }
  };

  const openModal = (user = null) => {
    if (user) {
      setEditingUser(user);
      setFormData({ name: user.name, email: user.email, role: user.role });
    } else {
      setEditingUser(null);
      setFormData({ name: '', email: '', role: 'editor' });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingUser(null);
  };

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleLabel = (role) => {
    return t.users.roles[role] || role;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t.users.title}</h1>
          <p className="text-gray-500">{t.users.subtitle}</p>
        </div>
        <button onClick={() => openModal()} className="btn-gold">
          <Plus size={20} />
          {t.users.addUser}
        </button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input type="text" placeholder={t.users.searchUsers} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="form-input pl-12" />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">{t.users.name}</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">{t.users.role}</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">{t.users.lastLogin}</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase">{t.users.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan={4} className="px-6 py-12 text-center text-gray-400">{t.common.loading}</td></tr>
              ) : filteredUsers.length === 0 ? (
                <tr><td colSpan={4} className="px-6 py-12 text-center text-gray-400">{t.users.noUsers}</td></tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white font-semibold">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        <Shield size={12} className="inline mr-1" />
                        {getRoleLabel(user.role)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{user.lastLogin}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openModal(user)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-amber-600">
                          <Edit size={18} />
                        </button>
                        <button onClick={() => handleDelete(user.id)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-red-600">
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
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-2xl shadow-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">{editingUser ? t.users.editUser : t.users.addNewUser}</h2>
              <button onClick={closeModal} className="p-2 rounded-lg hover:bg-gray-100"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t.users.name}</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="form-input" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t.users.email}</label>
                <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="form-input" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t.users.role}</label>
                <select value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} className="form-input">
                  <option value="editor">{t.users.roles.editor}</option>
                  <option value="admin">{t.users.roles.admin}</option>
                </select>
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
