import React, { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, Leaf, Users, MapPin } from 'lucide-react';
import { farmerService } from '../../services/farmerService';
import { FarmerCard } from '../../components/farmer/FarmerCard';
import { FarmerCardSkeleton } from '../../components/common/SkeletonLoader';
import { EmptyState } from '../../components/common/EmptyState';

export const FarmerDirectoryPage = () => {
  const [farmers, setFarmers] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [method, setMethod] = useState('All');
  const [location, setLocation] = useState('');
  const [organicOnly, setOrganicOnly] = useState(false);
  const [sort, setSort] = useState('rating_desc');

  const methods = ['All', 'Organic', 'Natural / Permaculture', 'Conventional', 'Hydroponic'];

  const fetchFarmers = async () => {
    setLoading(true);
    try {
      const params = { limit: 20, sort };
      if (search) params.search = search;
      if (method && method !== 'All') params.farmingMethod = method;
      if (location) params.location = location;
      if (organicOnly) params.organic = true;

      const res = await farmerService.getFarmers(params);
      if (res.success) {
        setFarmers(res.data);
        setTotal(res.total);
      }
    } catch (err) {
      console.warn('Error loading farmers directory:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFarmers();
  }, [method, organicOnly, sort]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchFarmers();
  };

  const handleReset = () => {
    setSearch('');
    setMethod('All');
    setLocation('');
    setOrganicOnly(false);
    setSort('rating_desc');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-forest-700 bg-forest-50 px-2.5 py-1 rounded-md">
            Direct Producer Network
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 font-serif mt-2">
            Verified Farmer Directory
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Discover {total} registered regional growers. Select specific farms and compare side-by-side.
          </p>
        </div>

        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 max-w-md w-full">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by farmer or farm name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-forest-600 bg-[#faf8f5]"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-forest-700 hover:bg-forest-800 text-white transition-colors"
          >
            Search
          </button>
        </form>
      </div>

      {/* Filter Row */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
        {/* Method Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1">
            Method:
          </span>
          {methods.map((m) => (
            <button
              key={m}
              onClick={() => setMethod(m)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                method === m
                  ? 'bg-forest-700 text-white'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {m}
            </button>
          ))}
        </div>

        {/* Right Sort & Organic Toggle */}
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={organicOnly}
              onChange={(e) => setOrganicOnly(e.target.checked)}
              className="w-4 h-4 rounded text-forest-700 focus:ring-forest-600"
            />
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
              <Leaf size={13} className="text-emerald-600" /> Organic Only
            </span>
          </label>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white"
          >
            <option value="rating_desc">Highest Rated</option>
            <option value="experience_desc">Years Experience</option>
            <option value="newest">Newly Onboarded</option>
          </select>
        </div>
      </div>

      {/* Farmers Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <FarmerCardSkeleton key={n} />
          ))}
        </div>
      ) : farmers.length === 0 ? (
        <EmptyState
          title="No verified farmers found"
          description="Try broadening your search term or filtering criteria."
          actionText="Reset Filters"
          onAction={handleReset}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {farmers.map((farmer) => (
            <FarmerCard key={farmer._id} farmer={farmer} />
          ))}
        </div>
      )}
    </div>
  );
};