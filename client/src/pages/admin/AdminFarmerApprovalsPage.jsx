import React, { useState, useEffect } from 'react';
import { ShieldCheck, Check, X, AlertTriangle, Eye, Sprout, MapPin } from 'lucide-react';
import { adminService } from '../../services/adminService';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Modal } from '../../components/common/Modal';

export const AdminFarmerApprovalsPage = () => {
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null);
  const [selectedFarmer, setSelectedFarmer] = useState(null);
  const [feedbackNotes, setFeedbackNotes] = useState('');

  const fetchFarmers = async () => {
    setLoading(true);
    try {
      const res = await adminService.getFarmers({ status: 'pending' });
      if (res.success) setFarmers(res.data);
    } catch (err) {
      console.warn('Error fetching pending farmers:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFarmers();
  }, []);

  const handleApprove = async (id) => {
    try {
      await adminService.approveFarmer(id, feedbackNotes || 'Application verified and approved.');
      alert('Farmer verified and authorized to sell on marketplace.');
      setSelectedFarmer(null);
      setFeedbackNotes('');
      fetchFarmers();
    } catch (err) {
      alert(err.message || 'Approval failed.');
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm('Reject this farmer application?')) return;
    try {
      await adminService.rejectFarmer(id, feedbackNotes || 'Application did not meet land audit standards.');
      alert('Farmer application rejected.');
      setSelectedFarmer(null);
      setFeedbackNotes('');
      fetchFarmers();
    } catch (err) {
      alert(err.message || 'Rejection failed.');
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Farmer Verification Audits
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Review submitted farm credentials, land holdings, and biological practices before authorizing public sales.
        </p>
      </div>

      {loading ? (
        <LoadingSpinner size="md" message="Auditing pending grower applications..." />
      ) : farmers.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 p-12 text-center rounded-3xl text-slate-400 space-y-2">
          <ShieldCheck size={36} className="mx-auto text-emerald-500 mb-2" />
          <h3 className="text-base font-bold text-white">All Applications Audited</h3>
          <p className="text-xs">There are no pending farmer registration requests awaiting verification.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {farmers.map((farmer) => (
            <div
              key={farmer._id}
              className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                    Pending Verification
                  </span>
                  <h3 className="text-lg font-bold text-white mt-1">{farmer.farmName}</h3>
                  <p className="text-xs text-slate-400">
                    Proprietor: {farmer.user?.name} • {farmer.user?.phone}
                  </p>
                </div>

                <div className="p-2 rounded-xl bg-slate-800 text-slate-300">
                  <Sprout size={20} />
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Location:</span>
                  <span className="font-semibold text-slate-200">
                    {farmer.location}, {farmer.district}, {farmer.state} - {farmer.pincode}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Methodology:</span>
                  <span className="font-bold text-emerald-400">{farmer.farmingMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Experience & Acreage:</span>
                  <span className="text-slate-200">{farmer.yearsExperience} yrs • {farmer.farmSizeAcres} Acres</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Crops:</span>
                  <span className="text-slate-200">{farmer.cropTypes?.join(', ')}</span>
                </div>
              </div>

              {farmer.description && (
                <p className="text-xs text-slate-400 italic">"{farmer.description}"</p>
              )}

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-800">
                <button
                  onClick={() => handleReject(farmer._id)}
                  className="px-4 py-2 rounded-xl bg-rose-950/60 hover:bg-rose-900 text-rose-300 font-bold text-xs border border-rose-800 transition-colors"
                >
                  Reject
                </button>
                <button
                  onClick={() => handleApprove(farmer._id)}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
                >
                  <Check size={14} /> Approve & Verify
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};