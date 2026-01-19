import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ShoppingCart, Bell, Check, Share2, BookOpen, Star, ChevronRight } from 'lucide-react';
import api from '../services/api';

export default function BookDetailPage() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [showWaitlistModal, setShowWaitlistModal] = useState(false);
  const [waitlistEmail, setWaitlistEmail] = useState('');
  const [waitlistSubmitted, setWaitlistSubmitted] = useState(false);
  const [relatedBooks, setRelatedBooks] = useState([]);

  useEffect(() => {
    setLoading(true);
    api.get(`/books/${id}`)
      .then(res => {
        setBook(res.data.book);
        return api.get(`/books/related/${id}`);
      })
      .then(res => setRelatedBooks(res.data.books || []))
      .catch(() => {
        // Use placeholder data
        setBook({
          id: parseInt(id),
          title: 'Mevaser Tov - Bereishis',
          hebrewTitle: 'מבשר טוב - בראשית',
          description: 'Chassidic insights and teachings on the book of Genesis, revealing the deep secrets and spiritual meanings within each parsha. This comprehensive volume explores the foundations of creation, the lives of our patriarchs, and the eternal lessons they hold for every Jew.',
          longDescription: `The Mevaser Tov on Bereishis represents the Rebbe's profound insights into the first book of the Torah. Through carefully crafted teachings, the Rebbe illuminates the hidden depths of each parsha, revealing how the stories of creation and our ancestors speak directly to our souls.

This volume includes:
• Deep analysis of each weekly Torah portion
• Chassidic interpretations of the patriarchs' lives
• Practical lessons for spiritual growth
• Insights on prayer, character refinement, and service of Hashem
• Beautiful stories and parables

The work combines intellectual depth with emotional warmth, making the wisdom of Chassidus accessible to scholars and laypeople alike.`,
          price: 35,
          image: '/images/books/bereishis.jpg',
          category: 'Torah',
          available: true,
          pages: 384,
          binding: 'Hardcover',
          language: 'Hebrew/English',
          isbn: '978-1-234567-89-0',
          publisher: 'Biala Publishing',
          year: 2024
        });
        setRelatedBooks([
          { id: 2, title: 'Mevaser Tov - Shemos', hebrewTitle: 'מבשר טוב - שמות', price: 35, image: '/images/books/shemos.jpg' },
          { id: 3, title: 'Mevaser Tov - Vayikra', hebrewTitle: 'מבשר טוב - ויקרא', price: 35, image: '/images/books/vayikra.jpg' },
          { id: 7, title: 'Maamar HaTorah', hebrewTitle: 'מאמר התורה', price: 25, image: '/images/books/maamar.jpg' },
        ]);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = () => {
    // Add to cart logic
    console.log(`Adding ${quantity} copies of book ${id} to cart`);
  };

  const handleWaitlistSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/waitlist', { bookId: id, email: waitlistEmail });
      setWaitlistSubmitted(true);
    } catch (error) {
      console.error('Waitlist error:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 w-32 bg-cream-200 rounded mb-8"></div>
            <div className="grid lg:grid-cols-2 gap-12">
              <div className="aspect-[3/4] bg-cream-200 rounded-2xl"></div>
              <div className="space-y-4">
                <div className="h-10 bg-cream-200 rounded w-3/4"></div>
                <div className="h-6 bg-cream-200 rounded w-1/2"></div>
                <div className="h-32 bg-cream-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <BookOpen size={48} className="mx-auto text-navy-300 mb-4" />
          <h2 className="font-display text-2xl text-navy-900 mb-2">Book Not Found</h2>
          <Link to="/books" className="text-gold-600 hover:text-gold-700">
            Browse all books
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back button */}
        <Link to="/books" className="inline-flex items-center gap-2 text-navy-600 hover:text-gold-600 transition-colors mb-8">
          <ArrowLeft size={20} />
          Back to Books
        </Link>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Book Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="sticky top-24"
          >
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-br from-gold-300 via-gold-400 to-gold-600 rounded-3xl transform rotate-1 opacity-20"></div>
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-gold-300">
                <img
                  src={book.image}
                  alt={book.title}
                  className="w-full h-auto"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `https://placehold.co/500x650/1A2035/C9A008?text=${encodeURIComponent(book.hebrewTitle || book.title)}`;
                  }}
                />
              </div>
            </div>
          </motion.div>

          {/* Book Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Category badge */}
            <span className="badge badge-info">{book.category}</span>

            {/* Title */}
            <div>
              <h1 className="font-display text-4xl md:text-5xl font-bold text-navy-900 mb-2">
                {book.title}
              </h1>
              <p className="font-hebrew text-2xl text-gold-700">{book.hebrewTitle}</p>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-2">
              <span className="font-display text-4xl font-bold text-gold-600">${book.price}</span>
              {book.available ? (
                <span className="badge badge-success">In Stock</span>
              ) : (
                <span className="badge badge-warning">Pre-Order</span>
              )}
            </div>

            {/* Description */}
            <p className="text-lg text-navy-700 leading-relaxed">{book.description}</p>

            {/* Long description */}
            {book.longDescription && (
              <div className="prose prose-lg text-navy-600 whitespace-pre-line">
                {book.longDescription}
              </div>
            )}

            {/* Book details */}
            <div className="grid grid-cols-2 gap-4 p-6 bg-cream-100 rounded-xl">
              <div>
                <span className="text-navy-500 text-sm">Pages</span>
                <p className="font-semibold text-navy-900">{book.pages}</p>
              </div>
              <div>
                <span className="text-navy-500 text-sm">Binding</span>
                <p className="font-semibold text-navy-900">{book.binding}</p>
              </div>
              <div>
                <span className="text-navy-500 text-sm">Language</span>
                <p className="font-semibold text-navy-900">{book.language}</p>
              </div>
              <div>
                <span className="text-navy-500 text-sm">Year</span>
                <p className="font-semibold text-navy-900">{book.year}</p>
              </div>
              <div className="col-span-2">
                <span className="text-navy-500 text-sm">ISBN</span>
                <p className="font-semibold text-navy-900">{book.isbn}</p>
              </div>
            </div>

            {/* Purchase section */}
            {book.available ? (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <label className="text-navy-700">Quantity:</label>
                  <div className="flex items-center border-2 border-cream-300 rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-4 py-2 hover:bg-cream-200 transition-colors"
                    >
                      -
                    </button>
                    <span className="px-4 py-2 font-semibold">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-4 py-2 hover:bg-cream-200 transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4">
                  <button onClick={handleAddToCart} className="btn-primary flex items-center gap-2">
                    <ShoppingCart size={18} />
                    Add to Cart
                  </button>
                  <button className="btn-secondary flex items-center gap-2">
                    <Share2 size={18} />
                    Share
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-navy-600">
                  This book is currently unavailable. Join the waitlist to be notified when it becomes available.
                </p>
                <button
                  onClick={() => setShowWaitlistModal(true)}
                  className="btn-primary flex items-center gap-2"
                >
                  <Bell size={18} />
                  Join Waitlist
                </button>
              </div>
            )}
          </motion.div>
        </div>

        {/* Related Books */}
        {relatedBooks.length > 0 && (
          <section className="mt-20">
            <h2 className="font-display text-3xl font-bold text-navy-900 mb-8">
              You May Also Like
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {relatedBooks.map((relatedBook) => (
                <motion.div
                  key={relatedBook.id}
                  whileHover={{ y: -8 }}
                  className="book-card"
                >
                  <div className="book-cover bg-gradient-to-br from-navy-800 to-navy-950">
                    <img
                      src={relatedBook.image}
                      alt={relatedBook.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = `https://placehold.co/300x400/1A2035/C9A008?text=${encodeURIComponent(relatedBook.hebrewTitle || relatedBook.title)}`;
                      }}
                    />
                  </div>
                  <div className="book-info">
                    <h3 className="font-display text-lg font-bold text-navy-900 mb-1">{relatedBook.title}</h3>
                    <p className="font-hebrew text-gold-700 text-sm mb-2">{relatedBook.hebrewTitle}</p>
                    <div className="flex items-center justify-between">
                      <span className="font-display font-bold text-xl text-gold-600">${relatedBook.price}</span>
                      <Link 
                        to={`/books/${relatedBook.id}`}
                        className="text-sm font-semibold text-navy-800 hover:text-gold-600 transition-colors inline-flex items-center gap-1"
                      >
                        View <ChevronRight size={16} />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Waitlist Modal */}
      {showWaitlistModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/60 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-cream-50 rounded-2xl p-8 max-w-md w-full shadow-2xl"
          >
            {waitlistSubmitted ? (
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
                  <Check size={32} className="text-green-600" />
                </div>
                <h3 className="font-display text-2xl font-bold text-navy-900 mb-2">You're on the list!</h3>
                <p className="text-navy-600 mb-6">We'll notify you when this book becomes available.</p>
                <button onClick={() => setShowWaitlistModal(false)} className="btn-primary">
                  Close
                </button>
              </div>
            ) : (
              <>
                <h3 className="font-display text-2xl font-bold text-navy-900 mb-2">Join the Waitlist</h3>
                <p className="text-navy-600 mb-6">Enter your email to be notified when "{book.title}" is back in stock.</p>
                <form onSubmit={handleWaitlistSubmit} className="space-y-4">
                  <input
                    type="email"
                    value={waitlistEmail}
                    onChange={(e) => setWaitlistEmail(e.target.value)}
                    placeholder="Your email"
                    required
                    className="form-input"
                  />
                  <div className="flex gap-4">
                    <button type="button" onClick={() => setShowWaitlistModal(false)} className="btn-secondary flex-1">
                      Cancel
                    </button>
                    <button type="submit" className="btn-primary flex-1">
                      Notify Me
                    </button>
                  </div>
                </form>
              </>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
}

