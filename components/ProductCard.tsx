'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Zap, CheckCircle2 } from 'lucide-react';
import { Product } from '@/lib/types';
import { useCart } from '@/lib/cart-context';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();
  const { addToCart } = useCart();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  // Calculate discount percentage
  const hasDiscount =
    product.regular_price && product.regular_price > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.regular_price! - product.price) / product.regular_price!) * 100)
    : 0;

  // Fallback image handler
  const imageUrl =
    product.thumbnail_url ||
    (product.images && product.images.length > 0 ? product.images[0] : '') ||
    '/images/products/Polish_20201014_203208731-removebg-preview.png';

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAdding(true);
    addToCart(product, 1, true);
    setTimeout(() => setIsAdding(false), 600);
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1, false);
    router.push('/checkout');
  };

  return (
    <div className="group bg-white rounded-2xl border border-slate-100 hover:border-brand-300 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden relative">
      {/* Discount Badge */}
      {hasDiscount && (
        <span className="absolute top-3 left-3 z-10 bg-red-600 text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm tracking-wide">
          SAVE {discountPercent}%
        </span>
      )}

      {/* Product Image with Flash Effect Loading */}
      <Link
        href={`/product/${product.slug}`}
        className="relative w-full aspect-square bg-slate-50 flex items-center justify-center p-4 overflow-hidden block"
      >
        {!imageLoaded && (
          <div className="absolute inset-0 bg-slate-100 overflow-hidden">
            <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/50 to-transparent" />
          </div>
        )}
        <img
          src={imageUrl}
          alt={product.title}
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
          className={`max-h-full max-w-full object-contain transform group-hover:scale-105 transition-transform duration-500 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      </Link>

      {/* Product Details */}
      <div className="p-4 flex flex-col flex-grow justify-between">
        <div>
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5 font-medium">
            <span className="truncate uppercase tracking-wider text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-600">
              {product.category?.name || 'Tools'}
            </span>
            <span className="flex items-center gap-1 text-emerald-600 font-semibold">
              <CheckCircle2 className="w-3 h-3" /> In Stock
            </span>
          </div>

          <Link href={`/product/${product.slug}`} className="block">
            <h3 className="font-bold text-slate-900 text-sm md:text-base line-clamp-2 group-hover:text-brand-600 transition-colors leading-snug">
              {product.title}
            </h3>
          </Link>
        </div>

        {/* Pricing & CTA */}
        <div className="pt-3 border-t border-slate-100 mt-3">
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-lg md:text-xl font-extrabold text-slate-900">
              Rs. {product.price.toLocaleString()}
            </span>
            {hasDiscount && (
              <span className="text-xs md:text-sm text-slate-400 line-through">
                Rs. {product.regular_price!.toLocaleString()}
              </span>
            )}
          </div>

          {/* Action Buttons: Add to Cart & Buy Now */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleAddToCart}
              className="w-full flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl border border-slate-200 hover:border-slate-800 text-slate-800 hover:text-slate-900 font-semibold text-xs transition-colors bg-white hover:bg-slate-50"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>{isAdding ? 'Added!' : 'Cart'}</span>
            </button>

            <button
              type="button"
              onClick={handleBuyNow}
              className="w-full flex items-center justify-center gap-1 py-2 px-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-slate-950 font-bold text-xs shadow-sm hover:shadow transition-all"
            >
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>Buy Now</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
