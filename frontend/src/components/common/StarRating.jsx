import React from 'react';
import { Star } from 'lucide-react';

export const StarRating = ({ rating = 0, count, showCount = true, size = 16, interactive = false, onRate }) => {
  const roundedRating = Math.round(rating * 10) / 10;

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={size}
            className={`${
              star <= Math.round(rating)
                ? 'text-amber-500 fill-amber-400'
                : 'text-slate-300'
            } ${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : ''}`}
            onClick={() => interactive && onRate && onRate(star)}
          />
        ))}
      </div>
      <span className="text-xs font-semibold text-slate-700">{roundedRating.toFixed(1)}</span>
      {showCount && count !== undefined && (
        <span className="text-xs text-slate-400">({count})</span>
      )}
    </div>
  );
};