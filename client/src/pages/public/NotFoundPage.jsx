import React from 'react';
import { Link } from 'react-router-dom';
import { Sprout } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center space-y-4">
      <div className="w-16 h-16 rounded-2xl bg-forest-100 text-forest-800 flex items-center justify-center shadow-xs">
        <Sprout size={32} />
      </div>
      <h1 className="text-5xl font-extrabold text-slate-900 font-serif">404</h1>
      <h2 className="text-xl font-bold text-slate-800">Page Not Found</h2>
      <p className="text-sm text-slate-500 max-w-sm">
        The field page you are looking for has been moved, harvested, or does not exist.
      </p>
      <Link
        to="/"
        className="px-6 py-2.5 rounded-xl bg-forest-700 hover:bg-forest-800 text-white font-semibold text-sm transition-colors"
      >
        Back to Home
      </Link>
    </div>
  );
};