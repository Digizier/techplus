'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Filter, SlidersHorizontal, ArrowUpDown, X, Search, Check } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { ProductCardSkeleton } from '@/components/SkeletonLoader';
import { getProducts, getCategories } from '@/lib/db';
import { Product, Category } from '@/lib/types';

function ShopContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const initialCategory = searchParams.get('category') || '';

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [search, setSearch] = useState(initialQuery);
  const [selectedCat, setSelectedCat] = useState<string>(initialCategory);
  const [sortBy, setSortBy] = useState<'newest' | 'price_asc' | 'price_desc'>('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Temporary mobile filter selection (applies only on clicking 'Done')
  const [tempSelectedCat, setTempSelectedCat] = useState<string>(initialCategory);

  // Load Categories once
  useEffect(() => {
    getCategories().then((cats) => setCategories(cats));
  }, []);

  // Fetch Products on filter changes (Strictly 8 items per page)
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const res = await getProducts({
        page: currentPage,
        limit: 8, // STRICT 8 items pagination
        categorySlug: selectedCat || undefined,
        searchQuery: search || undefined,
        sortBy,
      });

      setProducts(res.products);
      setTotalCount(res.totalCount);
      setLoading(false);
    }

    loadData();
  }, [currentPage, selectedCat, search, sortBy]);

  const totalPages = Math.ceil(totalCount / 8);

  const handleApplyMobileFilter = () => {
    setSelectedCat(tempSelectedCat);
    setCurrentPage(1);
    setIsMobileFilterOpen(false);
  };

  const handleResetFilters = () => {
    setSelectedCat('');
    setTempSelectedCat('');
    setSearch('');
    setCurrentPage(1);
    setIsMobileFilterOpen(false);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* 1. Header Bar */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
            Tool Catalog & Parts
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            Showing {products.length} of {totalCount} authentic products (8 items per page)
          </p>
        </div>

        {/* Controls: Search, Sort, Mobile Filter Trigger */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Mobile Filter Button */}
          <button
            type="button"
            onClick={() => {
              setTempSelectedCat(selectedCat);
              setIsMobileFilterOpen(true);
            }}
            className="lg:hidden flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold shadow-xs"
          >
            <Filter className="w-4 h-4" />
            <span>Filters {selectedCat ? '(1 Active)' : ''}</span>
          </button>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value as any);
                setCurrentPage(1);
              }}
              className="bg-transparent focus:outline-hidden text-xs font-bold text-slate-800 cursor-pointer"
            >
              <option value="newest">Sort: Newest First</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* 2. Main Layout: Desktop Sidebar Categories + Products Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Desktop Sidebar (No max-h-64 scroll traps; full open visibility) */}
        <div className="hidden lg:block bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-6 sticky top-28">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-extrabold text-sm text-slate-900 uppercase tracking-wider">
                Departments
              </h3>
              {selectedCat && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="text-[11px] font-bold text-red-500 hover:underline"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="space-y-1">
              <button
                type="button"
                onClick={() => {
                  setSelectedCat('');
                  setCurrentPage(1);
                }}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                  !selectedCat
                    ? 'bg-brand-500 text-slate-950 shadow-xs'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                All Products
              </button>

              {categories.map((cat) => (
                <div key={cat.id} className="pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCat(cat.slug);
                      setCurrentPage(1);
                    }}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors flex items-center justify-between ${
                      selectedCat === cat.slug
                        ? 'bg-brand-500 text-slate-950 shadow-xs'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span>{cat.name}</span>
                  </button>

                  {/* Subcategories (Openly rendered, no hidden scroll traps) */}
                  {cat.subcategories && cat.subcategories.length > 0 && (
                    <div className="pl-4 border-l-2 border-slate-100 ml-4 my-1 space-y-0.5">
                      {cat.subcategories.map((sub) => (
                        <button
                          key={sub.id}
                          type="button"
                          onClick={() => {
                            setSelectedCat(sub.slug);
                            setCurrentPage(1);
                          }}
                          className={`w-full text-left px-2.5 py-1.5 rounded-lg text-[11px] transition-colors block ${
                            selectedCat === sub.slug
                              ? 'text-brand-600 font-extrabold bg-amber-50'
                              : 'text-slate-500 hover:text-slate-900'
                          }`}
                        >
                          • {sub.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Products Grid (3 columns on Desktop, 2 on Mobile) */}
        <div className="lg:col-span-3 space-y-8">
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-4 md:gap-6">
              {Array(8)
                .fill(0)
                .map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-xs">
              <Search className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="font-bold text-slate-800 text-lg mb-1">No products found</h3>
              <p className="text-xs text-slate-500 mb-4">
                We couldn&apos;t find any items matching your filter criteria.
              </p>
              <button
                type="button"
                onClick={handleResetFilters}
                className="px-5 py-2.5 bg-brand-500 hover:bg-brand-600 text-slate-950 font-bold text-xs rounded-xl transition-colors shadow-xs"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-4 md:gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {/* Strict 8-Product Pagination Navigation */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-6 border-t border-slate-200">
              <button
                type="button"
                disabled={currentPage <= 1 || loading}
                onClick={() => {
                  setCurrentPage((p) => p - 1);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 text-xs font-bold hover:bg-slate-100 disabled:opacity-40 transition-colors"
              >
                Previous
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  type="button"
                  disabled={loading}
                  onClick={() => {
                    setCurrentPage(page);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`h-9 w-9 rounded-xl text-xs font-extrabold transition-all ${
                    page === currentPage
                      ? 'bg-brand-500 text-slate-950 shadow-sm'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                type="button"
                disabled={currentPage >= totalPages || loading}
                onClick={() => {
                  setCurrentPage((p) => p + 1);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 text-xs font-bold hover:bg-slate-100 disabled:opacity-40 transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 3. Mobile Filter Drawer (Ergonomic button selection with 'Done' button) */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            onClick={() => setIsMobileFilterOpen(false)}
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs"
          />
          <div className="absolute inset-y-0 right-0 w-4/5 max-w-sm bg-white shadow-2xl flex flex-col">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-brand-600" />
                <h3 className="font-bold text-sm text-slate-900">Filter Products</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsMobileFilterOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Select Department
              </h4>
              <div className="space-y-1.5">
                <button
                  type="button"
                  onClick={() => setTempSelectedCat('')}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between ${
                    tempSelectedCat === ''
                      ? 'bg-brand-500 text-slate-950 font-bold'
                      : 'bg-slate-50 text-slate-700'
                  }`}
                >
                  <span>All Products</span>
                  {tempSelectedCat === '' && <Check className="w-4 h-4" />}
                </button>

                {categories.map((cat) => (
                  <div key={cat.id} className="space-y-1">
                    <button
                      type="button"
                      onClick={() => setTempSelectedCat(cat.slug)}
                      className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between ${
                        tempSelectedCat === cat.slug
                          ? 'bg-brand-500 text-slate-950 font-bold'
                          : 'bg-slate-50 text-slate-700'
                      }`}
                    >
                      <span>{cat.name}</span>
                      {tempSelectedCat === cat.slug && <Check className="w-4 h-4" />}
                    </button>

                    {cat.subcategories && (
                      <div className="pl-4 space-y-1">
                        {cat.subcategories.map((sub) => (
                          <button
                            key={sub.id}
                            type="button"
                            onClick={() => setTempSelectedCat(sub.slug)}
                            className={`w-full text-left px-3 py-1.5 rounded-lg text-[11px] flex items-center justify-between ${
                              tempSelectedCat === sub.slug
                                ? 'text-brand-700 font-bold bg-amber-100/60'
                                : 'text-slate-600 bg-slate-50/50'
                            }`}
                          >
                            <span>• {sub.name}</span>
                            {tempSelectedCat === sub.slug && <Check className="w-3.5 h-3.5" />}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Done (X Products) Action Button */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex gap-2">
              <button
                type="button"
                onClick={handleResetFilters}
                className="px-4 py-3 bg-white border border-slate-200 text-slate-700 font-bold text-xs rounded-xl"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={handleApplyMobileFilter}
                className="flex-1 py-3 bg-brand-500 hover:bg-brand-600 text-slate-950 font-black text-xs rounded-xl shadow-xs"
              >
                Done (Apply Filter)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ShopClient() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading Catalog...</div>}>
      <ShopContent />
    </Suspense>
  );
}
