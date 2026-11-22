'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ChevronRight,
  Wrench,
  ArrowUpDown,
  ShieldCheck,
  Truck,
  Zap,
  CheckCircle2,
  PhoneCall,
  MessageCircle,
} from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { ProductCardSkeleton } from '@/components/SkeletonLoader';
import { getProducts } from '@/lib/db';
import { Product, Category } from '@/lib/types';
import { getCategoryGuide } from '@/lib/category-content';
import { useSettings } from '@/lib/settings-context';

export default function CategoryShopClient({
  categorySlug,
  initialCategory = null,
  initialProducts = [],
  initialTotalCount = 0,
  initialCategories = [],
  fallbackProducts = [],
}: {
  categorySlug: string;
  initialCategory?: Category | null;
  initialProducts?: Product[];
  initialTotalCount?: number;
  initialCategories?: Category[];
  fallbackProducts?: Product[];
}) {
  const { settings } = useSettings();
  const guide = getCategoryGuide(categorySlug);

  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [totalCount, setTotalCount] = useState(initialTotalCount);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(initialCategory);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<'newest' | 'price_asc' | 'price_desc'>('newest');

  // Load active category and filter updates on client navigation
  useEffect(() => {
    // Only re-fetch if user interacts (changes page or sort)
    if (currentPage === 1 && sortBy === 'newest' && initialProducts.length > 0) {
      return;
    }

    async function loadData() {
      setLoading(true);
      const res = await getProducts({
        page: currentPage,
        limit: 8,
        categorySlug,
        sortBy,
      });

      setProducts(res.products);
      setTotalCount(res.totalCount);
      setLoading(false);
    }

    loadData();
  }, [categorySlug, currentPage, sortBy]);

  const totalPages = Math.ceil(totalCount / 8);
  const categoryTitle = currentCategory?.name || guide.heroHeading;

  const whatsappInquiryUrl = `https://wa.me/92${settings.whatsapp_number.replace(/^0/, '')}?text=${encodeURIComponent(
    `Assalam-o-Alaikum Techplus.pk, I am inquiring about products and stock for: ${categoryTitle}`
  )}`;

  return (
    <div className="space-y-8 pb-16">
      {/* 1. Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 font-medium">
        <Link href="/" className="hover:text-slate-900 transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
        <Link href="/shop" className="hover:text-slate-900 transition-colors">
          Shop
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
        <span className="text-slate-900 font-bold capitalize">{categoryTitle}</span>
      </nav>

      {/* 2. Category Header with Unique Humanized Introduction & H1 */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 md:p-10 border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="space-y-2 max-w-3xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-brand-700 rounded-full text-xs font-bold uppercase tracking-wider border border-brand-200">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>{guide.heroBadge}</span>
            </span>

            {/* Semantic H1 */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
              {guide.heroHeading}
            </h1>

            {/* Unique 150-250 Word Introduction */}
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal pt-1">
              {guide.intro}
            </p>

            {/* Popular Use Tags */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Common Applications:
              </span>
              {guide.popularUses.map((use, uIdx) => (
                <span
                  key={uIdx}
                  className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg text-[11px] font-semibold"
                >
                  {use}
                </span>
              ))}
            </div>
          </div>

          {/* Sort Dropdown */}
          <div className="shrink-0 flex items-center gap-2 bg-slate-50 border border-slate-200 px-3.5 py-2.5 rounded-2xl text-xs font-semibold text-slate-700 shadow-2xs self-start">
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

        {/* Subcategories Quick Pills (if any) */}
        {currentCategory?.subcategories && currentCategory.subcategories.length > 0 && (
          <div className="pt-3 border-t border-slate-100 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1">
              Explore Sub-Categories:
            </span>
            {currentCategory.subcategories.map((sub) => (
              <Link
                key={sub.id}
                href={`/shop/${sub.slug}`}
                className="px-3.5 py-1.5 bg-slate-50 hover:bg-brand-50 border border-slate-200 hover:border-brand-400 rounded-xl text-xs font-semibold text-slate-700 hover:text-brand-700 transition-colors shadow-2xs shrink-0"
              >
                {sub.name}
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* 3. Products Grid (Pre-rendered for Google) */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-black text-slate-900">
            Available {categoryTitle} ({totalCount} Items)
          </h2>
          <span className="text-xs text-slate-500 font-medium">
            Page {currentPage} of {totalPages || 1}
          </span>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4 md:gap-6">
            {Array(8)
              .fill(0)
              .map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4 md:gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          /* Empty / In-Transit Department Custom Fallback - Never Show a Dead-End Page */
          <div className="space-y-8">
            <div className="bg-white rounded-3xl p-8 sm:p-12 text-center border border-slate-200 shadow-xs space-y-4 max-w-2xl mx-auto">
              <div className="w-14 h-14 bg-amber-50 text-brand-600 rounded-2xl flex items-center justify-center mx-auto">
                <Wrench className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-black text-slate-900">
                Fresh Inventory Arriving for {categoryTitle}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-md mx-auto">
                Our workshop is restocking tested models this week. Need a specific tool, branded surplus unit, or custom electrical component immediately? Contact our master technician directly.
              </p>
              <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                <a
                  href={whatsappInquiryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Inquire on WhatsApp</span>
                </a>
                <a
                  href={`tel:${settings.helpline_phone}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>Call {settings.helpline_phone}</span>
                </a>
              </div>
            </div>

            {fallbackProducts.length > 0 && (
              <div className="space-y-4 pt-4">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                  Popular Power Tools Available for Immediate Dispatch:
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4 md:gap-6">
                  {fallbackProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </div>
            )}
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
      </section>

      {/* 4. Semantic H2 Content Sections (Fix 2 & Fix 4 from Audit Report) */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-slate-200">
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-brand-600 flex items-center justify-center">
            <Zap className="w-6 h-6" />
          </div>
          {/* Semantic H2 #1 */}
          <h2 className="text-base font-black text-slate-900">{guide.h2Features}</h2>
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            {guide.h2FeaturesText}
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          {/* Semantic H2 #2 */}
          <h2 className="text-base font-black text-slate-900">{guide.h2Quality}</h2>
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            {guide.h2QualityText}
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Truck className="w-6 h-6" />
          </div>
          {/* Semantic H2 #3 */}
          <h2 className="text-base font-black text-slate-900">{guide.h2Delivery}</h2>
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            {guide.h2DeliveryText}
          </p>
        </div>
      </section>
    </div>
  );
}
