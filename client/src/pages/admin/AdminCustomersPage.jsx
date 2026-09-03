import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

export const AdminCustomersPage = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const res = await adminService.getCustomers();
      if (res.success) setCustomers(res.data);
    } catch (err) {
      console.warn('Error fetching customers:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleToggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
    if (!window.confirm(`Set customer status to ${newStatus}?`)) return;
    try {
      await adminService.toggleUserStatus(id, newStatus);
      fetchCustomers();
    } catch (err) {
      alert(err.message || 'Status update failed.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-800">
        <h1 className="text-2xl font-bold text-white tracking-tight">Customer Accounts Directory</h1>
        <p className="text-xs text-slate-400 mt-0.5">Manage registered consumers, order volume, and active status.</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden">
        {loading ? (
          <div className="p-12"><LoadingSpinner size="md" message="Loading customers..." /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead>
                <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-500 uppercase tracking-wider">
                  <th className="p-4">Customer</th>
                  <th className="p-4">Contact</th>
                  <th className="p-4">Orders Placed</th>
                  <th className="p-4">Total Spend</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Account Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {customers.map((c) => (
                  <tr key={c._id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-4 font-bold text-white">{c.name}</td>
                    <td className="p-4 text-slate-400">{c.email} • {c.phone}</td>
                    <td className="p-4 font-semibold text-slate-200">{c.orderCount || 0} Orders</td>
                    <td className="p-4 font-bold text-emerald-400 font-serif">₹{c.totalSpent || 0}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        c.status === 'active' ? 'bg-emerald-950 text-emerald-300' : 'bg-rose-950 text-rose-300'
                      }`}>
                        {c.status || 'active'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleToggleStatus(c._id, c.status || 'active')}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                          c.status === 'suspended'
                            ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                            : 'bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-800'
                        }`}
                      >
                        {c.status === 'suspended' ? 'Reactivate' : 'Suspend'}
                      </button>
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