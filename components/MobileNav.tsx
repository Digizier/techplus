'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Grid, ShoppingCart, MessageCircle, Truck } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { useSettings } from '@/lib/settings-context';

export default function MobileNav() {
  const pathname = usePathname();
  const { itemCount, setIsDrawerOpen } = useCart();
  const { settings } = useSettings();

  // If in admin panel, do NOT show storefront mobile navigation
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const whatsappUrl = `https://wa.me/92${settings.whatsapp_number.replace(/^0/, '')}?text=${encodeURIComponent(
    'Assalam-o-Alaikum Techplus.pk, I need information regarding your products.'
  )}`;

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 px-2 py-1.5 md:hidden shadow-lg">
      <div className="grid grid-cols-5 items-center text-center">
        {/* 1. Home */}
        <Link
          href="/"
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition-colors ${
            pathname === '/' ? 'text-brand-600 font-bold' : 'text-slate-500'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Home</span>
        </Link>

        {/* 2. Shop */}
        <Link
          href="/shop"
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition-colors ${
            pathname?.startsWith('/shop') ? 'text-brand-600 font-bold' : 'text-slate-500'
          }`}
        >
          <Grid className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Catalog</span>
        </Link>

        {/* 3. WhatsApp Center Button */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center -mt-4"
        >
          <div className="w-12 h-12 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-lg border-2 border-white transform active:scale-95 transition-transform">
            <MessageCircle className="w-6 h-6 fill-current" />
          </div>
          <span className="text-[10px] font-bold text-emerald-600 mt-0.5">WhatsApp</span>
        </a>

        {/* 4. Cart Button */}
        <button
          type="button"
          onClick={() => setIsDrawerOpen(true)}
          className="flex flex-col items-center justify-center py-1 text-slate-500 relative"
        >
          <div className="relative">
            <ShoppingCart className="w-5 h-5" />
            {itemCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-brand-500 text-slate-950 font-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center border border-white">
                {itemCount}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-0.5">Cart</span>
        </button>

        {/* 5. Track Order */}
        <Link
          href="/order-tracking"
          prefetch={false}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition-colors ${
            pathname === '/order-tracking' ? 'text-brand-600 font-bold' : 'text-slate-500'
          }`}
        >
          <Truck className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Track</span>
        </Link>
      </div>
    </div>
  );
}
