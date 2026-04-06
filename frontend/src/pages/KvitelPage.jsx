import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Plus, Trash2, Send, Globe, Check } from 'lucide-react';
import api from '../services/api';

const translations = {
  he: {
    title: 'הזכרת שמות',
    subtitle: 'על ציון הרבי מבשר טוב זצ"ל',
    senderDetails: 'פרטי השולח',
    firstName: 'שם פרטי',
    ben: 'בן',
    familyName: 'שם משפחה',
    email: 'דוא"ל',
    phone: 'טלפון',
    address: 'כתובת',
    blessingFor: 'ברכה ל...',
    blessingPlaceholder: 'לדוגמה: רפואה שלמה, פרנסה טובה, זיווג הגון...',
    additionalNames: 'שמות נוספים להזכרה',
    addName: 'הוסף שם',
    submit: 'שלח בקשה',
    sending: 'שולח...',
    successTitle: 'הבקשה נשלחה בהצלחה!',
    successMessage: 'השמות יוזכרו על ציון הרבי זצ"ל. תודה על פנייתך.',
    sendAnother: 'שלח בקשה נוספת',
    required: 'שדה חובה'
  },
  en: {
    title: 'Prayer Request',
    subtitle: 'At the Tziun of the Mevaser Tov zt"l',
    senderDetails: 'Your Details',
    firstName: 'First Name',
    ben: 'Ben (son of)',
    familyName: 'Family Name',
    email: 'Email',
    phone: 'Phone',
    address: 'Address',
    blessingFor: 'Blessing For...',
    blessingPlaceholder: 'e.g., Complete healing, Good livelihood, Shidduch...',
    additionalNames: 'Additional Names for Prayer',
    addName: 'Add Name',
    submit: 'Submit Request',
    sending: 'Sending...',
    successTitle: 'Request Submitted Successfully!',
    successMessage: 'The names will be mentioned at the Rebbe\'s Tziun. Thank you for your request.',
    sendAnother: 'Send Another Request',
    required: 'Required'
  }
};

export default function KvitelPage() {
  // Check URL params for embed mode and language
  const urlParams = new URLSearchParams(window.location.search);
  const embedMode = urlParams.get('embed') === 'true';
  const initialLang = urlParams.get('lang') || 'en'; // Default to English
  
  const [lang, setLang] = useState(initialLang);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  
  const [form, setForm] = useState({
    firstName: '',
    ben: '',
    familyName: '',
    email: '',
    phone: '',
    address: '',
    blessingFor: ''
  });
  
  const [additionalNames, setAdditionalNames] = useState([]);

  const t = translations[lang];
  const isRtl = lang === 'he';

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const addName = () => {
    setAdditionalNames(prev => [...prev, { firstName: '', ben: '', familyName: '', blessingFor: '' }]);
  };

  const updateName = (index, field, value) => {
    setAdditionalNames(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const removeName = (index) => {
    setAdditionalNames(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.firstName) {
      setError(t.required);
      return;
    }

    setLoading(true);
    setError('');

    try {
      await api.post('/kvitel', {
        ...form,
        additionalNames,
        language: lang
      });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({
      firstName: '',
      ben: '',
      familyName: '',
      email: '',
      phone: '',
      address: '',
      blessingFor: ''
    });
    setAdditionalNames([]);
    setSuccess(false);
    setError('');
  };

  if (success) {
    return (
      <div className={`min-h-screen bg-gradient-to-b from-cream-50 to-white ${embedMode ? 'py-8' : 'py-20'}`}>
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-lg mx-auto bg-white rounded-2xl shadow-xl p-8 text-center"
          >
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
              <Check size={40} className="text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Request Submitted Successfully!</h2>
            <p className="text-gray-600 mb-8">The names will be mentioned at the Rebbe's Tziun. Thank you for your request.</p>
            <button onClick={resetForm} className="btn-gold px-8 py-3">
              {t.sendAnother}
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-b from-cream-50 to-white ${embedMode ? 'py-4' : 'py-12'} ${isRtl ? 'rtl' : 'ltr'}`} dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="container mx-auto px-4">
        {/* Language Toggle */}
        {!embedMode && (
          <div className="flex justify-center mb-8">
            <button
              onClick={() => setLang(lang === 'he' ? 'en' : 'he')}
              className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-md hover:shadow-lg transition-all"
            >
              <Globe size={20} className="text-amber-600" />
              <span className="font-medium">{lang === 'he' ? 'English' : 'עברית'}</span>
            </button>
          </div>
        )}

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-amber-100 flex items-center justify-center">
            <Heart size={32} className="text-amber-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{t.title}</h1>
          <p className="text-xl text-gray-600">{t.subtitle}</p>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="max-w-2xl mx-auto"
        >
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8">
            {/* Sender Details */}
            <h2 className="text-xl font-bold text-gray-900 mb-6 pb-2 border-b border-gray-200">
              {t.senderDetails}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  {t.firstName} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.firstName}
                  onChange={(e) => handleChange('firstName', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">{t.ben}</label>
                <input
                  type="text"
                  value={form.ben}
                  onChange={(e) => handleChange('ben', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">{t.familyName}</label>
                <input
                  type="text"
                  value={form.familyName}
                  onChange={(e) => handleChange('familyName', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">{t.email}</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">{t.phone}</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">{t.address}</label>
                <input
                  type="text"
                  value={form.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none"
                />
              </div>
            </div>

            <div className="mb-8">
              <label className="block text-gray-700 text-sm font-medium mb-2">{t.blessingFor}</label>
              <textarea
                value={form.blessingFor}
                onChange={(e) => handleChange('blessingFor', e.target.value)}
                placeholder={t.blessingPlaceholder}
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none resize-none"
              />
            </div>

            {/* Additional Names */}
            <h2 className="text-xl font-bold text-gray-900 mb-6 pb-2 border-b border-gray-200">
              {t.additionalNames}
            </h2>

            {additionalNames.map((name, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-4 mb-4">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                  <button
                    type="button"
                    onClick={() => removeName(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <input
                    type="text"
                    value={name.firstName}
                    onChange={(e) => updateName(index, 'firstName', e.target.value)}
                    placeholder={t.firstName}
                    className="px-3 py-2 rounded-lg border border-gray-200 focus:border-amber-500 outline-none text-sm"
                  />
                  <input
                    type="text"
                    value={name.ben}
                    onChange={(e) => updateName(index, 'ben', e.target.value)}
                    placeholder={t.ben}
                    className="px-3 py-2 rounded-lg border border-gray-200 focus:border-amber-500 outline-none text-sm"
                  />
                  <input
                    type="text"
                    value={name.familyName}
                    onChange={(e) => updateName(index, 'familyName', e.target.value)}
                    placeholder={t.familyName}
                    className="px-3 py-2 rounded-lg border border-gray-200 focus:border-amber-500 outline-none text-sm"
                  />
                  <input
                    type="text"
                    value={name.blessingFor}
                    onChange={(e) => updateName(index, 'blessingFor', e.target.value)}
                    placeholder={t.blessingFor}
                    className="px-3 py-2 rounded-lg border border-gray-200 focus:border-amber-500 outline-none text-sm"
                  />
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={addName}
              className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-amber-500 hover:text-amber-600 transition-colors flex items-center justify-center gap-2 mb-8"
            >
              <Plus size={20} />
              {t.addName}
            </button>

            {error && (
              <p className="text-red-600 text-center mb-4">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-gold w-full py-4 flex items-center justify-center gap-2 text-lg"
            >
              {loading ? (
                <span className="w-6 h-6 border-2 border-gray-900/30 border-t-gray-900 rounded-full animate-spin" />
              ) : (
                <>
                  <Send size={20} />
                  {t.submit}
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
