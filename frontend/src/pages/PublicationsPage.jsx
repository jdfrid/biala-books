import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, FileText, Calendar, ExternalLink, BookOpen, Newspaper } from 'lucide-react';
import api from '../services/api';

export default function PublicationsPage() {
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    api.get('/publications')
      .then(res => setPublications(res.data.publications || []))
      .catch(() => setPublications(placeholderPublications))
      .finally(() => setLoading(false));
  }, []);

  const placeholderPublications = [
    {
      id: 1,
      title: 'Weekly Parsha Sheet - Parshas Bereishis',
      hebrewTitle: 'עלון השבוע - פרשת בראשית',
      category: 'Weekly',
      date: '2026-01-17',
      description: 'Torah thoughts and insights for the weekly parsha from the Mevaser Tov.',
      downloadUrl: '#',
      pages: 4
    },
    {
      id: 2,
      title: 'Weekly Parsha Sheet - Parshas Noach',
      hebrewTitle: 'עלון השבוע - פרשת נח',
      category: 'Weekly',
      date: '2026-01-10',
      description: 'Chassidic teachings on Parshas Noach.',
      downloadUrl: '#',
      pages: 4
    },
    {
      id: 3,
      title: 'Chanukah Special Edition',
      hebrewTitle: 'מהדורה מיוחדת לחנוכה',
      category: 'Special',
      date: '2025-12-15',
      description: 'Special publication for Chanukah with stories, teachings, and inspiration.',
      downloadUrl: '#',
      pages: 16
    },
    {
      id: 4,
      title: 'Annual Community Magazine',
      hebrewTitle: 'מגזין הקהילה השנתי',
      category: 'Magazine',
      date: '2025-09-01',
      description: 'The comprehensive annual review of Biala community activities worldwide.',
      downloadUrl: '#',
      pages: 48
    },
    {
      id: 5,
      title: 'Rosh Hashanah Preparation Guide',
      hebrewTitle: 'מדריך הכנה לראש השנה',
      category: 'Special',
      date: '2025-09-15',
      description: 'Spiritual preparation and customs for the High Holidays.',
      downloadUrl: '#',
      pages: 12
    },
    {
      id: 6,
      title: 'Pesach Haggadah Companion',
      hebrewTitle: 'הגדה של פסח עם פירושים',
      category: 'Special',
      date: '2025-04-10',
      description: 'Enhanced Haggadah with commentary from the Biala Rebbes.',
      downloadUrl: '#',
      pages: 24
    },
    {
      id: 7,
      title: 'Stories of Faith',
      hebrewTitle: 'סיפורי אמונה',
      category: 'Booklet',
      date: '2025-06-20',
      description: 'Collection of inspiring stories from the Biala tradition.',
      downloadUrl: '#',
      pages: 32
    },
    {
      id: 8,
      title: 'Tikkun Chatzos Guide',
      hebrewTitle: 'סדר תיקון חצות',
      category: 'Booklet',
      date: '2025-07-15',
      description: 'Complete guide for the midnight prayer service.',
      downloadUrl: '#',
      pages: 20
    },
  ];

  const displayPublications = publications.length > 0 ? publications : placeholderPublications;
  const categories = ['all', ...new Set(displayPublications.map(p => p.category))];
  
  const filteredPublications = selectedCategory === 'all' 
    ? displayPublications 
    : displayPublications.filter(p => p.category === selectedCategory);

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Weekly': return Newspaper;
      case 'Magazine': return BookOpen;
      default: return FileText;
    }
  };

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
            Publications & <span className="text-gradient">Newsletters</span>
          </h1>
          <p className="text-xl text-navy-600 max-w-2xl mx-auto">
            Free downloadable publications including weekly parsha sheets, special editions, and more
          </p>
        </motion.div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
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

        {/* Latest Weekly Sheet Highlight */}
        {filteredPublications.some(p => p.category === 'Weekly') && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-16"
          >
            {(() => {
              const latestWeekly = filteredPublications.find(p => p.category === 'Weekly');
              if (!latestWeekly) return null;
              
              return (
                <div className="ornate-border p-8 md:p-12 bg-gradient-to-r from-cream-50 to-cream-100">
                  <div className="flex flex-col md:flex-row items-center gap-8">
                    <div className="w-32 h-40 rounded-lg overflow-hidden shadow-lg bg-navy-900 flex items-center justify-center shrink-0">
                      <Newspaper size={48} className="text-gold-400" />
                    </div>
                    <div className="flex-1 text-center md:text-left">
                      <span className="badge badge-success mb-3">Latest Edition</span>
                      <h2 className="font-display text-2xl md:text-3xl font-bold text-navy-900 mb-2">
                        {latestWeekly.title}
                      </h2>
                      <p className="font-hebrew text-xl text-gold-700 mb-3">{latestWeekly.hebrewTitle}</p>
                      <p className="text-navy-600 mb-4">{latestWeekly.description}</p>
                      <a 
                        href={latestWeekly.downloadUrl}
                        className="btn-primary inline-flex items-center gap-2"
                      >
                        <Download size={18} />
                        Download This Week's Sheet
                      </a>
                    </div>
                  </div>
                </div>
              );
            })()}
          </motion.section>
        )}

        {/* Publications Grid */}
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="card p-6 animate-pulse">
                <div className="h-12 w-12 bg-cream-200 rounded-lg mb-4"></div>
                <div className="h-6 bg-cream-200 rounded mb-2"></div>
                <div className="h-4 bg-cream-200 rounded w-2/3 mb-4"></div>
                <div className="h-20 bg-cream-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPublications.map((item, index) => {
              const CategoryIcon = getCategoryIcon(item.category);
              
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="card p-6 group hover:shadow-xl transition-shadow"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-lg bg-gold-100 flex items-center justify-center shrink-0 group-hover:bg-gold-200 transition-colors">
                      <CategoryIcon size={24} className="text-gold-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="badge badge-info text-xs">{item.category}</span>
                      <div className="flex items-center gap-2 text-navy-500 text-xs mt-1">
                        <Calendar size={12} />
                        {new Date(item.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </div>
                    </div>
                  </div>

                  <h3 className="font-display text-lg font-bold text-navy-900 mb-1 group-hover:text-gold-700 transition-colors">
                    {item.title}
                  </h3>
                  <p className="font-hebrew text-gold-700 text-sm mb-3">{item.hebrewTitle}</p>
                  <p className="text-navy-600 text-sm mb-4 line-clamp-2">{item.description}</p>

                  <div className="flex items-center justify-between pt-4 border-t border-cream-200">
                    <span className="text-navy-500 text-sm">{item.pages} pages</span>
                    <a 
                      href={item.downloadUrl}
                      className="flex items-center gap-2 text-gold-600 font-semibold hover:text-gold-700 transition-colors"
                    >
                      <Download size={16} />
                      Download
                    </a>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Archive Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20"
        >
          <div className="card p-8 md:p-12 bg-navy-900 text-cream-100">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h2 className="font-display text-2xl md:text-3xl font-bold text-gold-400 mb-2">
                  Complete Archive
                </h2>
                <p className="text-cream-300">
                  Access our full archive of weekly parsha sheets and special publications dating back to 2010.
                </p>
              </div>
              <a href="#" className="btn-primary whitespace-nowrap flex items-center gap-2">
                <ExternalLink size={18} />
                Browse Archive
              </a>
            </div>
          </div>
        </motion.section>

        {/* Subscribe CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 ornate-border p-8 md:p-12 text-center"
        >
          <h2 className="font-display text-3xl font-bold text-navy-900 mb-4">
            Never Miss an Issue
          </h2>
          <p className="text-lg text-navy-600 mb-8 max-w-xl mx-auto">
            Subscribe to receive our weekly parsha sheet and special publications directly to your email.
          </p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="form-input flex-1"
            />
            <button type="submit" className="btn-primary whitespace-nowrap">
              Subscribe
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}

