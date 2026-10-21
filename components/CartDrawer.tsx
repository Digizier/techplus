'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Truck, Tag, Check } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { useSettings } from '@/lib/settings-context';
import { validateCoupon } from '@/lib/db';

export default function CartDrawer() {
  const router = useRouter();
  const { items, isDrawerOpen, setIsDrawerOpen, updateQuantity, removeFromCart, subtotal, itemCount } = useCart();
  const { settings } = useSettings();

  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);
  const [couponMessage, setCouponMessage] = useState<{ text: string; isError: boolean } | null>(null);
  const [isApplying, setIsApplying] = useState(false);

  // Free shipping calculations
  const threshold = settings.free_shipping_threshold || 3500;
  const isFreeShipping = subtotal >= threshold;
  const diffToFree = Math.max(0, threshold - subtotal);
  const progressPercent = Math.min(100, Math.round((subtotal / threshold) * 100));

  const shippingFee = items.length === 0 ? 0 : isFreeShipping ? 0 : (settings.base_shipping_fee || 250);
  const discountAmount = appliedCoupon ? appliedCoupon.discount : 0;
  const grandTotal = Math.max(0, subtotal + shippingFee - discountAmount);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;

    setIsApplying(true);
    setCouponMessage(null);

    const result = await validateCoupon(couponInput, subtotal);
    setIsApplying(false);

    if (result.isValid) {
      setAppliedCoupon({ code: couponInput.trim().toUpperCase(), discount: result.discount });
      setCouponMessage({ text: result.message, isError: false });
    } else {
      setCouponMessage({ text: result.message, isError: true });
    }
  };

  const handleCheckout = () => {
    setIsDrawerOpen(false);
    router.push('/checkout');
  };

  if (!isDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsDrawerOpen(false)}
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity animate-fadeIn"
      />

      {/* Drawer */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-4 md:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-brand-600" />
              <h2 className="text-lg font-bold text-slate-900">Your Cart</h2>
              <span className="bg-brand-100 text-brand-800 text-xs font-bold px-2 py-0.5 rounded-full">
                {itemCount} {itemCount === 1 ? 'item' : 'items'}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsDrawerOpen(false)}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Bar */}
          <div className="bg-amber-50/80 p-3.5 border-b border-amber-100">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-800 mb-1.5">
              <Truck className="w-4 h-4 text-brand-600 shrink-0" />
              {isFreeShipping ? (
                <span className="text-emerald-700 font-bold">
                  🎉 You have unlocked FREE Delivery!
                </span>
              ) : (
                <span>
                  Add <strong className="text-brand-700">Rs. {diffToFree.toLocaleString()}</strong> more to get <strong className="text-emerald-600">FREE Delivery</strong>
                </span>
              )}
            </div>
            <div className="w-full bg-amber-200/60 h-2 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 rounded-full ${
                  isFreeShipping ? 'bg-emerald-500' : 'bg-brand-500'
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 md:p-5 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-16 px-4">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                  <ShoppingBag className="w-10 h-10" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-1">Your cart is empty</h3>
                <p className="text-sm text-slate-500 mb-6">Explore our heavy duty tools and converters</p>
                <button
                  type="button"
                  onClick={() => setIsDrawerOpen(false)}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-brand-500 hover:bg-brand-600 text-slate-950 font-bold text-sm rounded-xl transition-colors shadow"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              items.map(({ product, quantity }) => (
                <div
                  key={product.id}
                  className="flex gap-3 p-3 bg-slate-50/80 rounded-2xl border border-slate-100 relative group"
                >
                  {/* Thumbnail */}
                  <div className="w-20 h-20 bg-white rounded-xl border border-slate-200 flex items-center justify-center p-1.5 shrink-0 overflow-hidden">
                    <img
                      src={product.thumbnail_url || '/images/products/Polish_20201014_203208731-removebg-preview.png'}
                      alt={product.title}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div className="pr-6">
                      <Link
                        href={`/product/${product.slug}`}
                        onClick={() => setIsDrawerOpen(false)}
                        className="text-xs md:text-sm font-bold text-slate-900 line-clamp-2 hover:text-brand-600 leading-snug"
                      >
                        {product.title}
                      </Link>
                      <div className="text-xs font-semibold text-slate-800 mt-1">
                        Rs. {product.price.toLocaleString()}
                      </div>
                    </div>

                    {/* Quantity Selector & Line Total */}
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-slate-300 rounded-lg bg-white overflow-hidden shadow-xs">
                        <button
                          type="button"
                          onClick={() => updateQuantity(product.id, quantity - 1)}
                          className="px-2 py-1 text-slate-600 hover:bg-slate-100 transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2.5 py-0.5 text-xs font-bold text-slate-800">
                          {quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(product.id, quantity + 1)}
                          className="px-2 py-1 text-slate-600 hover:bg-slate-100 transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="text-xs font-extrabold text-slate-900">
                        Rs. {(product.price * quantity).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={() => removeFromCart(product.id)}
                    className="absolute top-2.5 right-2.5 text-slate-400 hover:text-red-500 transition-colors p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer & Calculations */}
          {items.length > 0 && (
            <div className="p-4 md:p-5 border-t border-slate-100 bg-slate-50 space-y-3">
              {/* Promo Code Input */}
              <form onSubmit={handleApplyCoupon} className="space-y-1">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Promo code (e.g. WELCOME500)"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs uppercase font-medium focus:outline-hidden focus:border-brand-500"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isApplying || !couponInput.trim()}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl disabled:opacity-50 transition-colors"
                  >
                    {isApplying ? 'Applying...' : 'Apply'}
                  </button>
                </div>
                {couponMessage && (
                  <p
                    className={`text-[11px] font-medium ${
                      couponMessage.isError ? 'text-red-500' : 'text-emerald-600'
                    }`}
                  >
                    {couponMessage.text}
                  </p>
                )}
              </form>

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-200">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-900">Rs. {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping Fee</span>
                  <span className="font-semibold text-slate-900">
                    {shippingFee === 0 ? (
                      <span className="text-emerald-600 uppercase font-bold">Free</span>
                    ) : (
                      `Rs. ${shippingFee.toLocaleString()}`
                    )}
                  </span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Discount ({appliedCoupon.code})</span>
                    <span>-Rs. {appliedCoupon.discount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm md:text-base font-extrabold text-slate-900 pt-2 border-t border-slate-200">
                  <span>Grand Total</span>
                  <span className="text-brand-600">Rs. {grandTotal.toLocaleString()}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                type="button"
                onClick={handleCheckout}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-brand-500 hover:bg-brand-600 text-slate-950 font-extrabold text-sm rounded-xl shadow-md hover:shadow-lg transition-all"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <p className="text-center text-[10px] text-slate-400">
                Cash on Delivery, JazzCash & EasyPaisa available across Pakistan
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
