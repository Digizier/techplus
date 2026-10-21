'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { Banner } from '@/lib/types';
import { getBanners } from '@/lib/db';
import { BannerSkeleton } from './SkeletonLoader';

export default function HeroBanner() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBanners().then((data) => {
      setBanners(data);
      setLoading(false);
    });

    const handleBannerUpdate = () => {
      getBanners().then((data) => setBanners(data));
    };
    window.addEventListener('tp_banners_updated', handleBannerUpdate);
    return () => {
      window.removeEventListener('tp_banners_updated', handleBannerUpdate);
    };
  }, []);

  // Auto-slide every 6 seconds
  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [banners.length]);

  if (loading) {
    return <BannerSkeleton />;
  }

  // Fallback banner if none configured in admin
  const displayBanners: Banner[] =
    banners.length > 0
      ? banners
      : [
          {
            id: 'fallback-1',
            title: 'Professional Heavy-Duty Power Tools & Chainsaw Adapters',
            subtitle: '100% Genuine Copper Winding Rotary Drills, Cordless Kits & Adapters with 24-Hour Dispatch across Pakistan',
            desktop_image_url: '/images/hero-banner.png',
            mobile_image_url: '/images/hero-banner.png',
            link_url: '/shop',
            button_text: 'Explore All Tools',
            display_order: 1,
            is_active: true,
          },
        ];

  const currentBanner = displayBanners[currentIndex] || displayBanners[0];

  return (
    <div className="relative w-full rounded-3xl overflow-hidden shadow-md my-4 md:my-6 bg-slate-900">
      {/* Banner Slide */}
      <div className="relative min-h-[360px] md:min-h-[460px] flex items-center justify-between overflow-hidden">
        {/* Background Image / Overlay */}
        <div className="absolute inset-0 z-0">
          <picture>
            <source
              media="(max-width: 768px)"
              srcSet={currentBanner.mobile_image_url || currentBanner.desktop_image_url}
            />
            <img
              src={currentBanner.desktop_image_url}
              alt={currentBanner.title}
              className="w-full h-full object-cover object-center transform scale-102 transition-transform duration-1000"
            />
          </picture>
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-transparent" />
        </div>

        {/* Content Container */}
        <div className="relative z-10 max-w-2xl px-6 md:px-12 py-10 md:py-16 text-white">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-500/20 border border-brand-400/40 text-brand-300 rounded-full text-xs font-bold tracking-wide mb-4">
            <Zap className="w-3.5 h-3.5 fill-current text-brand-400" />
            <span>AUTHORISED TOOLS & REPAIR SOLUTIONS</span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-5xl font-black text-white leading-tight mb-4 tracking-tight drop-shadow-sm">
            {currentBanner.title}
          </h1>

          {currentBanner.subtitle && (
            <p className="text-xs sm:text-sm md:text-base text-slate-300 font-normal leading-relaxed mb-6 max-w-xl">
              {currentBanner.subtitle}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href={currentBanner.link_url || '/shop'}
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-brand-500 hover:bg-brand-600 text-slate-950 font-extrabold text-xs md:text-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
            >
              <span>{currentBanner.button_text || 'Shop Now'}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/services"
              className="inline-flex items-center gap-2 px-5 py-3.5 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs md:text-sm rounded-xl border border-white/20 backdrop-blur-xs transition-colors"
            >
              <span>AC & Solar Services</span>
            </Link>
          </div>
        </div>

        {/* Navigation Arrows */}
        {displayBanners.length > 1 && (
          <>
            <button
              type="button"
              onClick={() =>
                setCurrentIndex(
                  (prev) => (prev - 1 + displayBanners.length) % displayBanners.length
                )
              }
              className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2.5 bg-slate-950/60 hover:bg-slate-900 text-white rounded-full backdrop-blur-xs transition-all border border-white/10"
              aria-label="Previous Slide"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() =>
                setCurrentIndex((prev) => (prev + 1) % displayBanners.length)
              }
              className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2.5 bg-slate-950/60 hover:bg-slate-900 text-white rounded-full backdrop-blur-xs transition-all border border-white/10"
              aria-label="Next Slide"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Pagination Dots */}
        {displayBanners.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
            {displayBanners.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setCurrentIndex(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === currentIndex ? 'w-8 bg-brand-500' : 'w-2 bg-white/40'
                }`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
