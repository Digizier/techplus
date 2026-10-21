'use client';

import React from 'react';

export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-100 p-2.5 sm:p-3.5 md:p-4 shadow-2xs overflow-hidden relative flex flex-col justify-between h-full">
      <div className="relative w-full h-32 sm:h-40 md:h-48 bg-slate-100 rounded-lg sm:rounded-xl overflow-hidden mb-2">
        <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/40 to-transparent" />
      </div>
      <div className="h-3.5 bg-slate-100 rounded w-1/3 mb-1.5 relative overflow-hidden">
        <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/40 to-transparent" />
      </div>
      <div className="h-8 sm:h-9 bg-slate-100 rounded w-full mb-2 relative overflow-hidden">
        <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/40 to-transparent" />
      </div>
      <div className="pt-2 border-t border-slate-100">
        <div className="h-5 bg-slate-100 rounded w-1/2 mb-2 relative overflow-hidden">
          <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/40 to-transparent" />
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          <div className="h-7 bg-slate-100 rounded-lg relative overflow-hidden">
            <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/40 to-transparent" />
          </div>
          <div className="h-7 bg-slate-100 rounded-lg relative overflow-hidden">
            <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/40 to-transparent" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function BannerSkeleton() {
  return (
    <div className="w-full h-[360px] md:h-[480px] bg-slate-200 rounded-3xl relative overflow-hidden my-4">
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/30 to-transparent" />
    </div>
  );
}

export function CategoryPillSkeleton() {
  return (
    <div className="h-10 w-28 bg-slate-100 rounded-xl relative overflow-hidden">
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/40 to-transparent" />
    </div>
  );
}
