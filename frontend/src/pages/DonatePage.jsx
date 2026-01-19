import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, BookOpen, Users, Calendar, CreditCard, Building, Check } from 'lucide-react';

export default function DonatePage() {
  const [selectedAmount, setSelectedAmount] = useState(100);
  const [customAmount, setCustomAmount] = useState('');
  const [donationType, setDonationType] = useState('general');

  const amounts = [18, 36, 54, 100, 180, 360, 500, 1000];

  const causes = [
    {
      id: 'general',
      icon: Heart,
      title: 'General Fund',
      description: 'Support all activities of Biala institutions'
    },
    {
      id: 'books',
      icon: BookOpen,
      title: 'Book Publishing',
      description: 'Help publish and distribute sacred texts'
    },
    {
      id: 'institutions',
      icon: Building,
      title: 'Institutions',
      description: 'Support yeshivos and educational programs'
    },
    {
      id: 'events',
      icon: Calendar,
      title: 'Events & Programs',
      description: 'Fund community gatherings and celebrations'
    },
  ];

  const handleAmountClick = (amount) => {
    setSelectedAmount(amount);
    setCustomAmount('');
  };

  const handleCustomAmount = (e) => {
    setCustomAmount(e.target.value);
    setSelectedAmount(null);
  };

  const finalAmount = customAmount || selectedAmount;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-b from-amber-50 to-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-100 flex items-center justify-center mb-6">
              <Heart className="text-amber-600" size={32} />
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Support Our Mission
            </h1>
            <p className="text-gray-500 max-w-2xl mx-auto text-lg">
              Your generous donation helps us spread Torah wisdom and support Jewish communities worldwide
            </p>
          </motion.div>
        </div>
      </section>

      {/* Donation Form */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card p-8 md:p-12">
            {/* Donation Type */}
            <div className="mb-10">
              <h2 className="font-semibold text-xl text-gray-900 mb-6">Select a Cause</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {causes.map((cause) => (
                  <button
                    key={cause.id}
                    onClick={() => setDonationType(cause.id)}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      donationType === cause.id
                        ? 'border-amber-500 bg-amber-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        donationType === cause.id ? 'bg-amber-500 text-white' : 'bg-gray-100 text-gray-500'
                      }`}>
                        <cause.icon size={20} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{cause.title}</h3>
                        <p className="text-sm text-gray-500 mt-0.5">{cause.description}</p>
                      </div>
                      {donationType === cause.id && (
                        <Check className="text-amber-500" size={20} />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Amount Selection */}
            <div className="mb-10">
              <h2 className="font-semibold text-xl text-gray-900 mb-6">Select Amount</h2>
              <div className="grid grid-cols-4 gap-3 mb-4">
                {amounts.map((amount) => (
                  <button
                    key={amount}
                    onClick={() => handleAmountClick(amount)}
                    className={`py-3 px-4 rounded-xl font-semibold transition-all ${
                      selectedAmount === amount && !customAmount
                        ? 'bg-amber-500 text-white shadow-lg shadow-amber-200'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    ${amount}
                  </button>
                ))}
              </div>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-semibold">$</span>
                <input
                  type="number"
                  placeholder="Custom amount"
                  value={customAmount}
                  onChange={handleCustomAmount}
                  className="form-input pl-8 text-lg"
                />
              </div>
            </div>

            {/* Payment Info */}
            <div className="mb-10">
              <h2 className="font-semibold text-xl text-gray-900 mb-6">Payment Information</h2>
              <div className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <input type="text" placeholder="First Name" className="form-input" />
                  <input type="text" placeholder="Last Name" className="form-input" />
                </div>
                <input type="email" placeholder="Email Address" className="form-input" />
                <input type="tel" placeholder="Phone Number (optional)" className="form-input" />
                
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-3 mb-4">
                    <CreditCard className="text-gray-400" size={20} />
                    <span className="font-medium text-gray-900">Card Details</span>
                  </div>
                  <input type="text" placeholder="Card Number" className="form-input mb-4" />
                  <div className="grid grid-cols-2 gap-4">
                    <input type="text" placeholder="MM/YY" className="form-input" />
                    <input type="text" placeholder="CVC" className="form-input" />
                  </div>
                </div>
              </div>
            </div>

            {/* Summary & Submit */}
            <div className="bg-gray-50 rounded-2xl p-6 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Donation Amount</span>
                <span className="font-display text-3xl font-bold text-gray-900">${finalAmount || 0}</span>
              </div>
            </div>

            <button className="btn-gold w-full py-4 text-lg">
              <Heart size={20} />
              Complete Donation
            </button>

            <p className="text-center text-sm text-gray-400 mt-4">
              Your donation is tax-deductible. You will receive a receipt via email.
            </p>
          </div>

          {/* Alternative Payment Methods */}
          <div className="mt-8 text-center">
            <p className="text-gray-500 mb-4">Or donate via bank transfer:</p>
            <div className="card p-6 inline-block text-left">
              <p className="font-medium text-gray-900 mb-2">US Bank Account</p>
              <p className="text-sm text-gray-500">Bank: Chase Bank</p>
              <p className="text-sm text-gray-500">Account: Biala Publishing Fund</p>
              <p className="text-sm text-gray-500">Routing: XXXXXXXXX</p>
              <p className="text-sm text-gray-500">Account #: XXXXXXXXX</p>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl font-bold text-gray-900 mb-4">
              Your Impact
            </h2>
            <p className="text-gray-500">See how your donation makes a difference</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { amount: '$36', impact: 'Provides a sefer to a student in need' },
              { amount: '$180', impact: 'Sponsors a week of Torah classes' },
              { amount: '$1,000', impact: 'Helps publish a new volume of teachings' },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="font-display text-4xl font-bold text-amber-600 mb-2">{item.amount}</div>
                <p className="text-gray-600">{item.impact}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
