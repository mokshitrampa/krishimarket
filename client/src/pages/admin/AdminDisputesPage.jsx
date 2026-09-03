import React, { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle2, MessageSquare, Clock } from 'lucide-react';
import { adminService } from '../../services/adminService';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Modal } from '../../components/common/Modal';

export const AdminDisputesPage = () => {
  const [disputes, setDisputes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDispute, setSelectedDispute] = useState(null);
  const [status, setStatus] = useState('');
  const [adminNote, setAdminNote] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchDisputes = async () => {
    setLoading(true);
    try {
      const res = await adminService.getDisputes();
      if (res.success) setDisputes(res.data);
    } catch (err) {
      console.warn('Error fetching disputes:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDisputes();
  }, []);

  const handleOpenResolution = (d) => {
    setSelectedDispute(d);
    setStatus(d.status);
    setAdminNote(d.adminNote || '');
  };

  const handleSaveResolution = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await adminService.updateDispute(selectedDispute._id, status, adminNote);
      alert('Dispute resolution saved.');
      setSelectedDispute(null);
      fetchDisputes();
    } catch (err) {
      alert(err.message || 'Update failed.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-800">
        <h1 className="text-2xl font-bold text-white tracking-tight">Dispute Resolution Desk</h1>
        <p className="text-xs text-slate-400 mt-0.5">Mediate customer quality claims, delivery issues, and farm discrepancies.</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden">
        {loading ? (
          <div className="p-12"><LoadingSpinner size="md" message="Loading disputes..." /></div>
        ) : disputes.length === 0 ? (
          <div className="p-12 text-center text-slate-400 space-y-2">
            <CheckCircle2 size={32} className="mx-auto text-emerald-500 mb-2" />
            <p className="text-sm font-bold text-white">Zero Active Disputes</p>
            <p className="text-xs">All past customer claims have been investigated and closed.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead>
                <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-500 uppercase tracking-wider">
                  <th className="p-4">Order #</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Farmer</th>
                  <th className="p-4">Claim Reason</th>
                  <th className="p-4">Description</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Resolve</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {disputes.map((d) => (
                  <tr key={d._id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-4 font-bold text-rose-400">#{d.orderNumber}</td>
                    <td className="p-4 font-semibold text-white">{d.customer?.name}</td>
                    <td className="p-4 text-slate-300">{d.farmer?.name}</td>
                    <td className="p-4 font-bold text-amber-300">{d.reason}</td>
                    <td className="p-4 text-slate-400 max-w-xs truncate">{d.description}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                        d.status === 'resolved'
                          ? 'bg-emerald-950 text-emerald-300'
                          : d.status === 'under_review'
                          ? 'bg-amber-950 text-amber-300'
                          : d.status === 'rejected'
                          ? 'bg-slate-800 text-slate-400'
                          : 'bg-rose-950 text-rose-300'
                      }`}>
                        {d.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleOpenResolution(d)}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-colors"
                      >
                        Intervene
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedDispute && (
        <Modal
          isOpen={!!selectedDispute}
          onClose={() => setSelectedDispute(null)}
          title={`Dispute on Order #${selectedDispute.orderNumber}`}
        >
          <form onSubmit={handleSaveResolution} className="space-y-4 text-xs text-slate-800">
            <div className="p-3 bg-slate-50 rounded-xl space-y-1">
              <span className="font-bold block">Customer Claim: {selectedDispute.reason}</span>
              <p className="text-slate-600 italic">"{selectedDispute.description}"</p>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Update Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold bg-white"
              >
                <option value="open">Open</option>
                <option value="under_review">Under Review</option>
                <option value="resolved">Resolved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Administrative Action Note</label>
              <textarea
                rows="3"
                placeholder="Document resolution agreement with grower or buyer refund..."
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm"
            >
              {saving ? 'Saving...' : 'Save Dispute Resolution'}
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
};