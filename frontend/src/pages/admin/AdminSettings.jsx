import { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, Globe, Mail, CreditCard, Bell, Shield, Upload } from 'lucide-react';

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState('general');
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    siteName: 'Biala Publishing',
    siteDescription: 'Torah Writings of the Mevaser Tov',
    contactEmail: 'info@bialapublishing.com',
    contactPhone: '+1 (718) 555-0123',
    addressUS: '123 Lee Avenue, Brooklyn, NY 11211',
    addressIsrael: 'Rechov HaAdmor MiBiala 12, Jerusalem',
    
    smtpHost: 'smtp.example.com',
    smtpPort: '587',
    smtpUser: 'noreply@bialapublishing.com',
    adminNotifyEmail: 'admin@bialapublishing.com',
    
    stripePublicKey: 'pk_live_...',
    stripeSecretKey: 'sk_live_...',
    currency: 'USD',
    
    telegramBotToken: '',
    telegramChannelId: '',
    whatsappApiKey: '',
    facebookPageId: '',
    
    enableNewsletter: true,
    enableWaitlist: true,
    maintenanceMode: false,
  });

  const tabs = [
    { id: 'general', label: 'General', icon: Globe },
    { id: 'email', label: 'Email', icon: Mail },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'social', label: 'Social', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
  ];

  const handleSave = async () => {
    setSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSaving(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-navy-900">Settings</h1>
          <p className="text-navy-600">Configure your website settings</p>
        </div>
        <button 
          onClick={handleSave} 
          disabled={saving}
          className="btn-primary flex items-center gap-2"
        >
          {saving ? (
            <span className="w-5 h-5 border-2 border-navy-950/30 border-t-navy-950 rounded-full animate-spin" />
          ) : (
            <Save size={18} />
          )}
          Save Changes
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Tabs */}
        <div className="lg:w-48 shrink-0">
          <nav className="flex lg:flex-col gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeTab === tab.id
                    ? 'bg-gold-500 text-navy-950'
                    : 'hover:bg-cream-200 text-navy-700'
                }`}
              >
                <tab.icon size={18} />
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="card p-6">
            {activeTab === 'general' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <h2 className="font-display text-xl font-bold text-navy-900">General Settings</h2>
                
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-navy-700 text-sm font-medium mb-2">Site Name</label>
                    <input
                      type="text"
                      value={settings.siteName}
                      onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                      className="form-input"
                    />
                  </div>
                  <div>
                    <label className="block text-navy-700 text-sm font-medium mb-2">Site Description</label>
                    <input
                      type="text"
                      value={settings.siteDescription}
                      onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-navy-700 text-sm font-medium mb-2">Contact Email</label>
                    <input
                      type="email"
                      value={settings.contactEmail}
                      onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                      className="form-input"
                    />
                  </div>
                  <div>
                    <label className="block text-navy-700 text-sm font-medium mb-2">Contact Phone</label>
                    <input
                      type="tel"
                      value={settings.contactPhone}
                      onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
                      className="form-input"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-navy-700 text-sm font-medium mb-2">US Address</label>
                  <input
                    type="text"
                    value={settings.addressUS}
                    onChange={(e) => setSettings({ ...settings, addressUS: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div>
                  <label className="block text-navy-700 text-sm font-medium mb-2">Israel Address</label>
                  <input
                    type="text"
                    value={settings.addressIsrael}
                    onChange={(e) => setSettings({ ...settings, addressIsrael: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div>
                  <label className="block text-navy-700 text-sm font-medium mb-2">Site Logo</label>
                  <div className="border-2 border-dashed border-cream-300 rounded-lg p-8 text-center">
                    <Upload size={32} className="mx-auto text-navy-400 mb-2" />
                    <p className="text-navy-600 text-sm">Upload logo image</p>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'email' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <h2 className="font-display text-xl font-bold text-navy-900">Email Settings</h2>
                
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-navy-700 text-sm font-medium mb-2">SMTP Host</label>
                    <input
                      type="text"
                      value={settings.smtpHost}
                      onChange={(e) => setSettings({ ...settings, smtpHost: e.target.value })}
                      className="form-input"
                    />
                  </div>
                  <div>
                    <label className="block text-navy-700 text-sm font-medium mb-2">SMTP Port</label>
                    <input
                      type="text"
                      value={settings.smtpPort}
                      onChange={(e) => setSettings({ ...settings, smtpPort: e.target.value })}
                      className="form-input"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-navy-700 text-sm font-medium mb-2">SMTP Username</label>
                  <input
                    type="text"
                    value={settings.smtpUser}
                    onChange={(e) => setSettings({ ...settings, smtpUser: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div>
                  <label className="block text-navy-700 text-sm font-medium mb-2">Admin Notification Email</label>
                  <input
                    type="email"
                    value={settings.adminNotifyEmail}
                    onChange={(e) => setSettings({ ...settings, adminNotifyEmail: e.target.value })}
                    className="form-input"
                  />
                </div>
              </motion.div>
            )}

            {activeTab === 'payments' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <h2 className="font-display text-xl font-bold text-navy-900">Payment Settings</h2>
                
                <div>
                  <label className="block text-navy-700 text-sm font-medium mb-2">Stripe Public Key</label>
                  <input
                    type="text"
                    value={settings.stripePublicKey}
                    onChange={(e) => setSettings({ ...settings, stripePublicKey: e.target.value })}
                    className="form-input font-mono"
                    placeholder="pk_live_..."
                  />
                </div>

                <div>
                  <label className="block text-navy-700 text-sm font-medium mb-2">Stripe Secret Key</label>
                  <input
                    type="password"
                    value={settings.stripeSecretKey}
                    onChange={(e) => setSettings({ ...settings, stripeSecretKey: e.target.value })}
                    className="form-input font-mono"
                    placeholder="sk_live_..."
                  />
                </div>

                <div>
                  <label className="block text-navy-700 text-sm font-medium mb-2">Default Currency</label>
                  <select
                    value={settings.currency}
                    onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                    className="form-input"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="ILS">ILS (₪)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                  </select>
                </div>
              </motion.div>
            )}

            {activeTab === 'social' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <h2 className="font-display text-xl font-bold text-navy-900">Social Integration</h2>
                
                <div>
                  <label className="block text-navy-700 text-sm font-medium mb-2">Telegram Bot Token</label>
                  <input
                    type="password"
                    value={settings.telegramBotToken}
                    onChange={(e) => setSettings({ ...settings, telegramBotToken: e.target.value })}
                    className="form-input font-mono"
                  />
                </div>

                <div>
                  <label className="block text-navy-700 text-sm font-medium mb-2">Telegram Channel ID</label>
                  <input
                    type="text"
                    value={settings.telegramChannelId}
                    onChange={(e) => setSettings({ ...settings, telegramChannelId: e.target.value })}
                    className="form-input"
                    placeholder="@channelname or -1001234567890"
                  />
                </div>

                <div>
                  <label className="block text-navy-700 text-sm font-medium mb-2">WhatsApp API Key</label>
                  <input
                    type="password"
                    value={settings.whatsappApiKey}
                    onChange={(e) => setSettings({ ...settings, whatsappApiKey: e.target.value })}
                    className="form-input font-mono"
                  />
                </div>

                <div>
                  <label className="block text-navy-700 text-sm font-medium mb-2">Facebook Page ID</label>
                  <input
                    type="text"
                    value={settings.facebookPageId}
                    onChange={(e) => setSettings({ ...settings, facebookPageId: e.target.value })}
                    className="form-input"
                  />
                </div>
              </motion.div>
            )}

            {activeTab === 'security' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <h2 className="font-display text-xl font-bold text-navy-900">Security Settings</h2>
                
                <div className="space-y-4">
                  <label className="flex items-center justify-between p-4 bg-cream-100 rounded-lg cursor-pointer">
                    <div>
                      <div className="font-medium text-navy-900">Newsletter Subscription</div>
                      <div className="text-navy-600 text-sm">Allow visitors to subscribe to mailing list</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.enableNewsletter}
                      onChange={(e) => setSettings({ ...settings, enableNewsletter: e.target.checked })}
                      className="w-5 h-5 rounded border-cream-300 text-gold-500"
                    />
                  </label>

                  <label className="flex items-center justify-between p-4 bg-cream-100 rounded-lg cursor-pointer">
                    <div>
                      <div className="font-medium text-navy-900">Book Waitlist</div>
                      <div className="text-navy-600 text-sm">Allow waitlist signup for out-of-stock books</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.enableWaitlist}
                      onChange={(e) => setSettings({ ...settings, enableWaitlist: e.target.checked })}
                      className="w-5 h-5 rounded border-cream-300 text-gold-500"
                    />
                  </label>

                  <label className="flex items-center justify-between p-4 bg-red-50 rounded-lg cursor-pointer">
                    <div>
                      <div className="font-medium text-red-900">Maintenance Mode</div>
                      <div className="text-red-700 text-sm">Temporarily disable public access to the site</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.maintenanceMode}
                      onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
                      className="w-5 h-5 rounded border-red-300 text-red-500"
                    />
                  </label>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

