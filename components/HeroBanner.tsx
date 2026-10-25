'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Banner } from '@/lib/types';
import { getBanners } from '@/lib/db';
import { BannerSkeleton } from './SkeletonLoader';

export default function HeroBanner() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchBanners = () => {
    getBanners().then((data) => {
      setBanners(data);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchBanners();

    const handleBannerUpdate = () => {
      fetchBanners();
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

  const displayBanners: Banner[] =
    banners.length > 0
      ? banners
      : [
          {
            id: 'fallback-1',
            title: '',
            desktop_image_url: '/images/banners/banner-1.svg',
            mobile_image_url: '/images/banners/banner-1.svg',
            link_url: '/shop/power-tools',
            button_text: '',
            display_order: 1,
            is_active: true,
          },
        ];

  const currentBanner = displayBanners[currentIndex] || displayBanners[0];

  return (
    <div className="relative w-full rounded-2xl md:rounded-3xl overflow-hidden shadow-md my-3 md:my-5 bg-slate-950 group">
      {/* Banner is PURE IMAGE ONLY (No HTML text overlay, No edge cropping) */}
      <Link
        href={currentBanner.link_url || '/shop'}
        className="block relative w-full aspect-[1920/640] overflow-hidden"
      >
        <picture>
          <source
            media="(max-width: 768px)"
            srcSet={currentBanner.mobile_image_url || currentBanner.desktop_image_url}
          />
          <img
            src={currentBanner.desktop_image_url}
            alt={currentBanner.title ? `${currentBanner.title} - Techplus.pk Heavy Duty Tools` : 'Techplus.pk - Heavy Duty Power Tools, Chainsaw Converters & Repair Services in Pakistan'}
            className="w-full h-full object-contain md:object-cover transition-all duration-700 select-none"
            loading="eager"
          />
        </picture>
      </Link>

      {/* Navigation Arrows (visible on hover or tap) */}
      {displayBanners.length > 1 && (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setCurrentIndex(
                (prev) => (prev - 1 + displayBanners.length) % displayBanners.length
              );
            }}
            className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-20 p-2 md:p-2.5 bg-slate-950/70 hover:bg-slate-900 text-white rounded-full backdrop-blur-xs transition-all border border-white/10 opacity-70 group-hover:opacity-100"
            aria-label="Previous Banner"
          >
            <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setCurrentIndex((prev) => (prev + 1) % displayBanners.length);
            }}
            className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-20 p-2 md:p-2.5 bg-slate-950/70 hover:bg-slate-900 text-white rounded-full backdrop-blur-xs transition-all border border-white/10 opacity-70 group-hover:opacity-100"
            aria-label="Next Banner"
          >
            <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
          </button>
        </>
      )}

      {/* Pagination Indicators */}
      {displayBanners.length > 1 && (
        <div className="absolute bottom-2 md:bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 md:gap-2 bg-slate-950/40 px-3 py-1 rounded-full backdrop-blur-xs">
          {displayBanners.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setCurrentIndex(i);
              }}
              className={`h-1.5 md:h-2 rounded-full transition-all duration-300 ${
                i === currentIndex ? 'w-6 md:w-8 bg-brand-500' : 'w-1.5 md:w-2 bg-white/50'
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
