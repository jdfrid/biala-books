import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Download, Heart, Calendar, TrendingUp, DollarSign, Filter } from 'lucide-react';
import api from '../../services/api';

export default function AdminDonations() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCause, setFilterCause] = useState('all');

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    try {
      const res = await api.get('/admin/donations');
      setDonations(res.data.donations || []);
    } catch (error) {
      setDonations(placeholderDonations);
    } finally {
      setLoading(false);
    }
  };

  const placeholderDonations = [
    { id: 1, donor: 'Anonymous', email: null, amount: 500, cause: 'General Fund', recurring: false, date: '2026-01-18', dedication: 'In memory of Rabbi Moshe ben Avraham' },
    { id: 2, donor: 'Moshe Goldstein', email: 'moshe@example.com', amount: 180, cause: 'Book Publishing', recurring: true, date: '2026-01-18', dedication: null },
    { id: 3, donor: 'Chaim Weiss', email: 'chaim@example.com', amount: 360, cause: 'Institutions', recurring: false, date: '2026-01-17', dedication: 'L\'iluy Nishmas Sarah bas Yakov' },
    { id: 4, donor: 'Anonymous', email: null, amount: 100, cause: 'General Fund', recurring: false, date: '2026-01-17', dedication: null },
    { id: 5, donor: 'David Cohen', email: 'david@example.com', amount: 1000, cause: 'Events', recurring: false, date: '2026-01-15', dedication: 'In honor of our son\'s Bar Mitzvah' },
  ];

  const displayDonations = donations.length > 0 ? donations : placeholderDonations;

  const filteredDonations = displayDonations.filter(d => {
    const matchesSearch = 
      d.donor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (d.email && d.email.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCause = filterCause === 'all' || d.cause === filterCause;
    return matchesSearch && matchesCause;
  });

  const causes = ['all', ...new Set(displayDonations.map(d => d.cause))];
  const totalAmount = displayDonations.reduce((sum, d) => sum + d.amount, 0);
  const thisMonthTotal = displayDonations
    .filter(d => new Date(d.date).getMonth() === new Date().getMonth())
    .reduce((sum, d) => sum + d.amount, 0);
  const recurringCount = displayDonations.filter(d => d.recurring).length;

  const handleExport = () => {
    const data = filteredDonations.map(d => 
      `${d.donor},${d.email || 'N/A'},${d.amount},${d.cause},${d.date},${d.recurring ? 'Yes' : 'No'}`
    ).join('\n');
    const blob = new Blob([`Donor,Email,Amount,Cause,Date,Recurring\n${data}`], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'donations.csv';
    a.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-navy-900">Donations</h1>
          <p className="text-navy-600">Track and manage donations</p>
        </div>
        <button onClick={handleExport} className="btn-secondary flex items-center gap-2">
          <Download size={18} />
          Export
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-500 flex items-center justify-center">
              <DollarSign size={20} className="text-white" />
            </div>
            <div>
              <div className="font-display text-2xl font-bold text-navy-900">${totalAmount.toLocaleString()}</div>
              <div className="text-navy-600 text-sm">Total Raised</div>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center">
              <Calendar size={20} className="text-white" />
            </div>
            <div>
              <div className="font-display text-2xl font-bold text-navy-900">${thisMonthTotal.toLocaleString()}</div>
              <div className="text-navy-600 text-sm">This Month</div>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-pink-500 flex items-center justify-center">
              <Heart size={20} className="text-white" />
            </div>
            <div>
              <div className="font-display text-2xl font-bold text-navy-900">{displayDonations.length}</div>
              <div className="text-navy-600 text-sm">Total Donations</div>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-500 flex items-center justify-center">
              <TrendingUp size={20} className="text-white" />
            </div>
            <div>
              <div className="font-display text-2xl font-bold text-navy-900">{recurringCount}</div>
              <div className="text-navy-600 text-sm">Recurring Donors</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-navy-400" size={20} />
          <input
            type="text"
            placeholder="Search donors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-input pl-12"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {causes.map((cause) => (
            <button
              key={cause}
              onClick={() => setFilterCause(cause)}
              className={`px-4 py-2 rounded-lg font-display text-sm uppercase tracking-wider ${
                filterCause === cause
                  ? 'bg-gold-500 text-navy-950'
                  : 'bg-cream-200 text-navy-700 hover:bg-cream-300'
              }`}
            >
              {cause}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Donor</th>
                <th>Amount</th>
                <th>Cause</th>
                <th>Dedication</th>
                <th>Date</th>
                <th>Type</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td><div className="h-6 bg-cream-200 rounded w-32"></div></td>
                    <td><div className="h-6 bg-cream-200 rounded w-20"></div></td>
                    <td><div className="h-6 bg-cream-200 rounded w-24"></div></td>
                    <td><div className="h-6 bg-cream-200 rounded w-40"></div></td>
                    <td><div className="h-6 bg-cream-200 rounded w-24"></div></td>
                    <td><div className="h-6 bg-cream-200 rounded w-20"></div></td>
                  </tr>
                ))
              ) : filteredDonations.length > 0 ? (
                filteredDonations.map((donation) => (
                  <tr key={donation.id}>
                    <td>
                      <div className="font-semibold text-navy-900">{donation.donor}</div>
                      {donation.email && (
                        <div className="text-navy-500 text-sm">{donation.email}</div>
                      )}
                    </td>
                    <td className="font-bold text-green-600 text-lg">${donation.amount}</td>
                    <td>
                      <span className="badge badge-info">{donation.cause}</span>
                    </td>
                    <td className="text-navy-600 text-sm max-w-xs truncate">
                      {donation.dedication || '-'}
                    </td>
                    <td className="text-navy-600">{donation.date}</td>
                    <td>
                      {donation.recurring ? (
                        <span className="badge badge-success">Monthly</span>
                      ) : (
                        <span className="badge bg-cream-200 text-navy-600">One-time</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-navy-500">
                    No donations found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

