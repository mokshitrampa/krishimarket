import React from 'react';

export const ProductCardSkeleton = () => (
  <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden animate-pulse">
    <div className="h-48 bg-slate-200" />
    <div className="p-4 space-y-3">
      <div className="h-4 bg-slate-200 rounded w-1/3" />
      <div className="h-5 bg-slate-200 rounded w-3/4" />
      <div className="h-4 bg-slate-200 rounded w-1/2" />
      <div className="flex justify-between items-center pt-2">
        <div className="h-6 bg-slate-200 rounded w-1/4" />
        <div className="h-8 bg-slate-200 rounded w-1/3" />
      </div>
    </div>
  </div>
);

export const FarmerCardSkeleton = () => (
  <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden animate-pulse">
    <div className="h-32 bg-slate-200" />
    <div className="p-5 space-y-3">
      <div className="w-16 h-16 -mt-12 rounded-full bg-slate-300 border-4 border-white" />
      <div className="h-5 bg-slate-200 rounded w-2/3" />
      <div className="h-4 bg-slate-200 rounded w-1/2" />
      <div className="h-12 bg-slate-100 rounded" />
    </div>
  </div>
);