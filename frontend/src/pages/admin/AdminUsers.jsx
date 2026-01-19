import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Edit, Trash2, Shield, User, X } from 'lucide-react';
import api from '../../services/api';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'editor',
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/admin/users');
      setUsers(res.data.users || []);
    } catch (error) {
      setUsers(placeholderUsers);
    } finally {
      setLoading(false);
    }
  };

  const placeholderUsers = [
    { id: 1, name: 'Admin User', email: 'admin@bialapublishing.com', role: 'admin', lastLogin: '2026-01-18', status: 'active' },
    { id: 2, name: 'Content Editor', email: 'editor@bialapublishing.com', role: 'editor', lastLogin: '2026-01-17', status: 'active' },
    { id: 3, name: 'Media Manager', email: 'media@bialapublishing.com', role: 'editor', lastLogin: '2026-01-15', status: 'active' },
  ];

  const displayUsers = users.length > 0 ? users : placeholderUsers;

  const filteredUsers = displayUsers.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to remove this admin user?')) return;
    try {
      await api.delete(`/admin/users/${id}`);
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-navy-900">Admin Users</h1>
          <p className="text-navy-600">Manage system administrators and editors</p>
        </div>
        <button onClick={() => openModal()} className="btn-primary flex items-center gap-2">
          <Plus size={18} />
          Add User
        </button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-navy-400" size={20} />
        <input
          type="text"
          placeholder="Search users..."
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
                <th>User</th>
                <th>Role</th>
                <th>Last Login</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(3)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td><div className="h-6 bg-cream-200 rounded w-40"></div></td>
                    <td><div className="h-6 bg-cream-200 rounded w-20"></div></td>
                    <td><div className="h-6 bg-cream-200 rounded w-24"></div></td>
                    <td><div className="h-6 bg-cream-200 rounded w-20"></div></td>
                    <td><div className="h-6 bg-cream-200 rounded w-24"></div></td>
                  </tr>
                ))
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gold-100 flex items-center justify-center">
                          {user.role === 'admin' ? (
                            <Shield size={18} className="text-gold-600" />
                          ) : (
                            <User size={18} className="text-gold-600" />
                          )}
                        </div>
                        <div>
                          <div className="font-semibold text-navy-900">{user.name}</div>
                          <div className="text-navy-500 text-sm">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${user.role === 'admin' ? 'badge-warning' : 'badge-info'}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="text-navy-600">{user.lastLogin}</td>
                    <td>
                      <span className={`badge ${user.status === 'active' ? 'badge-success' : 'badge-danger'}`}>
                        {user.status}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openModal(user)}
                          className="p-2 rounded-lg hover:bg-cream-200 transition-colors"
                        >
                          <Edit size={16} className="text-navy-600" />
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
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
                  <td colSpan={5} className="text-center py-8 text-navy-500">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Permissions Info */}
      <div className="card p-6">
        <h3 className="font-display text-lg font-bold text-navy-900 mb-4">Role Permissions</h3>
        <div className="grid sm:grid-cols-2 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Shield size={18} className="text-gold-600" />
              <span className="font-semibold text-navy-900">Admin</span>
            </div>
            <ul className="text-navy-600 text-sm space-y-1 ml-6">
              <li>• Full access to all features</li>
              <li>• Manage admin users</li>
              <li>• Access system settings</li>
              <li>• View analytics & reports</li>
            </ul>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <User size={18} className="text-blue-600" />
              <span className="font-semibold text-navy-900">Editor</span>
            </div>
            <ul className="text-navy-600 text-sm space-y-1 ml-6">
              <li>• Manage books, news, media</li>
              <li>• View orders & donations</li>
              <li>• Manage subscribers</li>
              <li>• Cannot access settings</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/60">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-cream-50 rounded-2xl p-6 max-w-md w-full"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-2xl font-bold text-navy-900">
                {editingUser ? 'Edit User' : 'Add User'}
              </h2>
              <button onClick={closeModal} className="p-2 rounded-lg hover:bg-cream-200">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-navy-700 text-sm font-medium mb-2">Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="form-input"
                  required
                />
              </div>

              <div>
                <label className="block text-navy-700 text-sm font-medium mb-2">Email *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="form-input"
                  required
                />
              </div>

              <div>
                <label className="block text-navy-700 text-sm font-medium mb-2">Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="form-input"
                >
                  <option value="admin">Admin</option>
                  <option value="editor">Editor</option>
                </select>
              </div>

              <p className="text-navy-500 text-sm">
                {editingUser 
                  ? 'User will receive an email notification about the changes.'
                  : 'An invitation email with login instructions will be sent to this address.'}
              </p>

              <div className="flex gap-4 pt-4">
                <button type="button" onClick={closeModal} className="btn-secondary flex-1">
                  Cancel
                </button>
                <button type="submit" className="btn-primary flex-1">
                  {editingUser ? 'Update' : 'Send Invitation'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}

