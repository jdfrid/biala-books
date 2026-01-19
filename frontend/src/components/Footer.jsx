import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
                <span className="font-hebrew text-xl font-bold text-gray-900">ב</span>
              </div>
              <div>
                <span className="font-display font-bold text-white">Biala</span>
                <span className="font-display font-bold text-amber-400"> Publishing</span>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Spreading the Torah teachings of the Mevaser Tov to Jews worldwide.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { label: 'Our Books', path: '/books' },
                { label: 'About the Rebbe', path: '/about/rebbe' },
                { label: 'News & Updates', path: '/news' },
                { label: 'Media Gallery', path: '/media' },
              ].map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="text-gray-400 hover:text-amber-400 transition-colors text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-white mb-4">Support</h4>
            <ul className="space-y-2">
              {[
                { label: 'Make a Donation', path: '/donate' },
                { label: 'Sponsor a Book', path: '/donate?type=books' },
                { label: 'Contact Us', path: '/contact' },
              ].map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="text-gray-400 hover:text-amber-400 transition-colors text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-white mb-4">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <MapPin size={16} className="text-amber-400 mt-0.5 shrink-0" />
                <span className="text-gray-400">Jerusalem, Israel</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={16} className="text-amber-400 shrink-0" />
                <a href="mailto:info@bialapublishing.com" className="text-gray-400 hover:text-amber-400 transition-colors">
                  info@bialapublishing.com
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={16} className="text-amber-400 shrink-0" />
                <a href="tel:+1-718-555-0123" className="text-gray-400 hover:text-amber-400 transition-colors">
                  +1 (718) 555-0123
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-gray-500 text-sm text-center">
            © {new Date().getFullYear()} Biala Publishing. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
