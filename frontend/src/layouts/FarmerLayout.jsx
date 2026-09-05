import React from 'react';
import { Outlet, NavLink, Link } from 'react-router-dom';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  BarChart3,
  Settings,
  AlertCircle,
  ShieldCheck,
  Store
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const FarmerLayout = () => {
  const { user, farmerProfile } = useAuth();

  const isApproved = farmerProfile?.verificationStatus === 'approved';
  const isPending = farmerProfile?.verificationStatus === 'pending';

  const tabClass = ({ isActive }) =>
    `flex items-center gap-2 py-3 px-4 border-b-2 text-sm font-semibold transition-all whitespace-nowrap ${
      isActive
        ? 'border-forest-700 text-forest-900 bg-forest-50/50'
        : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
    }`;

  return (
    <div className="min-h-screen flex flex-col bg-[#faf8f5]">
      <Navbar />

      {/* Verification Status Warning / Notice */}
      {isPending && (
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-3 text-sm text-amber-800 flex items-center justify-between max-w-7xl mx-auto w-full">
          <div className="flex items-center gap-2 font-medium">
            <AlertCircle size={18} className="text-amber-600 shrink-0" />
            <span>
              Your farm registration is currently <strong>Under Administrator Review</strong>. You can configure your farm profile and prepare product listings. Once verified, they will immediately be published to the public marketplace.
            </span>
          </div>
        </div>
      )}

      {/* Header bar */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-forest-800 text-white flex items-center justify-center font-bold text-lg">
                {farmerProfile?.farmName ? farmerProfile.farmName.charAt(0) : 'F'}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold text-slate-900">
                    {farmerProfile?.farmName || `${user?.name}'s Farm`}
                  </h1>
                  {isApproved && (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      <ShieldCheck size={13} /> Verified
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500">
                  Farmer Partner: {user?.name} | {farmerProfile?.district || 'Agricultural Center'}, {farmerProfile?.state || ''}
                </p>
              </div>
            </div>

            {farmerProfile?._id && (
              <Link
                to={`/farmers/${farmerProfile._id}`}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors self-start sm:self-auto"
              >
                <Store size={14} /> View Public Storefront
              </Link>
            )}
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            <NavLink to="/farmer/dashboard" className={tabClass}>
              <LayoutDashboard size={16} /> Overview
            </NavLink>
            <NavLink to="/farmer/products" className={tabClass}>
              <Package size={16} /> Product Inventory
            </NavLink>
            <NavLink to="/farmer/orders" className={tabClass}>
              <ShoppingBag size={16} /> Incoming Orders
            </NavLink>
            <NavLink to="/farmer/analytics" className={tabClass}>
              <BarChart3 size={16} /> Sales & Performance
            </NavLink>
            <NavLink to="/farmer/profile" className={tabClass}>
              <Settings size={16} /> Farm Settings
            </NavLink>
          </div>
        </div>
      </div>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};