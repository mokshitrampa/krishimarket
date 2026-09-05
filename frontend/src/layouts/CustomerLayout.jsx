import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { LayoutDashboard, Package, Heart, ShoppingBag, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const CustomerLayout = () => {
  const { user } = useAuth();

  const tabClass = ({ isActive }) =>
    `flex items-center gap-2 py-3 px-4 border-b-2 text-sm font-semibold transition-all ${
      isActive
        ? 'border-forest-700 text-forest-900 bg-forest-50/50'
        : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
    }`;

  return (
    <div className="min-h-screen flex flex-col bg-[#faf8f5]">
      <Navbar />
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <h1 className="text-xl font-bold text-slate-900">Welcome, {user?.name}</h1>
              <p className="text-xs text-slate-500">Your personal farm-to-table consumer hub</p>
            </div>
          </div>
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            <NavLink to="/customer/dashboard" className={tabClass}>
              <LayoutDashboard size={16} /> Overview
            </NavLink>
            <NavLink to="/customer/orders" className={tabClass}>
              <Package size={16} /> Farm Orders
            </NavLink>
            <NavLink to="/customer/saved-farmers" className={tabClass}>
              <Heart size={16} /> Saved Farmers
            </NavLink>
            <NavLink to="/customer/cart" className={tabClass}>
              <ShoppingBag size={16} /> Checkout Basket
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