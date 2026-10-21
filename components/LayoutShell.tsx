'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Header from './Header';
import Footer from './Footer';
import MobileNav from './MobileNav';
import CartDrawer from './CartDrawer';
import WhatsAppFloat from './WhatsAppFloat';
import ScrollToTop from './ScrollToTop';

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin');

  if (isAdminRoute) {
    // Admin Panel is 100% isolated: NO storefront header, NO storefront footer, NO mobile bottom nav, NO floating WhatsApp
    return (
      <main className="min-h-screen bg-slate-100 text-slate-900 font-sans">
        <ScrollToTop />
        {children}
      </main>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-brand-500 selection:text-slate-950">
      <ScrollToTop />
      <Header />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-4 md:py-6">
        {children}
      </main>
      <Footer />
      <MobileNav />
      <CartDrawer />
      <WhatsAppFloat />
    </div>
  );
}
