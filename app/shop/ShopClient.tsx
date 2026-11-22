'use client';

import React, { useState, useEffect } from 'react';
import { Filter, ArrowUpDown, X, Search, Check, Zap, ShieldCheck, Truck, Wrench } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { ProductCardSkeleton } from '@/components/SkeletonLoader';
import { getProducts, getCategories } from '@/lib/db';
import { Product, Category } from '@/lib/types';

interface ShopProps {
  initialProducts?: Product[];
  initialTotalCount?: number;
  initialCategories?: Category[];
}

export default function ShopClient({
  initialProducts = [],
  initialTotalCount = 0,
  initialCategories = [],
}: ShopProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [totalCount, setTotalCount] = useState(initialTotalCount);
  const [loading, setLoading] = useState(false);

  // Filter States
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'price_asc' | 'price_desc'>('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Temporary mobile filter selection
  const [tempSelectedCat, setTempSelectedCat] = useState('');

  // Sync URL search params on client mount without bailing out static export
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const q = params.get('q') || '';
      const cat = params.get('category') || '';
      if (q) setSearch(q);
      if (cat) {
        setSelectedCat(cat);
        setTempSelectedCat(cat);
      }
    }
  }, []);

  // Load Categories on client if not provided
  useEffect(() => {
    if (categories.length === 0) {
      getCategories().then((cats) => setCategories(cats));
    }
  }, [categories.length]);

  // Fetch Products on client filter changes (Strictly 8 items per page)
  useEffect(() => {
    // Skip initial fetch if using pre-rendered data with defaults
    if (currentPage === 1 && !selectedCat && !search && sortBy === 'newest' && initialProducts.length > 0) {
      return;
    }

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
    <div className="space-y-8 pb-16">
      {/* 1. Header Bar with Semantic H1 (Fix 2 from Audit Report) */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-[11px] font-bold text-brand-600 uppercase tracking-wider block">
            Official Equipment Catalog
          </span>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
            Power Tools, Chainsaw Converters &amp; Workshop Machinery Pakistan
          </h1>
          <p className="text-xs md:text-sm text-slate-500">
            Showing {products.length} of {totalCount} verified products with 100% pure copper armatures.
          </p>
        </div>

        {/* Controls: Sort & Mobile Filter Trigger */}
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
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 shadow-2xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value as any);
                setCurrentPage(1);
              }}
              className="bg-transparent focus:outline-hidden text-xs font-bold text-slate-900 cursor-pointer"
            >
              <option value="newest">Sort: Newest First</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* 2. Main Layout: Desktop Sidebar Categories + Products Grid (Pre-rendered for Google) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-6 sticky top-28">
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
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors ${
                  selectedCat === ''
                    ? 'bg-slate-900 text-white font-bold shadow-xs'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span>All Departments</span>
                {selectedCat === '' && <Check className="w-4 h-4 text-brand-400" />}
              </button>

              {categories.map((cat) => (
                <div key={cat.id} className="space-y-1 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCat(cat.slug);
                      setCurrentPage(1);
                    }}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors ${
                      selectedCat === cat.slug
                        ? 'bg-slate-900 text-white font-bold shadow-xs'
                        : 'text-slate-800 hover:bg-slate-100'
                    }`}
                  >
                    <span>{cat.name}</span>
                    {selectedCat === cat.slug && <Check className="w-4 h-4 text-brand-400" />}
                  </button>

                  {/* Subcategories */}
                  {cat.subcategories && cat.subcategories.length > 0 && (
                    <div className="pl-4 space-y-0.5 border-l-2 border-slate-100 ml-3">
                      {cat.subcategories.map((sub) => (
                        <button
                          key={sub.id}
                          type="button"
                          onClick={() => {
                            setSelectedCat(sub.slug);
                            setCurrentPage(1);
                          }}
                          className={`w-full text-left px-3 py-1.5 rounded-lg text-[11px] flex items-center justify-between transition-colors ${
                            selectedCat === sub.slug
                              ? 'text-brand-700 font-bold bg-amber-50'
                              : 'text-slate-600 hover:text-brand-600 hover:bg-slate-50'
                          }`}
                        >
                          <span>• {sub.name}</span>
                          {selectedCat === sub.slug && <Check className="w-3.5 h-3.5 text-brand-600" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Products Grid Area */}
        <div className="lg:col-span-3 space-y-6">
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
              {Array(8)
                .fill(0)
                .map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-16 text-center border border-slate-200 shadow-xs space-y-3">
              <Wrench className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">No tools found matching your filter</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try clearing selected categories or searching for generic terms like &quot;drill&quot;, &quot;chainsaw&quot;, or &quot;plier&quot;.
              </p>
              <button
                type="button"
                onClick={handleResetFilters}
                className="mt-2 px-5 py-2.5 bg-brand-500 hover:bg-brand-600 text-slate-950 font-bold text-xs rounded-xl shadow-xs"
              >
                Reset All Filters
              </button>
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-6">
              <button
                type="button"
                disabled={currentPage <= 1 || loading}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 text-xs font-bold hover:bg-slate-50 disabled:opacity-40 transition-colors shadow-2xs"
              >
                Previous
              </button>
              <span className="text-xs font-bold text-slate-600 px-3">
                {currentPage} / {totalPages}
              </span>
              <button
                type="button"
                disabled={currentPage >= totalPages || loading}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 text-xs font-bold hover:bg-slate-50 disabled:opacity-40 transition-colors shadow-2xs"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 3. Semantic H2 Content Sections on /shop (Fix 2 from Audit Report) */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-slate-200">
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-brand-600 flex items-center justify-center">
            <Zap className="w-6 h-6" />
          </div>
          <h2 className="text-base font-black text-slate-900">
            Why Buy Tools from Techplus.pk?
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            Every tool in our catalog is benchmarked for commercial durability. We strictly reject cheap copper-clad aluminium (CCA) motors to ensure continuous torque under heavy loads.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="text-base font-black text-slate-900">
            100% Pure Copper Armatures &amp; Low Voltage Safety
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            Pakistani electrical grids experience frequent voltage fluctuations. Our pure copper windings withstand temperatures up to 200°C without burning out, guaranteeing years of service.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Truck className="w-6 h-6" />
          </div>
          <h2 className="text-base font-black text-slate-900">
            Nationwide Cash on Delivery with Parcel Open Checking
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            Order anywhere in Pakistan with transparent checking warranty. You are welcome to open the parcel upon arrival and verify the tool before paying the courier rider.
          </p>
        </div>
      </section>

      {/* 4. Mobile Filter Slide-Over Drawer */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            onClick={() => setIsMobileFilterOpen(false)}
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs"
          />
          <div className="absolute inset-y-0 right-0 w-4/5 max-w-sm bg-white shadow-2xl flex flex-col">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <span className="font-extrabold text-sm text-slate-900">Filter Departments</span>
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

            {/* Done Action Button */}
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
