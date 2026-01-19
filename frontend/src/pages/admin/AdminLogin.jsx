import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Key, BookOpen, ArrowRight, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AdminLogin() {
  const [step, setStep] = useState('email'); // 'email' | 'code'
  const [email, setEmail] = useState('');
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { requestLoginCode, verifyCode } = useAuth();
  const navigate = useNavigate();

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await requestLoginCode(email);
      setStep('code');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send verification code');
    } finally {
      setLoading(false);
    }
  };

  const handleCodeChange = (index, value) => {
    if (value.length > 1) return;
    
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.querySelector(`input[name="code-${index + 1}"]`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleCodeKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      const prevInput = document.querySelector(`input[name="code-${index - 1}"]`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleCodeSubmit = async (e) => {
    e.preventDefault();
    const fullCode = code.join('');
    if (fullCode.length !== 6) return;

    setLoading(true);
    setError('');

    try {
      await verifyCode(fullCode);
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid verification code');
      setCode(['', '', '', '', '', '']);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-navy-900 via-navy-950 to-navy-900 px-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-64 h-64 bg-gold-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-gold-400/5 rounded-full blur-3xl"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative"
      >
        <div className="card p-8 md:p-10">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center">
              <BookOpen size={32} className="text-navy-950" />
            </div>
            <h1 className="font-display text-2xl font-bold text-navy-900">Admin Portal</h1>
            <p className="text-navy-600 text-sm mt-1">Biala Publishing</p>
          </div>

          {step === 'email' ? (
            <>
              <div className="text-center mb-6">
                <h2 className="font-display text-xl font-bold text-navy-900 mb-2">
                  Sign In
                </h2>
                <p className="text-navy-600 text-sm">
                  Enter your email to receive a verification code
                </p>
              </div>

              <form onSubmit={handleEmailSubmit} className="space-y-6">
                <div>
                  <label className="block text-navy-700 text-sm font-medium mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-navy-400" size={18} />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="form-input pl-12"
                      placeholder="admin@bialapublishing.com"
                      required
                    />
                  </div>
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
                      Continue
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </form>
            </>
          ) : (
            <>
              <div className="text-center mb-6">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gold-100 flex items-center justify-center">
                  <Shield size={24} className="text-gold-600" />
                </div>
                <h2 className="font-display text-xl font-bold text-navy-900 mb-2">
                  Verify Your Identity
                </h2>
                <p className="text-navy-600 text-sm">
                  We've sent a 6-digit code to<br />
                  <span className="font-semibold text-navy-800">{email}</span>
                </p>
              </div>

              <form onSubmit={handleCodeSubmit} className="space-y-6">
                <div>
                  <label className="block text-navy-700 text-sm font-medium mb-3 text-center">
                    Enter Verification Code
                  </label>
                  <div className="flex justify-center gap-2">
                    {code.map((digit, index) => (
                      <input
                        key={index}
                        type="text"
                        name={`code-${index}`}
                        value={digit}
                        onChange={(e) => handleCodeChange(index, e.target.value)}
                        onKeyDown={(e) => handleCodeKeyDown(index, e)}
                        className="w-12 h-14 text-center text-2xl font-bold rounded-lg border-2 border-cream-300 focus:border-gold-400 focus:ring-2 focus:ring-gold-200 outline-none transition-all"
                        maxLength={1}
                        autoFocus={index === 0}
                      />
                    ))}
                  </div>
                </div>

                {error && (
                  <p className="text-red-600 text-sm text-center">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={loading || code.join('').length !== 6}
                  className="btn-primary w-full flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <span className="w-5 h-5 border-2 border-navy-950/30 border-t-navy-950 rounded-full animate-spin" />
                  ) : (
                    <>
                      <Key size={18} />
                      Verify & Sign In
                    </>
                  )}
                </button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setStep('email');
                      setCode(['', '', '', '', '', '']);
                      setError('');
                    }}
                    className="text-gold-600 text-sm hover:text-gold-700"
                  >
                    Use a different email
                  </button>
                </div>

                <div className="text-center text-navy-500 text-sm">
                  Didn't receive the code?{' '}
                  <button
                    type="button"
                    onClick={handleEmailSubmit}
                    disabled={loading}
                    className="text-gold-600 hover:text-gold-700 font-medium"
                  >
                    Resend
                  </button>
                </div>
              </form>
            </>
          )}
        </div>

        <p className="text-center text-cream-600 text-xs mt-6">
          Protected by two-factor authentication
        </p>
      </motion.div>
    </div>
  );
}

