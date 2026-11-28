'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  CheckCircle2,
  Zap,
  Wrench,
  Package,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import { Banner } from '@/lib/types';
import { getBanners } from '@/lib/db';

const DEFAULT_BANNERS: Banner[] = [
  {
    id: 'default-hero-products',
    title: 'Our Products',
    desktop_image_url: '/images/banners/banner-1.svg',
    mobile_image_url: '/images/banners/banner-1.svg',
    link_url: '/shop',
    button_text: 'Explore Our Products',
    display_order: 1,
    is_active: true,
  },
  {
    id: 'default-hero-services',
    title: 'Our Services',
    desktop_image_url: '/images/banners/banner-2.svg',
    mobile_image_url: '/images/banners/banner-2.svg',
    link_url: '/services',
    button_text: 'Explore Our Services',
    display_order: 2,
    is_active: true,
  },
  {
    id: 'default-hero-repair',
    title: 'Our Repair Services',
    desktop_image_url: '/images/banners/banner-3.svg',
    mobile_image_url: '/images/banners/banner-3.svg',
    link_url: '/services#repair-services',
    button_text: 'Book Appliance Repair',
    display_order: 3,
    is_active: true,
  },
];

function isBuiltInBannerUrl(url?: string | null): boolean {
  if (!url) return true;
  return (
    url.includes('/images/banners/banner-1.svg') ||
    url.includes('/images/banners/banner-2.svg') ||
    url.includes('/images/banners/banner-3.svg')
  );
}

export default function HeroBanner() {
  const [banners, setBanners] = useState<Banner[]>(DEFAULT_BANNERS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const fetchBanners = () => {
    getBanners().then((data) => {
      if (data && data.length > 0) {
        setBanners(data);
      }
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

  // Auto-slide every 6.5 seconds (pauses on hover/touch)
  useEffect(() => {
    if (banners.length <= 1 || isPaused) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 6500);
    return () => clearInterval(interval);
  }, [banners.length, isPaused]);

  const displayBanners: Banner[] = banners.length > 0 ? banners : DEFAULT_BANNERS;
  const safeIndex = currentIndex % displayBanners.length;
  const currentBanner = displayBanners[safeIndex] || displayBanners[0];

  // Determine which interactive built-in slide to show (if built-in SVG URLs are active)
  const isBuiltIn = isBuiltInBannerUrl(currentBanner.desktop_image_url);
  const slideType: 'products' | 'services' | 'repair' | 'custom' = !isBuiltIn
    ? 'custom'
    : currentBanner.desktop_image_url.includes('banner-2') ||
        currentBanner.link_url === '/services'
      ? 'services'
      : currentBanner.desktop_image_url.includes('banner-3') ||
          currentBanner.link_url?.includes('repair')
        ? 'repair'
        : safeIndex === 1
          ? 'services'
          : safeIndex === 2
            ? 'repair'
            : 'products';

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
      className="relative w-full rounded-2xl md:rounded-3xl overflow-hidden shadow-lg my-3 md:my-5 bg-slate-950 border border-slate-800/90 group"
    >
      {/* SLIDE 1: OUR PRODUCTS (/shop) */}
      {slideType === 'products' && (
        <Link
          href="/shop"
          className="block relative w-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white p-5 sm:p-8 md:px-12 md:py-9 transition-all"
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/12 rounded-full blur-3xl pointer-events-none" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 md:gap-8 items-center relative z-10">
            {/* Left Copy & Product List */}
            <div className="lg:col-span-7 space-y-3 sm:space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-500/20 border border-brand-500/40 text-brand-400 rounded-full text-[11px] sm:text-xs font-black uppercase tracking-wider">
                <Package className="w-3.5 h-3.5" />
                <span>100% Pure Copper Industrial Store</span>
              </div>

              <div>
                <h2 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-white uppercase leading-none">
                  OUR <span className="text-brand-400">PRODUCTS</span>
                </h2>
                <p className="text-xs sm:text-sm md:text-base text-slate-300 font-medium mt-2 max-w-xl">
                  Genuine heavy-duty power tools, drill machines, chainsaw converters &amp; electrician hand tools tested for Pakistani voltage.
                </p>
              </div>

              {/* Products Highlight Tags */}
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {[
                  '18V Cordless Drills',
                  '13mm Impact Drills',
                  '26mm Rotary Hilti',
                  'Chainsaw Converters',
                  'Electric Polishers',
                  'Pliers & Miter Shears',
                ].map((item) => (
                  <span
                    key={item}
                    className="px-2.5 py-1 bg-slate-900/90 border border-slate-700/80 text-slate-200 rounded-lg text-[11px] sm:text-xs font-semibold"
                  >
                    • {item}
                  </span>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <span className="inline-flex items-center gap-2 px-5 py-2.5 sm:py-3 bg-brand-500 group-hover:bg-brand-400 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-md transition-colors">
                  <span>Shop All Products</span>
                  <ArrowRight className="w-4 h-4" />
                </span>
                <span className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs text-emerald-400 font-bold">
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <span>Open Parcel Checking (COD)</span>
                </span>
              </div>
            </div>

            {/* Right Product Showcase Collage */}
            <div className="lg:col-span-5 grid grid-cols-3 gap-2 sm:gap-3">
              {[
                {
                  name: '13mm Hammer Drill',
                  img: '/images/products/bb0e10ce-0145-4100-b3f6-c763792ced0f.fit_2000_2C2000_ssl_1.png',
                },
                {
                  name: '10mm Copper Drill',
                  img: '/images/products/Polish_20201014_203208731-removebg-preview.resize_300_2C300_ssl_1.png',
                },
                {
                  name: '26mm Hilti Drill',
                  img: '/images/products/26mm-dewalt.resize_300_2C197_ssl_1.png',
                },
                {
                  name: 'Chainsaw Adapter',
                  img: '/images/products/collage.fit_1000_2C800_ssl_1.png',
                },
                {
                  name: '9-in-1 Pliers',
                  img: '/images/products/1000671311.resize_300_2C300_ssl_1.png',
                },
                {
                  name: 'Miter Shear',
                  img: '/images/products/90_degree_edge_tool-removebg-preview.resize_300_2C300_ssl_1.png',
                },
              ].map((prod) => (
                <div
                  key={prod.name}
                  className="bg-white/95 rounded-xl p-2 sm:p-2.5 flex flex-col items-center justify-between text-center border border-white/10 shadow-sm"
                >
                  <img
                    src={prod.img}
                    alt={prod.name}
                    width={100}
                    height={100}
                    style={{ aspectRatio: '1 / 1' }}
                    loading="eager"
                    fetchPriority="high"
                    className="w-12 h-12 sm:w-16 sm:h-16 object-contain"
                  />
                  <span className="text-[10px] sm:text-[11px] font-bold text-slate-900 leading-tight mt-1 line-clamp-1">
                    {prod.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Link>
      )}

      {/* SLIDE 2: OUR SERVICES (/services) */}
      {slideType === 'services' && (
        <Link
          href="/services"
          className="block relative w-full bg-gradient-to-br from-slate-950 via-emerald-950/50 to-slate-950 text-white p-5 sm:p-8 md:px-12 md:py-9 transition-all"
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/12 rounded-full blur-3xl pointer-events-none" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 md:gap-8 items-center relative z-10">
            {/* Left Copy & Full Services List */}
            <div className="lg:col-span-7 space-y-3 sm:space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 rounded-full text-[11px] sm:text-xs font-black uppercase tracking-wider">
                <Zap className="w-3.5 h-3.5 fill-current" />
                <span>Techplus Offering Services • Islamabad &amp; Rawalpindi</span>
              </div>

              <div>
                <h2 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-white uppercase leading-none">
                  OUR <span className="text-emerald-400">SERVICES</span>
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 font-medium mt-2">
                  20+ years wide field experience &amp; Solar EPC installations since 2018. Verified doorstep technicians.
                </p>
              </div>

              {/* All 7 Services Listed Clearly on Banner */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 sm:gap-2">
                {[
                  '01. Solar System Installation',
                  '02. Electrical Services',
                  '03. Air Conditioning',
                  '04. Plumbing & Core Cutting',
                  '05. CCTV & Biometric',
                  '06. PABX & Networking',
                  '07. Fire Alarm System',
                ].map((srv) => (
                  <span
                    key={srv}
                    className="px-2.5 py-1.5 bg-slate-900/90 border border-emerald-500/30 text-slate-100 rounded-lg text-[11px] sm:text-xs font-bold truncate"
                  >
                    ✓ {srv}
                  </span>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <span className="inline-flex items-center gap-2 px-5 py-2.5 sm:py-3 bg-emerald-500 group-hover:bg-emerald-400 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-md transition-colors">
                  <span>View Services &amp; Book Now</span>
                  <ArrowRight className="w-4 h-4" />
                </span>
                <span className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs text-brand-300 font-bold">
                  <Clock className="w-4 h-4 shrink-0" />
                  <span>Response Time: 15–30 Min</span>
                </span>
              </div>
            </div>

            {/* Right Work Showcase Picture */}
            <div className="lg:col-span-5 grid grid-cols-2 gap-2.5">
              <div className="relative rounded-xl overflow-hidden border border-slate-700 aspect-[4/3]">
                <img
                  src="/images/services/solar-installation.jpg"
                  alt="Solar System Installation Islamabad"
                  width={400}
                  height={300}
                  style={{ aspectRatio: '4 / 3' }}
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-1.5 left-1.5 px-2 py-0.5 bg-slate-950/85 text-brand-400 text-[10px] font-bold rounded">
                  Solar Since 2018
                </span>
              </div>
              <div className="relative rounded-xl overflow-hidden border border-slate-700 aspect-[4/3]">
                <img
                  src="/images/services/electrical-services.jpg"
                  alt="Licensed Electrician Services Islamabad"
                  width={400}
                  height={300}
                  style={{ aspectRatio: '4 / 3' }}
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-1.5 left-1.5 px-2 py-0.5 bg-slate-950/85 text-emerald-400 text-[10px] font-bold rounded">
                  20+ Yrs Electrical
                </span>
              </div>
              <div className="relative rounded-xl overflow-hidden border border-slate-700 aspect-[4/3]">
                <img
                  src="/images/services/air-conditioning.jpg"
                  alt="AC Water Gun Jet Service Islamabad"
                  width={400}
                  height={300}
                  style={{ aspectRatio: '4 / 3' }}
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-1.5 left-1.5 px-2 py-0.5 bg-slate-950/85 text-sky-400 text-[10px] font-bold rounded">
                  AC &amp; Gas Refill
                </span>
              </div>
              <div className="relative rounded-xl overflow-hidden border border-slate-700 aspect-[4/3]">
                <img
                  src="/images/services/cctv-biometric.jpg"
                  alt="CCTV Camera & Networking Islamabad"
                  width={400}
                  height={300}
                  style={{ aspectRatio: '4 / 3' }}
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-1.5 left-1.5 px-2 py-0.5 bg-slate-950/85 text-amber-300 text-[10px] font-bold rounded">
                  CCTV &amp; PABX
                </span>
              </div>
            </div>
          </div>
        </Link>
      )}

      {/* SLIDE 3: OUR REPAIR SERVICES (/services#repair-services) */}
      {slideType === 'repair' && (
        <Link
          href="/services#repair-services"
          className="block relative w-full bg-gradient-to-br from-slate-950 via-amber-950/35 to-slate-950 text-white p-5 sm:p-8 md:px-12 md:py-9 transition-all"
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/12 rounded-full blur-3xl pointer-events-none" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 md:gap-8 items-center relative z-10">
            {/* Left Copy & Appliance List */}
            <div className="lg:col-span-7 space-y-3 sm:space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-500/20 border border-orange-400/40 text-orange-300 rounded-full text-[11px] sm:text-xs font-black uppercase tracking-wider">
                <Wrench className="w-3.5 h-3.5" />
                <span>What We Repair • Doorstep Technician Support</span>
              </div>

              <div>
                <h2 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-white uppercase leading-none">
                  OUR <span className="text-brand-400">REPAIR SERVICES</span>
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 font-medium mt-2">
                  Fast fault diagnostics, genuine spare parts &amp; pure copper motor repairs for all home and office appliances.
                </p>
              </div>

              {/* Everyday Appliances We Repair */}
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {[
                  'Air Conditioner',
                  'Washing Machine',
                  'Electric Iron',
                  'Gas & Electric Geyser',
                  'Refrigerator & Freezer',
                  'Microwave Oven',
                  'Juicer & Blender',
                  'Vacuum Cleaner',
                  'Clothes Dryer',
                  'Ceiling & Pedestal Fan',
                ].map((appliance) => (
                  <span
                    key={appliance}
                    className="px-2.5 py-1 bg-slate-900/90 border border-orange-500/30 text-slate-100 rounded-lg text-[11px] sm:text-xs font-bold"
                  >
                    🔧 {appliance}
                  </span>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <span className="inline-flex items-center gap-2 px-5 py-2.5 sm:py-3 bg-brand-500 group-hover:bg-brand-400 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-md transition-colors">
                  <span>Book Repair Service Now</span>
                  <ArrowRight className="w-4 h-4" />
                </span>
                <span className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs text-emerald-400 font-bold">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Same-Day Twin Cities Visit</span>
                </span>
              </div>
            </div>

            {/* Right Visual Showcase */}
            <div className="lg:col-span-5 grid grid-cols-2 gap-2.5">
              <div className="relative rounded-xl overflow-hidden border border-slate-700 aspect-[4/3] col-span-2 sm:col-span-1 lg:col-span-2">
                <img
                  src="/images/services/air-conditioning.jpg"
                  alt="Appliance and AC Repair Technicians Islamabad"
                  width={600}
                  height={380}
                  style={{ aspectRatio: '16 / 10' }}
                  className="w-full h-40 sm:h-48 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent" />
                <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-xs font-bold">
                  <span className="text-white">Doorstep Fault Diagnosis</span>
                  <span className="px-2 py-0.5 bg-brand-500 text-slate-950 rounded text-[10px] font-black">
                    Testing Warranty
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Link>
      )}

      {/* CUSTOM UPLOADED IMAGE BANNER FALLBACK (from Admin Panel) */}
      {slideType === 'custom' && (
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
              alt={
                currentBanner.title
                  ? `${currentBanner.title} - Techplus.pk Heavy Duty Tools`
                  : 'Techplus.pk - Heavy Duty Power Tools, Chainsaw Converters & Repair Services in Pakistan'
              }
              width={1920}
              height={640}
              style={{ aspectRatio: '1920 / 640' }}
              decoding="async"
              className="w-full h-full object-contain md:object-cover transition-all duration-700 select-none"
              loading="eager"
              fetchPriority="high"
            />
          </picture>
        </Link>
      )}

      {/* Navigation Arrows */}
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
            className="hidden sm:flex absolute left-2 md:left-3 top-1/2 -translate-y-1/2 z-20 p-2 bg-slate-950/75 hover:bg-slate-900 text-white rounded-full backdrop-blur-xs transition-all border border-white/15 opacity-75 group-hover:opacity-100"
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
            className="hidden sm:flex absolute right-2 md:right-3 top-1/2 -translate-y-1/2 z-20 p-2 bg-slate-950/75 hover:bg-slate-900 text-white rounded-full backdrop-blur-xs transition-all border border-white/15 opacity-75 group-hover:opacity-100"
            aria-label="Next Banner"
          >
            <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
          </button>
        </>
      )}

      {/* Bottom Slide Switcher Pills (Clear Labels: Products | Services | Repair) */}
      {displayBanners.length > 1 && (
        <div className="bg-slate-950/95 border-t border-slate-800/80 px-2.5 sm:px-3 py-2 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
          {displayBanners.map((bnr, i) => {
            const label =
              i === 0 && isBuiltInBannerUrl(bnr.desktop_image_url)
                ? '01. Products'
                : i === 1 && isBuiltInBannerUrl(bnr.desktop_image_url)
                  ? '02. Services'
                  : i === 2 && isBuiltInBannerUrl(bnr.desktop_image_url)
                    ? '03. Repairs'
                    : bnr.title || `Slide ${i + 1}`;
            const desktopLabel =
              i === 0 && isBuiltInBannerUrl(bnr.desktop_image_url)
                ? '01. Our Products'
                : i === 1 && isBuiltInBannerUrl(bnr.desktop_image_url)
                  ? '02. Our Services'
                  : i === 2 && isBuiltInBannerUrl(bnr.desktop_image_url)
                    ? '03. Repair Services'
                    : bnr.title || `Slide ${i + 1}`;
            return (
              <button
                key={bnr.id || i}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setCurrentIndex(i);
                }}
                className={`px-2.5 sm:px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-bold transition-all shrink-0 ${
                  i === safeIndex
                    ? 'bg-brand-500 text-slate-950 shadow-xs'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
                }`}
                aria-label={`Switch to ${desktopLabel}`}
              >
                <span className="sm:hidden">{label}</span>
                <span className="hidden sm:inline">{desktopLabel}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
