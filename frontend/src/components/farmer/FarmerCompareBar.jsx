import React from 'react';
import { Link } from 'react-router-dom';
import { Scale, ArrowRight, X } from 'lucide-react';
import { useCompare } from '../../context/CompareContext';

export const FarmerCompareBar = () => {
  const { comparedFarmerIds, removeFarmerFromCompare, clearCompare, count } = useCompare();

  if (count === 0) return null;

  return (
    <aside aria-label="Farmer Comparison Dock" className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-11/12 max-w-2xl bg-forest-950 text-white rounded-2xl shadow-2xl p-4 border border-forest-800/80 animate-fade-in flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-forest-800 text-harvest-400 flex items-center justify-center shrink-0">
          <Scale size={20} />
        </div>
        <div>
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            Farmer Comparison Active
            <span className="px-2 py-0.2 rounded-full text-xs font-extrabold bg-harvest-400 text-forest-950">
              {count} of 4
            </span>
          </h4>
          <p className="text-xs text-slate-300 hidden sm:block">
            Side-by-side metrics: price, rating, harvest freshness, fulfilment & delivery
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={clearCompare}
          className="text-xs text-slate-400 hover:text-white px-2.5 py-1.5 rounded-lg transition-colors"
        >
          Clear
        </button>
        <Link
          to="/compare-farmers"
          className="px-4 py-2 rounded-xl text-xs font-bold bg-harvest-400 hover:bg-harvest-300 text-forest-950 flex items-center gap-1.5 transition-all shadow-md active:scale-95"
        >
          <span>Compare Now</span>
          <ArrowRight size={14} />
        </Link>
      </div>
    </aside>
  );
};