import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, MessageSquare, Facebook, Share2, Image, Link, CheckCircle, Clock } from 'lucide-react';

export default function AdminSocial() {
  const [content, setContent] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [imageUrl, setImageUrl] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [scheduling, setScheduling] = useState(false);
  const [scheduleDate, setScheduleDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const platforms = [
    { id: 'telegram', name: 'Telegram', icon: Send, color: 'bg-blue-500', connected: true },
    { id: 'whatsapp', name: 'WhatsApp', icon: MessageSquare, color: 'bg-green-500', connected: true },
    { id: 'facebook', name: 'Facebook', icon: Facebook, color: 'bg-blue-600', connected: false },
  ];

  const recentPosts = [
    { id: 1, content: 'New book release announcement...', platforms: ['telegram', 'whatsapp'], date: '2026-01-18', status: 'sent' },
    { id: 2, content: 'Shabbos times and parsha sheet...', platforms: ['telegram'], date: '2026-01-17', status: 'sent' },
    { id: 3, content: 'Upcoming event reminder...', platforms: ['telegram', 'whatsapp', 'facebook'], date: '2026-01-20', status: 'scheduled' },
  ];

  const togglePlatform = (id) => {
    if (selectedPlatforms.includes(id)) {
      setSelectedPlatforms(selectedPlatforms.filter(p => p !== id));
    } else {
      setSelectedPlatforms([...selectedPlatforms, id]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    setSuccess(true);
    setLoading(false);

    setTimeout(() => {
      setSuccess(false);
      setContent('');
      setImageUrl('');
      setLinkUrl('');
      setSelectedPlatforms([]);
      setScheduling(false);
      setScheduleDate('');
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-navy-900">Social Distribution</h1>
        <p className="text-navy-600">Share updates to Telegram, WhatsApp, and Facebook</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Compose */}
        <div className="lg:col-span-2">
          <div className="card p-6">
            <h2 className="font-display text-xl font-bold text-navy-900 mb-6">
              Compose Message
            </h2>

            {success ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle size={32} className="text-green-600" />
                </div>
                <h3 className="font-display text-xl font-bold text-navy-900 mb-2">
                  {scheduling ? 'Post Scheduled!' : 'Posted Successfully!'}
                </h3>
                <p className="text-navy-600">
                  Your message has been {scheduling ? 'scheduled for' : 'sent to'} {selectedPlatforms.length} platform(s).
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Platform Selection */}
                <div>
                  <label className="block text-navy-700 text-sm font-medium mb-3">
                    Select Platforms
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {platforms.map((platform) => (
                      <button
                        key={platform.id}
                        type="button"
                        onClick={() => platform.connected && togglePlatform(platform.id)}
                        disabled={!platform.connected}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all ${
                          selectedPlatforms.includes(platform.id)
                            ? 'border-gold-500 bg-gold-50'
                            : platform.connected
                              ? 'border-cream-300 hover:border-gold-300'
                              : 'border-cream-200 bg-cream-100 opacity-50 cursor-not-allowed'
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-full ${platform.color} flex items-center justify-center`}>
                          <platform.icon size={16} className="text-white" />
                        </div>
                        <span className="font-medium text-navy-900">{platform.name}</span>
                        {!platform.connected && (
                          <span className="text-xs text-navy-500">(Not connected)</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Message Content */}
                <div>
                  <label className="block text-navy-700 text-sm font-medium mb-2">
                    Message *
                  </label>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="form-input min-h-[150px]"
                    placeholder="Write your message here..."
                    required
                  />
                  <p className="text-navy-500 text-xs mt-1">{content.length} characters</p>
                </div>

                {/* Image URL */}
                <div>
                  <label className="block text-navy-700 text-sm font-medium mb-2">
                    <Image size={16} className="inline mr-1" />
                    Image URL (optional)
                  </label>
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="form-input"
                    placeholder="https://..."
                  />
                </div>

                {/* Link URL */}
                <div>
                  <label className="block text-navy-700 text-sm font-medium mb-2">
                    <Link size={16} className="inline mr-1" />
                    Link URL (optional)
                  </label>
                  <input
                    type="url"
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    className="form-input"
                    placeholder="https://..."
                  />
                </div>

                {/* Schedule Option */}
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={scheduling}
                      onChange={(e) => setScheduling(e.target.checked)}
                      className="w-5 h-5 rounded border-cream-300 text-gold-500"
                    />
                    <span className="text-navy-700">Schedule for later</span>
                  </label>
                  {scheduling && (
                    <input
                      type="datetime-local"
                      value={scheduleDate}
                      onChange={(e) => setScheduleDate(e.target.value)}
                      className="form-input max-w-xs"
                      required={scheduling}
                    />
                  )}
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading || selectedPlatforms.length === 0 || !content}
                  className="btn-primary w-full flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <span className="w-5 h-5 border-2 border-navy-950/30 border-t-navy-950 rounded-full animate-spin" />
                  ) : (
                    <>
                      <Share2 size={18} />
                      {scheduling ? 'Schedule Post' : 'Post Now'}
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Connected Accounts */}
          <div className="card p-6">
            <h3 className="font-display text-lg font-bold text-navy-900 mb-4">
              Connected Accounts
            </h3>
            <div className="space-y-3">
              {platforms.map((platform) => (
                <div key={platform.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full ${platform.color} flex items-center justify-center`}>
                      <platform.icon size={14} className="text-white" />
                    </div>
                    <span className="text-navy-900">{platform.name}</span>
                  </div>
                  {platform.connected ? (
                    <span className="badge badge-success">Connected</span>
                  ) : (
                    <button className="text-gold-600 text-sm hover:text-gold-700">
                      Connect
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Recent Posts */}
          <div className="card p-6">
            <h3 className="font-display text-lg font-bold text-navy-900 mb-4">
              Recent Posts
            </h3>
            <div className="space-y-4">
              {recentPosts.map((post) => (
                <div key={post.id} className="pb-4 border-b border-cream-200 last:border-0 last:pb-0">
                  <p className="text-navy-700 text-sm line-clamp-2 mb-2">{post.content}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      {post.platforms.map((p) => {
                        const platform = platforms.find(pl => pl.id === p);
                        return platform ? (
                          <div 
                            key={p}
                            className={`w-5 h-5 rounded-full ${platform.color} flex items-center justify-center`}
                          >
                            <platform.icon size={10} className="text-white" />
                          </div>
                        ) : null;
                      })}
                    </div>
                    <div className="flex items-center gap-2">
                      {post.status === 'scheduled' ? (
                        <span className="badge badge-warning flex items-center gap-1">
                          <Clock size={10} />
                          Scheduled
                        </span>
                      ) : (
                        <span className="badge badge-success">Sent</span>
                      )}
                      <span className="text-navy-500 text-xs">{post.date}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

