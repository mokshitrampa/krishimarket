import React, { useState } from 'react';
import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  ShieldCheck,
  Users,
  Package,
  Layers,
  ShoppingBag,
  MessageSquare,
  AlertTriangle,
  BarChart3,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Sprout,
  ExternalLink,
  Shield
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Farmer Approvals', path: '/admin/approvals', icon: ShieldCheck },
    { label: 'Farmers Directory', path: '/admin/farmers', icon: Sprout },
    { label: 'Customers', path: '/admin/customers', icon: Users },
    { label: 'Products', path: '/admin/products', icon: Package },
    { label: 'Categories', path: '/admin/categories', icon: Layers },
    { label: 'Orders', path: '/admin/orders', icon: ShoppingBag },
    { label: 'Reviews', path: '/admin/reviews', icon: MessageSquare },
    { label: 'Disputes', path: '/admin/disputes', icon: AlertTriangle },
    { label: 'Analytics', path: '/admin/analytics', icon: BarChart3 }
  ];

  return (
    <div className="min-h-screen flex bg-slate-950 text-slate-100 font-sans">
      {/* Sidebar */}
      <aside
        className={`bg-slate-900 border-r border-slate-800 transition-all duration-300 flex flex-col z-30 shrink-0 ${
          collapsed ? 'w-20' : 'w-64'
        }`}
      >
        {/* Brand */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-slate-800">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold">
                <Shield size={18} />
              </div>
              <span className="font-bold text-base text-white tracking-wide">
                Krishi<span className="text-emerald-400">Admin</span>
              </span>
            </div>
          )}
          {collapsed && (
            <div className="mx-auto w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold">
              <Shield size={18} />
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  } ${collapsed ? 'justify-center' : ''}`
                }
                title={collapsed ? item.label : undefined}
              >
                <Icon size={18} className="shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom user card */}
        <div className="p-3 border-t border-slate-800">
          <div className="flex items-center justify-between">
            <div className={`flex items-center gap-2.5 ${collapsed ? 'hidden' : ''}`}>
              <div className="w-8 h-8 rounded-full bg-emerald-700 text-white font-bold flex items-center justify-center text-xs">
                A
              </div>
              <div className="text-left truncate">
                <p className="text-xs font-bold text-slate-200 truncate">{user?.name}</p>
                <p className="text-[10px] text-emerald-400">Super Administrator</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 rounded-lg text-rose-400 hover:bg-slate-800 hover:text-rose-300 transition-colors"
              title="Sign Out"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-slate-900/50">
        {/* Top Navbar */}
        <header className="h-16 bg-slate-900 border-b border-slate-800 px-6 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
            <span>Admin Control Plane</span>
            <span>/</span>
            <span className="text-emerald-400 uppercase tracking-wider">KrishiDirect Governance</span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/"
              target="_blank"
              className="text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors"
            >
              <span>Public Site</span>
              <ExternalLink size={13} />
            </Link>
          </div>
        </header>

        {/* Workspace */}
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};