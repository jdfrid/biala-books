import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, BookOpen, CheckCircle } from 'lucide-react';
import api from '../services/api';

export default function NewsletterPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Show popup after 30 seconds if user hasn't subscribed
    const hasSubscribed = localStorage.getItem('newsletter_subscribed');
    const hasDismissed = sessionStorage.getItem('newsletter_dismissed');
    
    if (!hasSubscribed && !hasDismissed) {
      const timer = setTimeout(() => setIsOpen(true), 30000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.post('/newsletter/subscribe', { email, name });
      setSuccess(true);
      localStorage.setItem('newsletter_subscribed', 'true');
      setTimeout(() => setIsOpen(false), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to subscribe. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem('newsletter_dismissed', 'true');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/60 backdrop-blur-sm"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Decorative background */}
            <div className="absolute inset-0 bg-gradient-to-br from-gold-400 to-gold-600 rounded-2xl transform rotate-1"></div>
            
            <div className="relative bg-cream-50 rounded-2xl p-8 shadow-2xl">
              {/* Close button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 p-1 rounded-full hover:bg-cream-200 transition-colors"
              >
                <X size={20} className="text-navy-600" />
              </button>

              {success ? (
                <div className="text-center py-4">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle size={32} className="text-green-600" />
                  </div>
                  <h3 className="font-display text-2xl font-bold text-navy-900 mb-2">
                    Welcome!
                  </h3>
                  <p className="text-navy-600">
                    Thank you for subscribing. You'll receive our updates soon.
                  </p>
                </div>
              ) : (
                <>
                  {/* Icon */}
                  <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center">
                    <BookOpen size={28} className="text-navy-950" />
                  </div>

                  {/* Content */}
                  <div className="text-center mb-6">
                    <h3 className="font-display text-2xl font-bold text-navy-900 mb-2">
                      Stay Connected
                    </h3>
                    <p className="text-navy-600">
                      Subscribe to receive updates about new books, Torah teachings, and community events.
                    </p>
                  </div>

                  {/* Form */}
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <input
                        type="text"
                        placeholder="Your Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="form-input"
                        required
                      />
                    </div>
                    <div>
                      <input
                        type="email"
                        placeholder="Your Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="form-input"
                        required
                      />
                    </div>

                    {error && (
                      <p className="text-red-600 text-sm text-center">{error}</p>
                    )}

                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-primary w-full flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <span className="w-5 h-5 border-2 border-navy-950/30 border-t-navy-950 rounded-full animate-spin" />
                      ) : (
                        <>
                          <Mail size={18} />
                          Subscribe
                        </>
                      )}
                    </button>
                  </form>

                  <p className="text-xs text-navy-500 text-center mt-4">
                    We respect your privacy. Unsubscribe at any time.
                  </p>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

