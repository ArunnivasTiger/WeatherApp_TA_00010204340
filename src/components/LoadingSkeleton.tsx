import React from 'react';

export const LoadingSkeleton: React.FC = () => {
  return (
    <div id="weather-loading-skeleton" className="space-y-6 animate-pulse">
      {/* Current weather card skeleton */}
      <div className="rounded-3xl bg-slate-900/60 border border-slate-800 p-6 sm:p-8 space-y-6">
        <div className="flex justify-between items-center pb-6 border-b border-slate-800">
          <div className="space-y-2">
            <div className="h-4 w-28 bg-slate-800 rounded-md" />
            <div className="h-8 w-48 bg-slate-800 rounded-lg" />
          </div>
          <div className="h-6 w-32 bg-slate-800 rounded-full" />
        </div>

        <div className="py-4 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-slate-800 rounded-2xl" />
            <div className="space-y-3">
              <div className="h-12 w-32 bg-slate-800 rounded-lg" />
              <div className="h-5 w-40 bg-slate-800 rounded-md" />
            </div>
          </div>
          <div className="h-16 w-48 bg-slate-800 rounded-2xl" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-slate-800">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 bg-slate-800/60 rounded-2xl p-4" />
          ))}
        </div>
      </div>

      {/* Forecast skeleton */}
      <div className="rounded-3xl bg-slate-900/60 border border-slate-800 p-6 space-y-4">
        <div className="h-6 w-36 bg-slate-800 rounded-md" />
        <div className="space-y-3 pt-2">
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div key={i} className="h-12 bg-slate-800/40 rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
};
