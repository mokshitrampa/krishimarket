import React, { useState, useEffect } from 'react';
import { Star, Eye, EyeOff } from 'lucide-react';
import { adminService } from '../../services/adminService';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

export const AdminReviewsPage = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await adminService.getReviews();
      if (res.success) setReviews(res.data);
    } catch (err) {
      console.warn('Error fetching reviews:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleToggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'approved' ? 'hidden' : 'approved';
    try {
      await adminService.toggleReviewStatus(id, newStatus);
      fetchReviews();
    } catch (err) {
      alert(err.message || 'Moderation action failed.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-800">
        <h1 className="text-2xl font-bold text-white tracking-tight">Review & Rating Moderation</h1>
        <p className="text-xs text-slate-400 mt-0.5">Audit buyer feedback and hide inappropriate or fraudulent reviews.</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden">
        {loading ? (
          <div className="p-12"><LoadingSpinner size="md" message="Loading reviews..." /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead>
                <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-500 uppercase tracking-wider">
                  <th className="p-4">Customer</th>
                  <th className="p-4">Farmer</th>
                  <th className="p-4">Rating</th>
                  <th className="p-4">Review Text</th>
                  <th className="p-4">Visibility</th>
                  <th className="p-4 text-right">Moderation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {reviews.map((r) => (
                  <tr key={r._id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-4 font-bold text-white">{r.customer?.name || r.customerName}</td>
                    <td className="p-4 text-slate-300">{r.farmer?.name}</td>
                    <td className="p-4">
                      <span className="font-bold text-amber-400">★ {r.rating} / 5</span>
                    </td>
                    <td className="p-4 text-slate-300 max-w-sm italic">"{r.comment}"</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        r.status === 'approved' ? 'bg-emerald-950 text-emerald-300' : 'bg-rose-950 text-rose-300'
                      }`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleToggleStatus(r._id, r.status)}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                          r.status === 'approved'
                            ? 'bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-800'
                            : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                        }`}
                      >
                        {r.status === 'approved' ? 'Hide Review' : 'Approve'}
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