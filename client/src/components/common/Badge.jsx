import React from 'react';
import { ShieldCheck, Leaf, Sparkles, CheckCircle2 } from 'lucide-react';

export const Badge = ({ type, text, className = '' }) => {
  if (type === 'verified') {
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 ${className}`}>
        <ShieldCheck size={13} className="text-emerald-600" />
        {text || 'Verified Farmer'}
      </span>
    );
  }

  if (type === 'organic') {
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-forest-50 text-forest-800 border border-forest-200 ${className}`}>
        <Leaf size={12} className="text-forest-600" />
        {text || 'Organic'}
      </span>
    );
  }

  if (type === 'highlight') {
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-300 ${className}`}>
        <Sparkles size={12} className="text-amber-600" />
        {text}
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 ${className}`}>
      {text}
    </span>
  );
};