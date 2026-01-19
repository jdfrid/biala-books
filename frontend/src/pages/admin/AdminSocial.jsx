import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, MessageCircle, Facebook, Twitter, Check, AlertCircle } from 'lucide-react';

export default function AdminSocial() {
  const [message, setMessage] = useState('');
  const [platforms, setPlatforms] = useState({
    telegram: true,
    whatsapp: true,
    facebook: false
  });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    setSending(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setSending(false);
    setSent(true);
    setTimeout(() => setSent(false), 3000);
    setMessage('');
  };

  const platformConfig = [
    { key: 'telegram', name: 'Telegram', icon: MessageCircle, color: 'bg-blue-500' },
    { key: 'whatsapp', name: 'WhatsApp', icon: MessageCircle, color: 'bg-green-500' },
    { key: 'facebook', name: 'Facebook', icon: Facebook, color: 'bg-blue-600' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Social Distribution</h1>
        <p className="text-gray-500">Send updates to your social channels</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Message Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Compose Message</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write your update message here..."
                  className="form-input resize-none"
                  rows={6}
                  required
                />
                <div className="text-right text-sm text-gray-400 mt-1">{message.length} / 500</div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Send To</label>
                <div className="flex flex-wrap gap-3">
                  {platformConfig.map((platform) => (
                    <button
                      key={platform.key}
                      type="button"
                      onClick={() => setPlatforms({ ...platforms, [platform.key]: !platforms[platform.key] })}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 transition-all ${
                        platforms[platform.key]
                          ? 'border-amber-500 bg-amber-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-lg ${platform.color} flex items-center justify-center`}>
                        <platform.icon size={16} className="text-white" />
                      </div>
                      <span className="font-medium text-gray-700">{platform.name}</span>
                      {platforms[platform.key] && <Check size={16} className="text-amber-500" />}
                    </button>
                  ))}
                </div>
              </div>

              {sent && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-xl"
                >
                  <Check size={20} />
                  Message sent successfully to selected platforms!
                </motion.div>
              )}

              <button
                type="submit"
                disabled={sending || !Object.values(platforms).some(Boolean)}
                className="btn-gold w-full py-3"
              >
                {sending ? (
                  <span className="w-5 h-5 border-2 border-gray-900/30 border-t-gray-900 rounded-full animate-spin" />
                ) : (
                  <>
                    <Send size={18} />
                    Send Update
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Platform Settings */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Platform Settings</h2>
            <div className="space-y-4">
              {platformConfig.map((platform) => (
                <div key={platform.key} className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg ${platform.color} flex items-center justify-center`}>
                      <platform.icon size={20} className="text-white" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{platform.name}</div>
                      <div className="text-xs text-gray-500">
                        {platform.key === 'telegram' && 'Bot connected'}
                        {platform.key === 'whatsapp' && 'Group linked'}
                        {platform.key === 'facebook' && 'Page connected'}
                      </div>
                    </div>
                  </div>
                  <div className={`w-3 h-3 rounded-full ${platforms[platform.key] ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-amber-50 rounded-2xl p-6 border border-amber-200">
            <div className="flex items-start gap-3">
              <AlertCircle className="text-amber-600 shrink-0 mt-0.5" size={20} />
              <div>
                <h3 className="font-medium text-amber-800 mb-1">Configuration Required</h3>
                <p className="text-sm text-amber-700">
                  To enable social distribution, configure API keys and tokens in the Settings page.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Posts */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Recent Posts</h2>
        <div className="space-y-4">
          {[
            { message: 'New book release announcement!', platforms: ['telegram', 'whatsapp'], date: '2026-01-18 14:30' },
            { message: 'Shabbos schedule update for this week', platforms: ['telegram'], date: '2026-01-17 10:00' },
            { message: 'Registration open for annual gathering', platforms: ['telegram', 'whatsapp', 'facebook'], date: '2026-01-15 09:00' },
          ].map((post, i) => (
            <div key={i} className="flex items-start justify-between p-4 rounded-xl bg-gray-50">
              <div className="flex-1">
                <p className="text-gray-900">{post.message}</p>
                <div className="flex items-center gap-2 mt-2">
                  {post.platforms.map((p) => (
                    <span key={p} className="px-2 py-0.5 rounded-full text-xs bg-gray-200 text-gray-600">{p}</span>
                  ))}
                </div>
              </div>
              <span className="text-sm text-gray-500">{post.date}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
