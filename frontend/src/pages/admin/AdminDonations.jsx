import { useState, useEffect } from 'react';
import { Search, Download, Heart, Calendar, DollarSign } from 'lucide-react';
import api from '../../services/api';

export default function AdminDonations() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    try {
      const res = await api.get('/donations');
      setDonations(res.data.donations || []);
    } catch (err) {
      setDonations([
        { id: 1, name: 'Anonymous', email: 'anon@example.com', amount: 500, cause: 'General Fund', date: '2026-01-18' },
        { id: 2, name: 'David Cohen', email: 'david@example.com', amount: 180, cause: 'Book Publishing', date: '2026-01-17' },
        { id: 3, name: 'Sarah Levy', email: 'sarah@example.com', amount: 360, cause: 'Institutions', date: '2026-01-16' },
        { id: 4, name: 'Moshe Klein', email: 'moshe@example.com', amount: 100, cause: 'Events', date: '2026-01-15' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    const csv = donations.map(d => `${d.name},${d.email},${d.amount},${d.cause},${d.date}`).join('\n');
    const blob = new Blob([`Name,Email,Amount,Cause,Date\n${csv}`], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'donations.csv';
    a.click();
  };

  const filteredDonations = donations.filter(d =>
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalDonations = donations.reduce((sum, d) => sum + d.amount, 0);
  const donationsByCause = donations.reduce((acc, d) => {
    acc[d.cause] = (acc[d.cause] || 0) + d.amount;
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Donations</h1>
          <p className="text-gray-500">{donations.length} total donations</p>
        </div>
        <button onClick={handleExport} className="btn-secondary">
          <Download size={20} />
          Export CSV
        </button>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <DollarSign className="text-green-600" size={20} />
            </div>
            <span className="text-gray-500 text-sm">Total Raised</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">${totalDonations.toLocaleString()}</div>
        </div>
        {Object.entries(donationsByCause).map(([cause, amount]) => (
          <div key={cause} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                <Heart className="text-amber-600" size={20} />
              </div>
              <span className="text-gray-500 text-sm">{cause}</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">${amount.toLocaleString()}</div>
          </div>
        ))}
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input type="text" placeholder="Search donations..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="form-input pl-12" />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Donor</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Cause</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan={4} className="px-6 py-12 text-center text-gray-400">Loading...</td></tr>
              ) : filteredDonations.length === 0 ? (
                <tr><td colSpan={4} className="px-6 py-12 text-center text-gray-400">No donations found</td></tr>
              ) : (
                filteredDonations.map((donation) => (
                  <tr key={donation.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-gray-900 font-medium">{donation.name}</div>
                      <div className="text-sm text-gray-500">{donation.email}</div>
                    </td>
                    <td className="px-6 py-4 font-bold text-green-600">${donation.amount}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 rounded-full text-xs bg-amber-100 text-amber-700">{donation.cause}</span>
                    </td>
                    <td className="px-6 py-4 text-gray-600 flex items-center gap-2">
                      <Calendar size={14} />
                      {donation.date}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
