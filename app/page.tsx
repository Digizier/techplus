'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Wrench,
  Zap,
  ArrowRight,
  ShieldCheck,
  Truck,
  Sparkles,
  Flame,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Clock,
  PhoneCall,
} from 'lucide-react';
import HeroBanner from '@/components/HeroBanner';
import ProductCard from '@/components/ProductCard';
import { ProductCardSkeleton } from '@/components/SkeletonLoader';
import { getProducts, getCategories } from '@/lib/db';
import { Product, Category } from '@/lib/types';
import { useSettings } from '@/lib/settings-context';

export default function HomePage() {
  const { settings } = useSettings();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [discountProducts, setDiscountProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Active Category Filter for Home Products Grid
  const [selectedCatSlug, setSelectedCatSlug] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Refs for smooth horizontal scrolling
  const categoryScrollRef = useRef<HTMLDivElement>(null);
  const brandScrollRef = useRef<HTMLDivElement>(null);

  // Fetch initial data
  useEffect(() => {
    async function loadInitial() {
      try {
        const [cats, productsRes] = await Promise.all([
          getCategories(),
          getProducts({ page: 1, limit: 8 }),
        ]);

        setCategories(cats);
        setFeaturedProducts(productsRes.products);
        setTotalCount(productsRes.totalCount);

        // Fetch products with discounts for Flash Sale section
        const saleRes = await getProducts({ limit: 4, sortBy: 'price_desc' });
        setDiscountProducts(saleRes.products);
      } catch (err) {
        console.error('Home load error:', err);
      } finally {
        setLoading(false);
      }
    }

    loadInitial();

    const handleUpdate = () => {
      loadInitial();
    };
    window.addEventListener('tp_products_updated', handleUpdate);
    window.addEventListener('tp_categories_updated', handleUpdate);
    return () => {
      window.removeEventListener('tp_products_updated', handleUpdate);
      window.removeEventListener('tp_categories_updated', handleUpdate);
    };
  }, []);

  // Filter ONLY main parent categories that have show_on_home !== false
  const homeCategories = categories.filter(
    (c) => !c.parent_id && c.show_on_home !== false
  );

  const scrollContainer = (ref: React.RefObject<HTMLDivElement | null>, direction: 'left' | 'right') => {
    if (ref.current) {
      const scrollAmount = direction === 'left' ? -280 : 280;
      ref.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Fetch products when category tab or page changes (strict 8 items per page)
  const handleCategoryTabChange = async (slug: string) => {
    setSelectedCatSlug(slug);
    setCurrentPage(1);
    setLoading(true);

    const res = await getProducts({
      page: 1,
      limit: 8,
      categorySlug: slug === 'all' ? undefined : slug,
    });
    setFeaturedProducts(res.products);
    setTotalCount(res.totalCount);
    setLoading(false);
  };

  const handlePageChange = async (newPage: number) => {
    setCurrentPage(newPage);
    setLoading(true);

    const res = await getProducts({
      page: newPage,
      limit: 8,
      categorySlug: selectedCatSlug === 'all' ? undefined : selectedCatSlug,
    });
    setFeaturedProducts(res.products);
    setTotalCount(res.totalCount);
    setLoading(false);

    // Smooth scroll to top of catalog section
    const el = document.getElementById('featured-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const totalPages = Math.ceil(totalCount / 8);

  const brandLogos = [
    { name: 'Dawlance', file: 'Dawlance-logo.png' },
    { name: 'Gree', file: 'Gree-logo.png' },
    { name: 'Haier', file: 'Haier-logo.png' },
    { name: 'Kenwood', file: 'Kenwood-logo.png' },
    { name: 'LG', file: 'LG-logo.png' },
    { name: 'Mitsubishi', file: 'mitsubishi-logo.png' },
    { name: 'PEL', file: 'Pel-logo.png' },
    { name: 'Samsung', file: 'samsung-logo.png' },
    { name: 'TCL', file: 'TCL-logo.png' },
    { name: 'Acson', file: 'Acson-logo.png' },
    { name: 'Daikin', file: 'dikin1-logo.png' },
  ];

  return (
    <div className="space-y-8 md:space-y-14 pb-8 md:pb-12">
      {/* 1. Dynamic Hero Banner (Pure Responsive Image - No text overlay) */}
      <HeroBanner />

      {/* 2. Top Categories Section (Scrollable: 2.5 on mobile, fixed if <= 4 on desktop) */}
      <section className="relative">
        <div className="flex items-end justify-between mb-4">
          <div>
            <span className="text-xs font-bold text-brand-600 tracking-wider uppercase">
              Top Departments
            </span>
            <h2 className="text-lg md:text-2xl font-black text-slate-900 tracking-tight">
              Explore Main Categories
            </h2>
          </div>

          <div className="flex items-center gap-2">
            {/* Scroll Navigation Arrows (visible if > 4 on desktop or always handy) */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => scrollContainer(categoryScrollRef, 'left')}
                className="p-1.5 md:p-2 bg-white hover:bg-slate-100 text-slate-700 rounded-full border border-slate-200 shadow-2xs transition-colors"
                aria-label="Scroll Categories Left"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => scrollContainer(categoryScrollRef, 'right')}
                className="p-1.5 md:p-2 bg-white hover:bg-slate-100 text-slate-700 rounded-full border border-slate-200 shadow-2xs transition-colors"
                aria-label="Scroll Categories Right"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <Link
              href="/shop"
              className="text-xs md:text-sm font-bold text-brand-600 hover:text-brand-700 flex items-center gap-0.5 ml-2"
            >
              <span>View All</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Categories Display */}
        {/* On mobile: shows ~2.5 cards (w-[38vw]), touch scrollable with finger */}
        {/* On desktop: if <= 4 categories, clean 4-column grid; if > 4, smooth horizontal slider */}
        <div
          ref={categoryScrollRef}
          className={
            homeCategories.length <= 4
              ? 'hidden md:grid md:grid-cols-4 gap-4'
              : 'hidden md:flex md:items-stretch md:gap-4 md:overflow-x-auto md:scrollbar-none md:py-1'
          }
        >
          {homeCategories.map((cat) => (
            <Link
              key={cat.id}
              href={`/shop/${cat.slug}`}
              className={`group bg-white p-4 rounded-2xl border border-slate-100 hover:border-brand-400 hover:shadow-lg transition-all duration-300 text-center flex flex-col items-center justify-between shrink-0 ${
                homeCategories.length > 4 ? 'w-[220px]' : 'w-full'
              }`}
            >
              <div className="w-14 h-14 rounded-2xl bg-amber-50 group-hover:bg-brand-500/10 flex items-center justify-center text-brand-600 mb-3 transition-colors">
                <Wrench className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-xs md:text-sm text-slate-900 group-hover:text-brand-600 transition-colors line-clamp-1 mb-1">
                {cat.name}
              </h3>
              <span className="text-[10px] text-slate-400 font-medium">
                {cat.subcategories?.length || 0} sub-models
              </span>
            </Link>
          ))}
        </div>

        {/* Mobile View: Exactly 2.5 cards visible for intuitive finger swiping */}
        <div
          ref={categoryScrollRef}
          className="flex md:hidden items-stretch gap-3 overflow-x-auto snap-x snap-mandatory scrollbar-none pb-2 pt-1 -mx-4 px-4"
        >
          {homeCategories.map((cat) => (
            <Link
              key={cat.id}
              href={`/shop/${cat.slug}`}
              className="w-[38vw] min-w-[130px] max-w-[155px] snap-start shrink-0 group bg-white p-3.5 rounded-2xl border border-slate-100 hover:border-brand-400 hover:shadow-md transition-all text-center flex flex-col items-center justify-between"
            >
              <div className="w-12 h-12 rounded-xl bg-amber-50 group-hover:bg-brand-500/10 flex items-center justify-center text-brand-600 mb-2 transition-colors">
                <Wrench className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-xs text-slate-900 group-hover:text-brand-600 transition-colors line-clamp-1 mb-0.5">
                {cat.name}
              </h3>
              <span className="text-[10px] text-slate-400 font-medium">
                {cat.subcategories?.length || 0} sub-models
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. Flash Sale / Hot Deals Spotlight (2 PRODUCTS PER ROW ON MOBILE) */}
      <section className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 rounded-2xl md:rounded-3xl p-4 md:p-8 text-white relative overflow-hidden border border-slate-800">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-red-500/20 text-red-400 rounded-full text-[10px] md:text-xs font-black tracking-wider uppercase mb-1">
              <Flame className="w-3.5 h-3.5 fill-current" />
              <span>LIMITED TIME SPECIAL OFFERS</span>
            </div>
            <h2 className="text-xl md:text-3xl font-black text-white">
              Flash Deals &amp; Converter Kits
            </h2>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold bg-white/10 px-3 py-1.5 rounded-xl backdrop-blur-xs border border-white/10">
            <Clock className="w-3.5 h-3.5 text-brand-400" />
            <span>Fast Dispatch Across Pakistan</span>
          </div>
        </div>

        {/* 2 PRODUCTS IN ONE ROW ON MOBILE AS REQUESTED */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 relative z-10">
          {loading ? (
            Array(4)
              .fill(0)
              .map((_, i) => <ProductCardSkeleton key={i} />)
          ) : (
            discountProducts.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          )}
        </div>
      </section>

      {/* 4. Products Catalog Section with 8-Product Pagination */}
      <section id="featured-section">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
          <div>
            <span className="text-xs font-bold text-brand-600 tracking-wider uppercase">
              Verified Stock
            </span>
            <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
              Featured Tools &amp; Accessories
            </h2>
          </div>

          {/* Department Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
            <button
              type="button"
              onClick={() => handleCategoryTabChange('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                selectedCatSlug === 'all'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              All Items
            </button>
            {categories.slice(0, 4).map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleCategoryTabChange(cat.slug)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  selectedCatSlug === cat.slug
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* 8 Products Grid (2 on mobile, 3-4 on desktop) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
          {loading ? (
            Array(8)
              .fill(0)
              .map((_, i) => <ProductCardSkeleton key={i} />)
          ) : featuredProducts.length === 0 ? (
            <div className="col-span-full py-16 text-center bg-white rounded-3xl border border-slate-100">
              <Wrench className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="font-bold text-slate-800 text-base mb-1">No products found</h3>
              <p className="text-xs text-slate-500">Try selecting another department or explore all tools.</p>
            </div>
          ) : (
            featuredProducts.map((p) => <ProductCard key={p.id} product={p} />)
          )}
        </div>

        {/* Strict 8-Product Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            <button
              type="button"
              disabled={currentPage <= 1 || loading}
              onClick={() => handlePageChange(currentPage - 1)}
              className="px-3.5 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-xs font-bold hover:bg-slate-100 disabled:opacity-40 transition-colors"
            >
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                type="button"
                disabled={loading}
                onClick={() => handlePageChange(page)}
                className={`h-8 w-8 rounded-xl text-xs font-extrabold transition-all ${
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
              onClick={() => handlePageChange(currentPage + 1)}
              className="px-3.5 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-xs font-bold hover:bg-slate-100 disabled:opacity-40 transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </section>

      {/* 5. Services Spotlight (AC, Solar, Appliances) */}
      <section className="bg-amber-500/10 border border-amber-500/30 rounded-2xl md:rounded-3xl p-5 md:p-8">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-amber-500 text-slate-950 rounded-full text-[10px] md:text-xs font-black uppercase">
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>ISLAMABAD &amp; RAWALPINDI SERVICES</span>
            </div>
            <h2 className="text-xl md:text-2xl font-black text-slate-900 leading-tight">
              Looking for AC Service or Solar System Installation?
            </h2>
            <p className="text-xs md:text-sm text-slate-700 max-w-xl">
              Get high-pressure water gun AC cleaning, appliance troubleshooting, and certified GoodWe solar system setups with verified technicians and warranty coverage.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 shrink-0 w-full sm:w-auto">
            <Link
              href="/services"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow transition-colors text-center"
            >
              <span>Book A Service</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href={`tel:${settings.helpline_phone}`}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-white hover:bg-slate-50 text-slate-900 font-bold text-xs rounded-xl border border-slate-200 shadow-xs transition-colors text-center"
            >
              <PhoneCall className="w-4 h-4 text-brand-600" />
              <span>{settings.helpline_phone}</span>
            </a>
          </div>
        </div>
      </section>

      {/* 6. Authorized Brands - SINGLE SCROLLABLE ROW AS REQUESTED */}
      <section className="bg-white rounded-2xl md:rounded-3xl p-5 md:p-6 border border-slate-100 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-extrabold text-slate-500 uppercase tracking-widest">
            Authorized Brands &amp; Genuine Parts
          </h3>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => scrollContainer(brandScrollRef, 'left')}
              className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full transition-colors"
              aria-label="Scroll Brands Left"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => scrollContainer(brandScrollRef, 'right')}
              className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full transition-colors"
              aria-label="Scroll Brands Right"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Single Scrollable Row for Brands */}
        <div
          ref={brandScrollRef}
          className="flex items-center gap-3 overflow-x-auto scrollbar-none py-1 -mx-2 px-2 snap-x"
        >
          {brandLogos.map((brand, i) => (
            <div
              key={i}
              className="p-3 bg-slate-50/80 rounded-xl border border-slate-100 flex items-center justify-center h-14 w-28 md:w-32 shrink-0 snap-start hover:bg-white hover:shadow-2xs transition-all"
            >
              <img
                src={`/images/brands/${brand.file}`}
                alt={brand.name}
                className="max-h-8 max-w-full object-contain grayscale hover:grayscale-0 transition-all opacity-75 hover:opacity-100"
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
