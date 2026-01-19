import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, MessageSquare, Clock, CheckCircle } from 'lucide-react';
import api from '../services/api';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.post('/contact', formData);
      setSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: 'Main Office - Jerusalem',
      lines: ['Rechov HaAdmor MiBiala 12', 'Jerusalem, Israel'],
    },
    {
      icon: MapPin,
      title: 'US Office - Brooklyn',
      lines: ['123 Lee Avenue', 'Brooklyn, NY 11211'],
    },
    {
      icon: Mail,
      title: 'Email',
      lines: ['info@bialapublishing.com', 'orders@bialapublishing.com'],
      link: 'mailto:info@bialapublishing.com'
    },
    {
      icon: Phone,
      title: 'Phone',
      lines: ['Israel: +972-2-555-1234', 'US: +1 (718) 555-0123'],
    },
    {
      icon: Clock,
      title: 'Office Hours',
      lines: ['Sun-Thu: 9am - 5pm (Israel)', 'Fri: 9am - 1pm (Israel)'],
    },
  ];

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
            Contact <span className="text-gradient">Us</span>
          </h1>
          <p className="text-xl text-navy-600 max-w-2xl mx-auto">
            We'd love to hear from you. Reach out with questions, feedback, or to learn more about our work.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2"
          >
            <div className="card p-8">
              <h2 className="font-display text-2xl font-bold text-navy-900 mb-6 flex items-center gap-3">
                <MessageSquare size={24} className="text-gold-500" />
                Send Us a Message
              </h2>

              {success ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle size={32} className="text-green-600" />
                  </div>
                  <h3 className="font-display text-2xl font-bold text-navy-900 mb-2">
                    Message Sent!
                  </h3>
                  <p className="text-navy-600 mb-6">
                    Thank you for reaching out. We'll get back to you as soon as possible.
                  </p>
                  <button
                    onClick={() => setSuccess(false)}
                    className="btn-secondary"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-navy-700 text-sm font-medium mb-2">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="form-input"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-navy-700 text-sm font-medium mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="form-input"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-navy-700 text-sm font-medium mb-2">
                      Subject *
                    </label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="form-input"
                      required
                    >
                      <option value="">Select a subject...</option>
                      <option value="general">General Inquiry</option>
                      <option value="orders">Book Orders</option>
                      <option value="donations">Donations</option>
                      <option value="sponsorship">Sponsorship Opportunities</option>
                      <option value="media">Media & Press</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-navy-700 text-sm font-medium mb-2">
                      Message *
                    </label>
                    <textarea
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="form-input min-h-[150px]"
                      placeholder="How can we help you?"
                      required
                    />
                  </div>

                  {error && (
                    <p className="text-red-600 text-sm">{error}</p>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <span className="w-5 h-5 border-2 border-navy-950/30 border-t-navy-950 rounded-full animate-spin" />
                    ) : (
                      <>
                        <Send size={18} />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {contactInfo.map((item, index) => (
              <div key={index} className="card p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-gold-100 flex items-center justify-center shrink-0">
                    <item.icon size={18} className="text-gold-600" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-navy-900 mb-2">
                      {item.title}
                    </h3>
                    {item.lines.map((line, i) => (
                      <p key={i} className="text-navy-600 text-sm">
                        {item.link ? (
                          <a href={item.link} className="hover:text-gold-600 transition-colors">
                            {line}
                          </a>
                        ) : (
                          line
                        )}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            ))}

            {/* Social Links */}
            <div className="card p-6 bg-navy-900">
              <h3 className="font-display font-bold text-gold-400 mb-4">
                Follow Us
              </h3>
              <p className="text-cream-300 text-sm mb-4">
                Stay connected through our social media channels for updates, inspiration, and community news.
              </p>
              <div className="flex gap-3">
                <a 
                  href="https://t.me/bialapublishing" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-navy-800 flex items-center justify-center hover:bg-gold-500 transition-colors text-cream-300 hover:text-navy-950"
                >
                  <Send size={18} />
                </a>
                <a 
                  href="https://wa.me/17185550123" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-navy-800 flex items-center justify-center hover:bg-gold-500 transition-colors text-cream-300 hover:text-navy-950"
                >
                  <MessageSquare size={18} />
                </a>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Newsletter Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 ornate-border p-8 md:p-12 text-center"
        >
          <h2 className="font-display text-3xl font-bold text-navy-900 mb-4">
            Subscribe to Our Mailing List
          </h2>
          <p className="text-lg text-navy-600 mb-8 max-w-xl mx-auto">
            Receive updates about new publications, events, and Torah teachings directly to your inbox.
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

