import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Scale,
  ShieldCheck,
  MapPin,
  X,
  Check,
  Sparkles,
  ArrowRight,
  Leaf,
  Clock,
  DollarSign,
  Star,
  Award,
  Plus
} from 'lucide-react';
import { farmerService } from '../../services/farmerService';
import { useCompare } from '../../context/CompareContext';
import { StarRating } from '../../components/common/StarRating';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

export const FarmerComparisonPage = () => {
  const { comparedFarmerIds, removeFarmerFromCompare, clearCompare } = useCompare();
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchComparisonData = async () => {
      if (comparedFarmerIds.length === 0) {
        setFarmers([]);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const res = await farmerService.compareFarmers(comparedFarmerIds);
        if (res.success) {
          setFarmers(res.data);
        }
      } catch (err) {
        setError(err.message || 'Failed to calculate farmer comparison metrics.');
      } finally {
        setLoading(false);
      }
    };

    fetchComparisonData();
  }, [comparedFarmerIds]);

  if (comparedFarmerIds.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-forest-100 text-forest-800 flex items-center justify-center mx-auto shadow-sm">
          <Scale size={36} />
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-extrabold text-slate-900 font-serif">
            Farmer Comparison Matrix
          </h2>
          <p className="text-slate-500 max-w-md mx-auto text-sm leading-relaxed">
            Select 2 to 4 local farmers from our directory or marketplace to evaluate prices, freshness, organic credentials, and delivery times side-by-side.
          </p>
        </div>
        <div className="flex justify-center gap-4 pt-2">
          <Link
            to="/farmers"
            className="px-6 py-3 rounded-xl bg-forest-700 hover:bg-forest-800 text-white font-bold text-sm transition-all shadow-md"
          >
            Browse Verified Farmers
          </Link>
          <Link
            to="/marketplace"
            className="px-6 py-3 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold text-sm transition-all"
          >
            Explore Marketplace
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-forest-700 bg-forest-50 px-2.5 py-1 rounded-md">
            Side-By-Side Decision Matrix
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 font-serif mt-2">
            Compare Farmers
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Analyzing {farmers.length} farm operations backed by real platform verification records.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/farmers"
            className="px-4 py-2 rounded-xl text-xs font-bold border border-slate-200 hover:bg-slate-50 text-slate-700 flex items-center gap-1.5"
          >
            <Plus size={14} /> Add Another Farmer
          </Link>
          <button
            onClick={clearCompare}
            className="px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors"
          >
            Clear All
          </button>
        </div>
      </div>

      {loading && <LoadingSpinner size="lg" message="Computing comparison metrics from backend..." />}

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm">
          {error}
        </div>
      )}

      {!loading && farmers.length > 0 && (
        <div className="overflow-x-auto pb-6">
          <div className="min-w-[760px] bg-white rounded-3xl border border-slate-200/90 shadow-sm divide-y divide-slate-100 overflow-hidden">
            {/* Header Row: Farmer Identity & Highlight Badges */}
            <div className="grid grid-cols-5 p-6 bg-slate-50/70 items-start">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 self-center">
                Farmer & Operation
              </div>

              {farmers.map((f) => (
                <div key={f.id} className="px-3 space-y-3 relative text-left">
                  <button
                    onClick={() => removeFarmerFromCompare(f.id)}
                    className="absolute top-0 right-3 p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-200 transition-colors"
                    title="Remove from comparison"
                  >
                    <X size={16} />
                  </button>

                  <img
                    src={
                      f.profileImage ||
                      `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
                        f.farmerName
                      )}`
                    }
                    alt={f.farmName}
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-sm"
                  />

                  <div>
                    <h4 className="text-base font-bold text-slate-900 leading-snug">
                      {f.farmName}
                    </h4>
                    <p className="text-xs font-semibold text-slate-500">{f.farmerName}</p>
                    <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                      <MapPin size={10} /> {f.district}, {f.state}
                    </p>
                  </div>

                  {/* Highlights */}
                  <div className="flex flex-wrap gap-1 min-h-[28px]">
                    {f.highlights?.isHighestRating && (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
                        <Star size={10} className="fill-amber-600 text-amber-600" /> Top Rated
                      </span>
                    )}
                    {f.highlights?.isBestPrice && (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300 flex items-center gap-1">
                        <DollarSign size={10} /> Best Avg Price
                      </span>
                    )}
                    {f.highlights?.isFastestDelivery && (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-100 text-blue-900 border border-blue-300 flex items-center gap-1">
                        <Clock size={10} /> Fast Dispatch
                      </span>
                    )}
                    {f.highlights?.isOrganicVerified && (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-forest-100 text-forest-900 border border-forest-300 flex items-center gap-1">
                        <Leaf size={10} /> Organic Certified
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Row: Verification */}
            <div className="grid grid-cols-5 p-5 items-center text-xs">
              <div className="font-bold text-slate-700">Platform Verification</div>
              {farmers.map((f) => (
                <div key={f.id} className="px-3">
                  {f.isVerified ? (
                    <span className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                      <ShieldCheck size={14} /> Verified Farm
                    </span>
                  ) : (
                    <span className="text-slate-400 font-medium">Pending Audit</span>
                  )}
                </div>
              ))}
            </div>

            {/* Row: Overall Rating */}
            <div className="grid grid-cols-5 p-5 items-center text-xs">
              <div className="font-bold text-slate-700">Rating & Reviews</div>
              {farmers.map((f) => (
                <div key={f.id} className="px-3">
                  <StarRating rating={f.rating} count={f.reviewCount} size={15} />
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    {f.customerSatisfaction} satisfaction score
                  </span>
                </div>
              ))}
            </div>

            {/* Row: Farming Methodology */}
            <div className="grid grid-cols-5 p-5 items-center text-xs">
              <div className="font-bold text-slate-700">Farming Method</div>
              {farmers.map((f) => (
                <div key={f.id} className="px-3">
                  <span className="font-bold text-forest-900 text-sm block">
                    {f.farmingMethod}
                  </span>
                  {f.certifications && f.certifications.length > 0 && (
                    <span className="text-[11px] text-slate-500 block">
                      {f.certifications.join(', ')}
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Row: Experience & Farm Size */}
            <div className="grid grid-cols-5 p-5 items-center text-xs">
              <div className="font-bold text-slate-700">Experience & Acreage</div>
              {farmers.map((f) => (
                <div key={f.id} className="px-3">
                  <span className="font-bold text-slate-800 text-sm block">
                    {f.yearsExperience} Years
                  </span>
                  <span className="text-slate-400 block">{f.farmSizeAcres} Acres Farmstead</span>
                </div>
              ))}
            </div>

            {/* Row: Active Inventory & Avg Price */}
            <div className="grid grid-cols-5 p-5 items-center text-xs">
              <div className="font-bold text-slate-700">Active Products & Avg Price</div>
              {farmers.map((f) => (
                <div key={f.id} className="px-3">
                  <span className="font-extrabold text-forest-950 font-serif text-sm block">
                    ₹{f.avgProductPrice} <span className="text-xs font-normal text-slate-400">avg / item</span>
                  </span>
                  <span className="text-slate-500 font-semibold">{f.productCount} Harvest Items Listed</span>
                </div>
              ))}
            </div>

            {/* Row: Latest Harvest Date */}
            <div className="grid grid-cols-5 p-5 items-center text-xs">
              <div className="font-bold text-slate-700">Latest Harvest Date</div>
              {farmers.map((f) => (
                <div key={f.id} className="px-3">
                  <span className="font-semibold text-slate-800 block">
                    {f.latestHarvestDate
                      ? new Date(f.latestHarvestDate).toLocaleDateString('en-IN', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })
                      : 'Today'}
                  </span>
                  <span className="text-[11px] text-emerald-700 font-medium">Morning Fresh</span>
                </div>
              ))}
            </div>

            {/* Row: Delivery Window & Min Order */}
            <div className="grid grid-cols-5 p-5 items-center text-xs">
              <div className="font-bold text-slate-700">Delivery & Minimum Order</div>
              {farmers.map((f) => (
                <div key={f.id} className="px-3">
                  <span className="font-bold text-slate-900 block">{f.typicalDeliveryTime}</span>
                  <span className="text-slate-500 block">Min. Order: ₹{f.minimumOrder}</span>
                </div>
              ))}
            </div>

            {/* Row: Fulfilment Rate */}
            <div className="grid grid-cols-5 p-5 items-center text-xs">
              <div className="font-bold text-slate-700">Order Fulfilment Rate</div>
              {farmers.map((f) => (
                <div key={f.id} className="px-3">
                  <span className="font-extrabold text-emerald-700 text-sm block">
                    {f.fulfilmentRate}%
                  </span>
                  <span className="text-[10px] text-slate-400">On-time fresh dispatch</span>
                </div>
              ))}
            </div>

            {/* Row: Key Crop Types */}
            <div className="grid grid-cols-5 p-5 items-start text-xs">
              <div className="font-bold text-slate-700">Crop Specialization</div>
              {farmers.map((f) => (
                <div key={f.id} className="px-3">
                  <div className="flex flex-wrap gap-1">
                    {f.cropTypes.map((c, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px]">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Action Row */}
            <div className="grid grid-cols-5 p-6 bg-slate-50 items-center">
              <div className="font-bold text-slate-700 text-xs">Selection & Products</div>
              {farmers.map((f) => (
                <div key={f.id} className="px-3 space-y-2">
                  <Link
                    to={`/farmers/${f.id}`}
                    className="w-full py-2.5 px-3 rounded-xl text-xs font-bold bg-forest-700 hover:bg-forest-800 text-white flex items-center justify-center gap-1 transition-colors shadow-xs"
                  >
                    <span>View Farm Store</span>
                    <ArrowRight size={13} />
                  </Link>

                  <Link
                    to={`/marketplace?farmer=${f.userId}`}
                    className="w-full py-1.5 px-3 rounded-xl text-xs font-semibold text-slate-600 hover:text-forest-800 flex items-center justify-center text-center"
                  >
                    Browse Produce ({f.productCount})
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};