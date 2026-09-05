import React from 'react';
import { Link } from 'react-router-dom';
import { Sprout, ShoppingBag, ShieldCheck, Truck, Scale, HeartHandshake, CheckCircle2, ArrowRight } from 'lucide-react';

export const HowItWorksPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-forest-700 bg-forest-50 px-3 py-1 rounded-full">
          Platform Architecture
        </span>
        <h1 className="text-4xl font-extrabold text-slate-900 font-serif">
          How Direct Farm Buying Works
        </h1>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          From verified farm onboarding to early morning harvest and kitchen delivery: here is how KrishiDirect establishes accountability every step of the way.
        </p>
      </div>

      {/* Customer Journey */}
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-xs space-y-8">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-forest-800 text-harvest-400 flex items-center justify-center">
            <ShoppingBag size={22} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900 font-serif">The Consumer Journey</h2>
            <p className="text-xs text-slate-500">How you choose growers, verify produce, and receive fresh food</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-3">
            <span className="w-7 h-7 rounded-full bg-forest-100 text-forest-800 font-bold text-xs flex items-center justify-center">1</span>
            <h3 className="text-base font-bold text-slate-900">Explore & Compare</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Browse seasonal harvest produce or explore verified growers in your region. Use our Side-by-Side Comparison engine to examine farming practices, harvest dates, prices, and past customer ratings.
            </p>
          </div>

          <div className="space-y-3">
            <span className="w-7 h-7 rounded-full bg-forest-100 text-forest-800 font-bold text-xs flex items-center justify-center">2</span>
            <h3 className="text-base font-bold text-slate-900">Farmer-Grouped Orders</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              When adding produce to your basket, items are transparently grouped by their specific farmstead. You choose your preferred morning or evening delivery window and check out with Cash on Delivery or simulated card payment.
            </p>
          </div>

          <div className="space-y-3">
            <span className="w-7 h-7 rounded-full bg-forest-100 text-forest-800 font-bold text-xs flex items-center justify-center">3</span>
            <h3 className="text-base font-bold text-slate-900">Dawn Harvest & Doorstep Delivery</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Your farmer receives your order directly on their dashboard, picks the ripe crops at sunrise, packs them in breathable natural packaging, and dispatches directly to your table with complete status tracking.
            </p>
          </div>
        </div>
      </div>

      {/* Farmer Journey */}
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-xs space-y-8">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-amber-500 text-forest-950 flex items-center justify-center">
            <Sprout size={22} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900 font-serif">The Farmer Journey</h2>
            <p className="text-xs text-slate-500">From application verification to digital store management</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-3">
            <span className="w-7 h-7 rounded-full bg-amber-100 text-amber-900 font-bold text-xs flex items-center justify-center">1</span>
            <h3 className="text-base font-bold text-slate-900">Registration & Land Audit</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Growers apply by detailing their farm location, acreage, organic practices, and soil certifications. Applications are audited by platform administrators before any farmer is authorized to sell publicly.
            </p>
          </div>

          <div className="space-y-3">
            <span className="w-7 h-7 rounded-full bg-amber-100 text-amber-900 font-bold text-xs flex items-center justify-center">2</span>
            <h3 className="text-base font-bold text-slate-900">List Real Harvest Inventory</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Farmers set their own honest prices and record exact harvest dates, expected freshness windows, and batch quantities. No commission middleman dictates unfair cuts.
            </p>
          </div>

          <div className="space-y-3">
            <span className="w-7 h-7 rounded-full bg-amber-100 text-amber-900 font-bold text-xs flex items-center justify-center">3</span>
            <h3 className="text-base font-bold text-slate-900">Receive & Fulfil Direct Orders</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Incoming orders display clear customer delivery details and slots. Farmers advance the order status from Confirmed to Harvest to Dispatch, viewing their real-time sales and repeat customer metrics.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};