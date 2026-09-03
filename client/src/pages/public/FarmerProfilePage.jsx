import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ShieldCheck,
  MapPin,
  Scale,
  Heart,
  Calendar,
  Clock,
  Truck,
  Leaf,
  Award,
  Package,
  CheckCircle2,
  Phone,
  Mail,
  Share2
} from 'lucide-react';
import { farmerService } from '../../services/farmerService';
import { favoriteService } from '../../services/favoriteService';
import { reviewService } from '../../services/reviewService';
import { ProductCard } from '../../components/marketplace/ProductCard';
import { StarRating } from '../../components/common/StarRating';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { useCompare } from '../../context/CompareContext';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

export const FarmerProfilePage = () => {
  const { id } = useParams();
  const { isInCompare, addFarmerToCompare, removeFarmerFromCompare } = useCompare();
  const { isAuthenticated, isCustomer } = useAuth();
  const { showToast } = useCart();

  const [data, setData] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const fetchFarmerDetail = async () => {
      setLoading(true);
      try {
        const res = await farmerService.getFarmerById(id);
        if (res.success) {
          setData(res.data);
          // Fetch reviews
          const farmerUserId = res.data.profile.user?._id || res.data.profile.user;
          const revRes = await reviewService.getFarmerReviews(farmerUserId);
          if (revRes.success) {
            setReviews(revRes.data);
          }
        }
      } catch (err) {
        console.warn('Error fetching farmer profile:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFarmerDetail();
  }, [id]);

  if (loading) {
    return <LoadingSpinner size="lg" message="Loading farmer profile & soil records..." />;
  }

  if (!data || !data.profile) {
    return (
      <div className="max-w-3xl mx-auto py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-800">Farmer Profile Not Found</h2>
        <p className="text-slate-500 text-sm">The grower you are looking for is either unlisted or unavailable.</p>
        <Link to="/farmers" className="px-5 py-2.5 rounded-xl bg-forest-700 text-white text-sm font-semibold">
          Return to Farmer Directory
        </Link>
      </div>
    );
  }

  const { profile, products } = data;
  const farmerUser = profile.user || {};
  const inCompare = isInCompare(profile._id) || isInCompare(farmerUser._id);

  const handleToggleCompare = () => {
    if (inCompare) {
      removeFarmerFromCompare(profile._id);
      removeFarmerFromCompare(farmerUser._id);
      showToast('Removed from comparison.');
    } else {
      const res = addFarmerToCompare(profile._id);
      showToast(res.message);
    }
  };

  const handleToggleSave = async () => {
    if (!isAuthenticated) {
      showToast('Please login as a customer to save farmers.', 'warning');
      return;
    }
    try {
      if (isSaved) {
        await favoriteService.removeFavorite(profile._id);
        setIsSaved(false);
        showToast('Removed from saved farmers.');
      } else {
        await favoriteService.addFavorite(profile._id);
        setIsSaved(true);
        showToast('Farmer added to your saved favorites!');
      }
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* 1. Header Banner & Profile Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        {/* Farm Banner */}
        <div className="h-48 sm:h-64 bg-forest-950 relative overflow-hidden">
          <img
            src={
              profile.bannerImage ||
              'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80'
            }
            alt={profile.farmName}
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        </div>

        {/* Profile Info Bar */}
        <div className="px-6 sm:px-10 pb-8 relative">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 -mt-16 sm:-mt-20 mb-6">
            {/* Avatar & Title */}
            <div className="flex items-end gap-5">
              <img
                src={
                  profile.profileImage ||
                  farmerUser.avatar ||
                  `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
                    farmerUser.name || 'Farmer'
                  )}`
                }
                alt={profile.farmName}
                className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl border-4 border-white shadow-xl object-cover bg-white shrink-0"
              />
              <div className="space-y-1 mb-2">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-serif">
                    {profile.farmName}
                  </h1>
                  {profile.verificationStatus === 'approved' && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                      <ShieldCheck size={14} /> Verified
                    </span>
                  )}
                </div>
                <p className="text-sm font-semibold text-slate-600">
                  Operated by {farmerUser.name} | {profile.yearsExperience || 5} Years Dedicated Farming
                </p>
                <p className="text-xs text-slate-500 flex items-center gap-1">
                  <MapPin size={13} className="text-forest-700 shrink-0" />
                  <span>
                    {profile.location}, {profile.district}, {profile.state} - {profile.pincode}
                  </span>
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleToggleCompare}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs border ${
                  inCompare
                    ? 'bg-harvest-500 text-forest-950 border-harvest-600'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                }`}
              >
                <Scale size={15} />
                <span>{inCompare ? 'Added to Compare' : 'Add to Compare'}</span>
              </button>

              <button
                onClick={handleToggleSave}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs border ${
                  isSaved
                    ? 'bg-rose-50 text-rose-700 border-rose-200'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                }`}
              >
                <Heart size={15} className={isSaved ? 'fill-rose-500 text-rose-500' : ''} />
                <span>{isSaved ? 'Saved' : 'Save Farmer'}</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-forest-50/70 border border-forest-100 text-xs">
            <div>
              <span className="text-slate-400 block font-semibold">Farming Method</span>
              <span className="font-bold text-forest-900 text-sm">{profile.farmingMethod}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-semibold">Overall Rating</span>
              <div className="mt-0.5">
                <StarRating rating={profile.rating || 4.8} count={profile.reviewCount || 0} size={14} />
              </div>
            </div>
            <div>
              <span className="text-slate-400 block font-semibold">Order Fulfilment Rate</span>
              <span className="font-bold text-forest-900 text-sm">{profile.fulfilmentRate || 98}%</span>
            </div>
            <div>
              <span className="text-slate-400 block font-semibold">Typical Delivery Window</span>
              <span className="font-bold text-forest-900 text-sm">{profile.typicalDeliveryDays || '1-2 Days'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Farm Story, Transparency & Reviews */}
        <div className="lg:col-span-1 space-y-6">
          {/* About Farm */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-3">
            <h3 className="text-base font-bold text-slate-900 font-serif">About The Farm</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {profile.description || 'Dedicated to regenerative farming and clean agricultural harvesting.'}
            </p>

            <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Farm Acreage:</span>
                <span className="font-semibold text-slate-800">{profile.farmSizeAcres || 5} Acres</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Minimum Order Value:</span>
                <span className="font-semibold text-slate-800">₹{profile.minimumOrder || 200}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Organic Certified:</span>
                <span className="font-semibold text-emerald-700">
                  {profile.organicCertified ? 'Yes (Verified)' : 'Residue-Free / Natural'}
                </span>
              </div>
            </div>
          </div>

          {/* Sourcing Transparency & Harvest Practices */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 font-serif flex items-center gap-2">
              <Leaf size={18} className="text-forest-700" />
              <span>Farm Transparency</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <h5 className="font-bold text-slate-800 mb-1">Morning Harvest Practices</h5>
                <p className="text-slate-600 leading-relaxed">{profile.harvestPractices}</p>
              </div>
              <div>
                <h5 className="font-bold text-slate-800 mb-1">Origin Transparency</h5>
                <p className="text-slate-600 leading-relaxed">{profile.sourcingTransparency}</p>
              </div>
            </div>
          </div>

          {/* Customer Reviews */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 font-serif">Customer Reviews</h3>
              <span className="text-xs text-slate-400 font-semibold">{reviews.length} reviews</span>
            </div>

            {reviews.length === 0 ? (
              <p className="text-xs text-slate-500">No public reviews yet for this farmer.</p>
            ) : (
              <div className="space-y-3">
                {reviews.map((rev) => (
                  <div key={rev._id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800">{rev.customerName || 'Verified Buyer'}</span>
                      <StarRating rating={rev.rating} showCount={false} size={12} />
                    </div>
                    <p className="text-xs text-slate-600 italic">"{rev.comment}"</p>
                    <span className="text-[10px] text-slate-400 block">
                      {new Date(rev.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Farmer Products */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <div>
              <h2 className="text-xl font-bold text-slate-900 font-serif">
                Produce From {profile.farmName}
              </h2>
              <p className="text-xs text-slate-500">Direct farmgate listings currently available for order</p>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-forest-100 text-forest-800">
              {products ? products.length : 0} Harvest Items
            </span>
          </div>

          {!products || products.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-slate-200">
              <Package size={32} className="mx-auto text-slate-400 mb-2" />
              <h4 className="text-sm font-bold text-slate-800">No active products currently listed</h4>
              <p className="text-xs text-slate-500 mt-1">This farmer is currently between seasonal harvest cycles.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {products.map((p) => (
                <ProductCard key={p._id} product={{ ...p, farmer: farmerUser, farmerProfile: profile }} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};