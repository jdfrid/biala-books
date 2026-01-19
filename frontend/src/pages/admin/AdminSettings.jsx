import { useState } from 'react';
import { Save, Mail, Globe, Key, Bell, Shield, Database } from 'lucide-react';

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    siteName: 'Biala Publishing',
    siteEmail: 'info@bialapublishing.com',
    adminEmail: 'admin@bialapublishing.com',
    smtpHost: '',
    smtpPort: '587',
    smtpUser: '',
    smtpPass: '',
    stripeKey: '',
    telegramBotToken: '',
    whatsappApiKey: '',
    facebookPageToken: ''
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const updateSetting = (key, value) => {
    setSettings({ ...settings, [key]: value });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500">Configure system settings and integrations</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* General Settings */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Globe className="text-blue-600" size={20} />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">General Settings</h2>
              <p className="text-sm text-gray-500">Basic site configuration</p>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Site Name</label>
              <input type="text" value={settings.siteName} onChange={(e) => updateSetting('siteName', e.target.value)} className="form-input" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email</label>
              <input type="email" value={settings.siteEmail} onChange={(e) => updateSetting('siteEmail', e.target.value)} className="form-input" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Admin Email</label>
              <input type="email" value={settings.adminEmail} onChange={(e) => updateSetting('adminEmail', e.target.value)} className="form-input" />
            </div>
          </div>
        </div>

        {/* Email Settings */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <Mail className="text-green-600" size={20} />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">Email Configuration</h2>
              <p className="text-sm text-gray-500">SMTP settings for sending emails</p>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">SMTP Host</label>
              <input type="text" value={settings.smtpHost} onChange={(e) => updateSetting('smtpHost', e.target.value)} className="form-input" placeholder="smtp.example.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">SMTP Port</label>
              <input type="text" value={settings.smtpPort} onChange={(e) => updateSetting('smtpPort', e.target.value)} className="form-input" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">SMTP User</label>
              <input type="text" value={settings.smtpUser} onChange={(e) => updateSetting('smtpUser', e.target.value)} className="form-input" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">SMTP Password</label>
              <input type="password" value={settings.smtpPass} onChange={(e) => updateSetting('smtpPass', e.target.value)} className="form-input" />
            </div>
          </div>
        </div>

        {/* Payment Settings */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <Key className="text-purple-600" size={20} />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">Payment Integration</h2>
              <p className="text-sm text-gray-500">Stripe payment configuration</p>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Stripe Secret Key</label>
            <input type="password" value={settings.stripeKey} onChange={(e) => updateSetting('stripeKey', e.target.value)} className="form-input" placeholder="sk_live_..." />
          </div>
        </div>

        {/* Social Integration */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
              <Bell className="text-amber-600" size={20} />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">Social Media Integration</h2>
              <p className="text-sm text-gray-500">API keys for social distribution</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Telegram Bot Token</label>
              <input type="password" value={settings.telegramBotToken} onChange={(e) => updateSetting('telegramBotToken', e.target.value)} className="form-input" placeholder="123456:ABC-DEF..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp API Key</label>
              <input type="password" value={settings.whatsappApiKey} onChange={(e) => updateSetting('whatsappApiKey', e.target.value)} className="form-input" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Facebook Page Token</label>
              <input type="password" value={settings.facebookPageToken} onChange={(e) => updateSetting('facebookPageToken', e.target.value)} className="form-input" />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex items-center justify-end gap-4">
          {saved && (
            <span className="text-green-600 font-medium">Settings saved successfully!</span>
          )}
          <button type="submit" disabled={saving} className="btn-gold">
            {saving ? (
              <span className="w-5 h-5 border-2 border-gray-900/30 border-t-gray-900 rounded-full animate-spin" />
            ) : (
              <>
                <Save size={18} />
                Save Settings
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
