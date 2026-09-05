import React from 'react';
import { Sprout } from 'lucide-react';
import { Link } from 'react-router-dom';

export const EmptyState = ({
  icon: Icon = Sprout,
  title = 'No items found',
  description = 'Try adjusting your filters or search query to find what you are looking for.',
  actionText,
  actionLink,
  onAction
}) => {
  return (
    <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center max-w-md mx-auto my-8">
      <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-forest-50 text-forest-700 flex items-center justify-center">
        <Icon size={32} />
      </div>
      <h3 className="text-lg font-bold text-slate-900 mb-2">{title}</h3>
      <p className="text-sm text-slate-500 mb-6 leading-relaxed">{description}</p>
      {actionText && (
        actionLink ? (
          <Link
            to={actionLink}
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl text-sm font-semibold bg-forest-700 text-white hover:bg-forest-800 transition-colors shadow-sm"
          >
            {actionText}
          </Link>
        ) : (
          <button
            onClick={onAction}
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl text-sm font-semibold bg-forest-700 text-white hover:bg-forest-800 transition-colors shadow-sm"
          >
            {actionText}
          </button>
        )
      )}
    </div>
  );
};