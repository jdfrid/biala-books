import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Calendar, Eye, Search, Filter } from 'lucide-react';

export default function PublicationsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['all', 'Weekly Parsha', 'Holidays', 'Special Occasions', 'Archive'];

  const publications = [
    {
      id: 1,
      title: 'Parshas Shemos - Weekly Insights',
      description: 'Torah thoughts and stories from the Mevaser Tov on this week\'s parsha',
      date: '2026-01-17',
      category: 'Weekly Parsha',
      downloads: 234,
      pages: 4
    },
    {
      id: 2,
      title: 'Parshas Vaera - Weekly Insights',
      description: 'Teachings on redemption and faith from the holy Rebbes of Biala',
      date: '2026-01-10',
      category: 'Weekly Parsha',
      downloads: 312,
      pages: 4
    },
    {
      id: 3,
      title: 'Tu B\'Shvat Special Edition',
      description: 'Insights on the New Year of the Trees and spiritual growth',
      date: '2026-01-08',
      category: 'Holidays',
      downloads: 456,
      pages: 8
    },
    {
      id: 4,
      title: 'Chanukah Compilation 5786',
      description: 'Complete collection of Chanukah teachings and stories',
      date: '2025-12-20',
      category: 'Holidays',
      downloads: 892,
      pages: 16
    },
    {
      id: 5,
      title: 'Yahrtzeit Memorial Edition',
      description: 'Special publication in memory of the Mevaser Tov',
      date: '2025-12-15',
      category: 'Special Occasions',
      downloads: 567,
      pages: 12
    },
    {
      id: 6,
      title: 'Rosh Hashanah Guide 5786',
      description: 'Preparation guide and teachings for the new year',
      date: '2025-09-20',
      category: 'Archive',
      downloads: 1234,
      pages: 20
    },
  ];

  const filteredPublications = publications.filter(pub => {
    const matchesSearch = pub.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          pub.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || pub.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-b from-amber-50 to-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-100 flex items-center justify-center mb-6">
              <FileText className="text-amber-600" size={32} />
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Publications
            </h1>
            <p className="text-gray-500 max-w-2xl mx-auto text-lg">
              Download our weekly leaflets, holiday guides, and special publications
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
                placeholder="Search publications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input pl-11 py-2.5"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Publications List */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredPublications.length === 0 ? (
            <div className="text-center py-12">
              <FileText size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">No publications found matching your criteria.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPublications.map((pub, index) => (
                <motion.div
                  key={pub.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="card p-6 group"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shrink-0">
                      <FileText className="text-white" size={24} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-xs text-amber-600 font-medium uppercase tracking-wide">
                        {pub.category}
                      </span>
                      <h3 className="font-semibold text-gray-900 group-hover:text-amber-600 transition-colors truncate">
                        {pub.title}
                      </h3>
                    </div>
                  </div>

                  <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                    {pub.description}
                  </p>

                  <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                    <span className="flex items-center gap-1">
                      <Calendar size={14} />
                      {new Date(pub.date).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </span>
                    <span>{pub.pages} pages</span>
                    <span className="flex items-center gap-1">
                      <Download size={14} />
                      {pub.downloads}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <button className="btn-gold flex-1 py-2.5 text-sm">
                      <Download size={16} />
                      Download PDF
                    </button>
                    <button className="btn-secondary py-2.5 px-4">
                      <Eye size={16} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Subscribe Section */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card p-8 md:p-12 text-center bg-gradient-to-br from-gray-900 to-gray-800 text-white">
            <h2 className="font-display text-3xl font-bold mb-4">
              Get Weekly Publications
            </h2>
            <p className="text-gray-300 mb-8 max-w-xl mx-auto">
              Subscribe to receive our weekly parsha leaflet and special holiday publications directly to your inbox
            </p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="form-input flex-1 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
              />
              <button type="submit" className="btn-gold whitespace-nowrap">
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Archive Note */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-500">
            Looking for older publications? Check our{' '}
            <button 
              onClick={() => setSelectedCategory('Archive')}
              className="text-amber-600 hover:underline font-medium"
            >
              archive section
            </button>{' '}
            for past years' collections.
          </p>
        </div>
      </section>
    </div>
  );
}
