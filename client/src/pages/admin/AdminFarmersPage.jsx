import React, { useState, useEffect } from 'react';
import { Search, ShieldCheck, AlertCircle, Ban, Check, Sprout } from 'lucide-react';
import { adminService } from '../../services/adminService';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

export const AdminFarmersPage = () => {
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const fetchFarmers = async () => {
    setLoading(true);
    try {
      const res = await adminService.getFarmers({ status: statusFilter, search });
      if (res.success) setFarmers(res.data);
    } catch (err) {
      console.warn('Error fetching farmers:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFarmers();
  }, [statusFilter]);

  const handleToggleStatus = async (userId, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
    if (!window.confirm(`Are you sure you want to change user status to ${newStatus}?`)) return;
    try {
      await adminService.toggleUserStatus(userId, newStatus);
      fetchFarmers();
    } catch (err) {
      alert(err.message || 'Status update failed.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Growers & Farms Registry</h1>
          <p className="text-xs text-slate-400 mt-0.5">Manage onboarded farmer partners across agricultural zones.</p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 font-semibold"
          >
            <option value="All">All Statuses</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
            <option value="suspended">Suspended</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden">
        {loading ? (
          <div className="p-12"><LoadingSpinner size="md" message="Loading farmers..." /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead>
                <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-500 uppercase tracking-wider">
                  <th className="p-4">Farm & Farmer</th>
                  <th className="p-4">Location</th>
                  <th className="p-4">Method</th>
                  <th className="p-4">Experience</th>
                  <th className="p-4">Verification</th>
                  <th className="p-4">Account</th>
                  <th className="p-4 text-right">Moderation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {farmers.map((f) => (
                  <tr key={f._id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-4">
                      <span className="font-bold text-white block">{f.farmName}</span>
                      <span className="text-slate-400 text-[11px]">{f.user?.name} • {f.user?.phone}</span>
                    </td>
                    <td className="p-4">{f.district}, {f.state}</td>
                    <td className="p-4 font-semibold text-emerald-400">{f.farmingMethod}</td>
                    <td className="p-4">{f.yearsExperience} yrs • {f.farmSizeAcres} ac</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        f.verificationStatus === 'approved'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : f.verificationStatus === 'pending'
                          ? 'bg-amber-950 text-amber-300 border border-amber-800'
                          : 'bg-rose-950 text-rose-300 border border-rose-800'
                      }`}>
                        {f.verificationStatus}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`capitalize text-[11px] font-bold ${
                        f.user?.status === 'active' ? 'text-emerald-400' : 'text-rose-400'
                      }`}>
                        {f.user?.status || 'active'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      {f.user && (
                        <button
                          onClick={() => handleToggleStatus(f.user._id, f.user.status || 'active')}
                          className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                            f.user.status === 'suspended'
                              ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                              : 'bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-800'
                          }`}
                        >
                          {f.user.status === 'suspended' ? 'Reactivate' : 'Suspend'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};