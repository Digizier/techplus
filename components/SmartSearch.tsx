'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, X, CheckCircle2, ArrowRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Product } from '@/lib/types';

// Common Pakistani Hinglish / Roman Urdu keywords dictionary
const HINGLISH_SYNONYMS: Record<string, string[]> = {
  drill: ['berma', 'barma', 'dril', 'machine', 'drilling', 'surakh'],
  chainsaw: ['ari', 'aari', 'saw', 'lakri', 'wood', 'converter', 'adapter', 'cutter', 'chainsaw'],
  plier: ['plas', 'plass', 'pliers', 'wire cutter', 'cheelna', 'taar', 'crimping'],
  polisher: ['polish', 'ragrai', 'buffing', 'shine', 'chamkana', 'car polish'],
  hammer: ['hilti', 'sds', 'rotary', 'concrete', 'chisel', 'pathar', 'impact'],
  cordless: ['battery', 'bina taar', 'chargeable', '18v', '21v', 'bnktop'],
  ac: ['service', 'water gun', 'washing gun', 'cooling', 'cleaning', 'gas'],
  solar: ['inverter', 'plate', 'goodwe', 'hybrid', 'on grid', 'solar system'],
};

// Expand user search query to include technical/English matching terms
function expandSearchTerms(rawQuery: string): string[] {
  const clean = rawQuery.toLowerCase().trim();
  const terms = new Set<string>([clean]);

  for (const [englishTerm, romanVariations] of Object.entries(HINGLISH_SYNONYMS)) {
    for (const v of romanVariations) {
      if (clean.includes(v)) {
        terms.add(englishTerm);
      }
    }
    if (clean.includes(englishTerm)) {
      romanVariations.forEach((v) => terms.add(v));
    }
  }

  return Array.from(terms);
}

interface SmartSearchProps {
  isMobile?: boolean;
  onNavigate?: () => void;
}

export default function SmartSearch({ isMobile = false, onNavigate }: SmartSearchProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced search query
  useEffect(() => {
    if (!query || query.trim().length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      const expandedTerms = expandSearchTerms(query);

      // Build Supabase OR filter for expanded terms
      const orClauses = expandedTerms
        .map((t) => `title.ilike.%${t}%,description.ilike.%${t}%,slug.ilike.%${t}%`)
        .join(',');

      const { data } = await supabase
        .from('products')
        .select('id, title, slug, price, regular_price, thumbnail_url, is_active')
        .eq('is_active', true)
        .or(orClauses)
        .limit(6);

      setResults((data as Product[]) || []);
      setIsOpen(true);
      setLoading(false);
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setIsOpen(false);
      router.push(`/shop?q=${encodeURIComponent(query.trim())}`);
      if (onNavigate) onNavigate();
    }
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <form onSubmit={handleSubmit} className="relative flex items-center">
        <input
          type="text"
          placeholder={
            isMobile
              ? 'Search (e.g. drill, ari, plas, saw...)'
              : 'Search products (e.g. drill machine, chainsaw converter, pliers, hilti)...'
          }
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            if (results.length > 0) setIsOpen(true);
          }}
          className={`w-full bg-slate-100/90 focus:bg-white border border-slate-200 focus:border-brand-500 rounded-full text-slate-800 placeholder-slate-400 focus:outline-hidden transition-all shadow-inner ${
            isMobile
              ? 'pl-9 pr-16 py-2 text-xs rounded-xl'
              : 'pl-11 pr-24 py-2.5 text-sm rounded-full'
          }`}
        />
        <Search
          className={`text-slate-400 absolute pointer-events-none ${
            isMobile ? 'w-4 h-4 left-3' : 'w-4 h-4 left-4'
          }`}
        />

        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setResults([]);
              setIsOpen(false);
            }}
            className={`absolute text-slate-400 hover:text-slate-600 ${
              isMobile ? 'right-12' : 'right-20'
            }`}
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}

        <button
          type="submit"
          className={`absolute bg-brand-500 hover:bg-brand-600 text-slate-950 font-bold transition-colors shadow-xs ${
            isMobile
              ? 'right-1 px-3 py-1 text-[11px] rounded-lg'
              : 'right-1.5 px-4 py-1.5 text-xs rounded-full'
          }`}
        >
          Go
        </button>
      </form>

      {/* Live Dropdown Suggestions */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50 animate-fadeIn">
          {loading ? (
            <div className="p-4 text-center text-xs text-slate-500 font-medium">
              Searching matched tools...
            </div>
          ) : results.length > 0 ? (
            <div>
              <div className="p-2.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-bold uppercase tracking-wider">
                <span>Matching Products ({results.length})</span>
                <span className="text-[10px] text-slate-400">Click to view</span>
              </div>

              <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
                {results.map((product) => (
                  <Link
                    key={product.id}
                    href={`/product/${product.slug}`}
                    onClick={() => {
                      setIsOpen(false);
                      if (onNavigate) onNavigate();
                    }}
                    className="flex items-center gap-3 p-3 hover:bg-amber-50/60 transition-colors group"
                  >
                    <div className="w-12 h-12 bg-white rounded-xl border border-slate-200 p-1 flex items-center justify-center shrink-0 overflow-hidden">
                      <img
                        src={
                          product.thumbnail_url ||
                          '/images/products/Polish_20201014_203208731-removebg-preview.png'
                        }
                        alt=""
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                    <div className="flex-1 min-w-0 text-left">
                      <h4 className="text-xs font-bold text-slate-900 truncate group-hover:text-brand-600">
                        {product.title}
                      </h4>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs font-black text-slate-900">
                          Rs. {product.price.toLocaleString()}
                        </span>
                        {product.regular_price && product.regular_price > product.price && (
                          <span className="text-[10px] text-slate-400 line-through">
                            Rs. {product.regular_price.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded shrink-0">
                      In Stock
                    </span>
                  </Link>
                ))}
              </div>

              <div className="p-2.5 bg-slate-50 border-t border-slate-100 text-center">
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center justify-center gap-1 mx-auto"
                >
                  <span>See all matching results for &quot;{query}&quot;</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="p-6 text-center text-xs text-slate-500">
              No matching products found for &quot;<strong>{query}</strong>&quot;.
              <div className="text-[11px] text-slate-400 mt-1">
                Try searching in English or Roman Urdu: <em>drill, ari, chainsaw, plas, cutter, hilti</em>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
