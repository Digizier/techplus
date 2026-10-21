'use client';

import React from 'react';

export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm overflow-hidden relative">
      <div className="relative w-full aspect-square bg-slate-100 rounded-xl overflow-hidden mb-4">
        <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/40 to-transparent" />
      </div>
      <div className="h-4 bg-slate-100 rounded w-1/3 mb-2 relative overflow-hidden">
        <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/40 to-transparent" />
      </div>
      <div className="h-5 bg-slate-100 rounded w-4/5 mb-3 relative overflow-hidden">
        <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/40 to-transparent" />
      </div>
      <div className="flex items-center justify-between pt-2">
        <div className="h-6 bg-slate-100 rounded w-1/2 relative overflow-hidden">
          <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/40 to-transparent" />
        </div>
        <div className="h-9 w-20 bg-slate-100 rounded-lg relative overflow-hidden">
          <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/40 to-transparent" />
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
