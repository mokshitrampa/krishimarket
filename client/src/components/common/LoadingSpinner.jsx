import React from 'react';

export const LoadingSpinner = ({ size = 'md', message = 'Loading fresh produce...' }) => {
  const sizeClasses = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4'
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div
        className={`${sizeClasses[size] || sizeClasses.md} rounded-full border-forest-200 border-t-forest-700 animate-spin mb-3`}
      />
      {message && <p className="text-sm font-medium text-slate-500">{message}</p>}
    </div>
  );
};