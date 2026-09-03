import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Scale, MapPin, ArrowRight, Trash2, Sprout } from 'lucide-react';
import { favoriteService } from '../../services/favoriteService';
import { useCompare } from '../../context/CompareContext';
import { useCart } from '../../context/CartContext';
import { StarRating } from '../../components/common/StarRating';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';

export const SavedFarmersPage = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addFarmerToCompare, isInCompare } = useCompare();
  const { showToast } = useCart();

  const fetchFavorites = async () => {
    setLoading(true);
    try {
      const res = await favoriteService.getFavorites();
      if (res.success) setFavorites(res.data);
    } catch (err) {
      console.warn('Error loading favorites:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const handleRemove = async (farmerId) => {
    try {
      await favoriteService.removeFavorite(farmerId);
      showToast('Farmer removed from favorites.');
      fetchFavorites();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-serif">
          Saved / Favorite Farmers
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Keep tabs on your preferred regional growers, compare their stats, and view current crops.
        </p>
      </div>

      {loading ? (
        <LoadingSpinner size="md" message="Loading your saved growers..." />
      ) : favorites.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="No saved farmers"
          description="Browse the farmer directory and click 'Save Farmer' on any farm profile to bookmark them here."
          actionText="Discover Farmers"
          actionLink="/farmers"
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((fav) => {
            const profile = fav.farmerProfile || {};
            const farmerUser = fav.farmer || {};
            const inCompare = isInCompare(profile._id);

            return (
              <div
                key={fav._id}
                className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <img
                      src={
                        profile.profileImage ||
                        farmerUser.avatar ||
                        `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
                          farmerUser.name || 'Farmer'
                        )}`
                      }
                      alt=""
                      className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shadow-xs"
                    />
                    <button
                      onClick={() => handleRemove(profile._id || farmerUser._id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Remove"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-slate-900 font-serif">
                      {profile.farmName || farmerUser.name}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">{farmerUser.name}</p>
                    <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                      <MapPin size={11} /> {profile.district}, {profile.state}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <StarRating rating={profile.rating || 4.8} count={profile.reviewCount} size={13} />
                    <span className="font-semibold text-forest-700">{profile.farmingMethod}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => {
                      const res = addFarmerToCompare(profile._id);
                      showToast(res.message);
                    }}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center gap-1"
                  >
                    <Scale size={13} /> {inCompare ? 'In Compare' : 'Compare'}
                  </button>

                  <Link
                    to={`/farmers/${profile._id || farmerUser._id}`}
                    className="text-xs font-bold text-forest-800 hover:underline flex items-center gap-1"
                  >
                    <span>View Store</span>
                    <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};