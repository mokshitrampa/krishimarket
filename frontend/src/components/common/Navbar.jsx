import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  Sprout,
  ShoppingBag,
  Scale,
  User as UserIcon,
  Menu,
  X,
  LogOut,
  ChevronDown,
  LayoutDashboard,
  Package,
  Heart,
  Settings,
  BarChart3,
  ShieldAlert
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useCompare } from '../../context/CompareContext';

export const Navbar = () => {
  const { user, isAuthenticated, logout, isCustomer, isFarmer, isAdmin } = useAuth();
  const { cart } = useCart();
  const { count: compareCount } = useCompare();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    navigate('/login');
  };

  const navLinkClass = ({ isActive }) =>
    `text-sm font-medium transition-colors ${
      isActive
        ? 'text-forest-700 font-semibold'
        : 'text-slate-600 hover:text-forest-700'
    }`;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-xl bg-forest-800 text-harvest-400 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <Sprout size={24} />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-forest-950 block font-serif leading-none">
                Krishi <span className="text-forest-600">Market</span>
              </span>
              <span className="text-[10px] tracking-wider uppercase font-semibold text-slate-400 block mt-0.5">
                Farm to Table Marketplace
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            <NavLink to="/" className={navLinkClass} end>
              Home
            </NavLink>
            <NavLink to="/marketplace" className={navLinkClass}>
              Marketplace
            </NavLink>
            <NavLink to="/farmers" className={navLinkClass}>
              Farmers
            </NavLink>
            <NavLink to="/how-it-works" className={navLinkClass}>
              How It Works
            </NavLink>
            <NavLink to="/about" className={navLinkClass}>
              About
            </NavLink>
            {isAdmin && (
              <NavLink to="/admin/dashboard" className="text-sm font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200 hover:bg-emerald-100 transition-colors flex items-center gap-1.5">
                Admin Portal
              </NavLink>
            )}
            {isFarmer && (
              <NavLink to="/farmer/dashboard" className="text-sm font-bold text-forest-800 bg-forest-50 px-3 py-1 rounded-lg border border-forest-200 hover:bg-forest-100 transition-colors">
                Farmer Hub
              </NavLink>
            )}
          </nav>

          {/* Right Action Icons & User Menu */}
          <div className="flex items-center gap-3">
            {/* Farmer Comparison Button */}
            <Link
              to="/compare-farmers"
              className="relative p-2.5 rounded-xl text-slate-700 hover:text-forest-800 hover:bg-forest-50 transition-colors flex items-center gap-1.5"
              title="Compare Farmers"
            >
              <Scale size={20} />
              <span className="hidden lg:inline text-xs font-semibold">Compare</span>
              {compareCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-harvest-500 text-forest-950 font-bold text-xs flex items-center justify-center shadow-sm">
                  {compareCount}
                </span>
              )}
            </Link>

            {/* Shopping Cart Button for Customer */}
            {(!isAuthenticated || isCustomer) && (
              <Link
                to="/customer/cart"
                className="relative p-2.5 rounded-xl text-slate-700 hover:text-forest-800 hover:bg-forest-50 transition-colors flex items-center gap-1.5"
                title="Your Basket"
              >
                <ShoppingBag size={20} />
                <span className="hidden lg:inline text-xs font-semibold">Basket</span>
                {cart.itemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-forest-700 text-white font-bold text-xs flex items-center justify-center shadow-sm">
                    {cart.itemsCount}
                  </span>
                )}
              </Link>
            )}

            {/* Admin Console Shortcut if Admin */}
            {isAdmin && (
              <Link
                to="/admin/dashboard"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 text-emerald-400 border border-slate-700 text-xs font-bold hover:bg-slate-800 transition-colors shadow-xs"
              >
                <ShieldAlert size={14} />
                <span>Admin Console</span>
              </Link>
            )}

            {/* Auth / Profile Area */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2.5 p-1.5 pr-3 rounded-full hover:bg-slate-100 border border-slate-200 transition-all"
                >
                  <img
                    src={
                      user.avatar ||
                      `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
                        user.name
                      )}`
                    }
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover border border-slate-300"
                  />
                  <div className="hidden md:block text-left">
                    <p className="text-xs font-bold text-slate-800 leading-tight">
                      {user.name.split(' ')[0]}
                    </p>
                    <span className="text-[10px] font-semibold uppercase text-forest-700 bg-forest-50 px-1.5 py-0.2 rounded-sm">
                      {user.role}
                    </span>
                  </div>
                  <ChevronDown size={14} className="text-slate-400" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setUserDropdownOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-fade-in">
                      <div className="px-4 py-2 border-b border-slate-100">
                        <p className="text-xs font-semibold text-slate-400">Signed in as</p>
                        <p className="text-sm font-bold text-slate-900 truncate">{user.email}</p>
                      </div>

                      {/* Customer Links */}
                      {isCustomer && (
                        <>
                          <Link
                            to="/customer/dashboard"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-forest-50 hover:text-forest-800"
                          >
                            <LayoutDashboard size={16} /> Customer Dashboard
                          </Link>
                          <Link
                            to="/customer/orders"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-forest-50 hover:text-forest-800"
                          >
                            <Package size={16} /> My Farm Orders
                          </Link>
                          <Link
                            to="/customer/saved-farmers"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-forest-50 hover:text-forest-800"
                          >
                            <Heart size={16} /> Favorite Farmers
                          </Link>
                        </>
                      )}

                      {/* Farmer Links */}
                      {isFarmer && (
                        <>
                          <Link
                            to="/farmer/dashboard"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-forest-50 hover:text-forest-800"
                          >
                            <LayoutDashboard size={16} /> Farmer Dashboard
                          </Link>
                          <Link
                            to="/farmer/products"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-forest-50 hover:text-forest-800"
                          >
                            <Package size={16} /> Manage Products
                          </Link>
                          <Link
                            to="/farmer/orders"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-forest-50 hover:text-forest-800"
                          >
                            <ShoppingBag size={16} /> Incoming Orders
                          </Link>
                          <Link
                            to="/farmer/analytics"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-forest-50 hover:text-forest-800"
                          >
                            <BarChart3 size={16} /> Sales & Analytics
                          </Link>
                          <Link
                            to="/farmer/profile"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-forest-50 hover:text-forest-800"
                          >
                            <Settings size={16} /> Farm Profile
                          </Link>
                        </>
                      )}

                      {/* Admin Links */}
                      {isAdmin && (
                        <Link
                          to="/admin/dashboard"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100"
                        >
                          <ShieldAlert size={16} /> Admin Operations
                        </Link>
                      )}

                      <div className="border-t border-slate-100 mt-1 pt-1">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50"
                        >
                          <LogOut size={16} /> Sign Out
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:text-forest-800 hover:bg-slate-100 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register/customer"
                  className="hidden sm:inline-flex px-4 py-2 rounded-xl text-sm font-semibold bg-forest-700 text-white hover:bg-forest-800 shadow-xs transition-colors"
                >
                  Register
                </Link>
                <Link
                  to="/register/farmer"
                  className="px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-harvest-100 text-harvest-900 border border-harvest-300 hover:bg-harvest-200 transition-colors"
                >
                  Join as Farmer
                </Link>
              </div>
            )}

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3">
          <NavLink
            to="/"
            end
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-slate-700"
          >
            Home
          </NavLink>
          <NavLink
            to="/marketplace"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-slate-700"
          >
            Marketplace
          </NavLink>
          <NavLink
            to="/farmers"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-slate-700"
          >
            Farmers Directory
          </NavLink>
          <NavLink
            to="/compare-farmers"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-slate-700"
          >
            Compare Farmers {compareCount > 0 && `(${compareCount})`}
          </NavLink>
          <NavLink
            to="/how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-slate-700"
          >
            How It Works
          </NavLink>
          <NavLink
            to="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-slate-700"
          >
            About Krishi Market
          </NavLink>

          {isAdmin && (
            <NavLink
              to="/admin/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-base font-bold text-emerald-800 bg-emerald-50 px-3 rounded-xl border border-emerald-200"
            >
              🛡️ Admin Operations
            </NavLink>
          )}

          {!isAuthenticated && (
            <div className="pt-4 border-t border-slate-200 flex flex-col gap-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-xl text-sm font-semibold border border-slate-300 text-slate-800"
              >
                Sign In
              </Link>
              <Link
                to="/register/customer"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-xl text-sm font-semibold bg-forest-700 text-white"
              >
                Register as Customer
              </Link>
              <Link
                to="/register/farmer"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-xl text-sm font-semibold bg-harvest-500 text-forest-950 font-bold"
              >
                Join as Farmer Partner
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};