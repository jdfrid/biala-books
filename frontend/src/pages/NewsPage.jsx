import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, ChevronRight, Tag } from 'lucide-react';
import api from '../services/api';

export default function NewsPage() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    api.get('/news')
      .then(res => setNews(res.data.news || []))
      .catch(() => setNews(placeholderNews))
      .finally(() => setLoading(false));
  }, []);

  const placeholderNews = [
    {
      id: 1,
      title: 'New Volume of Mevaser Tov Released',
      excerpt: 'We are thrilled to announce the publication of the latest volume in the Mevaser Tov series, covering Parshas Vayikra through Parshas Bechukosai.',
      content: 'The complete content would go here...',
      date: '2026-01-15',
      category: 'Publications',
      image: '/images/news/new-book.jpg',
      featured: true
    },
    {
      id: 2,
      title: 'Annual International Gathering Announced',
      excerpt: 'The annual gathering of Biala Chassidim from around the world will take place this Adar in Jerusalem. Registration is now open.',
      date: '2026-01-10',
      category: 'Events',
      image: '/images/news/gathering.jpg',
      featured: true
    },
    {
      id: 3,
      title: 'Sponsor the Complete Mevaser Tov Set',
      excerpt: 'A unique opportunity to dedicate the complete Mevaser Tov collection in memory of loved ones or in honor of special occasions.',
      date: '2026-01-05',
      category: 'Opportunities',
      image: '/images/news/sponsorship.jpg',
      featured: false
    },
    {
      id: 4,
      title: 'New Kollel Opened in London',
      excerpt: 'A new kollel for advanced Torah study has been established in the London Biala community, with twelve dedicated scholars.',
      date: '2025-12-20',
      category: 'Community',
      image: '/images/news/kollel.jpg',
      featured: false
    },
    {
      id: 5,
      title: 'Yahrtzeit Commemorations',
      excerpt: 'Join us in commemorating the yahrtzeit of previous Biala Rebbes with special learning programs and gatherings.',
      date: '2025-12-15',
      category: 'Events',
      image: '/images/news/yahrtzeit.jpg',
      featured: false
    },
    {
      id: 6,
      title: 'Translation Project Update',
      excerpt: 'Progress continues on the English translation of the Mevaser Tov. Volume one is expected to be completed by Pesach.',
      date: '2025-12-10',
      category: 'Publications',
      image: '/images/news/translation.jpg',
      featured: false
    },
  ];

  const displayNews = news.length > 0 ? news : placeholderNews;
  const categories = ['all', ...new Set(displayNews.map(n => n.category))];
  
  const filteredNews = selectedCategory === 'all' 
    ? displayNews 
    : displayNews.filter(n => n.category === selectedCategory);

  const featuredNews = filteredNews.filter(n => n.featured);
  const regularNews = filteredNews.filter(n => !n.featured);

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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
            News & <span className="text-gradient">Updates</span>
          </h1>
          <p className="text-xl text-navy-600 max-w-2xl mx-auto">
            Stay informed about our latest publications, events, and community news
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

        {loading ? (
          <div className="grid md:grid-cols-2 gap-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="card animate-pulse">
                <div className="aspect-video bg-cream-200"></div>
                <div className="p-6 space-y-3">
                  <div className="h-4 bg-cream-200 rounded w-1/4"></div>
                  <div className="h-6 bg-cream-200 rounded w-3/4"></div>
                  <div className="h-20 bg-cream-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Featured News */}
            {featuredNews.length > 0 && (
              <section className="mb-16">
                <h2 className="font-display text-2xl font-bold text-navy-900 mb-8">Featured</h2>
                <div className="grid md:grid-cols-2 gap-8">
                  {featuredNews.map((item, index) => (
                    <motion.article
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="card group cursor-pointer overflow-hidden"
                    >
                      <div className="aspect-video overflow-hidden relative">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://placehold.co/640x360/1A2035/C9A008?text=News';
                          }}
                        />
                        <div className="absolute top-4 left-4">
                          <span className="badge badge-info">{item.category}</span>
                        </div>
                      </div>
                      <div className="p-6">
                        <div className="flex items-center gap-2 text-gold-600 text-sm mb-3">
                          <Calendar size={14} />
                          {formatDate(item.date)}
                        </div>
                        <h3 className="font-display text-2xl font-bold text-navy-900 mb-3 group-hover:text-gold-700 transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-navy-600 mb-4 line-clamp-3">{item.excerpt}</p>
                        <span className="text-gold-600 font-semibold inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                          Read More <ChevronRight size={16} />
                        </span>
                      </div>
                    </motion.article>
                  ))}
                </div>
              </section>
            )}

            {/* Regular News */}
            <section>
              <h2 className="font-display text-2xl font-bold text-navy-900 mb-8">
                {featuredNews.length > 0 ? 'More News' : 'Latest News'}
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {regularNews.map((item, index) => (
                  <motion.article
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="card group cursor-pointer"
                  >
                    <div className="aspect-video overflow-hidden relative">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://placehold.co/400x225/1A2035/C9A008?text=News';
                        }}
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <span className="flex items-center gap-1 text-gold-600 text-sm">
                          <Calendar size={14} />
                          {formatDate(item.date)}
                        </span>
                        <span className="flex items-center gap-1 text-navy-500 text-xs">
                          <Tag size={12} />
                          {item.category}
                        </span>
                      </div>
                      <h3 className="font-display text-lg font-bold text-navy-900 mb-2 group-hover:text-gold-700 transition-colors line-clamp-2">
                        {item.title}
                      </h3>
                      <p className="text-navy-600 text-sm line-clamp-2">{item.excerpt}</p>
                    </div>
                  </motion.article>
                ))}
              </div>
            </section>
          </>
        )}

        {/* Newsletter CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 ornate-border p-8 md:p-12 text-center"
        >
          <h2 className="font-display text-3xl font-bold text-navy-900 mb-4">
            Never Miss an Update
          </h2>
          <p className="text-lg text-navy-600 mb-8 max-w-xl mx-auto">
            Subscribe to our mailing list to receive the latest news directly to your inbox.
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

