import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, ArrowRight, Play, Calendar, Sparkles, ChevronRight } from 'lucide-react';
import api from '../services/api';

export default function HomePage() {
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/books/featured').catch(() => ({ data: { books: [] } }))
      .then(res => setFeaturedBooks(res.data.books || []))
      .finally(() => setLoading(false));
  }, []);

  const books = featuredBooks.length > 0 ? featuredBooks : [
    { id: 1, title: 'Mevaser Tov - Bereishis', hebrewTitle: 'מבשר טוב - בראשית', price: 35, available: true },
    { id: 2, title: 'Mevaser Tov - Shemos', hebrewTitle: 'מבשר טוב - שמות', price: 35, available: true },
    { id: 3, title: 'Kedushas Yisroel', hebrewTitle: 'קדושת ישראל', price: 28, available: false },
    { id: 4, title: 'Maamar HaTorah', hebrewTitle: 'מאמר התורה', price: 25, available: true },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section - Clean & Modern */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        {/* Subtle gradient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-amber-50/50 to-white"></div>
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-amber-100/30 to-transparent"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left content */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 text-amber-800 text-sm font-medium mb-6">
                <Sparkles size={16} />
                Torah Teachings of the Mevaser Tov
              </div>

              <h1 className="font-display text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                Illuminating
                <span className="block text-amber-600">Sacred Wisdom</span>
              </h1>

              <p className="text-lg text-gray-600 leading-relaxed mb-8 max-w-lg">
                Discover the profound Torah teachings of the Biala Rebbe, bringing the light of Chassidus to generations worldwide.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link to="/books" className="btn-gold">
                  <BookOpen size={18} />
                  Browse Collection
                </Link>
                <Link to="/about/rebbe" className="btn-secondary">
                  Learn More
                  <ArrowRight size={18} />
                </Link>
              </div>

              {/* Stats */}
              <div className="flex gap-12 mt-12 pt-8 border-t border-gray-200">
                {[
                  { value: '25+', label: 'Published Volumes' },
                  { value: '150+', label: 'Years of Legacy' },
                  { value: '10K+', label: 'Books Distributed' },
                ].map((stat) => (
                  <div key={stat.label}>
                    <div className="font-display text-3xl font-bold text-gray-900">{stat.value}</div>
                    <div className="text-sm text-gray-500">{stat.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right - Featured visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className="relative">
                {/* Decorative elements */}
                <div className="absolute -top-4 -left-4 w-72 h-72 bg-amber-200 rounded-full opacity-20 blur-3xl"></div>
                <div className="absolute -bottom-8 -right-8 w-64 h-64 bg-amber-300 rounded-full opacity-20 blur-3xl"></div>
                
                {/* Main card */}
                <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 shadow-2xl">
                  <div className="text-center">
                    <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg">
                      <span className="font-hebrew text-4xl font-bold text-gray-900">מט</span>
                    </div>
                    <h3 className="font-hebrew text-2xl text-amber-400 mb-2">המבשר טוב</h3>
                    <p className="text-gray-400 text-sm">רבינו מביאלא זיע״א</p>
                    
                    <div className="mt-8 pt-6 border-t border-gray-700">
                      <p className="font-hebrew text-amber-200/80 text-sm leading-relaxed">
                        "כל יהודי הוא אבן יקרה בכתר של הקב״ה"
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Books */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl font-bold text-gray-900 mb-4">
              Featured Publications
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Explore our collection of sacred Torah writings
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {books.map((book, index) => (
              <motion.div
                key={book.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link to={`/books/${book.id}`} className="book-card block group">
                  <div className="book-cover flex items-center justify-center">
                    <div className="text-center p-4">
                      <span className="font-hebrew text-3xl text-amber-400 font-bold">{book.hebrewTitle}</span>
                    </div>
                    {!book.available && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <span className="badge badge-warning">Coming Soon</span>
                      </div>
                    )}
                  </div>
                  <div className="book-info">
                    <h3 className="font-semibold text-gray-900 group-hover:text-amber-600 transition-colors mb-1">
                      {book.title}
                    </h3>
                    <div className="flex items-center justify-between mt-3">
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

          <div className="text-center mt-12">
            <Link to="/books" className="btn-secondary">
              View All Books
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-24 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="aspect-[4/5] rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-32 h-32 mx-auto rounded-full bg-amber-500/10 flex items-center justify-center mb-4">
                      <span className="font-hebrew text-5xl text-amber-400">ב</span>
                    </div>
                    <p className="font-hebrew text-xl text-amber-400">ביאלא</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="font-display text-4xl font-bold mb-6">
                The <span className="text-amber-400">Biala</span> Dynasty
              </h2>
              <p className="text-gray-300 text-lg leading-relaxed mb-6">
                The Biala dynasty traces its roots to the great Chassidic masters of Poland. 
                For over 150 years, the Biala Rebbes have inspired countless Jews with teachings 
                of love, devotion, and service to Hashem.
              </p>
              <p className="text-gray-400 leading-relaxed mb-8">
                Today, vibrant Biala communities flourish in Jerusalem, Brooklyn, London, and 
                around the world, continuing the sacred tradition of spreading Torah and Chassidus.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/about/rebbe" className="btn-gold">
                  About the Mevaser Tov
                </Link>
                <Link to="/about/biala" className="btn-secondary text-white border-gray-600 hover:bg-gray-800 hover:border-gray-500">
                  Biala History
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* News Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl font-bold text-gray-900 mb-4">
              Latest Updates
            </h2>
            <p className="text-gray-500">Stay connected with our community</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: 'New Volume Released', date: 'Jan 15, 2026', category: 'Publications' },
              { title: 'Annual Gathering Announced', date: 'Jan 10, 2026', category: 'Events' },
              { title: 'Sponsorship Opportunity', date: 'Jan 5, 2026', category: 'Opportunities' },
            ].map((item, index) => (
              <motion.article
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card p-6 hover:shadow-lg cursor-pointer"
              >
                <span className="badge badge-info mb-4">{item.category}</span>
                <h3 className="font-semibold text-xl text-gray-900 mb-2">{item.title}</h3>
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <Calendar size={14} />
                  {item.date}
                </div>
              </motion.article>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/news" className="btn-secondary">
              View All News
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Media Preview */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl font-bold text-gray-900 mb-4">
              Media Gallery
            </h2>
            <p className="text-gray-500">Experience the beauty of Biala through videos and recordings</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              { title: 'Friday Night Tish', subtitle: 'Experience the spiritual atmosphere' },
              { title: 'Torah Shiurim', subtitle: 'Learn from the Rebbe\'s teachings' },
            ].map((item, index) => (
              <div key={index} className="video-card rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-hebrew text-4xl text-amber-400/30">{index === 0 ? 'טיש' : 'שיעור'}</span>
                </div>
                <div className="play-button">
                  <div className="play-icon">
                    <Play size={24} fill="currentColor" className="ml-1" />
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                  <h3 className="font-semibold text-lg text-white">{item.title}</h3>
                  <p className="text-gray-300 text-sm">{item.subtitle}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/media" className="btn-gold">
              <Play size={18} />
              Explore Media Gallery
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-3xl font-bold text-gray-900 mb-4">
            Stay Connected
          </h2>
          <p className="text-gray-500 mb-8">
            Subscribe to receive updates about new publications and community events.
          </p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="form-input flex-1"
            />
            <button type="submit" className="btn-gold whitespace-nowrap">
              Subscribe
            </button>
          </form>
        </div>
      </section>

      {/* Donate CTA */}
      <section className="py-16 bg-gradient-to-r from-amber-500 to-amber-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="font-display text-2xl font-bold text-gray-900 mb-1">
                Support Our Mission
              </h2>
              <p className="text-gray-800">
                Help us spread the light of Torah to Jews around the world
              </p>
            </div>
            <Link to="/donate" className="btn-primary bg-gray-900 hover:bg-gray-800">
              Make a Donation
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
