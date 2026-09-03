import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Package,
  ShoppingBag,
  Award,
  CheckCircle2,
  XCircle,
  BarChart3
} from 'lucide-react';
import { adminService } from '../../services/adminService';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

export const AdminAnalyticsPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await adminService.getAnalytics();
        if (res.success) setData(res.data);
      } catch (err) {
        console.warn('Error loading admin analytics:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return <LoadingSpinner size="lg" message="Loading platform analytics..." />;
  }

  const {
    fulfilmentRate = 98,
    cancellationRate = 2,
    totalOrders = 0,
    deliveredOrders = 0,
    topFarmers = [],
    topProducts = []
  } = data || {};

  return (
    <div className="space-y-8">
      <div className="pb-4 border-b border-slate-800">
        <h1 className="text-2xl font-bold text-white tracking-tight">Platform Performance & KPI Metrics</h1>
        <p className="text-xs text-slate-400 mt-0.5">Macro logistics health, farmer volume, and crop velocity.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-1">
          <span className="text-xs font-semibold text-slate-400">Order Fulfilment Rate</span>
          <span className="text-3xl font-extrabold text-emerald-400 font-serif block">{fulfilmentRate}%</span>
          <span className="text-[11px] text-slate-500">Delivered on schedule</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-1">
          <span className="text-xs font-semibold text-slate-400">Cancellation Rate</span>
          <span className="text-3xl font-extrabold text-rose-400 font-serif block">{cancellationRate}%</span>
          <span className="text-[11px] text-slate-500">Customer or stock voids</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-1">
          <span className="text-xs font-semibold text-slate-400">Delivered Volume</span>
          <span className="text-3xl font-extrabold text-white font-serif block">{deliveredOrders}</span>
          <span className="text-[11px] text-slate-500">Successful dispatches</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-1">
          <span className="text-xs font-semibold text-slate-400">Total Transactions</span>
          <span className="text-3xl font-extrabold text-white font-serif block">{totalOrders}</span>
          <span className="text-[11px] text-slate-500">Lifetime volume</span>
        </div>
      </div>

      {/* Top Farmers & Top Crops */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Farmers by Sales */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
          <h3 className="text-sm font-bold text-white">Top Growers by Sales Volume</h3>
          <div className="space-y-3">
            {topFarmers.map((f, i) => (
              <div key={i} className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-white block">{f.farmerName}</span>
                  <span className="text-slate-400">{f.orderCount} Orders Fulfilled</span>
                </div>
                <span className="font-extrabold text-emerald-400 font-serif text-sm">
                  ₹{f.totalSales}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Selling Crops */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
          <h3 className="text-sm font-bold text-white">Highest Rated Harvest Produce</h3>
          <div className="space-y-3">
            {topProducts.map((p, i) => (
              <div key={i} className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-white block">{p.name}</span>
                  <span className="text-slate-400">{p.category} • {p.stock} in stock</span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-amber-400 block">★ {p.rating}</span>
                  <span className="text-slate-500 font-serif">₹{p.price}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};