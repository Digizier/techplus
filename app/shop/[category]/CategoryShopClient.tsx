'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronRight, Wrench, ArrowUpDown, Filter } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { ProductCardSkeleton } from '@/components/SkeletonLoader';
import { getProducts, getCategories } from '@/lib/db';
import { Product, Category } from '@/lib/types';

export default function CategoryShopClient({ categorySlug }: { categorySlug: string }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<'newest' | 'price_asc' | 'price_desc'>('newest');

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const [cats, productsRes] = await Promise.all([
        getCategories(),
        getProducts({
          page: currentPage,
          limit: 8, // STRICT 8 items pagination
          categorySlug,
          sortBy,
        }),
      ]);

      setCategories(cats);
      setProducts(productsRes.products);
      setTotalCount(productsRes.totalCount);

      // Find active category
      let found: Category | null = null;
      for (const c of cats) {
        if (c.slug === categorySlug) {
          found = c;
          break;
        }
        if (c.subcategories) {
          const sub = c.subcategories.find((s) => s.slug === categorySlug);
          if (sub) {
            found = sub;
            break;
          }
        }
      }
      setCurrentCategory(found);
      setLoading(false);
    }

    loadData();
  }, [categorySlug, currentPage, sortBy]);

  const totalPages = Math.ceil(totalCount / 8);

  const categoryTitle = currentCategory?.name || categorySlug.replace(/-/g, ' ');

  return (
    <div className="space-y-6 pb-16">
      {/* 1. Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 font-medium">
        <Link href="/" className="hover:text-slate-900">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
        <Link href="/shop" className="hover:text-slate-900">
          Shop
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
        <span className="text-slate-900 font-bold capitalize">{categoryTitle}</span>
      </nav>

      {/* 2. Category Header */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-brand-600 tracking-wider uppercase">
            Department Catalog
          </span>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight capitalize">
            {categoryTitle}
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            {currentCategory?.description ||
              `Browse heavy duty ${categoryTitle} with pure copper winding and guaranteed performance.`}
          </p>
        </div>

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

      {/* 3. Subcategories Quick Pills (if any) */}
      {currentCategory?.subcategories && currentCategory.subcategories.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1">
            Sub-Models:
          </span>
          {currentCategory.subcategories.map((sub) => (
            <Link
              key={sub.id}
              href={`/shop/${sub.slug}`}
              className="px-3.5 py-1.5 bg-white border border-slate-200 hover:border-brand-500 rounded-xl text-xs font-semibold text-slate-700 hover:text-brand-600 transition-colors shadow-2xs shrink-0"
            >
              {sub.name}
            </Link>
          ))}
        </div>
      )}

      {/* 4. Products Grid (Strictly 8 items per page) */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
          {Array(8)
            .fill(0)
            .map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 text-center border border-slate-100 shadow-xs">
          <Wrench className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="font-bold text-slate-800 text-lg mb-1">No items currently in this department</h3>
          <p className="text-xs text-slate-500 mb-4">
            Check out our other tool categories or return to the main shop.
          </p>
          <Link
            href="/shop"
            className="px-5 py-2.5 bg-brand-500 hover:bg-brand-600 text-slate-950 font-bold text-xs rounded-xl inline-block shadow-xs transition-colors"
          >
            Browse All Tools
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {/* 5. Pagination Navigation */}
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
  );
}
