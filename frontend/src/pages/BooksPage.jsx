import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Filter, ChevronRight, BookOpen, X } from 'lucide-react';
import api from '../services/api';

export default function BooksPage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    api.get('/books')
      .then(res => setBooks(res.data.books || []))
      .catch(() => {
        // Use placeholder data
        setBooks(placeholderBooks);
      })
      .finally(() => setLoading(false));
  }, []);

  const placeholderBooks = [
    {
      id: 1,
      title: 'Mevaser Tov - Bereishis',
      hebrewTitle: 'מבשר טוב - בראשית',
      description: 'Chassidic insights and teachings on the book of Genesis, revealing the deep secrets and spiritual meanings within each parsha.',
      price: 35,
      image: '/images/books/bereishis.jpg',
      category: 'Torah',
      available: true
    },
    {
      id: 2,
      title: 'Mevaser Tov - Shemos',
      hebrewTitle: 'מבשר טוב - שמות',
      description: 'Profound Torah thoughts on the book of Exodus, exploring themes of redemption, revelation, and service of Hashem.',
      price: 35,
      image: '/images/books/shemos.jpg',
      category: 'Torah',
      available: true
    },
    {
      id: 3,
      title: 'Mevaser Tov - Vayikra',
      hebrewTitle: 'מבשר טוב - ויקרא',
      description: 'Deep insights into the laws of sacrifices and sanctity, bringing the Temple service alive for our times.',
      price: 35,
      image: '/images/books/vayikra.jpg',
      category: 'Torah',
      available: true
    },
    {
      id: 4,
      title: 'Mevaser Tov - Bamidbar',
      hebrewTitle: 'מבשר טוב - במדבר',
      description: 'Torah teachings on the wilderness journey of Israel, with lessons for our own spiritual travels.',
      price: 35,
      image: '/images/books/bamidbar.jpg',
      category: 'Torah',
      available: true
    },
    {
      id: 5,
      title: 'Mevaser Tov - Devarim',
      hebrewTitle: 'מבשר טוב - דברים',
      description: 'Chassidic commentary on Moses\' final teachings, preparing the soul for entering the Holy Land.',
      price: 35,
      image: '/images/books/devarim.jpg',
      category: 'Torah',
      available: true
    },
    {
      id: 6,
      title: 'Kedushas Yisroel',
      hebrewTitle: 'קדושת ישראל',
      description: 'A profound work on the inherent holiness of every Jew and the path to spiritual refinement.',
      price: 28,
      image: '/images/books/kedushas.jpg',
      category: 'Chassidus',
      available: false
    },
    {
      id: 7,
      title: 'Maamar HaTorah',
      hebrewTitle: 'מאמר התורה',
      description: 'Discourse on the eternal nature of Torah study and its transformative power.',
      price: 25,
      image: '/images/books/maamar.jpg',
      category: 'Chassidus',
      available: true
    },
    {
      id: 8,
      title: 'Mevaser Tov - Moadim',
      hebrewTitle: 'מבשר טוב - מועדים',
      description: 'Torah insights for the Jewish holidays, enhancing your celebration with deep meaning.',
      price: 38,
      image: '/images/books/moadim.jpg',
      category: 'Holidays',
      available: true
    },
    {
      id: 9,
      title: 'Mevaser Tov - Rosh Hashanah & Yom Kippur',
      hebrewTitle: 'מבשר טוב - ראש השנה ויום כיפור',
      description: 'Special teachings for the Days of Awe, preparing the heart for divine judgment.',
      price: 32,
      image: '/images/books/yamim-noraim.jpg',
      category: 'Holidays',
      available: true
    },
    {
      id: 10,
      title: 'Mevaser Tov - Sukkos',
      hebrewTitle: 'מבשר טוב - סוכות',
      description: 'Chassidic insights for the festival of joy and divine protection.',
      price: 28,
      image: '/images/books/sukkos.jpg',
      category: 'Holidays',
      available: true
    },
    {
      id: 11,
      title: 'Mevaser Tov - Pesach',
      hebrewTitle: 'מבשר טוב - פסח',
      description: 'Teachings on freedom and redemption for the Passover festival.',
      price: 30,
      image: '/images/books/pesach.jpg',
      category: 'Holidays',
      available: true
    },
    {
      id: 12,
      title: 'Mevaser Tov - Shavuos',
      hebrewTitle: 'מבשר טוב - שבועות',
      description: 'Torah insights for the festival of receiving the Torah.',
      price: 26,
      image: '/images/books/shavuos.jpg',
      category: 'Holidays',
      available: false
    },
  ];

  const displayBooks = books.length > 0 ? books : placeholderBooks;

  const categories = ['all', ...new Set(displayBooks.map(b => b.category))];

  const filteredBooks = displayBooks.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         book.hebrewTitle.includes(searchQuery) ||
                         book.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || book.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="font-display text-4xl md:text-5xl font-bold text-navy-900 mb-4">
            Our <span className="text-gradient">Publications</span>
          </h1>
          <p className="text-xl text-navy-600 max-w-2xl mx-auto">
            Browse our complete collection of Torah writings from the Biala dynasty
          </p>
        </motion.div>

        {/* Search and Filters */}
        <div className="mb-12">
          <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-navy-400" size={20} />
              <input
                type="text"
                placeholder="Search books..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="form-input pl-12"
              />
            </div>

            {/* Filter Toggle (Mobile) */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="sm:hidden btn-secondary flex items-center justify-center gap-2"
            >
              <Filter size={18} />
              Filters
            </button>

            {/* Category Filters (Desktop) */}
            <div className="hidden sm:flex items-center gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg font-display text-sm uppercase tracking-wider transition-all ${
                    selectedCategory === category
                      ? 'bg-gold-500 text-navy-950'
                      : 'bg-cream-200 text-navy-700 hover:bg-cream-300'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Mobile Filters */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="sm:hidden mt-4 p-4 bg-cream-100 rounded-lg"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="font-display text-sm uppercase tracking-wider text-navy-600">Categories</span>
                <button onClick={() => setShowFilters(false)}>
                  <X size={18} />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => {
                      setSelectedCategory(category);
                      setShowFilters(false);
                    }}
                    className={`px-4 py-2 rounded-lg font-display text-sm uppercase tracking-wider transition-all ${
                      selectedCategory === category
                        ? 'bg-gold-500 text-navy-950'
                        : 'bg-cream-200 text-navy-700'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* Books Grid */}
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="card animate-pulse">
                <div className="aspect-[3/4] bg-cream-200"></div>
                <div className="p-6 space-y-3">
                  <div className="h-6 bg-cream-200 rounded"></div>
                  <div className="h-4 bg-cream-200 rounded w-2/3"></div>
                  <div className="h-20 bg-cream-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredBooks.length > 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
          >
            {filteredBooks.map((book, index) => (
              <motion.div
                key={book.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -8 }}
                className="book-card"
              >
                <div className="book-cover bg-gradient-to-br from-navy-800 to-navy-950">
                  <img
                    src={book.image}
                    alt={book.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = `https://placehold.co/300x400/1A2035/C9A008?text=${encodeURIComponent(book.hebrewTitle || book.title)}`;
                    }}
                  />
                  {!book.available && (
                    <div className="absolute inset-0 bg-navy-950/70 flex items-center justify-center">
                      <span className="badge badge-warning">Coming Soon</span>
                    </div>
                  )}
                  <div className="absolute top-3 right-3">
                    <span className="badge badge-info">{book.category}</span>
                  </div>
                </div>
                <div className="book-info">
                  <h3 className="font-display text-lg font-bold text-navy-900 mb-1">{book.title}</h3>
                  <p className="font-hebrew text-gold-700 text-sm mb-2">{book.hebrewTitle}</p>
                  <p className="text-navy-600 text-sm mb-4 line-clamp-2">{book.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="font-display font-bold text-xl text-gold-600">${book.price}</span>
                    <Link 
                      to={`/books/${book.id}`}
                      className="text-sm font-semibold text-navy-800 hover:text-gold-600 transition-colors inline-flex items-center gap-1"
                    >
                      View Details <ChevronRight size={16} />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-20">
            <BookOpen size={48} className="mx-auto text-navy-300 mb-4" />
            <h3 className="font-display text-xl text-navy-600 mb-2">No books found</h3>
            <p className="text-navy-500">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
}

