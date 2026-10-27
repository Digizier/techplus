'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search,
  ShoppingCart,
  MessageCircle,
  Menu,
  X,
  ChevronDown,
  Wrench,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { useSettings } from '@/lib/settings-context';
import { Category } from '@/lib/types';
import { getCategories } from '@/lib/db';
import SmartSearch from './SmartSearch';

export default function Header() {
  const router = useRouter();
  const { itemCount, setIsDrawerOpen } = useCart();
  const { settings } = useSettings();

  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);

  useEffect(() => {
    getCategories().then((data) => setCategories(data));

    const handleCategoryUpdate = () => {
      getCategories().then((data) => setCategories(data));
    };
    window.addEventListener('tp_categories_updated', handleCategoryUpdate);
    return () => {
      window.removeEventListener('tp_categories_updated', handleCategoryUpdate);
    };
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  const whatsappUrl = `https://wa.me/92${settings.whatsapp_number.replace(/^0/, '')}?text=${encodeURIComponent(
    'Assalam-o-Alaikum Techplus.pk, I need assistance with your products and services.'
  )}`;

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-100 shadow-xs">
      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 md:py-4 flex items-center justify-between gap-3 md:gap-6">
        {/* Mobile Hamburger Button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(true)}
          className="lg:hidden p-2 text-slate-700 hover:text-slate-950 hover:bg-slate-100 rounded-xl transition-colors"
          aria-label="Open Menu"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <img
            src="/images/logo.png"
            alt="Techplus.pk - Heavy Duty Power Tools, Chainsaw Converters & Repair Services Pakistan"
            width={160}
            height={48}
            className="h-10 md:h-12 w-auto object-contain"
          />
        </Link>

        {/* Global Smart Search Bar (Desktop with live Hinglish & product suggestions) */}
        <div className="hidden md:flex flex-1 max-w-xl">
          <SmartSearch />
        </div>

        {/* Actions: WhatsApp Contact & Cart */}
        <div className="flex items-center gap-2 md:gap-4 shrink-0">
          {/* WhatsApp Direct Help (Desktop) */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-2 text-xs font-semibold px-3 py-2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl hover:bg-emerald-100 transition-colors"
          >
            <MessageCircle className="w-4 h-4 text-emerald-600 fill-emerald-100" />
            <div className="text-left leading-tight">
              <span className="block text-[10px] text-emerald-600 font-medium">WhatsApp Support</span>
              <span>{settings.whatsapp_number}</span>
            </div>
          </a>

          {/* Cart Drawer Trigger Button */}
          <button
            type="button"
            onClick={() => setIsDrawerOpen(true)}
            className="relative flex items-center gap-2 px-3.5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl shadow-sm hover:shadow transition-all group"
          >
            <ShoppingCart className="w-5 h-5 text-brand-400 group-hover:scale-110 transition-transform" />
            <span className="hidden sm:inline text-xs font-bold">Cart</span>
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-brand-500 text-slate-950 text-[11px] font-black h-5 w-5 rounded-full flex items-center justify-center border-2 border-white shadow-xs">
                {itemCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* 3. Mobile Search Bar (Below Header on phones with live dropdown) */}
      <div className="md:hidden px-4 pb-3">
        <SmartSearch isMobile />
      </div>

      {/* 4. Desktop Categories & Department Bar */}
      <div className="hidden lg:block bg-slate-50/80 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between text-xs font-semibold text-slate-700">
          <div className="flex items-center gap-1">
            {/* All Categories Dropdown Trigger */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
                className="flex items-center gap-2 py-3 px-4 bg-brand-500 text-slate-950 font-bold hover:bg-brand-600 transition-colors rounded-t-lg"
              >
                <Wrench className="w-4 h-4" />
                <span>All Departments</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {/* Mega/Dropdown Menu */}
              {categoryDropdownOpen && (
                <div
                  onMouseLeave={() => setCategoryDropdownOpen(false)}
                  className="absolute left-0 top-full w-72 bg-white border border-slate-200 shadow-xl rounded-b-2xl py-2 z-50 animate-fadeIn"
                >
                  {categories.map((cat) => (
                    <div key={cat.id} className="group/item">
                      <Link
                        href={`/shop/${cat.slug}`}
                        onClick={() => setCategoryDropdownOpen(false)}
                        className="flex items-center justify-between px-4 py-2.5 text-slate-800 hover:bg-brand-50 hover:text-brand-700 transition-colors font-medium text-xs"
                      >
                        <span>{cat.name}</span>
                        {cat.subcategories && cat.subcategories.length > 0 && (
                          <span className="text-[10px] text-slate-400 group-hover/item:text-brand-600">
                            {cat.subcategories.length} sub
                          </span>
                        )}
                      </Link>

                      {/* Nested subcategories */}
                      {cat.subcategories && cat.subcategories.length > 0 && (
                        <div className="pl-6 bg-slate-50/50 py-1 border-l-2 border-brand-300 ml-4 mb-1">
                          {cat.subcategories.map((sub) => (
                            <Link
                              key={sub.id}
                              href={`/shop/${sub.slug}`}
                              onClick={() => setCategoryDropdownOpen(false)}
                              className="block py-1 px-3 text-[11px] text-slate-600 hover:text-brand-600 hover:underline"
                            >
                              • {sub.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                  <div className="border-t border-slate-100 mt-2 pt-2 px-4">
                    <Link
                      href="/shop"
                      onClick={() => setCategoryDropdownOpen(false)}
                      className="text-brand-600 font-bold text-xs hover:underline block py-1"
                    >
                      Browse Entire Catalog →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Department Links */}
            <Link
              href="/shop"
              className="py-3 px-3 hover:text-brand-600 transition-colors"
            >
              All Products
            </Link>
            <Link
              href="/shop/power-tools"
              className="py-3 px-3 hover:text-brand-600 transition-colors"
            >
              Power Tools
            </Link>
            <Link
              href="/shop/tool-converters"
              className="py-3 px-3 hover:text-brand-600 transition-colors"
            >
              Chainsaw & Grinder Converters
            </Link>
            <Link
              href="/shop/hand-tools"
              className="py-3 px-3 hover:text-brand-600 transition-colors"
            >
              Hand Tools
            </Link>
            <Link
              href="/services"
              className="py-3 px-3 hover:text-brand-600 transition-colors flex items-center gap-1.5 text-slate-900 font-bold"
            >
              <Zap className="w-3.5 h-3.5 text-amber-500 fill-current" />
              <span>Our Services</span>
            </Link>
          </div>

          <div className="flex items-center gap-4 text-slate-500">
            <Link href="/profile" className="hover:text-slate-900 transition-colors font-medium">
              Company Profile
            </Link>
            <Link href="/about-us" className="hover:text-slate-900 transition-colors">
              About
            </Link>
            <Link href="/contact-us" className="hover:text-slate-900 transition-colors">
              Contact & Store Location
            </Link>
          </div>
        </div>
      </div>

      {/* 5. Mobile Slide-Over Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            onClick={() => setMobileMenuOpen(false)}
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs"
          />
          <div className="absolute inset-y-0 left-0 w-4/5 max-w-sm bg-white shadow-2xl flex flex-col">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <img src="/images/logo.png" alt="Techplus.pk" width={120} height={36} className="h-8 w-auto object-contain" />
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <div>
                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Shop Departments
                </h4>
                <div className="space-y-1">
                  <Link
                    href="/shop"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 text-sm font-bold text-slate-900 hover:bg-brand-50 rounded-xl"
                  >
                    All Products Catalog
                  </Link>
                  {categories.map((cat) => (
                    <div key={cat.id}>
                      <Link
                        href={`/shop/${cat.slug}`}
                        onClick={() => setMobileMenuOpen(false)}
                        className="block px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-100 rounded-xl"
                      >
                        {cat.name}
                      </Link>
                      {cat.subcategories && cat.subcategories.length > 0 && (
                        <div className="pl-6 space-y-1 my-1">
                          {cat.subcategories.map((sub) => (
                            <Link
                              key={sub.id}
                              href={`/shop/${sub.slug}`}
                              onClick={() => setMobileMenuOpen(false)}
                              className="block py-1 text-xs text-slate-500 hover:text-brand-600"
                            >
                              • {sub.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Services & Info
                </h4>
                <div className="space-y-1 text-sm font-medium text-slate-700">
                  <Link
                    href="/services"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-xl hover:bg-slate-100 text-brand-600 font-bold"
                  >
                    Our Services (Solar, Electrical, AC)
                  </Link>
                  <Link
                    href="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-xl hover:bg-slate-100 font-bold text-slate-800"
                  >
                    Company Profile
                  </Link>
                  <Link
                    href="/order-tracking"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-xl hover:bg-slate-100"
                  >
                    Track Your Order
                  </Link>
                  <Link
                    href="/about-us"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-xl hover:bg-slate-100"
                  >
                    About Techplus.pk
                  </Link>
                  <Link
                    href="/contact-us"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-xl hover:bg-slate-100"
                  >
                    Contact & Shop Location
                  </Link>
                </div>
              </div>
            </div>

            {/* Mobile Drawer Footer with Helpline */}
            <div className="p-4 bg-slate-50 border-t border-slate-100">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-xs"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
