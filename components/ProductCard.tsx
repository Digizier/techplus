'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Zap, CheckCircle2 } from 'lucide-react';
import { Product } from '@/lib/types';
import { useCart } from '@/lib/cart-context';
import { resolveImageUrl } from '@/lib/image-utils';

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
  const rawImage =
    product.thumbnail_url ||
    (product.images && product.images.length > 0 ? product.images[0] : '');
  const imageUrl = resolveImageUrl(rawImage);

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
    <div className="group bg-white rounded-xl sm:rounded-2xl border border-slate-100 hover:border-brand-300 shadow-2xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between overflow-hidden relative h-full">
      {/* Discount Badge */}
      {hasDiscount && (
        <span className="absolute top-2 left-2 sm:top-2.5 sm:left-2.5 z-10 bg-red-600 text-white text-[9px] sm:text-[11px] font-black px-1.5 sm:px-2 py-0.5 rounded-full shadow-2xs tracking-tight">
          SAVE {discountPercent}%
        </span>
      )}

      {/* Product Image */}
      <Link
        href={`/product/${product.slug}`}
        className="relative w-full h-32 sm:h-40 md:h-48 bg-slate-50 flex items-center justify-center p-2.5 sm:p-3.5 md:p-4 overflow-hidden block shrink-0"
      >
        {!imageLoaded && (
          <div className="absolute inset-0 bg-slate-100 overflow-hidden">
            <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/50 to-transparent" />
          </div>
        )}
        <img
          src={imageUrl}
          alt={`${product.title} - Techplus Pakistan Power Tools`}
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
          className={`max-h-full max-w-full object-contain transform group-hover:scale-105 transition-transform duration-300 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      </Link>

      {/* Product Details */}
      <div className="p-2.5 sm:p-3.5 md:p-4 flex flex-col flex-grow justify-between">
        <div>
          <div className="flex items-center justify-between text-[10px] sm:text-xs text-slate-400 mb-1 font-medium">
            <span className="truncate uppercase tracking-wider text-[9px] sm:text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-600 font-semibold max-w-[85px] sm:max-w-[110px]">
              {product.category?.name || 'Tools'}
            </span>
            <span className="flex items-center gap-0.5 sm:gap-1 text-emerald-600 font-bold text-[9px] sm:text-[11px] shrink-0">
              <CheckCircle2 className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> In Stock
            </span>
          </div>

          <Link href={`/product/${product.slug}`} className="block">
            <h3 className="font-bold text-slate-900 text-xs sm:text-sm line-clamp-2 group-hover:text-brand-600 transition-colors leading-tight h-8 sm:h-9">
              {product.title}
            </h3>
          </Link>
        </div>

        {/* Pricing & CTA */}
        <div className="pt-2 sm:pt-2.5 border-t border-slate-100 mt-2 sm:mt-2.5">
          <div className="flex items-baseline gap-1.5 mb-2 sm:mb-2.5">
            <span className="text-sm sm:text-base md:text-lg font-black text-slate-900 tracking-tight">
              Rs. {product.price.toLocaleString()}
            </span>
            {hasDiscount && (
              <span className="text-[10px] sm:text-xs text-slate-400 line-through">
                Rs. {product.regular_price!.toLocaleString()}
              </span>
            )}
          </div>

          {/* Action Buttons: Add to Cart & Buy Now */}
          <div className="grid grid-cols-2 gap-1.5">
            <button
              type="button"
              onClick={handleAddToCart}
              className="w-full flex items-center justify-center gap-1 py-1.5 px-1.5 rounded-lg border border-slate-200 hover:border-slate-800 text-slate-800 hover:text-slate-900 font-bold text-[10px] sm:text-xs transition-colors bg-white hover:bg-slate-50"
            >
              <ShoppingCart className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span>{isAdding ? 'Added!' : 'Cart'}</span>
            </button>

            <button
              type="button"
              onClick={handleBuyNow}
              className="w-full flex items-center justify-center gap-1 py-1.5 px-1.5 rounded-lg bg-brand-500 hover:bg-brand-600 text-slate-950 font-black text-[10px] sm:text-xs shadow-2xs hover:shadow-xs transition-all"
            >
              <Zap className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current" />
              <span>Buy Now</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
