import { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pendingEmail, setPendingEmail] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.get('/auth/me')
        .then(res => setUser(res.data.user))
        .catch(() => localStorage.removeItem('token'))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const requestLoginCode = async (email) => {
    const normalizedEmail = email.toLowerCase().trim();
    console.log('Requesting code for:', normalizedEmail);
    const res = await api.post('/auth/request-code', { email: normalizedEmail });
    setPendingEmail(normalizedEmail);
    return res.data; // Return the response data (includes devCode in dev mode)
  };

  const verifyCode = async (code, emailOverride = null) => {
    const emailToUse = (emailOverride || pendingEmail || '').toLowerCase().trim();
    console.log('Verifying code for email:', emailToUse, 'code:', code);
    const res = await api.post('/auth/verify-code', { email: emailToUse, code });
    localStorage.setItem('token', res.data.token);
    setUser(res.data.user);
    setPendingEmail(null);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      pendingEmail,
      requestLoginCode, 
      verifyCode, 
      logout,
      isAuthenticated: !!user 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
