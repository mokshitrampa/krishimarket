import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sprout, ArrowRight, AlertCircle, ShieldCheck, MapPin, Leaf } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const FarmerRegisterPage = () => {
  const { registerFarmer } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    farmName: '',
    location: '',
    district: '',
    state: '',
    pincode: '',
    cropTypes: '',
    farmingMethod: 'Organic',
    yearsExperience: '',
    farmSizeAcres: '',
    description: '',
    organicCertified: false,
    certifications: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone || !formData.password || !formData.farmName || !formData.location || !formData.district || !formData.state || !formData.pincode) {
      setError('Please fill in all mandatory personal and farmstead fields.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await registerFarmer(formData);
      navigate('/farmer/dashboard');
    } catch (err) {
      setError(err.message || 'Farmer registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6">
      <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-lg space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-amber-500 text-forest-950 flex items-center justify-center mx-auto shadow-md">
            <Sprout size={24} />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 font-serif">
            Farmer Partner Onboarding
          </h2>
          <p className="text-xs text-slate-500">
            Join the platform to sell harvest directly. Applications are audited by administrators to verify farm records.
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
            <AlertCircle size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: Farmer Personal Details */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-forest-800 pb-2 border-b border-slate-100">
              1. Farmer Contact & Credentials
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1">
                  Farmer Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="e.g. Ramesh Patel"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-forest-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="ramesh@farm.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-forest-600 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1">
                  Contact Phone *
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  placeholder="+91 98201 11223"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-forest-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1">
                  Password *
                </label>
                <input
                  type="password"
                  name="password"
                  required
                  placeholder="Secure password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-forest-600 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Farm Location & Specifics */}
          <div className="space-y-4 pt-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-forest-800 pb-2 border-b border-slate-100">
              2. Farm Identity & Location
            </h4>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1">
                Farm / Orchard Name *
              </label>
              <input
                type="text"
                name="farmName"
                required
                placeholder="e.g. Green Valley Organic Farm"
                value={formData.farmName}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-forest-600 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">
                  Village / Taluka / Town *
                </label>
                <input
                  type="text"
                  name="location"
                  required
                  placeholder="e.g. Dindori"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">District *</label>
                <input
                  type="text"
                  name="district"
                  required
                  placeholder="e.g. Nashik"
                  value={formData.district}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">State *</label>
                <input
                  type="text"
                  name="state"
                  required
                  placeholder="e.g. Maharashtra"
                  value={formData.state}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Pincode *</label>
                <input
                  type="text"
                  name="pincode"
                  required
                  placeholder="e.g. 422202"
                  value={formData.pincode}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Agricultural Methodology */}
          <div className="space-y-4 pt-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-forest-800 pb-2 border-b border-slate-100">
              3. Farming Practices & Crops
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Farming Method</label>
                <select
                  name="farmingMethod"
                  value={formData.farmingMethod}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs bg-white font-semibold"
                >
                  <option value="Organic">Organic</option>
                  <option value="Natural / Permaculture">Natural / Permaculture</option>
                  <option value="Conventional">Conventional</option>
                  <option value="Hydroponic">Hydroponic</option>
                  <option value="Mixed">Mixed</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Years Experience</label>
                <input
                  type="number"
                  name="yearsExperience"
                  value={formData.yearsExperience}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Farm Size (Acres)</label>
                <input
                  type="number"
                  name="farmSizeAcres"
                  value={formData.farmSizeAcres}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">
                Crop Types (comma separated, e.g. Vegetables, Grains, Fruits)
              </label>
              <input
                type="text"
                name="cropTypes"
                placeholder="Vegetables, Fruits, Grains"
                value={formData.cropTypes}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-xl border border-slate-300 text-sm"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">
                Farm Story & Practices Description
              </label>
              <textarea
                name="description"
                rows="3"
                placeholder="Briefly describe your soil practices, water sourcing, and seasonal specialties..."
                value={formData.description}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-forest-600"
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <input
                type="checkbox"
                id="organicCertified"
                name="organicCertified"
                checked={formData.organicCertified}
                onChange={handleChange}
                className="w-4 h-4 rounded text-forest-700"
              />
              <label htmlFor="organicCertified" className="text-xs font-bold text-slate-800">
                Hold official organic or residue-free accreditation (NPOP, PGS-India, etc.)
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-forest-800 hover:bg-forest-900 text-harvest-300 font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all active:scale-98 disabled:opacity-50"
          >
            {loading ? 'Submitting Application...' : 'Submit Application for Verification'}
            <ArrowRight size={16} />
          </button>
        </form>

        <div className="pt-4 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-500">
            Already registered?{' '}
            <Link to="/login" className="font-bold text-forest-700 hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};