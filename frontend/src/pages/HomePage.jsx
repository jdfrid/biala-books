import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Star, ArrowRight, ChevronRight, Play, Calendar, Sparkles } from 'lucide-react';
import api from '../services/api';

export default function HomePage() {
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [latestNews, setLatestNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/books/featured').catch(() => ({ data: { books: [] } })),
      api.get('/news/latest').catch(() => ({ data: { news: [] } }))
    ]).then(([booksRes, newsRes]) => {
      setFeaturedBooks(booksRes.data.books || []);
      setLatestNews(newsRes.data.news || []);
    }).finally(() => setLoading(false));
  }, []);

  // Placeholder data for initial display
  const placeholderBooks = [
    {
      id: 1,
      title: 'Mevaser Tov - Bereishis',
      hebrewTitle: 'מבשר טוב - בראשית',
      description: 'Torah insights on the book of Genesis from the Rebbe',
      price: 35,
      image: '/images/books/bereishis.jpg',
      available: true
    },
    {
      id: 2,
      title: 'Mevaser Tov - Shemos',
      hebrewTitle: 'מבשר טוב - שמות',
      description: 'Chassidic teachings on the book of Exodus',
      price: 35,
      image: '/images/books/shemos.jpg',
      available: true
    },
    {
      id: 3,
      title: 'Kedushas Yisroel',
      hebrewTitle: 'קדושת ישראל',
      description: 'On the holiness and sanctity of the Jewish people',
      price: 28,
      image: '/images/books/kedushas.jpg',
      available: false
    },
    {
      id: 4,
      title: 'Maamar HaTorah',
      hebrewTitle: 'מאמר התורה',
      description: 'Discourse on the eternal nature of Torah study',
      price: 25,
      image: '/images/books/maamar.jpg',
      available: true
    }
  ];

  const books = featuredBooks.length > 0 ? featuredBooks : placeholderBooks;

  return (
    <div className="min-h-screen">
      {/* Hero Section - Modern & Compact */}
      <section className="relative min-h-[70vh] flex items-center overflow-hidden bg-gradient-to-br from-cream-50 via-cream-100 to-gold-50">
        {/* Modern geometric background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-gold-400/20 to-transparent rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3"></div>
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-navy-900/5 to-transparent rounded-full blur-2xl"></div>
          <div className="absolute top-1/2 left-1/2 w-[800px] h-[800px] bg-gradient-radial from-gold-300/10 to-transparent rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 relative">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left content */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-gold-100 to-gold-50 border border-gold-200/50 backdrop-blur-sm"
              >
                <Sparkles size={14} className="text-gold-600" />
                <span className="text-xs font-medium text-gold-800 tracking-wide">Torah Teachings of the Mevaser Tov</span>
              </motion.div>

              <h1 className="font-display text-4xl md:text-5xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-navy-900 via-navy-800 to-navy-900 bg-clip-text text-transparent">Illuminating</span>
                <br />
                <span className="bg-gradient-to-r from-gold-600 via-gold-500 to-gold-600 bg-clip-text text-transparent">Sacred Wisdom</span>
              </h1>

              <p className="text-base text-navy-600 leading-relaxed max-w-md">
                Discover the profound Torah teachings of the Biala Rebbe, 
                the <span className="font-hebrew text-gold-700 font-semibold">מבשר טוב</span>, 
                bringing the light of Chassidus to Jews worldwide.
              </p>

              <div className="flex flex-wrap gap-3 pt-2">
                <Link to="/books" className="group px-6 py-2.5 rounded-xl font-display font-semibold text-sm bg-gradient-to-r from-navy-900 to-navy-800 text-gold-400 hover:from-navy-800 hover:to-navy-700 transition-all shadow-lg shadow-navy-900/20 inline-flex items-center gap-2">
                  <BookOpen size={16} />
                  Explore Books
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link to="/about/rebbe" className="px-6 py-2.5 rounded-xl font-display font-semibold text-sm border-2 border-gold-400 text-gold-700 hover:bg-gold-400 hover:text-navy-900 transition-all inline-flex items-center gap-2">
                  About the Rebbe
                </Link>
              </div>

              {/* Stats - Compact */}
              <div className="flex gap-6 pt-6">
                {[
                  { value: '25+', label: 'Volumes' },
                  { value: '150+', label: 'Years' },
                  { value: 'Global', label: 'Community' },
                ].map((stat, i) => (
                  <motion.div 
                    key={stat.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + i * 0.1 }}
                    className="text-center"
                  >
                    <div className="font-display text-2xl font-bold bg-gradient-to-b from-gold-600 to-gold-700 bg-clip-text text-transparent">{stat.value}</div>
                    <div className="text-navy-500 text-xs uppercase tracking-wider">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Right - Rebbe Image - Smaller */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="relative flex justify-center lg:justify-end"
            >
              <div className="relative w-72 md:w-80">
                {/* Modern frame effect */}
                <div className="absolute -inset-3 bg-gradient-to-br from-gold-400 via-gold-500 to-gold-600 rounded-2xl opacity-20 blur-xl"></div>
                <div className="absolute -inset-1 bg-gradient-to-br from-gold-300 to-gold-500 rounded-2xl opacity-30"></div>
                
                <div className="relative rounded-xl overflow-hidden shadow-2xl ring-1 ring-gold-400/50">
                  <div className="aspect-[3/4] bg-gradient-to-br from-navy-800 to-navy-950 flex items-center justify-center">
                    <div className="text-center p-6">
                      <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center">
                        <span className="font-hebrew text-3xl font-bold text-navy-950">מט</span>
                      </div>
                      <p className="font-hebrew text-gold-400 text-lg">המבשר טוב</p>
                      <p className="font-hebrew text-gold-500/70 text-sm mt-1">זיע״א</p>
                    </div>
                  </div>
                </div>

                {/* Floating badge */}
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-md rounded-lg px-4 py-2 shadow-xl border border-gold-200"
                >
                  <p className="font-hebrew text-sm text-navy-900 whitespace-nowrap">
                    כ״ק אדמו״ר מביאלא
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="section-divider">
        <span className="section-divider-icon">✦</span>
      </div>

      {/* Featured Books Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-4xl md:text-5xl font-bold text-navy-900 mb-4">
              Sacred <span className="text-gradient">Publications</span>
            </h2>
            <p className="text-xl text-navy-600 max-w-2xl mx-auto">
              Explore our collection of Torah writings, bringing the light of Chassidus to your home
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 stagger-children">
            {books.map((book) => (
              <motion.div
                key={book.id}
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
                      View <ChevronRight size={16} />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/books" className="btn-secondary inline-flex items-center gap-2">
              View All Books
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-gradient-to-br from-navy-900 via-navy-950 to-navy-900 text-cream-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute -inset-4 bg-gradient-to-br from-gold-400/20 to-gold-600/20 rounded-3xl transform -rotate-2"></div>
              <div className="relative rounded-2xl overflow-hidden">
                <img
                  src="/images/rebbe-current.jpg"
                  alt="The Current Biala Rebbe"
                  className="w-full h-auto"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://placehold.co/500x600/0D101A/C9A008?text=The+Rebbe';
                  }}
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h2 className="font-display text-4xl md:text-5xl font-bold">
                The <span className="text-gold-400">Biala</span> Dynasty
              </h2>
              <p className="text-cream-300 text-lg leading-relaxed">
                The Biala dynasty traces its roots to the great Chassidic masters of Poland. 
                Founded by Rebbe Yerachmiel Tzvi of Biala, the dynasty has produced generations 
                of Torah luminaries who have inspired countless Jews with their teachings of 
                love, devotion, and service to Hashem.
              </p>
              <p className="text-cream-300 text-lg leading-relaxed">
                Today, under the leadership of the current Rebbe שליט״א, the Biala community 
                continues to flourish with vibrant kehillos in Jerusalem, Bnei Brak, Brooklyn, 
                London, and around the world.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <Link to="/about/rebbe" className="btn-primary">
                  About the Mevaser Tov
                </Link>
                <Link to="/about/biala" className="btn-secondary text-cream-100 border-cream-400 hover:bg-cream-100 hover:text-navy-900">
                  About Biala Hasidism
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* News Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-4xl md:text-5xl font-bold text-navy-900 mb-4">
              Latest <span className="text-gradient">Updates</span>
            </h2>
            <p className="text-xl text-navy-600 max-w-2xl mx-auto">
              Stay connected with news from our community
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'New Volume Released',
                date: 'January 15, 2026',
                excerpt: 'We are pleased to announce the release of the newest volume of Mevaser Tov on Parshas HaShavua.',
                image: '/images/news/release.jpg'
              },
              {
                title: 'Annual Gathering Announced',
                date: 'January 10, 2026',
                excerpt: 'The annual international gathering of Biala Chassidim will take place this Adar in Jerusalem.',
                image: '/images/news/gathering.jpg'
              },
              {
                title: 'Sponsorship Opportunity',
                date: 'January 5, 2026',
                excerpt: 'Join us in sponsoring the upcoming publication of the complete Mevaser Tov series.',
                image: '/images/news/sponsorship.jpg'
              }
            ].map((item, index) => (
              <motion.article
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card group cursor-pointer"
              >
                <div className="aspect-video overflow-hidden">
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
                  <div className="flex items-center gap-2 text-gold-600 text-sm mb-2">
                    <Calendar size={14} />
                    {item.date}
                  </div>
                  <h3 className="font-display text-xl font-bold text-navy-900 mb-2 group-hover:text-gold-700 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-navy-600 line-clamp-2">{item.excerpt}</p>
                </div>
              </motion.article>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/news" className="btn-secondary inline-flex items-center gap-2">
              View All News
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Media Preview */}
      <section className="py-20 bg-cream-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-4xl md:text-5xl font-bold text-navy-900 mb-4">
              Media <span className="text-gradient">Gallery</span>
            </h2>
            <p className="text-xl text-navy-600 max-w-2xl mx-auto">
              Experience the beauty of Biala through videos and recordings
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="video-card"
            >
              <img
                src="/images/media/tish.jpg"
                alt="Biala Tish"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://placehold.co/640x360/1A2035/C9A008?text=Tish';
                }}
              />
              <div className="play-button">
                <div className="play-icon">
                  <Play size={28} fill="currentColor" />
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-navy-950 to-transparent">
                <h3 className="font-display text-lg font-bold text-cream-100">Friday Night Tish</h3>
                <p className="text-cream-300 text-sm">Experience the spiritual atmosphere</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="video-card"
            >
              <img
                src="/images/media/shiur.jpg"
                alt="Torah Shiur"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://placehold.co/640x360/1A2035/C9A008?text=Shiur';
                }}
              />
              <div className="play-button">
                <div className="play-icon">
                  <Play size={28} fill="currentColor" />
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-navy-950 to-transparent">
                <h3 className="font-display text-lg font-bold text-cream-100">Torah Shiurim</h3>
                <p className="text-cream-300 text-sm">Learn from the Rebbe's teachings</p>
              </div>
            </motion.div>
          </div>

          <div className="text-center mt-12">
            <Link to="/media" className="btn-primary inline-flex items-center gap-2">
              <Play size={18} />
              Explore Media Gallery
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="ornate-border p-8 md:p-12 text-center"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-navy-900 mb-4">
              Stay Connected
            </h2>
            <p className="text-lg text-navy-600 mb-8 max-w-xl mx-auto">
              Subscribe to receive updates about new publications, Torah teachings, and community events.
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
      </section>

      {/* Donate CTA */}
      <section className="py-20 bg-gradient-to-r from-gold-500 via-gold-400 to-gold-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-navy-950 mb-2">
                Support Our Mission
              </h2>
              <p className="text-navy-800 text-lg">
                Help us spread the light of Torah to Jews around the world
              </p>
            </div>
            <Link to="/donate" className="btn-dark whitespace-nowrap">
              Make a Donation
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

