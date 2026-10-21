'use client';

import React from 'react';
import Link from 'next/link';
import { Wrench, Home, Search, ArrowRight } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center py-16 px-4">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-100 shadow-sm text-center space-y-5">
        <div className="w-16 h-16 bg-amber-50 text-brand-600 rounded-3xl flex items-center justify-center mx-auto shadow-inner">
          <Wrench className="w-8 h-8" />
        </div>

        <div>
          <span className="text-4xl md:text-5xl font-black text-slate-900 font-mono block">
            404
          </span>
          <h1 className="text-xl font-bold text-slate-900 mt-2">
            Page or Part Not Found
          </h1>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            The page you are looking for might have been moved, renamed, or is temporarily unavailable.
          </p>
        </div>

        <div className="pt-2 space-y-2">
          <Link
            href="/"
            className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 bg-brand-500 hover:bg-brand-600 text-slate-950 font-bold text-xs rounded-xl shadow-xs transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>Return to Homepage</span>
          </Link>

          <Link
            href="/shop"
            className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors"
          >
            <Search className="w-4 h-4" />
            <span>Browse All Tools</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
