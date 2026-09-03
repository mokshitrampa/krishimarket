import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, MapPin, Scale, Check, Sprout, Leaf, Award } from 'lucide-react';
import { StarRating } from '../common/StarRating';
import { useCompare } from '../../context/CompareContext';

export const FarmerCard = ({ farmer }) => {
  const { isInCompare, addFarmerToCompare, removeFarmerFromCompare } = useCompare();

  const userId = farmer.user?._id || farmer.user || farmer._id;
  const farmerName = farmer.user?.name || farmer.farmerName || 'Verified Producer';
  const farmName = farmer.farmName || `${farmerName}'s Farmstead`;
  const locationStr = `${farmer.location || ''}, ${farmer.district || ''}, ${farmer.state || ''}`.replace(/^,\s*/, '');
  const inCompare = isInCompare(farmer._id) || isInCompare(userId);

  const handleToggleCompare = (e) => {
    e.preventDefault();
    if (inCompare) {
      removeFarmerFromCompare(farmer._id);
      removeFarmerFromCompare(userId);
    } else {
      addFarmerToCompare(farmer._id);
    }
  };

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-forest-200 transition-all duration-300 flex flex-col overflow-hidden">
      {/* Banner */}
      <div className="relative h-28 bg-forest-900 overflow-hidden">
        <img
          src={
            farmer.bannerImage ||
            'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80'
          }
          alt={farmName}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

        {/* Verification Status Badge */}
        {farmer.verificationStatus === 'approved' && (
          <div className="absolute top-2.5 right-2.5 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-600/90 backdrop-blur-sm text-white shadow-sm">
            <ShieldCheck size={12} /> Verified Farm
          </div>
        )}
      </div>

      {/* Avatar & Body */}
      <div className="px-5 pb-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Avatar floating */}
          <div className="flex justify-between items-end -mt-9 mb-3">
            <img
              src={
                farmer.profileImage ||
                farmer.user?.avatar ||
                `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
                  farmerName
                )}`
              }
              alt={farmerName}
              className="w-16 h-16 rounded-2xl border-3 border-white shadow-md object-cover bg-white"
            />

            {/* Compare Button */}
            <button
              onClick={handleToggleCompare}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors border ${
                inCompare
                  ? 'bg-harvest-500 text-forest-950 border-harvest-600 font-bold'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {inCompare ? (
                <>
                  <Check size={13} className="text-forest-950" />
                  <span>Added</span>
                </>
              ) : (
                <>
                  <Scale size={13} className="text-slate-500" />
                  <span>Compare</span>
                </>
              )}
            </button>
          </div>

          {/* Farm Name & Farmer Title */}
          <Link to={`/farmers/${farmer._id}`}>
            <h3 className="text-lg font-bold text-slate-900 group-hover:text-forest-800 transition-colors line-clamp-1">
              {farmName}
            </h3>
          </Link>
          <p className="text-xs font-semibold text-slate-600 mb-1">{farmerName}</p>

          <p className="text-xs text-slate-500 flex items-center gap-1 mb-2.5">
            <MapPin size={12} className="text-forest-600 shrink-0" />
            <span className="truncate">{locationStr}</span>
          </p>

          {/* Rating & Experience */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
            <StarRating rating={farmer.rating || 4.8} count={farmer.reviewCount || 0} size={14} />
            <span className="font-semibold text-slate-600">
              {farmer.yearsExperience || 5} yrs farming
            </span>
          </div>

          {/* Crop Types Tags */}
          <div className="mt-3 flex flex-wrap gap-1.5">
            <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-forest-50 text-forest-800 border border-forest-100 flex items-center gap-1">
              <Leaf size={10} /> {farmer.farmingMethod || 'Organic'}
            </span>
            {farmer.cropTypes &&
              farmer.cropTypes.slice(0, 2).map((crop, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 text-slate-600"
                >
                  {crop}
                </span>
              ))}
            {farmer.cropTypes && farmer.cropTypes.length > 2 && (
              <span className="text-[10px] text-slate-400 self-center">
                +{farmer.cropTypes.length - 2} more
              </span>
            )}
          </div>
        </div>

        {/* Footer Action */}
        <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs font-semibold text-forest-700">
            {farmer.productCount !== undefined ? `${farmer.productCount} Harvest Items` : 'Active Store'}
          </span>
          <Link
            to={`/farmers/${farmer._id}`}
            className="text-xs font-bold text-slate-800 hover:text-forest-800 underline underline-offset-4"
          >
            View Profile →
          </Link>
        </div>
      </div>
    </div>
  );
};