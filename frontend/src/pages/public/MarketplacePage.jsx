import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, Leaf } from 'lucide-react';
import { productService } from '../../services/productService';
import { ProductCard } from '../../components/marketplace/ProductCard';
import { ProductCardSkeleton } from '../../components/common/SkeletonLoader';
import { EmptyState } from '../../components/common/EmptyState';

export const MarketplacePage = () => {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [organicOnly, setOrganicOnly] = useState(searchParams.get('organic') === 'true');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || 'harvest_recent');
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);

  const categories = [
    'All',
    'Vegetables',
    'Fruits',
    'Dairy',
    'Grains',
    'Pulses',
    'Spices',
    'Organic Produce',
    'Other'
  ];

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 12, sort };
      if (search) params.search = search;
      if (category && category !== 'All') params.category = category;
      if (organicOnly) params.organic = true;
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;
      if (location) params.location = location;

      const res = await productService.getProducts(params);
      if (res.success) {
        setProducts(res.data);
        setTotal(res.total);
        setPages(res.pages);
      }
    } catch (err) {
      console.warn('Failed to load marketplace products:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [category, organicOnly, sort, page]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchProducts();
  };

  const handleClearFilters = () => {
    setSearch('');
    setCategory('All');
    setOrganicOnly(false);
    setMinPrice('');
    setMaxPrice('');
    setLocation('');
    setSort('harvest_recent');
    setPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-forest-700 bg-forest-50 px-2.5 py-1 rounded-md">
            Direct Farmgate Inventory
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 font-serif mt-2">
            Agricultural Marketplace
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Showing {total} verified farm products directly listed by their growers.
          </p>
        </div>

        {/* Search Box */}
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 max-w-md w-full">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by crop, vegetable, fruit..."
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

      {/* Main Filter & Grid Container */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filters */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                <SlidersHorizontal size={16} className="text-forest-700" />
                <span>Filters</span>
              </div>
              <button
                onClick={handleClearFilters}
                className="text-xs font-semibold text-slate-400 hover:text-rose-600 transition-colors"
              >
                Reset All
              </button>
            </div>

            {/* Categories */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2.5">
                Category
              </label>
              <div className="space-y-1">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setCategory(cat);
                      setPage(1);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center justify-between ${
                      category === cat
                        ? 'bg-forest-700 text-white'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <span>{cat}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Organic Toggle */}
            <div className="pt-4 border-t border-slate-100">
              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={organicOnly}
                  onChange={(e) => {
                    setOrganicOnly(e.target.checked);
                    setPage(1);
                  }}
                  className="w-4 h-4 rounded text-forest-700 focus:ring-forest-600 border-slate-300"
                />
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1">
                  <Leaf size={14} className="text-emerald-600" /> Organic Certified Only
                </span>
              </label>
            </div>

            {/* Location Filter */}
            <div className="pt-4 border-t border-slate-100">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">
                Farmer District / Region
              </label>
              <input
                type="text"
                placeholder="e.g. Nashik, Pune, Shimla"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                onBlur={fetchProducts}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-forest-600 focus:outline-none"
              />
            </div>

            {/* Price Range */}
            <div className="pt-4 border-t border-slate-100">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">
                Price Range (₹)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-1/2 px-3 py-1.5 rounded-xl border border-slate-200 text-xs"
                />
                <span className="text-slate-400 text-xs">-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-1/2 px-3 py-1.5 rounded-xl border border-slate-200 text-xs"
                />
              </div>
              <button
                onClick={() => {
                  setPage(1);
                  fetchProducts();
                }}
                className="mt-2 w-full py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700"
              >
                Apply Price
              </button>
            </div>
          </div>
        </div>

        {/* Product Grid Area */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white rounded-2xl px-5 py-3 border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
            <span className="text-slate-500 font-medium">
              Showing <strong>{products.length}</strong> of {total} products
            </span>

            <div className="flex items-center gap-2">
              <span className="text-slate-500 font-medium">Sort by:</span>
              <select
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value);
                  setPage(1);
                }}
                className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 font-semibold focus:outline-none focus:ring-2 focus:ring-forest-600 bg-white"
              >
                <option value="harvest_recent">Recently Harvested</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating_desc">Highest Rated</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <ProductCardSkeleton key={n} />
              ))}
            </div>
          ) : products.length === 0 ? (
            <EmptyState
              title="No products match your criteria"
              description="Try clearing your filters or search query to view all farmgate produce."
              actionText="Clear All Filters"
              onAction={handleClearFilters}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {pages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-6">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50"
              >
                Previous
              </button>
              {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-9 h-9 rounded-xl text-xs font-bold transition-colors ${
                    p === page
                      ? 'bg-forest-700 text-white'
                      : 'border border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                disabled={page >= pages}
                onClick={() => setPage((p) => Math.min(pages, p + 1))}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};