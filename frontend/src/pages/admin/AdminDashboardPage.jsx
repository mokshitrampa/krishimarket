import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  ShieldCheck,
  Package,
  ShoppingBag,
  DollarSign,
  AlertTriangle,
  ArrowRight,
  Clock,
  CheckCircle2,
  XCircle,
  Sprout,
  BarChart3,
  RotateCcw
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { adminService } from '../../services/adminService';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

export const AdminDashboardPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [resetting, setResetting] = useState(false);

  const fetchAdminDash = async () => {
    setLoading(true);
    try {
      const res = await adminService.getDashboard();
      if (res.success) setData(res.data);
    } catch (err) {
      console.warn('Admin dash fetch error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminDash();
  }, []);

  const handleResetClean = async () => {
    if (
      !window.confirm(
        'Reset platform to a clean slate? This will clear all mock orders, fake customers, and test disputes, leaving only your Admin account and standard categories so you can start fresh.'
      )
    ) {
      return;
    }
    setResetting(true);
    try {
      await adminService.resetCleanDatabase();
      alert('Platform database successfully reset to clean slate! All fake mock orders and users removed.');
      await fetchAdminDash();
    } catch (err) {
      alert(err.message || 'Reset failed.');
    } finally {
      setResetting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner size="lg" message="Synthesizing platform telemetry..." />;
  }

  const {
    kpis = {},
    monthlySales = [],
    categoryDist = [],
    recentOrders = [],
    pendingApprovalsList = [],
    recentDisputes = []
  } = data || {};

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Platform Command Center</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Operational metrics, verification audits, and live marketplace activity
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            onClick={handleResetClean}
            disabled={resetting}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold text-xs flex items-center gap-1.5 border border-slate-700 transition-colors shadow-xs disabled:opacity-50"
            title="Wipe mock orders and test accounts to start fresh"
          >
            <RotateCcw size={14} className={resetting ? 'animate-spin' : ''} />
            <span>{resetting ? 'Resetting...' : 'Reset Clean Slate'}</span>
          </button>

          {kpis.pendingFarmerApprovals > 0 && (
            <Link
              to="/admin/approvals"
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md transition-all"
            >
              <ShieldCheck size={16} />
              <span>{kpis.pendingFarmerApprovals} Pending Approvals</span>
            </Link>
          )}
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-1">
          <span className="text-xs font-semibold text-slate-400">Total Gross Merchandise</span>
          <span className="text-2xl font-extrabold text-white font-serif block">₹{kpis.totalGMV}</span>
          <span className="text-[11px] text-emerald-400">Avg Order: ₹{kpis.avgOrderValue}</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-1">
          <span className="text-xs font-semibold text-slate-400">Total Platform Orders</span>
          <span className="text-2xl font-extrabold text-white font-serif block">{kpis.totalOrders}</span>
          <span className="text-[11px] text-slate-400">{kpis.completedOrders} Delivered</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-1">
          <span className="text-xs font-semibold text-slate-400">Verified Growers</span>
          <span className="text-2xl font-extrabold text-white font-serif block">{kpis.verifiedFarmers}</span>
          <span className="text-[11px] text-amber-400">{kpis.pendingFarmerApprovals} Pending audit</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-1">
          <span className="text-xs font-semibold text-slate-400">Active Disputes</span>
          <span className="text-2xl font-extrabold text-rose-400 font-serif block">{kpis.activeDisputes}</span>
          <span className="text-[11px] text-slate-400">{kpis.totalCustomers} Registered Buyers</span>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* GMV & Orders Area Chart */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white">GMV & Order Velocity (Past 6 Months)</h3>
              <p className="text-xs text-slate-400">Direct platform sales throughput</p>
            </div>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlySales}>
                <defs>
                  <linearGradient id="adminGMV" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip
                  formatter={(val) => [`₹${val}`, 'Gross GMV']}
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    color: '#fff',
                    borderRadius: '10px',
                    fontSize: '12px'
                  }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2.5} fill="url(#adminGMV)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Distribution Bar Chart */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white">Crop Categories</h3>
            <span className="text-xs text-slate-400">{kpis.totalProducts} Listings</span>
          </div>

          {categoryDist.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-slate-500 text-xs">
              <Package size={28} className="mb-2 opacity-50" />
              <span>No product listings yet.</span>
            </div>
          ) : (
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryDist} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#1e293b" />
                  <XAxis type="number" stroke="#64748b" fontSize={11} />
                  <YAxis dataKey="name" type="category" stroke="#64748b" fontSize={10} width={75} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#334155',
                      color: '#fff',
                      borderRadius: '8px',
                      fontSize: '11px'
                    }}
                  />
                  <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      {/* Two columns: Pending Approvals & Recent Disputes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Approvals */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white">Pending Farmer Applications</h3>
              <p className="text-xs text-slate-400">Land & methodology audits</p>
            </div>
            <Link to="/admin/approvals" className="text-xs font-semibold text-emerald-400 hover:underline">
              Manage All →
            </Link>
          </div>

          {pendingApprovalsList.length === 0 ? (
            <p className="text-xs text-slate-500 py-6 text-center">No pending farmer applications.</p>
          ) : (
            <div className="space-y-3">
              {pendingApprovalsList.map((f) => (
                <div key={f._id} className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-white block">{f.farmName}</span>
                    <span className="text-slate-400">{f.user?.name} • {f.district}, {f.state}</span>
                    <span className="text-[10px] text-amber-400 block mt-0.5">{f.farmingMethod} ({f.farmSizeAcres} Acres)</span>
                  </div>
                  <Link
                    to="/admin/approvals"
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
                  >
                    Review
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Disputes */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white">Reported Order Issues</h3>
              <p className="text-xs text-slate-400">Consumer disputes needing intervention</p>
            </div>
            <Link to="/admin/disputes" className="text-xs font-semibold text-emerald-400 hover:underline">
              View Disputes →
            </Link>
          </div>

          {recentDisputes.length === 0 ? (
            <p className="text-xs text-slate-500 py-6 text-center">No active disputes reported.</p>
          ) : (
            <div className="space-y-3">
              {recentDisputes.map((d) => (
                <div key={d._id} className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-rose-400">#{d.orderNumber}</span>
                      <span className="px-2 py-0.2 rounded-full text-[10px] bg-slate-700 text-slate-300 capitalize">{d.status}</span>
                    </div>
                    <span className="text-slate-300 font-semibold block mt-1">{d.reason}</span>
                    <span className="text-slate-400 text-[11px] line-clamp-1">{d.description}</span>
                  </div>
                  <Link
                    to="/admin/disputes"
                    className="px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-white font-semibold text-xs"
                  >
                    Action
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};