import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, Trash2, Search, Eye, X, Download } from 'lucide-react';
import api from '../../services/api';
import { useAdminLang } from '../../context/AdminLangContext';

export default function AdminKvitel() {
  const { t } = useAdminLang();
  const [kvitelList, setKvitelList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedKvitel, setSelectedKvitel] = useState(null);

  useEffect(() => {
    fetchKvitel();
  }, []);

  const fetchKvitel = async () => {
    try {
      const res = await api.get('/admin/kvitel');
      setKvitelList(res.data.kvitel);
    } catch (error) {
      console.error('Failed to fetch kvitel:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm(t.kvitel.confirmDelete)) return;
    try {
      await api.delete(`/admin/kvitel/${id}`);
      setKvitelList(kvitelList.filter(k => k.id !== id));
    } catch (error) {
      console.error('Failed to delete:', error);
    }
  };

  const exportToCSV = () => {
    const headers = ['Date', 'First Name', 'Ben', 'Family', 'Email', 'Phone', 'Address', 'Blessing For', 'Additional Names'];
    const rows = kvitelList.map(k => [
      new Date(k.created_at).toLocaleDateString(),
      k.first_name,
      k.ben || '',
      k.family_name || '',
      k.email || '',
      k.phone || '',
      k.address || '',
      k.blessing_for || '',
      k.additional_names?.map(n => `${n.firstName} בן ${n.ben}`).join('; ') || ''
    ]);
    
    const csv = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `kvitel_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const filteredList = kvitelList.filter(k => 
    k.first_name?.toLowerCase().includes(search.toLowerCase()) ||
    k.family_name?.toLowerCase().includes(search.toLowerCase()) ||
    k.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t.kvitel.title}</h1>
          <p className="text-gray-500">{t.kvitel.subtitle}</p>
        </div>
        <button onClick={exportToCSV} className="btn-gold flex items-center gap-2">
          <Download size={18} />
          {t.kvitel.exportCsv}
        </button>
      </div>

      {/* Embed Options */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
        <h3 className="font-semibold text-blue-900 mb-2">{t.kvitel.embedOptions}</h3>
        <p className="text-sm text-blue-700 mb-3">{t.kvitel.embedDescription}</p>
        <div className="space-y-2 text-sm">
          <div className="bg-white rounded-lg p-2 font-mono text-xs break-all">
            <strong>{t.kvitel.fullPage}:</strong><br/>
            {window.location.origin}/kvitel-embed
          </div>
          <div className="bg-white rounded-lg p-2 font-mono text-xs break-all">
            <strong>{t.kvitel.embedMode}:</strong><br/>
            {window.location.origin}/kvitel?embed=true
          </div>
          <div className="bg-white rounded-lg p-2 font-mono text-xs break-all">
            <strong>{t.kvitel.embedModeHebrew}:</strong><br/>
            {window.location.origin}/kvitel?embed=true&lang=he
          </div>
          <div className="bg-white rounded-lg p-2 font-mono text-xs break-all">
            <strong>{t.kvitel.iframeCode}:</strong><br/>
            {'<iframe src="' + window.location.origin + '/kvitel-embed" width="100%" height="800" frameborder="0"></iframe>'}
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t.kvitel.searchKvitel}
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-amber-500 outline-none"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 flex items-center gap-4">
        <Heart className="text-amber-600" size={24} />
        <span className="text-amber-800 font-medium">
          {t.kvitel.title}: {kvitelList.length}
        </span>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">{t.kvitel.date}</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">{t.kvitel.name}</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">{t.kvitel.email}</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">{t.kvitel.blessingFor}</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">{t.kvitel.additionalNames}</th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600">{t.kvitel.actions}</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                  {t.common.loading}
                </td>
              </tr>
            ) : filteredList.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                  {t.kvitel.noKvitel}
                </td>
              </tr>
            ) : (
              filteredList.map((kvitel) => (
                <tr key={kvitel.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(kvitel.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">
                      {kvitel.first_name} {kvitel.family_name}
                    </div>
                    {kvitel.ben && (
                      <div className="text-sm text-gray-500">בן {kvitel.ben}</div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-600">{kvitel.email || '-'}</div>
                    <div className="text-sm text-gray-500">{kvitel.phone || '-'}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-600 max-w-xs truncate">
                      {kvitel.blessing_for || '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-amber-100 text-amber-800 rounded-full text-sm">
                      +{kvitel.additional_names?.length || 0}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => setSelectedKvitel(kvitel)}
                        className="p-2 hover:bg-gray-100 rounded-lg text-gray-600"
                        title={t.kvitel.details}
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(kvitel.id)}
                        className="p-2 hover:bg-red-50 rounded-lg text-red-600"
                        title={t.common.delete}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Detail Modal */}
      {selectedKvitel && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
          >
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold">{t.kvitel.details}</h2>
              <button onClick={() => setSelectedKvitel(null)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X size={20} />
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="text-sm text-gray-500">{t.books.titleEnglish.split(' ')[0]}</label>
                  <p className="font-medium">{selectedKvitel.first_name}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Ben</label>
                  <p className="font-medium">{selectedKvitel.ben || '-'}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">{t.books.titleHebrew.split(' ')[0]}</label>
                  <p className="font-medium">{selectedKvitel.family_name || '-'}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">{t.kvitel.email}</label>
                  <p className="font-medium">{selectedKvitel.email || '-'}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">{t.kvitel.phone}</label>
                  <p className="font-medium">{selectedKvitel.phone || '-'}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">{t.kvitel.address}</label>
                  <p className="font-medium">{selectedKvitel.address || '-'}</p>
                </div>
              </div>
              
              <div className="mb-6">
                <label className="text-sm text-gray-500">{t.kvitel.blessingFor}</label>
                <p className="font-medium bg-amber-50 p-3 rounded-lg mt-1">
                  {selectedKvitel.blessing_for || '-'}
                </p>
              </div>

              {selectedKvitel.additional_names?.length > 0 && (
                <div>
                  <label className="text-sm text-gray-500 mb-2 block">{t.kvitel.additionalNames}</label>
                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left">{t.books.titleEnglish.split(' ')[0]}</th>
                          <th className="px-4 py-2 text-left">Ben</th>
                          <th className="px-4 py-2 text-left">Family</th>
                          <th className="px-4 py-2 text-left">{t.kvitel.blessingFor}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {selectedKvitel.additional_names.map((name, i) => (
                          <tr key={i}>
                            <td className="px-4 py-2">{name.firstName}</td>
                            <td className="px-4 py-2">{name.ben || '-'}</td>
                            <td className="px-4 py-2">{name.familyName || '-'}</td>
                            <td className="px-4 py-2">{name.blessingFor || '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              <div className="mt-6 pt-4 border-t text-sm text-gray-500">
                {t.kvitel.date}: {new Date(selectedKvitel.created_at).toLocaleString()} | 
                {t.kvitel.language}: {selectedKvitel.language === 'he' ? 'עברית' : 'English'}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
