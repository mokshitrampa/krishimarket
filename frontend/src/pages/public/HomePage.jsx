import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Sprout,
  ArrowRight,
  ShieldCheck,
  Scale,
  ShoppingBag,
  TrendingDown,
  CheckCircle2,
  Leaf,
  Truck,
  HeartHandshake
} from 'lucide-react';
import { productService } from '../../services/productService';
import { farmerService } from '../../services/farmerService';
import { ProductCard } from '../../components/marketplace/ProductCard';
import { FarmerCard } from '../../components/farmer/FarmerCard';
import { ProductCardSkeleton, FarmerCardSkeleton } from '../../components/common/SkeletonLoader';

export const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [featuredFarmers, setFeaturedFarmers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const [prodRes, farmerRes] = await Promise.all([
          productService.getProducts({ limit: 8, sort: 'harvest_recent' }),
          farmerService.getFarmers({ limit: 4, sort: 'rating_desc' })
        ]);
        if (prodRes.success) setFeaturedProducts(prodRes.data);
        if (farmerRes.success) setFeaturedFarmers(farmerRes.data);
      } catch (err) {
        console.warn('Error loading home data:', err.message);
      } finally {
        setLoading(false);
      }
    };
    loadHomeData();
  }, []);

  return (
    <div className="space-y-24 pb-20">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-forest-900 via-forest-900 to-forest-950 text-white pt-16 pb-24 md:py-28">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-forest-800/80 border border-forest-700/60 text-harvest-300 text-xs font-semibold backdrop-blur-sm shadow-xs">
                <Leaf size={14} className="text-emerald-400" />
                <span>100% Direct Farmer-to-Consumer Agricultural Platform</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white font-serif leading-[1.15]">
                Fresh From Local Farms. <br />
                <span className="text-harvest-400 italic">Directly To Your Table.</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed font-sans">
                Cut through commercial wholesale middlemen. Connect directly with verified local growers, compare farming practices side-by-side, inspect morning harvest dates, and secure honest farmgate prices.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  to="/marketplace"
                  className="px-7 py-3.5 rounded-xl text-base font-bold bg-harvest-400 hover:bg-harvest-300 text-forest-950 shadow-lg shadow-harvest-500/20 flex items-center gap-2 transition-all active:scale-95"
                >
                  <span>Explore Marketplace</span>
                  <ArrowRight size={18} />
                </Link>
                <Link
                  to="/register/farmer"
                  className="px-7 py-3.5 rounded-xl text-base font-bold bg-forest-800/90 hover:bg-forest-800 text-white border border-forest-700 transition-all flex items-center gap-2"
                >
                  <span>Join as Farmer</span>
                </Link>
                <Link
                  to="/compare-farmers"
                  className="px-5 py-3.5 rounded-xl text-sm font-semibold text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors"
                >
                  <Scale size={16} className="text-harvest-400" />
                  <span>Compare Farmers</span>
                </Link>
              </div>

              {/* Micro Trust Stats */}
              <div className="grid grid-cols-3 gap-6 pt-6 border-t border-forest-800/80 text-left">
                <div>
                  <span className="text-2xl sm:text-3xl font-extrabold text-white font-serif block">
                    35-40%
                  </span>
                  <span className="text-xs text-slate-400 font-medium">Better Farmer Margins</span>
                </div>
                <div>
                  <span className="text-2xl sm:text-3xl font-extrabold text-white font-serif block">
                    Zero
                  </span>
                  <span className="text-xs text-slate-400 font-medium">Mandi Intermediaries</span>
                </div>
                <div>
                  <span className="text-2xl sm:text-3xl font-extrabold text-white font-serif block">
                    100%
                  </span>
                  <span className="text-xs text-slate-400 font-medium">Traceable Sourcing</span>
                </div>
              </div>
            </div>

            {/* Right Visual */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-forest-800/50 bg-forest-800">
                  <img
                    src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80"
                    alt="Fresh organic harvest in field basket"
                    className="w-full h-80 sm:h-96 object-cover"
                  />
                </div>

                <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-4 shadow-xl border border-slate-100 flex items-center gap-3 text-slate-900 animate-fade-in">
                  <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <ShieldCheck size={24} />
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 font-semibold block">Farmgate Traceability</span>
                    <span className="text-sm font-bold text-slate-900 block">Single-Origin Guarantee</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Value Proposition for Customer & Farmer */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-forest-700 bg-forest-100/70 px-3 py-1 rounded-full">
            The Two-Sided Platform Value
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 font-serif">
            A Fairer Deal For Everyone Who Cares About Real Food
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Standard food supply chains pass fresh crops through multiple middlemen, draining farmer profits while charging consumers inflated rates for cold-stored produce. KrishiDirect bridges both ends directly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Customer Card */}
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-6">
              <ShoppingBag size={26} />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 font-serif mb-3">For Consumers</h3>
            <p className="text-sm text-slate-600 mb-6 leading-relaxed">
              Nourish your household with vibrant produce picked at peak maturity and delivered directly to your doorstep.
            </p>
            <ul className="space-y-3 text-sm text-slate-700">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 size={18} className="text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Know your grower:</strong> See the exact farm, soil practices, and farmer profile behind every harvest.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 size={18} className="text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Side-by-side comparison:</strong> Compare prices, ratings, freshness, and delivery slots across local farmers before ordering.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 size={18} className="text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Peak nutritional density:</strong> Harvested the morning of scheduled dispatch without artificial gas chambers.</span>
              </li>
            </ul>
            <div className="mt-8">
              <Link to="/marketplace" className="text-sm font-bold text-forest-700 hover:text-forest-900 flex items-center gap-1">
                Browse Marketplace Products →
              </Link>
            </div>
          </div>

          {/* Farmer Card */}
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center mb-6">
              <Sprout size={26} />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 font-serif mb-3">For Farmers</h3>
            <p className="text-sm text-slate-600 mb-6 leading-relaxed">
              Take complete sovereignty over your harvest pricing, cultivate repeat local consumers, and build a lasting brand.
            </p>
            <ul className="space-y-3 text-sm text-slate-700">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 size={18} className="text-amber-600 shrink-0 mt-0.5" />
                <span><strong>Set your own prices:</strong> Keep full agricultural realization without arbitrary distress-selling at wholesale mandis.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 size={18} className="text-amber-600 shrink-0 mt-0.5" />
                <span><strong>Direct customer relationships:</strong> Receive ratings, direct feedback, and recurring loyal buyers season after season.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 size={18} className="text-amber-600 shrink-0 mt-0.5" />
                <span><strong>Digital order dispatch manager:</strong> Manage stock, view scheduled harvest quantities, and track operational revenue.</span>
              </li>
            </ul>
            <div className="mt-8">
              <Link to="/register/farmer" className="text-sm font-bold text-forest-700 hover:text-forest-900 flex items-center gap-1">
                Register as a Verified Farmer →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Featured Verified Farmers */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-forest-700 bg-forest-100/70 px-3 py-1 rounded-full">
              Verified Producers
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 font-serif mt-2">
              Meet Local Growers
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Every farmer profile is verified for land authenticity, farming methods, and food safety standards.
            </p>
          </div>
          <Link
            to="/farmers"
            className="text-sm font-bold text-forest-700 hover:text-forest-900 flex items-center gap-1.5 shrink-0"
          >
            <span>View All Farmers ({featuredFarmers.length}+)</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <FarmerCardSkeleton key={n} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredFarmers.map((farmer) => (
              <FarmerCard key={farmer._id} farmer={farmer} />
            ))}
          </div>
        )}
      </section>

      {/* 4. Featured Fresh Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-forest-700 bg-forest-100/70 px-3 py-1 rounded-full">
              Fresh This Morning
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 font-serif mt-2">
              Seasonal Farmgate Harvest
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Recently harvested agricultural produce directly available from local fields.
            </p>
          </div>
          <Link
            to="/marketplace"
            className="text-sm font-bold text-forest-700 hover:text-forest-900 flex items-center gap-1.5 shrink-0"
          >
            <span>Explore All Harvest Produce</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <ProductCardSkeleton key={n} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};