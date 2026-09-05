import React, { useState, useEffect } from 'react';
import { Settings, Check, ShieldCheck, MapPin, Leaf, Truck } from 'lucide-react';
import { farmerService } from '../../services/farmerService';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

export const FarmerProfileSettingsPage = () => {
  const { farmerProfile, setFarmerProfile } = useAuth();
  const { showToast } = useCart();
  const [loading, setLoading] = useState(!farmerProfile);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    farmName: '',
    description: '',
    location: '',
    district: '',
    state: '',
    pincode: '',
    cropTypes: '',
    farmingMethod: 'Organic',
    organicCertified: false,
    certifications: '',
    yearsExperience: 5,
    farmSizeAcres: 5,
    minimumOrder: 200,
    typicalDeliveryDays: '1-2 Days',
    profileImage: '',
    bannerImage: '',
    harvestPractices: '',
    sourcingTransparency: ''
  });

  useEffect(() => {
    if (farmerProfile) {
      setForm({
        farmName: farmerProfile.farmName || '',
        description: farmerProfile.description || '',
        location: farmerProfile.location || '',
        district: farmerProfile.district || '',
        state: farmerProfile.state || '',
        pincode: farmerProfile.pincode || '',
        cropTypes: farmerProfile.cropTypes ? farmerProfile.cropTypes.join(', ') : '',
        farmingMethod: farmerProfile.farmingMethod || 'Organic',
        organicCertified: farmerProfile.organicCertified || false,
        certifications: farmerProfile.certifications ? farmerProfile.certifications.join(', ') : '',
        yearsExperience: farmerProfile.yearsExperience || 5,
        farmSizeAcres: farmerProfile.farmSizeAcres || 5,
        minimumOrder: farmerProfile.minimumOrder || 200,
        typicalDeliveryDays: farmerProfile.typicalDeliveryDays || '1-2 Days',
        profileImage: farmerProfile.profileImage || '',
        bannerImage: farmerProfile.bannerImage || '',
        harvestPractices: farmerProfile.harvestPractices || '',
        sourcingTransparency: farmerProfile.sourcingTransparency || ''
      });
      setLoading(false);
    }
  }, [farmerProfile]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        yearsExperience: Number(form.yearsExperience),
        farmSizeAcres: Number(form.farmSizeAcres),
        minimumOrder: Number(form.minimumOrder),
        cropTypes: form.cropTypes.split(',').map((s) => s.trim()).filter(Boolean),
        certifications: form.certifications.split(',').map((s) => s.trim()).filter(Boolean)
      };

      const res = await farmerService.updateProfile(payload);
      if (res.success) {
        setFarmerProfile(res.data);
        showToast('Farm profile settings updated!');
      }
    } catch (err) {
      showToast(err.message || 'Update failed.', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner size="md" message="Loading farm configuration..." />;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-serif">
          Farm Profile & Storefront Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Customize your public storefront details, crop specialties, delivery options, and soil practices.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-xs space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1">
              Farm Name *
            </label>
            <input
              type="text"
              required
              value={form.farmName}
              onChange={(e) => setForm({ ...form, farmName: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-forest-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1">
              Farming Methodology
            </label>
            <select
              value={form.farmingMethod}
              onChange={(e) => setForm({ ...form, farmingMethod: e.target.value })}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold bg-white"
            >
              <option value="Organic">Organic</option>
              <option value="Natural / Permaculture">Natural / Permaculture</option>
              <option value="Conventional">Conventional</option>
              <option value="Hydroponic">Hydroponic</option>
              <option value="Mixed">Mixed</option>
            </select>
          </div>
        </div>

        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1">
            Farm Story & Soil Practices Description
          </label>
          <textarea
            rows="3"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full px-4 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-forest-600 focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div>
            <label className="text-xs font-semibold text-slate-600 block mb-1">Location</label>
            <input
              type="text"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-600 block mb-1">District</label>
            <input
              type="text"
              value={form.district}
              onChange={(e) => setForm({ ...form, district: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-600 block mb-1">State</label>
            <input
              type="text"
              value={form.state}
              onChange={(e) => setForm({ ...form, state: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-600 block mb-1">Pincode</label>
            <input
              type="text"
              value={form.pincode}
              onChange={(e) => setForm({ ...form, pincode: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="text-xs font-semibold text-slate-600 block mb-1">Min Order (₹)</label>
            <input
              type="number"
              value={form.minimumOrder}
              onChange={(e) => setForm({ ...form, minimumOrder: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-600 block mb-1">Typical Dispatch Time</label>
            <input
              type="text"
              placeholder="e.g. 1-2 Days"
              value={form.typicalDeliveryDays}
              onChange={(e) => setForm({ ...form, typicalDeliveryDays: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-600 block mb-1">Farm Size (Acres)</label>
            <input
              type="number"
              value={form.farmSizeAcres}
              onChange={(e) => setForm({ ...form, farmSizeAcres: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-600 block mb-1">
            Crop Specialization (comma separated)
          </label>
          <input
            type="text"
            value={form.cropTypes}
            onChange={(e) => setForm({ ...form, cropTypes: e.target.value })}
            className="w-full px-4 py-2 rounded-xl border border-slate-300 text-xs"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-600 block mb-1">
            Morning Harvest Practices
          </label>
          <textarea
            rows="2"
            value={form.harvestPractices}
            onChange={(e) => setForm({ ...form, harvestPractices: e.target.value })}
            className="w-full px-4 py-2 rounded-xl border border-slate-300 text-xs"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-600 block mb-1">
            Sourcing & Origin Transparency Statement
          </label>
          <textarea
            rows="2"
            value={form.sourcingTransparency}
            onChange={(e) => setForm({ ...form, sourcingTransparency: e.target.value })}
            className="w-full px-4 py-2 rounded-xl border border-slate-300 text-xs"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full py-3 rounded-xl bg-forest-700 hover:bg-forest-800 text-white font-bold text-sm shadow-md transition-all disabled:opacity-50"
        >
          {saving ? 'Saving Settings...' : 'Save Farmstead Settings'}
        </button>
      </form>
    </div>
  );
};