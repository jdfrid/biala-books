import { Link } from 'react-router-dom';
import { BookOpen, Mail, Phone, MapPin, Facebook, Youtube, Send } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-navy-900 via-navy-950 to-navy-900 text-cream-200">
      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center">
                <BookOpen size={24} className="text-navy-950" />
              </div>
              <div>
                <h3 className="font-display text-lg font-bold text-gold-400">Biala Publishing</h3>
                <p className="text-xs font-hebrew text-cream-400">הוצאת ספרים ביאלא</p>
              </div>
            </div>
            <p className="text-cream-400 text-sm leading-relaxed">
              Dedicated to spreading the holy Torah teachings of the Mevaser Tov and the Biala dynasty to Jews around the world.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-sm uppercase tracking-wider text-gold-400 mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { label: 'Our Books', path: '/books' },
                { label: 'About the Rebbe', path: '/about/rebbe' },
                { label: 'Biala Hasidism', path: '/about/biala' },
                { label: 'News & Updates', path: '/news' },
                { label: 'Media Gallery', path: '/media' },
                { label: 'Publications', path: '/publications' },
              ].map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="text-cream-400 hover:text-gold-400 transition-colors text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-display text-sm uppercase tracking-wider text-gold-400 mb-4">Support Our Work</h4>
            <ul className="space-y-2">
              {[
                { label: 'Donate to Institutions', path: '/donate?type=institutions' },
                { label: 'Sponsor a Book', path: '/donate?type=books' },
                { label: 'Support Events', path: '/donate?type=events' },
                { label: 'Contact Us', path: '/contact' },
              ].map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="text-cream-400 hover:text-gold-400 transition-colors text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-sm uppercase tracking-wider text-gold-400 mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-gold-500 mt-0.5 shrink-0" />
                <span className="text-cream-400 text-sm">
                  Jerusalem, Israel<br />
                  Brooklyn, NY, USA
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-gold-500 shrink-0" />
                <a href="mailto:info@bialapublishing.com" className="text-cream-400 hover:text-gold-400 transition-colors text-sm">
                  info@bialapublishing.com
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-gold-500 shrink-0" />
                <a href="tel:+1-718-555-0123" className="text-cream-400 hover:text-gold-400 transition-colors text-sm">
                  +1 (718) 555-0123
                </a>
              </li>
            </ul>

            {/* Social links */}
            <div className="flex items-center gap-3 mt-6">
              <a 
                href="https://t.me/bialapublishing" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-navy-800 flex items-center justify-center hover:bg-gold-500 hover:text-navy-950 transition-all"
              >
                <Send size={18} />
              </a>
              <a 
                href="https://facebook.com/bialapublishing" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-navy-800 flex items-center justify-center hover:bg-gold-500 hover:text-navy-950 transition-all"
              >
                <Facebook size={18} />
              </a>
              <a 
                href="https://youtube.com/@bialapublishing" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-navy-800 flex items-center justify-center hover:bg-gold-500 hover:text-navy-950 transition-all"
              >
                <Youtube size={18} />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-navy-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-cream-500 text-sm">
              © {new Date().getFullYear()} Biala Publishing. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link to="/privacy" className="text-cream-500 hover:text-gold-400 text-sm transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-cream-500 hover:text-gold-400 text-sm transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

