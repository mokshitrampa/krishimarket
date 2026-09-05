import React from 'react';
import { Link } from 'react-router-dom';
import { Sprout, ShieldCheck, HeartHandshake, Truck, MapPin, Mail, Phone } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-forest-950 text-slate-300 pt-16 pb-12 border-t border-forest-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-forest-900">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-forest-800 text-harvest-400 flex items-center justify-center">
                <Sprout size={22} />
              </div>
              <span className="text-2xl font-bold tracking-tight text-white font-serif">
                Krishi <span className="text-harvest-400">Market</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Connecting local farmers directly to households and conscious consumers. We eliminate extractive middlemen, ensure fair farmgate realizations, and guarantee field-fresh transparency.
            </p>
            <div className="flex flex-wrap gap-4 pt-2 text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <ShieldCheck size={16} className="text-emerald-400" /> Verified Farm Profiles
              </div>
              <div className="flex items-center gap-1.5">
                <HeartHandshake size={16} className="text-harvest-400" /> Fair Local Pricing
              </div>
              <div className="flex items-center gap-1.5">
                <Truck size={16} className="text-blue-400" /> Morning Harvest Dispatch
              </div>
            </div>
          </div>

          {/* Marketplace Col */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-4 font-sans">
              Marketplace
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <Link to="/marketplace" className="hover:text-harvest-300 transition-colors">
                  All Harvest Produce
                </Link>
              </li>
              <li>
                <Link to="/marketplace?category=Vegetables" className="hover:text-harvest-300 transition-colors">
                  Fresh Vegetables
                </Link>
              </li>
              <li>
                <Link to="/marketplace?category=Fruits" className="hover:text-harvest-300 transition-colors">
                  Orchard Fruits
                </Link>
              </li>
              <li>
                <Link to="/marketplace?category=Dairy" className="hover:text-harvest-300 transition-colors">
                  A2 Dairy & Ghee
                </Link>
              </li>
              <li>
                <Link to="/marketplace?category=Organic+Produce" className="hover:text-harvest-300 transition-colors">
                  Certified Organic
                </Link>
              </li>
              <li>
                <Link to="/marketplace?category=Grains" className="hover:text-harvest-300 transition-colors">
                  Indigenous Grains
                </Link>
              </li>
            </ul>
          </div>

          {/* Farmers & Discover Col */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-4 font-sans">
              Farmers
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <Link to="/farmers" className="hover:text-harvest-300 transition-colors">
                  Browse Farmer Directory
                </Link>
              </li>
              <li>
                <Link to="/compare-farmers" className="hover:text-harvest-300 transition-colors">
                  Side-by-Side Comparison
                </Link>
              </li>
              <li>
                <Link to="/register/farmer" className="hover:text-harvest-300 transition-colors text-harvest-400 font-semibold">
                  Partner with Us (Register)
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="hover:text-harvest-300 transition-colors">
                  Farming Standards
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-harvest-300 transition-colors">
                  Middlemen Reduction Impact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Col */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-4 font-sans">
              Trust & Contact
            </h4>
            <div className="space-y-3 text-sm text-slate-400">
              <div className="flex items-start gap-2">
                <MapPin size={16} className="text-harvest-400 shrink-0 mt-0.5" />
                <span>Krishi Bhavan Agri Hub, Pune & Nashik Agricultural Zone</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={16} className="text-harvest-400 shrink-0" />
                <span>support@krishimarket.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={16} className="text-harvest-400 shrink-0" />
                <span>+91 1800 233 4455 (Toll Free)</span>
              </div>
              <div className="pt-2">
                <Link
                  to="/admin/dashboard"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-semibold text-emerald-400 hover:text-emerald-300 hover:border-slate-700 transition-colors shadow-xs"
                >
                  <ShieldCheck size={14} />
                  <span>Admin Control Portal</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Krishi Market Agriculture Platform. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link to="/about" className="hover:text-slate-400">Privacy Policy</Link>
            <Link to="/about" className="hover:text-slate-400">Terms of Service</Link>
            <Link to="/how-it-works" className="hover:text-slate-400">Verification Guidelines</Link>
            <Link to="/admin/dashboard" className="hover:text-emerald-400 text-slate-500 flex items-center gap-1 font-semibold">
              <span>Admin Desk</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};