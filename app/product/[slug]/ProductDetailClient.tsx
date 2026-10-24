'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ChevronRight,
  ShoppingCart,
  Zap,
  Truck,
  ShieldCheck,
  RotateCcw,
  CheckCircle2,
  Minus,
  Plus,
  MessageCircle,
  Wrench,
  Package,
} from 'lucide-react';
import { Product } from '@/lib/types';
import { getProductBySlug, getProducts } from '@/lib/db';
import { resolveImageUrl } from '@/lib/image-utils';
import { useCart } from '@/lib/cart-context';
import { useSettings } from '@/lib/settings-context';
import ProductCard from '@/components/ProductCard';

export default function ProductDetailClient({ slug }: { slug: string }) {
  const router = useRouter();
  const { addToCart } = useCart();
  const { settings } = useSettings();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    async function loadProduct() {
      setLoading(true);
      const data = await getProductBySlug(slug);
      if (data) {
        setProduct(data);
        const initialImg = resolveImageUrl(
          data.thumbnail_url || (data.images && data.images[0]) || ''
        );
        setSelectedImage(initialImg);

        // Fetch related products from same category (reliably 4 items)
        let relatedList: Product[] = [];
        if (data.category_id) {
          const relatedRes = await getProducts({
            limit: 6,
            categoryId: data.category_id,
          });
          relatedList = relatedRes.products.filter((p) => p.id !== data.id);
        }

        // If fewer than 4 related items, backfill with top products
        if (relatedList.length < 4) {
          const fallbackRes = await getProducts({ limit: 6, sortBy: 'newest' });
          const existingIds = new Set([data.id, ...relatedList.map((p) => p.id)]);
          const backfill = fallbackRes.products.filter((p) => !existingIds.has(p.id));
          relatedList = [...relatedList, ...backfill];
        }

        setRelatedProducts(relatedList.slice(0, 4));
      }
      setLoading(false);
    }

    loadProduct();
  }, [slug]);

  if (loading) {
    return (
      <div className="py-12 space-y-6 animate-pulse">
        <div className="h-6 bg-slate-200 rounded w-1/4 mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="aspect-square bg-slate-200 rounded-3xl" />
          <div className="space-y-4">
            <div className="h-8 bg-slate-200 rounded w-3/4" />
            <div className="h-6 bg-slate-200 rounded w-1/3" />
            <div className="h-24 bg-slate-200 rounded" />
            <div className="h-12 bg-slate-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="py-20 text-center bg-white rounded-3xl border border-slate-100 p-8">
        <Wrench className="w-16 h-16 text-slate-300 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-slate-900 mb-2">Product Not Found</h2>
        <p className="text-sm text-slate-500 mb-6">
          The requested product may have been moved or removed from our catalog.
        </p>
        <Link
          href="/shop"
          className="px-6 py-2.5 bg-brand-500 text-slate-950 font-bold text-sm rounded-xl shadow-xs inline-block"
        >
          Return to Catalog
        </Link>
      </div>
    );
  }

  const hasDiscount = product.regular_price && product.regular_price > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.regular_price! - product.price) / product.regular_price!) * 100)
    : 0;

  const galleryImages = Array.from(
    new Set(
      [product.thumbnail_url, ...(product.images || [])]
        .filter(Boolean)
        .map((img) => resolveImageUrl(img))
    )
  );

  const handleAddToCart = () => {
    setIsAdding(true);
    addToCart(product, quantity, true);
    setTimeout(() => setIsAdding(false), 600);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, false);
    router.push('/checkout');
  };

  const whatsappOrderUrl = `https://wa.me/92${settings.whatsapp_number.replace(/^0/, '')}?text=${encodeURIComponent(
    `Assalam-o-Alaikum Techplus.pk, I want to order:\n\n*Product:* ${product.title}\n*Price:* Rs. ${product.price.toLocaleString()}\n*Quantity:* ${quantity}\n*URL:* https://techplus.pk/product/${product.slug}`
  )}`;

  return (
    <div className="space-y-12 pb-16">
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
        <span className="text-slate-900 font-bold truncate max-w-xs">{product.title}</span>
      </nav>

      {/* 2. Main Product Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 bg-white rounded-3xl p-6 md:p-10 border border-slate-100 shadow-xs items-start">
        {/* Left: Image Gallery */}
        <div className="space-y-4">
          {/* Main Selected Image */}
          <div className="relative aspect-square bg-slate-50 rounded-2xl border border-slate-100 p-6 flex items-center justify-center overflow-hidden">
            {hasDiscount && (
              <span className="absolute top-4 left-4 z-10 bg-red-600 text-white text-xs font-black px-3 py-1 rounded-full shadow-sm tracking-wide">
                SAVE {discountPercent}%
              </span>
            )}
            <img
              src={selectedImage || '/images/products/Polish_20201014_203208731-removebg-preview.png'}
              alt={product.title}
              className="max-h-full max-w-full object-contain transition-transform duration-300 hover:scale-105"
            />
          </div>

          {/* Gallery Thumbnails */}
          {galleryImages.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
              {galleryImages.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setSelectedImage(img)}
                  className={`w-16 h-16 rounded-xl border-2 p-1 bg-slate-50 shrink-0 transition-all ${
                    selectedImage === img
                      ? 'border-brand-500 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-contain" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Details & Purchase Form */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                <CheckCircle2 className="w-3.5 h-3.5" /> In Stock & Ready to Dispatch
              </span>
              {product.sku && (
                <span className="text-xs text-slate-400 font-mono">
                  SKU: {product.sku}
                </span>
              )}
            </div>

            <h1 className="text-xl md:text-3xl font-black text-slate-900 leading-snug">
              {product.title}
            </h1>
          </div>

          {/* Pricing */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-baseline gap-3">
            <span className="text-2xl md:text-4xl font-black text-slate-900">
              Rs. {product.price.toLocaleString()}
            </span>
            {hasDiscount && (
              <span className="text-sm md:text-base text-slate-400 line-through font-semibold">
                Rs. {product.regular_price!.toLocaleString()}
              </span>
            )}
            {hasDiscount && (
              <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-md">
                Save Rs. {(product.regular_price! - product.price).toLocaleString()}
              </span>
            )}
          </div>

          {/* Quantity Selector */}
          <div className="flex items-center gap-4 pt-2">
            <span className="text-xs font-bold text-slate-700">Quantity:</span>
            <div className="flex items-center border border-slate-300 rounded-xl bg-white overflow-hidden shadow-xs">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="px-3 py-2 text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="px-4 py-1 text-sm font-bold text-slate-900">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="px-3 py-2 text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
            <span className="text-xs text-slate-400">
              Total: <strong>Rs. {(product.price * quantity).toLocaleString()}</strong>
            </span>
          </div>

          {/* Action CTAs */}
          <div className="space-y-3 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={handleAddToCart}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl border-2 border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white font-extrabold text-sm transition-all"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>{isAdding ? 'Added to Cart!' : 'Add to Cart'}</span>
              </button>

              <button
                type="button"
                onClick={handleBuyNow}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-brand-500 hover:bg-brand-600 text-slate-950 font-black text-sm shadow-md hover:shadow-lg transition-all"
              >
                <Zap className="w-4 h-4 fill-current" />
                <span>Buy Now (Instant Checkout)</span>
              </button>
            </div>

            {/* WhatsApp Direct Order Button */}
            <a
              href={whatsappOrderUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>Order via WhatsApp (Quick Dispatch)</span>
            </a>
          </div>

          {/* Delivery & Assurance Badges */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-100 text-center">
            <div className="p-3 bg-slate-50 rounded-xl">
              <Truck className="w-5 h-5 text-brand-600 mx-auto mb-1" />
              <div className="text-[11px] font-bold text-slate-800">Fast Delivery</div>
              <div className="text-[10px] text-slate-400">2-5 Working Days</div>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
              <ShieldCheck className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
              <div className="text-[11px] font-bold text-slate-800">100% Genuine</div>
              <div className="text-[10px] text-slate-400">Pure Copper Quality</div>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
              <Package className="w-5 h-5 text-blue-600 mx-auto mb-1" />
              <div className="text-[11px] font-bold text-slate-800">Cash on Delivery</div>
              <div className="text-[10px] text-slate-400">Pay at Your Doorstep</div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Detailed Description Section */}
      <div className="bg-white rounded-3xl p-6 md:p-10 border border-slate-100 shadow-xs space-y-4">
        <h2 className="text-lg md:text-xl font-black text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
          <Wrench className="w-5 h-5 text-brand-600" />
          <span>Product Specifications & Description</span>
        </h2>
        <div className="text-xs md:text-sm text-slate-700 leading-relaxed whitespace-pre-line space-y-2">
          {product.description || product.short_description || 'Authentic industrial grade tool with full copper winding.'}
        </div>
      </div>

      {/* 4. Related Products */}
      {relatedProducts.length > 0 && (
        <section className="space-y-6">
          <h2 className="text-xl md:text-2xl font-black text-slate-900">
            Customers Also Explored
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {relatedProducts.slice(0, 4).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
