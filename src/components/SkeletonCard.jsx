import React from 'react';

export const SkeletonCard = () => {
  return (
    <div className="w-full p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 shadow-sm flex flex-col justify-between h-[280px]">
      <div>
        {/* Company info shimmer */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl shimmer" />
            <div className="flex flex-col gap-2">
              <div className="h-4 w-28 rounded-md shimmer" />
              <div className="h-3 w-16 rounded-md shimmer" />
            </div>
          </div>
          <div className="h-8 w-8 rounded-full shimmer" />
        </div>

        {/* Job title shimmer */}
        <div className="flex flex-col gap-2 mb-4">
          <div className="h-5 w-4/5 rounded-md shimmer" />
          <div className="h-3.5 w-1/2 rounded-md shimmer" />
        </div>

        {/* Details tags shimmer */}
        <div className="flex flex-wrap gap-2 mb-4">
          <div className="h-6 w-16 rounded-full shimmer" />
          <div className="h-6 w-20 rounded-full shimmer" />
          <div className="h-6 w-14 rounded-full shimmer" />
        </div>
      </div>

      {/* Card footer shimmer */}
      <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-700/60 pt-4 mt-auto">
        <div className="h-5 w-24 rounded-md shimmer" />
        <div className="h-8 w-20 rounded-lg shimmer" />
      </div>
    </div>
  );
};
export default SkeletonCard;
