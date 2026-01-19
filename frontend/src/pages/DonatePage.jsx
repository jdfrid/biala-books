import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, BookOpen, Calendar, Building2, Check, CreditCard, Building, DollarSign } from 'lucide-react';

export default function DonatePage() {
  const [selectedCause, setSelectedCause] = useState('general');
  const [amount, setAmount] = useState('');
  const [customAmount, setCustomAmount] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);
  const [donorInfo, setDonorInfo] = useState({
    name: '',
    email: '',
    phone: '',
    dedication: '',
  });

  const causes = [
    {
      id: 'general',
      title: 'General Fund',
      icon: Heart,
      description: 'Support all activities of the Biala institutions',
    },
    {
      id: 'books',
      title: 'Book Publishing',
      icon: BookOpen,
      description: 'Help publish and distribute the Rebbe\'s Torah teachings',
    },
    {
      id: 'events',
      title: 'Community Events',
      icon: Calendar,
      description: 'Support gatherings, celebrations, and community programs',
    },
    {
      id: 'institutions',
      title: 'Institutions',
      icon: Building2,
      description: 'Support our yeshivos, schools, and batei medrash',
    },
  ];

  const presetAmounts = ['18', '36', '54', '100', '180', '360'];

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalAmount = amount === 'custom' ? customAmount : amount;
    console.log('Donation submitted:', {
      cause: selectedCause,
      amount: finalAmount,
      recurring: isRecurring,
      donorInfo
    });
    // Handle payment processing
  };

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
            Support Our <span className="text-gradient">Mission</span>
          </h1>
          <p className="text-xl text-navy-600 max-w-2xl mx-auto">
            Your generous donation helps spread Torah and Chassidus throughout the world
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Left Column - Cause Selection */}
          <div className="lg:col-span-2">
            {/* Select Cause */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-12"
            >
              <h2 className="font-display text-2xl font-bold text-navy-900 mb-6">
                1. Choose Where to Give
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {causes.map((cause) => (
                  <button
                    key={cause.id}
                    onClick={() => setSelectedCause(cause.id)}
                    className={`card p-6 text-left transition-all ${
                      selectedCause === cause.id
                        ? 'ring-2 ring-gold-500 bg-gold-50'
                        : 'hover:shadow-lg'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        selectedCause === cause.id
                          ? 'bg-gold-500 text-navy-950'
                          : 'bg-cream-200 text-navy-600'
                      }`}>
                        <cause.icon size={24} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-display font-bold text-navy-900 mb-1">
                          {cause.title}
                        </h3>
                        <p className="text-navy-600 text-sm">{cause.description}</p>
                      </div>
                      {selectedCause === cause.id && (
                        <Check size={20} className="text-gold-600 shrink-0" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </motion.section>

            {/* Select Amount */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-12"
            >
              <h2 className="font-display text-2xl font-bold text-navy-900 mb-6">
                2. Select Amount
              </h2>
              
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mb-4">
                {presetAmounts.map((preset) => (
                  <button
                    key={preset}
                    onClick={() => setAmount(preset)}
                    className={`py-3 px-4 rounded-lg font-display font-bold transition-all ${
                      amount === preset
                        ? 'bg-gold-500 text-navy-950'
                        : 'bg-cream-200 text-navy-700 hover:bg-cream-300'
                    }`}
                  >
                    ${preset}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-4">
                <button
                  onClick={() => setAmount('custom')}
                  className={`py-3 px-6 rounded-lg font-display font-bold transition-all ${
                    amount === 'custom'
                      ? 'bg-gold-500 text-navy-950'
                      : 'bg-cream-200 text-navy-700 hover:bg-cream-300'
                  }`}
                >
                  Custom
                </button>
                {amount === 'custom' && (
                  <div className="relative flex-1 max-w-xs">
                    <DollarSign size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-400" />
                    <input
                      type="number"
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                      placeholder="Enter amount"
                      className="form-input pl-10"
                      min="1"
                    />
                  </div>
                )}
              </div>

              {/* Recurring option */}
              <label className="flex items-center gap-3 mt-6 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isRecurring}
                  onChange={(e) => setIsRecurring(e.target.checked)}
                  className="w-5 h-5 rounded border-cream-300 text-gold-500 focus:ring-gold-400"
                />
                <span className="text-navy-700">Make this a monthly recurring donation</span>
              </label>
            </motion.section>

            {/* Donor Information */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="font-display text-2xl font-bold text-navy-900 mb-6">
                3. Your Information
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-navy-700 text-sm font-medium mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={donorInfo.name}
                      onChange={(e) => setDonorInfo({ ...donorInfo, name: e.target.value })}
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
                      value={donorInfo.email}
                      onChange={(e) => setDonorInfo({ ...donorInfo, email: e.target.value })}
                      className="form-input"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-navy-700 text-sm font-medium mb-2">
                    Phone Number (optional)
                  </label>
                  <input
                    type="tel"
                    value={donorInfo.phone}
                    onChange={(e) => setDonorInfo({ ...donorInfo, phone: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div>
                  <label className="block text-navy-700 text-sm font-medium mb-2">
                    Dedication (optional)
                  </label>
                  <textarea
                    value={donorInfo.dedication}
                    onChange={(e) => setDonorInfo({ ...donorInfo, dedication: e.target.value })}
                    className="form-input min-h-[100px]"
                    placeholder="In memory of... / In honor of... / L'iluy Nishmas..."
                  />
                </div>

                <button
                  type="submit"
                  className="btn-primary w-full flex items-center justify-center gap-2 text-lg py-4"
                  disabled={!amount || (amount === 'custom' && !customAmount)}
                >
                  <CreditCard size={20} />
                  Donate ${amount === 'custom' ? customAmount || '0' : amount}
                  {isRecurring ? '/month' : ''}
                </button>
              </form>
            </motion.section>
          </div>

          {/* Right Column - Info & Bank Details */}
          <div className="space-y-8">
            {/* Donation Impact */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="card p-6"
            >
              <h3 className="font-display text-xl font-bold text-navy-900 mb-4">
                Your Impact
              </h3>
              <ul className="space-y-3 text-navy-600">
                <li className="flex items-start gap-3">
                  <Check size={18} className="text-green-600 shrink-0 mt-0.5" />
                  <span>$18 sponsors a weekly parsha sheet distribution</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check size={18} className="text-green-600 shrink-0 mt-0.5" />
                  <span>$54 helps publish one page of Torah teachings</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check size={18} className="text-green-600 shrink-0 mt-0.5" />
                  <span>$180 supports a yeshiva student for one week</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check size={18} className="text-green-600 shrink-0 mt-0.5" />
                  <span>$360 sponsors a complete sefer for a family</span>
                </li>
              </ul>
            </motion.div>

            {/* Bank Transfer Option */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="card p-6 bg-navy-900 text-cream-100"
            >
              <div className="flex items-center gap-3 mb-4">
                <Building size={24} className="text-gold-400" />
                <h3 className="font-display text-xl font-bold text-gold-400">
                  Wire Transfer
                </h3>
              </div>
              <p className="text-cream-300 mb-4 text-sm">
                For larger donations or wire transfers, please use the following bank details:
              </p>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-cream-400">Bank:</span>
                  <span className="text-cream-100 ml-2">Chase Bank</span>
                </div>
                <div>
                  <span className="text-cream-400">Account Name:</span>
                  <span className="text-cream-100 ml-2">Biala Publishing Inc.</span>
                </div>
                <div>
                  <span className="text-cream-400">Routing #:</span>
                  <span className="text-cream-100 ml-2">021000021</span>
                </div>
                <div>
                  <span className="text-cream-400">Account #:</span>
                  <span className="text-cream-100 ml-2">123456789</span>
                </div>
                <div>
                  <span className="text-cream-400">SWIFT:</span>
                  <span className="text-cream-100 ml-2">CHASUS33</span>
                </div>
              </div>
            </motion.div>

            {/* Tax Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="card p-6"
            >
              <h3 className="font-display text-xl font-bold text-navy-900 mb-3">
                Tax Deductible
              </h3>
              <p className="text-navy-600 text-sm">
                Biala Publishing is a registered 501(c)(3) non-profit organization. 
                All donations are tax-deductible to the fullest extent of the law.
                A receipt will be emailed to you for your records.
              </p>
              <p className="text-navy-500 text-xs mt-3">
                EIN: 12-3456789
              </p>
            </motion.div>

            {/* Contact for Major Gifts */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="card p-6 border-2 border-gold-400"
            >
              <h3 className="font-display text-xl font-bold text-navy-900 mb-3">
                Major Gifts
              </h3>
              <p className="text-navy-600 text-sm mb-4">
                For sponsorship opportunities or donations over $10,000, please contact us directly to discuss how your gift can make the greatest impact.
              </p>
              <a href="mailto:donations@bialapublishing.com" className="text-gold-600 font-semibold hover:text-gold-700">
                donations@bialapublishing.com
              </a>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

