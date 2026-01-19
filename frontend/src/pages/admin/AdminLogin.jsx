import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Key, BookOpen, ArrowRight, Shield, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AdminLogin() {
  const [step, setStep] = useState('email'); // 'email' | 'code'
  const [email, setEmail] = useState('');
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [devCode, setDevCode] = useState(null); // For development mode
  
  const { requestLoginCode, verifyCode } = useAuth();
  const navigate = useNavigate();

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setDevCode(null);

    try {
      const response = await requestLoginCode(email);
      // If dev code is returned, show it
      if (response?.devCode) {
        setDevCode(response.devCode);
      }
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

  // Auto-fill code in dev mode
  const handleAutoFill = () => {
    if (devCode) {
      setCode(devCode.split(''));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative"
      >
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-10">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
              <BookOpen size={32} className="text-gray-900" />
            </div>
            <h1 className="font-display text-2xl font-bold text-gray-900">Admin Portal</h1>
            <p className="text-gray-500 text-sm mt-1">Biala Publishing</p>
          </div>

          {step === 'email' ? (
            <>
              <div className="text-center mb-6">
                <h2 className="font-display text-xl font-bold text-gray-900 mb-2">
                  Sign In
                </h2>
                <p className="text-gray-500 text-sm">
                  Enter your email to receive a verification code
                </p>
              </div>

              <form onSubmit={handleEmailSubmit} className="space-y-6">
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
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
                  className="btn-gold w-full py-3 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <span className="w-5 h-5 border-2 border-gray-900/30 border-t-gray-900 rounded-full animate-spin" />
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
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-amber-100 flex items-center justify-center">
                  <Shield size={24} className="text-amber-600" />
                </div>
                <h2 className="font-display text-xl font-bold text-gray-900 mb-2">
                  Verify Your Identity
                </h2>
                <p className="text-gray-500 text-sm">
                  Enter the 6-digit code
                  {devCode ? (
                    <span className="block text-amber-600 font-medium mt-1">
                      Dev Mode - Code shown below
                    </span>
                  ) : (
                    <span className="block">sent to <span className="font-semibold text-gray-800">{email}</span></span>
                  )}
                </p>
              </div>

              {/* Dev Mode Code Display */}
              {devCode && (
                <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                  <div className="flex items-center gap-2 text-amber-800 mb-2">
                    <AlertCircle size={16} />
                    <span className="text-sm font-medium">Development Mode</span>
                  </div>
                  <div className="text-center">
                    <span className="font-mono text-2xl font-bold text-gray-900 tracking-widest">{devCode}</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleAutoFill}
                    className="w-full mt-3 text-sm text-amber-600 hover:text-amber-700 font-medium"
                  >
                    Click to auto-fill
                  </button>
                </div>
              )}

              <form onSubmit={handleCodeSubmit} className="space-y-6">
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-3 text-center">
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
                        className="w-12 h-14 text-center text-2xl font-bold rounded-xl border-2 border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition-all"
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
                  className="btn-gold w-full py-3 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <span className="w-5 h-5 border-2 border-gray-900/30 border-t-gray-900 rounded-full animate-spin" />
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
                      setDevCode(null);
                    }}
                    className="text-amber-600 text-sm hover:text-amber-700"
                  >
                    Use a different email
                  </button>
                </div>

                <div className="text-center text-gray-500 text-sm">
                  Didn't receive the code?{' '}
                  <button
                    type="button"
                    onClick={handleEmailSubmit}
                    disabled={loading}
                    className="text-amber-600 hover:text-amber-700 font-medium"
                  >
                    Resend
                  </button>
                </div>
              </form>
            </>
          )}
        </div>

        <p className="text-center text-gray-400 text-xs mt-6">
          Protected by two-factor authentication
        </p>
      </motion.div>
    </div>
  );
}
