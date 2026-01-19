import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, Heart, Share2, ArrowLeft, Check, Bell, BookOpen, Truck, Shield, ChevronRight } from 'lucide-react';
import api from '../services/api';

export default function BookDetailPage() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [waitlistEmail, setWaitlistEmail] = useState('');
  const [waitlistSubmitted, setWaitlistSubmitted] = useState(false);

  useEffect(() => {
    api.get(`/books/${id}`).catch(() => ({ data: null }))
      .then(res => setBook(res.data))
      .finally(() => setLoading(false));
  }, [id]);

  // Sample book data
  const sampleBook = {
    id: parseInt(id),
    title: 'Mevaser Tov - Bereishis',
    hebrewTitle: 'מבשר טוב - בראשית',
    author: 'The Mevaser Tov of Biala',
    price: 35,
    category: 'Torah',
    available: true,
    stock: 15,
    description: 'The first volume of the renowned Mevaser Tov series, containing profound insights and teachings on the Book of Bereishis (Genesis). This sefer illuminates the weekly parsha with the unique perspective of the Biala Chassidus.',
    features: [
      'Teachings on each parsha in Bereishis',
      'Stories and parables from the Mevaser Tov',
      'Insights on avodas Hashem',
      'Clear Hebrew text with nekudos',
      'Comprehensive index'
    ],
    specs: {
      pages: 450,
      binding: 'Hardcover',
      dimensions: '6" x 9"',
      language: 'Hebrew',
      publisher: 'Biala Publishing',
      year: 2020
    }
  };

  const displayBook = book || sampleBook;

  const handleAddToCart = () => {
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleWaitlist = (e) => {
    e.preventDefault();
    setWaitlistSubmitted(true);
  };

  const relatedBooks = [
    { id: 2, title: 'Mevaser Tov - Shemos', hebrewTitle: 'מבשר טוב - שמות', price: 35 },
    { id: 3, title: 'Mevaser Tov - Vayikra', hebrewTitle: 'מבשר טוב - ויקרא', price: 35 },
    { id: 6, title: 'Kedushas Yisroel', hebrewTitle: 'קדושת ישראל', price: 28 },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-sm">
            <Link to="/books" className="text-gray-400 hover:text-gray-600 flex items-center gap-1">
              <ArrowLeft size={16} />
              Back to Books
            </Link>
            <span className="text-gray-300">/</span>
            <span className="text-gray-600">{displayBook.title}</span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Book Image */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="sticky top-24">
                <div className="aspect-[3/4] rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 overflow-hidden shadow-2xl">
                  {displayBook.image_url ? (
                    <img 
                      src={displayBook.image_url} 
                      alt={displayBook.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-center p-8">
                        <div className="w-24 h-24 mx-auto rounded-2xl bg-amber-500/20 flex items-center justify-center mb-6">
                          <span className="font-hebrew text-4xl text-amber-400">מט</span>
                        </div>
                        <h3 className="font-hebrew text-2xl text-amber-400 mb-2">{displayBook.hebrewTitle}</h3>
                        <p className="text-gray-400 text-sm">Biala Publishing</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Book Details */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <span className="badge badge-info mb-4">{displayBook.category}</span>
              
              <h1 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                {displayBook.title}
              </h1>
              <p className="font-hebrew text-xl text-amber-600 mb-4">{displayBook.hebrewTitle}</p>
              
              <p className="text-gray-500 mb-6">By {displayBook.author}</p>

              <div className="flex items-baseline gap-4 mb-8">
                <span className="font-display text-4xl font-bold text-gray-900">${displayBook.price}</span>
                {displayBook.available && displayBook.stock > 0 && (
                  <span className="badge badge-success">In Stock</span>
                )}
                {!displayBook.available && (
                  <span className="badge badge-warning">Coming Soon</span>
                )}
                {displayBook.available && displayBook.stock === 0 && (
                  <span className="badge badge-danger">Out of Stock</span>
                )}
              </div>

              <p className="text-gray-600 leading-relaxed mb-8">
                {displayBook.description}
              </p>

              {/* Purchase Section */}
              {displayBook.available && displayBook.stock > 0 ? (
                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-4">
                    <label className="text-sm font-medium text-gray-700">Quantity:</label>
                    <div className="flex items-center border border-gray-200 rounded-lg">
                      <button 
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="px-4 py-2 text-gray-500 hover:text-gray-700"
                      >
                        -
                      </button>
                      <span className="px-4 py-2 font-medium">{quantity}</span>
                      <button 
                        onClick={() => setQuantity(quantity + 1)}
                        className="px-4 py-2 text-gray-500 hover:text-gray-700"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button 
                      onClick={handleAddToCart}
                      className={`btn-gold flex-1 py-4 ${addedToCart ? 'bg-green-500' : ''}`}
                    >
                      {addedToCart ? (
                        <>
                          <Check size={20} />
                          Added to Cart!
                        </>
                      ) : (
                        <>
                          <ShoppingCart size={20} />
                          Add to Cart - ${displayBook.price * quantity}
                        </>
                      )}
                    </button>
                    <button className="btn-secondary py-4 px-4">
                      <Heart size={20} />
                    </button>
                    <button className="btn-secondary py-4 px-4">
                      <Share2 size={20} />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-amber-50 rounded-2xl p-6 mb-8">
                  <div className="flex items-center gap-3 mb-4">
                    <Bell className="text-amber-600" size={24} />
                    <h3 className="font-semibold text-gray-900">
                      {!displayBook.available ? 'Coming Soon' : 'Out of Stock'}
                    </h3>
                  </div>
                  {waitlistSubmitted ? (
                    <div className="flex items-center gap-2 text-green-600">
                      <Check size={20} />
                      <span>You're on the waitlist! We'll notify you when available.</span>
                    </div>
                  ) : (
                    <form onSubmit={handleWaitlist} className="flex gap-2">
                      <input
                        type="email"
                        required
                        value={waitlistEmail}
                        onChange={(e) => setWaitlistEmail(e.target.value)}
                        placeholder="Enter your email"
                        className="form-input flex-1"
                      />
                      <button type="submit" className="btn-gold">
                        Notify Me
                      </button>
                    </form>
                  )}
                </div>
              )}

              {/* Features */}
              <div className="border-t border-gray-200 pt-8 mb-8">
                <h3 className="font-semibold text-gray-900 mb-4">What's Inside</h3>
                <ul className="space-y-2">
                  {displayBook.features?.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-gray-600">
                      <Check className="text-amber-500 mt-0.5 shrink-0" size={18} />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Specs */}
              <div className="border-t border-gray-200 pt-8 mb-8">
                <h3 className="font-semibold text-gray-900 mb-4">Specifications</h3>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(displayBook.specs || {}).map(([key, value]) => (
                    <div key={key}>
                      <span className="text-sm text-gray-400 capitalize">{key}</span>
                      <p className="font-medium text-gray-900">{value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4">
                {[
                  { icon: Truck, label: 'Free shipping over $50' },
                  { icon: Shield, label: 'Secure checkout' },
                  { icon: BookOpen, label: 'Quality printing' },
                ].map((item) => (
                  <div key={item.label} className="text-center">
                    <item.icon className="mx-auto text-gray-400 mb-2" size={24} />
                    <span className="text-xs text-gray-500">{item.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Related Books */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl font-bold text-gray-900 mb-8">
            You May Also Like
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedBooks.map((relBook) => (
              <Link 
                key={relBook.id} 
                to={`/books/${relBook.id}`}
                className="book-card block group"
              >
                <div className="book-cover flex items-center justify-center">
                  <span className="font-hebrew text-2xl text-amber-400 font-bold">
                    {relBook.hebrewTitle}
                  </span>
                </div>
                <div className="book-info">
                  <h3 className="font-semibold text-gray-900 group-hover:text-amber-600 transition-colors">
                    {relBook.title}
                  </h3>
                  <div className="flex items-center justify-between mt-2">
                    <span className="font-bold text-lg text-amber-600">${relBook.price}</span>
                    <span className="text-sm text-gray-400 group-hover:text-amber-600 transition-colors flex items-center gap-1">
                      View <ChevronRight size={14} />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
