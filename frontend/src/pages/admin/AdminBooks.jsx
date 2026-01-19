import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Edit, Trash2, Eye, Upload, X } from 'lucide-react';
import api from '../../services/api';

export default function AdminBooks() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    hebrewTitle: '',
    description: '',
    longDescription: '',
    price: '',
    category: 'Torah',
    available: true,
    pages: '',
    binding: 'Hardcover',
    language: 'Hebrew/English',
    isbn: '',
    year: new Date().getFullYear(),
  });

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const res = await api.get('/admin/books');
      setBooks(res.data.books || []);
    } catch (error) {
      setBooks(placeholderBooks);
    } finally {
      setLoading(false);
    }
  };

  const placeholderBooks = [
    { id: 1, title: 'Mevaser Tov - Bereishis', hebrewTitle: 'מבשר טוב - בראשית', price: 35, category: 'Torah', available: true, orders: 156 },
    { id: 2, title: 'Mevaser Tov - Shemos', hebrewTitle: 'מבשר טוב - שמות', price: 35, category: 'Torah', available: true, orders: 143 },
    { id: 3, title: 'Kedushas Yisroel', hebrewTitle: 'קדושת ישראל', price: 28, category: 'Chassidus', available: false, orders: 89 },
    { id: 4, title: 'Maamar HaTorah', hebrewTitle: 'מאמר התורה', price: 25, category: 'Chassidus', available: true, orders: 67 },
  ];

  const displayBooks = books.length > 0 ? books : placeholderBooks;

  const filteredBooks = displayBooks.filter(book =>
    book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.hebrewTitle.includes(searchQuery)
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingBook) {
        await api.put(`/admin/books/${editingBook.id}`, formData);
      } else {
        await api.post('/admin/books', formData);
      }
      fetchBooks();
      closeModal();
    } catch (error) {
      console.error('Error saving book:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this book?')) return;
    try {
      await api.delete(`/admin/books/${id}`);
      fetchBooks();
    } catch (error) {
      console.error('Error deleting book:', error);
    }
  };

  const openModal = (book = null) => {
    if (book) {
      setEditingBook(book);
      setFormData(book);
    } else {
      setEditingBook(null);
      setFormData({
        title: '',
        hebrewTitle: '',
        description: '',
        longDescription: '',
        price: '',
        category: 'Torah',
        available: true,
        pages: '',
        binding: 'Hardcover',
        language: 'Hebrew/English',
        isbn: '',
        year: new Date().getFullYear(),
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingBook(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-navy-900">Books</h1>
          <p className="text-navy-600">Manage your book catalog</p>
        </div>
        <button onClick={() => openModal()} className="btn-primary flex items-center gap-2">
          <Plus size={18} />
          Add Book
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-navy-400" size={20} />
        <input
          type="text"
          placeholder="Search books..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="form-input pl-12"
        />
      </div>

      {/* Books Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Book</th>
                <th>Category</th>
                <th>Price</th>
                <th>Status</th>
                <th>Orders</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(4)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td><div className="h-6 bg-cream-200 rounded w-48"></div></td>
                    <td><div className="h-6 bg-cream-200 rounded w-20"></div></td>
                    <td><div className="h-6 bg-cream-200 rounded w-16"></div></td>
                    <td><div className="h-6 bg-cream-200 rounded w-24"></div></td>
                    <td><div className="h-6 bg-cream-200 rounded w-12"></div></td>
                    <td><div className="h-6 bg-cream-200 rounded w-24"></div></td>
                  </tr>
                ))
              ) : filteredBooks.length > 0 ? (
                filteredBooks.map((book) => (
                  <tr key={book.id}>
                    <td>
                      <div>
                        <div className="font-semibold text-navy-900">{book.title}</div>
                        <div className="text-navy-500 text-sm font-hebrew">{book.hebrewTitle}</div>
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-info">{book.category}</span>
                    </td>
                    <td className="font-semibold">${book.price}</td>
                    <td>
                      <span className={`badge ${book.available ? 'badge-success' : 'badge-warning'}`}>
                        {book.available ? 'Available' : 'Out of Stock'}
                      </span>
                    </td>
                    <td>{book.orders || 0}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => window.open(`/books/${book.id}`, '_blank')}
                          className="p-2 rounded-lg hover:bg-cream-200 transition-colors"
                          title="View"
                        >
                          <Eye size={16} className="text-navy-600" />
                        </button>
                        <button
                          onClick={() => openModal(book)}
                          className="p-2 rounded-lg hover:bg-cream-200 transition-colors"
                          title="Edit"
                        >
                          <Edit size={16} className="text-navy-600" />
                        </button>
                        <button
                          onClick={() => handleDelete(book.id)}
                          className="p-2 rounded-lg hover:bg-red-100 transition-colors"
                          title="Delete"
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
                    No books found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/60">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-cream-50 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-2xl font-bold text-navy-900">
                {editingBook ? 'Edit Book' : 'Add New Book'}
              </h2>
              <button onClick={closeModal} className="p-2 rounded-lg hover:bg-cream-200">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-navy-700 text-sm font-medium mb-2">Title (English) *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="form-input"
                    required
                  />
                </div>
                <div>
                  <label className="block text-navy-700 text-sm font-medium mb-2">Title (Hebrew) *</label>
                  <input
                    type="text"
                    value={formData.hebrewTitle}
                    onChange={(e) => setFormData({ ...formData, hebrewTitle: e.target.value })}
                    className="form-input font-hebrew"
                    dir="rtl"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-navy-700 text-sm font-medium mb-2">Short Description *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="form-input min-h-[80px]"
                  required
                />
              </div>

              <div>
                <label className="block text-navy-700 text-sm font-medium mb-2">Full Description</label>
                <textarea
                  value={formData.longDescription}
                  onChange={(e) => setFormData({ ...formData, longDescription: e.target.value })}
                  className="form-input min-h-[120px]"
                />
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-navy-700 text-sm font-medium mb-2">Price ($) *</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="form-input"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                <div>
                  <label className="block text-navy-700 text-sm font-medium mb-2">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="form-input"
                    required
                  >
                    <option value="Torah">Torah</option>
                    <option value="Chassidus">Chassidus</option>
                    <option value="Holidays">Holidays</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-navy-700 text-sm font-medium mb-2">Status</label>
                  <select
                    value={formData.available ? 'available' : 'unavailable'}
                    onChange={(e) => setFormData({ ...formData, available: e.target.value === 'available' })}
                    className="form-input"
                  >
                    <option value="available">Available</option>
                    <option value="unavailable">Out of Stock</option>
                  </select>
                </div>
              </div>

              <div className="grid sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-navy-700 text-sm font-medium mb-2">Pages</label>
                  <input
                    type="number"
                    value={formData.pages}
                    onChange={(e) => setFormData({ ...formData, pages: e.target.value })}
                    className="form-input"
                    min="1"
                  />
                </div>
                <div>
                  <label className="block text-navy-700 text-sm font-medium mb-2">Binding</label>
                  <select
                    value={formData.binding}
                    onChange={(e) => setFormData({ ...formData, binding: e.target.value })}
                    className="form-input"
                  >
                    <option value="Hardcover">Hardcover</option>
                    <option value="Softcover">Softcover</option>
                    <option value="Leather">Leather</option>
                  </select>
                </div>
                <div>
                  <label className="block text-navy-700 text-sm font-medium mb-2">Language</label>
                  <select
                    value={formData.language}
                    onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                    className="form-input"
                  >
                    <option value="Hebrew">Hebrew</option>
                    <option value="English">English</option>
                    <option value="Hebrew/English">Hebrew/English</option>
                  </select>
                </div>
                <div>
                  <label className="block text-navy-700 text-sm font-medium mb-2">Year</label>
                  <input
                    type="number"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>

              <div>
                <label className="block text-navy-700 text-sm font-medium mb-2">ISBN</label>
                <input
                  type="text"
                  value={formData.isbn}
                  onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                  className="form-input"
                  placeholder="978-..."
                />
              </div>

              <div>
                <label className="block text-navy-700 text-sm font-medium mb-2">Book Cover Image</label>
                <div className="border-2 border-dashed border-cream-300 rounded-lg p-8 text-center">
                  <Upload size={32} className="mx-auto text-navy-400 mb-2" />
                  <p className="text-navy-600 text-sm">Click or drag to upload image</p>
                  <p className="text-navy-400 text-xs mt-1">PNG, JPG up to 5MB</p>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button type="button" onClick={closeModal} className="btn-secondary flex-1">
                  Cancel
                </button>
                <button type="submit" className="btn-primary flex-1">
                  {editingBook ? 'Update Book' : 'Add Book'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}

