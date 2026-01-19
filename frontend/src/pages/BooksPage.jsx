import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Filter, ChevronRight, BookOpen } from 'lucide-react';
import api from '../services/api';

export default function BooksPage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  useEffect(() => {
    api.get('/books').catch(() => ({ data: { books: [] } }))
      .then(res => setBooks(res.data.books || []))
      .finally(() => setLoading(false));
  }, []);

  // Sample books for display
  const sampleBooks = [
    { id: 1, title: 'Mevaser Tov - Bereishis', hebrewTitle: 'מבשר טוב - בראשית', price: 35, category: 'Torah', available: true, description: 'Teachings on the Book of Genesis' },
    { id: 2, title: 'Mevaser Tov - Shemos', hebrewTitle: 'מבשר טוב - שמות', price: 35, category: 'Torah', available: true, description: 'Teachings on the Book of Exodus' },
    { id: 3, title: 'Mevaser Tov - Vayikra', hebrewTitle: 'מבשר טוב - ויקרא', price: 35, category: 'Torah', available: true, description: 'Teachings on the Book of Leviticus' },
    { id: 4, title: 'Mevaser Tov - Bamidbar', hebrewTitle: 'מבשר טוב - במדבר', price: 35, category: 'Torah', available: false, description: 'Teachings on the Book of Numbers' },
    { id: 5, title: 'Mevaser Tov - Devarim', hebrewTitle: 'מבשר טוב - דברים', price: 35, category: 'Torah', available: false, description: 'Teachings on the Book of Deuteronomy' },
    { id: 6, title: 'Kedushas Yisroel', hebrewTitle: 'קדושת ישראל', price: 28, category: 'Chassidus', available: true, description: 'Collected teachings on holiness' },
    { id: 7, title: 'Maamar HaTorah', hebrewTitle: 'מאמר התורה', price: 25, category: 'Chassidus', available: true, description: 'Discourses on Torah' },
    { id: 8, title: 'Siddur Biala', hebrewTitle: 'סידור ביאלא', price: 40, category: 'Prayer', available: true, description: 'Prayer book with Biala customs' },
  ];

  const displayBooks = books.length > 0 ? books : sampleBooks;
  const categories = ['all', 'Torah', 'Chassidus', 'Prayer', 'Holidays'];

  const filteredBooks = displayBooks.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          book.hebrewTitle?.includes(searchTerm);
    const matchesCategory = filterCategory === 'all' || book.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-b from-amber-50 to-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Our Books
            </h1>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Explore our complete collection of Torah writings from the Biala dynasty
            </p>
          </div>

          {/* Search and Filter */}
          <div className="mt-12 max-w-3xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search by title..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="form-input pl-12"
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="form-input pl-12 pr-8 appearance-none cursor-pointer"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>
                      {cat === 'all' ? 'All Categories' : cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Books Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="card animate-pulse">
                  <div className="aspect-[3/4] bg-gray-200"></div>
                  <div className="p-5 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredBooks.length === 0 ? (
            <div className="text-center py-16">
              <BookOpen size={48} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No books found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredBooks.map((book, index) => (
                <motion.div
                  key={book.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link to={`/books/${book.id}`} className="book-card block group">
                    <div className="book-cover flex items-center justify-center relative">
                      {book.image_url ? (
                        <img src={book.image_url} alt={book.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="text-center p-4">
                          <span className="font-hebrew text-2xl text-amber-400 font-bold leading-relaxed">
                            {book.hebrewTitle}
                          </span>
                        </div>
                      )}
                      {!book.available && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                          <span className="badge badge-warning">Pre-Order</span>
                        </div>
                      )}
                    </div>
                    <div className="book-info">
                      <span className="text-xs text-amber-600 font-medium uppercase tracking-wide">
                        {book.category}
                      </span>
                      <h3 className="font-semibold text-gray-900 group-hover:text-amber-600 transition-colors mt-1 mb-1">
                        {book.title}
                      </h3>
                      <p className="text-sm text-gray-500 line-clamp-2 mb-3">
                        {book.description}
                      </p>
                      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                        <span className="font-bold text-lg text-amber-600">${book.price}</span>
                        <span className="text-sm text-gray-400 group-hover:text-amber-600 transition-colors flex items-center gap-1">
                          View <ChevronRight size={14} />
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-2xl font-bold text-gray-900 mb-4">
            Looking for a specific sefer?
          </h2>
          <p className="text-gray-500 mb-6">
            Contact us if you're looking for a specific publication or would like to inquire about upcoming releases.
          </p>
          <Link to="/contact" className="btn-secondary">
            Contact Us
          </Link>
        </div>
      </section>
    </div>
  );
}
