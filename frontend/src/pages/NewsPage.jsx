import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowRight, Tag, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function NewsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['all', 'Publications', 'Events', 'Community', 'Announcements'];

  const news = [
    {
      id: 1,
      title: 'New Volume of Mevaser Tov Released',
      excerpt: 'We are pleased to announce the publication of the newest volume in the Mevaser Tov series, containing teachings on Sefer Vayikra.',
      date: '2026-01-15',
      category: 'Publications',
      featured: true,
      readTime: '3 min read'
    },
    {
      id: 2,
      title: 'Annual Gathering Announced for Adar',
      excerpt: 'The annual gathering of Biala chassidim will take place in Jerusalem during the month of Adar. Registration is now open.',
      date: '2026-01-10',
      category: 'Events',
      featured: true,
      readTime: '2 min read'
    },
    {
      id: 3,
      title: 'Sponsorship Opportunities for New Publication',
      excerpt: 'Help bring the next volume of sacred teachings to print. Various sponsorship levels available.',
      date: '2026-01-05',
      category: 'Announcements',
      featured: false,
      readTime: '2 min read'
    },
    {
      id: 4,
      title: 'Community Celebrates Chanukah Together',
      excerpt: 'Hundreds gathered for the annual Chanukah celebration featuring lighting, music, and inspiration.',
      date: '2025-12-28',
      category: 'Community',
      featured: false,
      readTime: '4 min read'
    },
    {
      id: 5,
      title: 'New Learning Program Launches',
      excerpt: 'A new online learning program featuring weekly shiurim on the teachings of the Mevaser Tov is now available.',
      date: '2025-12-20',
      category: 'Announcements',
      featured: false,
      readTime: '3 min read'
    },
    {
      id: 6,
      title: 'Yahrtzeit Commemoration',
      excerpt: 'Community members gathered to mark the yahrtzeit of the Mevaser Tov with learning, prayers, and stories.',
      date: '2025-12-15',
      category: 'Community',
      featured: false,
      readTime: '5 min read'
    },
  ];

  const filteredNews = news.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredNews = filteredNews.filter(item => item.featured);
  const regularNews = filteredNews.filter(item => !item.featured);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-b from-amber-50 to-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="font-display text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              News & Updates
            </h1>
            <p className="text-gray-500 max-w-2xl mx-auto text-lg">
              Stay informed about our latest publications, events, and community news
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-6 bg-white border-b border-gray-100 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Categories */}
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedCategory === cat
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {cat === 'all' ? 'All' : cat}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative w-full md:w-72">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search news..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input pl-11 py-2.5"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured News */}
      {featuredNews.length > 0 && (
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-display text-2xl font-bold text-gray-900 mb-8">Featured</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {featuredNews.map((item, index) => (
                <motion.article
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="card overflow-hidden group cursor-pointer"
                >
                  <div className="aspect-[16/9] bg-gradient-to-br from-gray-800 to-gray-900 relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="font-hebrew text-5xl text-amber-400/20">חדשות</span>
                    </div>
                    <div className="absolute top-4 left-4">
                      <span className="badge badge-info">{item.category}</span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar size={14} />
                        {new Date(item.date).toLocaleDateString('en-US', { 
                          month: 'long', 
                          day: 'numeric', 
                          year: 'numeric' 
                        })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={14} />
                        {item.readTime}
                      </span>
                    </div>
                    <h3 className="font-display text-xl font-bold text-gray-900 mb-2 group-hover:text-amber-600 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-gray-500 line-clamp-2 mb-4">{item.excerpt}</p>
                    <span className="inline-flex items-center gap-1 text-amber-600 font-medium text-sm group-hover:gap-2 transition-all">
                      Read More <ArrowRight size={16} />
                    </span>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All News */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl font-bold text-gray-900 mb-8">All Updates</h2>
          
          {regularNews.length === 0 && featuredNews.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No news articles found matching your criteria.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {regularNews.map((item, index) => (
                <motion.article
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="card p-6 flex flex-col md:flex-row gap-6 group cursor-pointer hover:shadow-lg"
                >
                  <div className="w-full md:w-48 aspect-video md:aspect-square rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center shrink-0">
                    <Tag className="text-gray-300" size={32} />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      <span className="badge badge-info">{item.category}</span>
                      <span className="text-sm text-gray-400 flex items-center gap-1">
                        <Calendar size={14} />
                        {new Date(item.date).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric', 
                          year: 'numeric' 
                        })}
                      </span>
                      <span className="text-sm text-gray-400 flex items-center gap-1">
                        <Clock size={14} />
                        {item.readTime}
                      </span>
                    </div>
                    <h3 className="font-display text-xl font-bold text-gray-900 mb-2 group-hover:text-amber-600 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-gray-500 line-clamp-2 mb-4">{item.excerpt}</p>
                    <span className="inline-flex items-center gap-1 text-amber-600 font-medium text-sm group-hover:gap-2 transition-all">
                      Read More <ArrowRight size={16} />
                    </span>
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-3xl font-bold text-gray-900 mb-4">
            Stay Updated
          </h2>
          <p className="text-gray-500 mb-8">
            Subscribe to our newsletter and never miss important news and updates
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
    </div>
  );
}
