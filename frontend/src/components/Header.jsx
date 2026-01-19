import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X, ChevronDown, BookOpen, Users, Newspaper, Video, Gift, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const navItems = [
  { 
    label: 'Books', 
    path: '/books',
    icon: BookOpen 
  },
  { 
    label: 'About',
    icon: Users,
    children: [
      { label: 'The Mevaser Tov', path: '/about/rebbe' },
      { label: 'Biala Hasidism', path: '/about/biala' },
    ]
  },
  { 
    label: 'News & Updates', 
    path: '/news',
    icon: Newspaper 
  },
  { 
    label: 'Publications', 
    path: '/publications',
    icon: BookOpen 
  },
  { 
    label: 'Media', 
    path: '/media',
    icon: Video 
  },
  { 
    label: 'Donate', 
    path: '/donate',
    icon: Gift 
  },
  { 
    label: 'Contact', 
    path: '/contact',
    icon: Mail 
  },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  return (
    <header className="sticky top-0 z-50 glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-gold-400 shadow-lg">
              <img 
                src="/images/logo.png" 
                alt="Biala Publishing" 
                className="w-full h-full object-contain bg-cream-50 p-1"
              />
            </div>
            <div className="hidden sm:block">
              <h1 className="font-display text-xl font-bold text-gradient">Biala Publishing</h1>
              <p className="text-xs text-navy-600 font-hebrew">הוצאת ספרים ביאלא</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              item.children ? (
                <div 
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => setActiveDropdown(item.label)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <button className="nav-link flex items-center gap-1 px-4">
                    {item.label}
                    <ChevronDown size={14} className={`transition-transform ${activeDropdown === item.label ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {activeDropdown === item.label && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute top-full left-0 pt-2"
                      >
                        <div className="glass rounded-lg overflow-hidden shadow-xl min-w-[200px]">
                          {item.children.map((child) => (
                            <NavLink
                              key={child.path}
                              to={child.path}
                              className={({ isActive }) => 
                                `block px-5 py-3 text-sm hover:bg-gold-100 transition-colors ${isActive ? 'bg-gold-100 text-gold-700' : 'text-navy-800'}`
                              }
                            >
                              {child.label}
                            </NavLink>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <NavLink 
                  key={item.path} 
                  to={item.path} 
                  className={({ isActive }) => `nav-link px-4 ${isActive ? 'active text-gold-600' : ''}`}
                >
                  {item.label}
                </NavLink>
              )
            ))}
          </nav>

          {/* Mobile menu button */}
          <button 
            className="lg:hidden p-2 rounded-lg hover:bg-cream-200 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden overflow-hidden glass border-t border-gold-200"
          >
            <nav className="max-w-7xl mx-auto px-4 py-4 space-y-1">
              {navItems.map((item) => (
                item.children ? (
                  <div key={item.label} className="space-y-1">
                    <div className="px-4 py-2 text-sm font-display uppercase tracking-wider text-navy-500">
                      {item.label}
                    </div>
                    {item.children.map((child) => (
                      <NavLink
                        key={child.path}
                        to={child.path}
                        onClick={() => setMobileMenuOpen(false)}
                        className={({ isActive }) => 
                          `flex items-center gap-3 px-6 py-3 rounded-lg transition-colors ${isActive ? 'bg-gold-100 text-gold-700' : 'hover:bg-cream-200 text-navy-700'}`
                        }
                      >
                        {child.label}
                      </NavLink>
                    ))}
                  </div>
                ) : (
                  <NavLink 
                    key={item.path} 
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) => 
                      `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-gold-100 text-gold-700' : 'hover:bg-cream-200 text-navy-700'}`
                    }
                  >
                    <item.icon size={18} />
                    {item.label}
                  </NavLink>
                )
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

