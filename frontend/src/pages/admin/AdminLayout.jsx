import { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, Navigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BookOpen, 
  Newspaper, 
  Video, 
  Users, 
  Bell, 
  ShoppingCart, 
  Heart,
  Share2,
  Settings,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { path: '/admin', icon: LayoutDashboard, label: 'Dashboard', exact: true },
  { path: '/admin/books', icon: BookOpen, label: 'Books' },
  { path: '/admin/news', icon: Newspaper, label: 'News & Updates' },
  { path: '/admin/media', icon: Video, label: 'Media' },
  { path: '/admin/subscribers', icon: Users, label: 'Subscribers' },
  { path: '/admin/waitlist', icon: Bell, label: 'Waitlist' },
  { path: '/admin/orders', icon: ShoppingCart, label: 'Orders' },
  { path: '/admin/donations', icon: Heart, label: 'Donations' },
  { path: '/admin/users', icon: Users, label: 'Admin Users', roles: ['admin'] },
  { path: '/admin/social', icon: Share2, label: 'Social Distribution' },
  { path: '/admin/settings', icon: Settings, label: 'Settings', roles: ['admin'] },
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, loading, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/admin/login');
    }
  }, [loading, isAuthenticated, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-navy-950">
        <div className="w-8 h-8 border-2 border-gold-400/30 border-t-gold-400 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const filteredNavItems = navItems.filter(
    item => !item.roles || item.roles.includes(user?.role)
  );

  return (
    <div className="min-h-screen flex bg-cream-100">
      {/* Sidebar overlay (mobile) */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-navy-950/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 
        bg-gradient-to-b from-navy-900 via-navy-950 to-navy-900 
        transform transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="h-full flex flex-col p-4">
          {/* Logo */}
          <div className="flex items-center justify-between px-2 py-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center">
                <BookOpen size={20} className="text-navy-950" />
              </div>
              <div>
                <div className="font-display font-semibold text-gold-400">Admin Panel</div>
                <div className="text-xs text-cream-500">Biala Publishing</div>
              </div>
            </div>
            <button 
              className="lg:hidden p-1 rounded hover:bg-navy-800"
              onClick={() => setSidebarOpen(false)}
            >
              <X size={20} className="text-cream-400" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 overflow-y-auto">
            {filteredNavItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.exact}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) => `
                  flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
                  ${isActive 
                    ? 'bg-gold-500/20 text-gold-400 border-l-3 border-gold-500' 
                    : 'text-cream-400 hover:bg-navy-800 hover:text-gold-400'
                  }
                `}
              >
                <item.icon size={20} />
                <span className="text-sm font-medium">{item.label}</span>
              </NavLink>
            ))}
          </nav>

          {/* User info & Logout */}
          <div className="border-t border-navy-700 pt-4 mt-4">
            <div className="flex items-center gap-3 px-2 py-3">
              <div className="w-10 h-10 rounded-full bg-navy-700 flex items-center justify-center">
                <span className="text-gold-400 font-semibold">
                  {user?.name?.charAt(0).toUpperCase() || 'A'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-cream-200 font-medium truncate">{user?.name || 'Admin'}</div>
                <div className="text-xs text-cream-500 capitalize">{user?.role || 'admin'}</div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
            >
              <LogOut size={20} />
              <span className="text-sm font-medium">Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <header className="h-16 bg-cream-50 border-b border-cream-200 flex items-center px-4 lg:px-6 sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg hover:bg-cream-200"
          >
            <Menu size={24} />
          </button>
          
          <div className="flex-1" />
          
          <a 
            href="/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-sm text-navy-500 hover:text-gold-600 transition-colors"
          >
            View Public Site →
          </a>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

