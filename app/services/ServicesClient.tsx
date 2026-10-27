'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Sun,
  Zap,
  Wind,
  Wrench,
  Camera,
  Network,
  BellRing,
  CheckCircle2,
  PhoneCall,
  Send,
  Sparkles,
  MessageCircle,
  Clock,
  ShieldCheck,
  MapPin,
  ChevronRight,
  ChevronLeft,
  Check,
} from 'lucide-react';
import { createServiceInquiry } from '@/lib/db';
import { useSettings } from '@/lib/settings-context';

// Continuous smooth auto-scrolling hook matching home page category menu
function useContinuousScroll(
  ref: React.RefObject<HTMLDivElement | null>,
  speed: number = 0.8,
  isActive: boolean = true
) {
  useEffect(() => {
    const el = ref.current;
    if (!el || !isActive) return;

    let isInteracting = false;
    let resumeTimer: ReturnType<typeof setTimeout> | null = null;
    let animId: number;
    let accumulator = 0;

    el.style.scrollBehavior = 'auto';

    const pause = () => {
      isInteracting = true;
      if (resumeTimer) clearTimeout(resumeTimer);
    };

    const resume = (delay = 2000) => {
      if (resumeTimer) clearTimeout(resumeTimer);
      resumeTimer = setTimeout(() => {
        isInteracting = false;
      }, delay);
    };

    const handleMouseEnter = () => pause();
    const handleMouseLeave = () => resume(600);
    const handleTouchStart = () => pause();
    const handleTouchEnd = () => resume(2000);

    el.addEventListener('mouseenter', handleMouseEnter);
    el.addEventListener('mouseleave', handleMouseLeave);
    el.addEventListener('touchstart', handleTouchStart, { passive: true });
    el.addEventListener('touchend', handleTouchEnd, { passive: true });

    const tick = () => {
      if (!isInteracting && el) {
        const halfWidth = el.scrollWidth / 2;
        if (halfWidth > 0 && halfWidth > el.clientWidth) {
          accumulator += speed;
          if (accumulator >= 1) {
            const step = Math.floor(accumulator);
            accumulator -= step;
            el.scrollLeft += step;
            if (el.scrollLeft >= halfWidth) {
              el.scrollLeft -= halfWidth;
            } else if (el.scrollLeft <= 0) {
              el.scrollLeft += halfWidth;
            }
          }
        }
      }
      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(animId);
      if (resumeTimer) clearTimeout(resumeTimer);
      el.removeEventListener('mouseenter', handleMouseEnter);
      el.removeEventListener('mouseleave', handleMouseLeave);
      el.removeEventListener('touchstart', handleTouchStart);
      el.removeEventListener('touchend', handleTouchEnd);
    };
  }, [ref, speed, isActive]);
}

export default function ServicesClient() {
  const { settings } = useSettings();

  // Active service index for the main slider / detail view
  const [activeServiceIdx, setActiveServiceIdx] = useState(0);

  // Scroll ref for horizontal tabs carousel
  const tabsScrollRef = useRef<HTMLDivElement | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_phone: '',
    service_type: 'Solar System Installation (Since 2018)',
    city: 'Islamabad',
    address: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const coreServices = [
    {
      id: 'solar',
      number: '01',
      title: 'Solar System Installation',
      subtitle: 'On-Grid, Hybrid & Net-Metering Solutions Since 2018',
      image: '/images/services/solar-installation.jpg',
      alt: 'Residential rooftop solar system installation Islamabad Techplus',
      tagline: 'Offering Solar System Installation Since 2018',
      lines: [
        'Techplus has delivered residential and commercial solar setups across Islamabad and Rawalpindi since 2018.',
        'We engineer customized on-grid, off-grid, and hybrid systems using Tier-1 Jinko solar panels and GoodWe, SAJ, Huawei or Knox inverters.',
        'Our engineers manage end-to-end IESCO net-metering paperwork and green meter installation so you generate clean power and lower your bills.',
      ],
      features: [
        'Turnkey Hybrid & On-Grid Systems (3kW to 100kW+)',
        'Complete IESCO Green Meter & Net-Metering Approval',
        'Tier-1 N-Type TopCon & Bifacial Solar Panels',
        'Heavy-Duty Elevated Structure for Islamabad Storms',
      ],
      icon: Sun,
    },
    {
      id: 'electrical',
      number: '02',
      title: 'Electrical Services',
      subtitle: '20+ Years Wide Experience in Islamabad & Rawalpindi',
      image: '/images/services/electrical-services.jpg',
      alt: 'Professional licensed electrician distribution board wiring Islamabad Techplus',
      tagline: 'Wide Field Experience from More Than 20 Years',
      lines: [
        'We offer premier electrical services for homes, corporate offices, and plazas in Islamabad with over 20 years of hands-on experience.',
        'Our certified master electricians handle full house rewiring, DB load balancing, 3-phase changeover switches, and urgent short-circuit emergencies.',
        'We use genuine Pakistan Cables pure copper wiring and Schneider/ABB circuit breakers to protect your valuable appliances from voltage spikes.',
      ],
      features: [
        'Complete House Rewiring & Conduit Pipe Laying',
        'Distribution Board (DB) & 3-Phase Load Balancing',
        'Emergency Short Circuit & Burnt Wire Diagnostics',
        'Pure Copper Wiring with Safe Grounding / Earthing',
      ],
      icon: Zap,
    },
    {
      id: 'ac',
      number: '03',
      title: 'Air Conditioning',
      subtitle: 'Master Chemical Wash, Gas Refill & Inverter Troubleshooting',
      image: '/images/services/air-conditioning.jpg',
      alt: 'HVAC technician chemical wash split AC cleaning Islamabad Techplus',
      tagline: 'Precision Split & Inverter AC Maintenance',
      lines: [
        'Doorstep AC installation, master chemical jet cleaning, and PCB inverter repair across Islamabad and Rawalpindi.',
        'We perform high-pressure water gun washing of indoor blowers and outdoor condenser coils without taking the units down from the wall.',
        'Accurate pressure diagnostics and authentic R410A / R32 gas refilling ensure optimal chilling during peak summer heat waves.',
      ],
      features: [
        'High-Pressure Water Gun Deep Chemical Cleaning',
        'Original R410A / R32 Refrigerant Gas Charging',
        'Inverter PCB Board Diagnostics & Error Code Fixes',
        'Copper Piping Installation with Nitrogen Leak Testing',
      ],
      icon: Wind,
    },
    {
      id: 'plumbing',
      number: '04',
      title: 'Plumbing Services & Core Cutting',
      subtitle: 'Sanitary Fittings, Pipeline Leak Detection & Diamond Core Cutting',
      image: '/images/services/plumbing-core-cutting.jpg',
      alt: 'Diamond core cutting machine and sanitary plumbing pipes Islamabad Techplus',
      tagline: 'Leak-Free Sanitary Piping & Clean Core Cutting',
      lines: [
        'Complete sanitary plumbing, PPRC and CPVC pipe heat-fusing, and modern bathroom fixture installations for homes and commercial plazas.',
        'We specialize in precision diamond core cutting from 2 to 8 inches for AC piping, exhaust ducts, and plumbing lines without cracking your concrete walls or beams.',
        'Motorized pressure drain cleaning eliminates kitchen sink and sewer line blockages without damaging your tiles or existing infrastructure.',
      ],
      features: [
        'Diamond Core Cutting (2" to 8") with Zero Wall Cracking',
        'PPRC & CPVC Hot / Cold Water Pipeline Fitting',
        'Concealed Water Leakage Detection & Pressure Testing',
        'Water Tank Cleaning, Automatic Float Valves & Pressure Pumps',
      ],
      icon: Wrench,
    },
    {
      id: 'cctv',
      number: '05',
      title: 'CCTV & Biometric Time Attendance',
      subtitle: 'Hikvision & Dahua HD/IP Cameras with Live Mobile View',
      image: '/images/services/cctv-biometric.jpg',
      alt: 'Commercial 4K CCTV camera and biometric fingerprint time attendance terminal Islamabad Techplus',
      tagline: 'High-Definition Surveillance & Cloud Attendance',
      lines: [
        'End-to-end security camera installation for residences, offices, schools, and commercial warehouses in Islamabad and Rawalpindi.',
        'We set up Dahua and Hikvision HD IP cameras with color night vision, motion sensing, remote smartphone streaming, and centralized NVR storage.',
        'We also configure facial recognition and fingerprint biometric attendance systems with automated payroll and punch-in software.',
      ],
      features: [
        'Hikvision & Dahua 2MP / 5MP / 4K IP Camera Systems',
        'ColorVu Full-Color Night Vision & Smart AI Motion Alerts',
        'Live Mobile App Streaming on iOS & Android Worldwide',
        'Fingerprint & Face Recognition Biometric Time Clocks',
      ],
      icon: Camera,
    },
    {
      id: 'networking',
      number: '06',
      title: 'PABX & Computer Networking',
      subtitle: 'Structured Cat6 Cabling, Server Racks & Office Intercoms',
      image: '/images/services/pabx-networking.jpg',
      alt: 'Enterprise server rack Cat6 patch cables and office IP PABX phone Islamabad Techplus',
      tagline: 'Seamless Office Communications & High-Speed LAN',
      lines: [
        'Complete corporate IT networking, structured Cat6 cable routing, patch panel punch-downs, and server rack installations.',
        'We eliminate office Wi-Fi dead zones using enterprise TP-Link and Ubiquiti access points with seamless roaming across multiple floors.',
        'We deploy hybrid analog and IP PABX intercom systems for instant department-to-department internal voice calling.',
      ],
      features: [
        'Gigabit Cat6 Structured Cabling & Server Rack Cabinets',
        'Multi-Floor Mesh Wi-Fi & TP-Link Access Points',
        'Panasonic & Grandstream PABX Intercom Systems',
        'Fluke-Tested Cable Crimping & Network Troubleshooting',
      ],
      icon: Network,
    },
    {
      id: 'firealarm',
      number: '07',
      title: 'Fire Alarm System',
      subtitle: 'Addressable & Conventional Smoke, Heat & Siren Systems',
      image: '/images/services/fire-alarm-system.jpg',
      alt: 'Commercial smoke detector and fire alarm control panel Islamabad Techplus',
      tagline: 'Reliable Life & Asset Safety Systems',
      lines: [
        'Certified fire safety solutions protecting residential houses, restaurants, corporate offices, and commercial basements in Islamabad.',
        'We install optical smoke detectors, rate-of-rise heat sensors, manual break-glass call points, and high-decibel strobe sirens.',
        'Our micro-controller central panels immediately identify the exact room or loop triggered for rapid evacuation and emergency response.',
      ],
      features: [
        'Optical Smoke Detectors & Thermal Heat Sensors',
        'Manual Break-Glass Emergency Call Points & Strobes',
        'Central Addressable & Conventional Alarm Panels',
        'Annual Maintenance Inspections & Loop Testing',
      ],
      icon: BellRing,
    },
  ];

  // Repeat for continuous seamless horizontal auto-scroll loop
  const repeatedServices = [...coreServices, ...coreServices];

  // Hook for continuous auto-scrolling
  useContinuousScroll(tabsScrollRef, 0.75, true);

  const scrollTabs = (direction: 'left' | 'right') => {
    if (!tabsScrollRef.current) return;
    const scrollAmount = direction === 'left' ? -260 : 260;
    tabsScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  // Partner brands from Visiting Card
  const partnerBrands = [
    { name: 'Huawei', file: 'huawei.svg', role: 'Solar Inverters & Power Solutions' },
    { name: 'GoodWe', file: 'goodwe.svg', role: 'Smart Hybrid & On-Grid Inverters' },
    { name: 'Jinko Solar', file: 'jinkosolar.svg', role: 'Tier-1 High-Efficiency PV Modules' },
    { name: 'Hikvision', file: 'hikvision.svg', role: 'HD Security & IP Surveillance' },
    { name: 'Dahua', file: 'dahua.svg', role: 'AI Cameras & Biometric Attendance' },
    { name: 'TP-Link', file: 'tplink.svg', role: 'Enterprise Routers & Access Points' },
    { name: 'Panasonic', file: 'panasonic.svg', role: 'PABX Intercoms & Communication' },
    { name: 'Knox', file: 'knox.svg', role: 'Residential Solar Inverters' },
    { name: 'SAJ', file: 'saj.svg', role: 'Smart Solar & Storage Solutions' },
    { name: 'LG', file: 'lg.svg', role: 'HVAC & Electronic Component Systems' },
  ];

  const handleBookNow = (serviceName: string) => {
    setFormData((prev) => ({ ...prev, service_type: serviceName }));
    const el = document.getElementById('book-service');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customer_name || !formData.customer_phone) {
      setErrorMsg('Please enter your name and contact phone number.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      await createServiceInquiry({
        customer_name: formData.customer_name.trim(),
        customer_phone: formData.customer_phone.trim(),
        service_type: formData.service_type,
        city: formData.city.trim(),
        address: formData.address.trim(),
        message: formData.message.trim(),
        status: 'New',
      });
      setSubmitted(true);
      setFormData({
        customer_name: '',
        customer_phone: '',
        service_type: 'Solar System Installation (Since 2018)',
        city: 'Islamabad',
        address: '',
        message: '',
      });
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to submit inquiry. Please call helpline directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const whatsappInquiryUrl = (topic: string) => {
    const rawNumber = settings.whatsapp_number.replace(/^0/, '');
    const text = encodeURIComponent(
      `Assalam-o-Alaikum Techplus.pk, I need service assistance for: ${topic} in Islamabad/Rawalpindi.`
    );
    return `https://wa.me/92${rawNumber}?text=${text}`;
  };

  const currentService = coreServices[activeServiceIdx];
  const CurrentIcon = currentService.icon;

  return (
    <div className="space-y-14 pb-20">
      {/* 1. HERO BANNER: OUR SERVICES */}
      <section className="bg-slate-950 text-white rounded-3xl p-6 sm:p-10 md:p-14 border border-slate-800 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-brand-500/20 text-brand-400 rounded-full text-xs font-black tracking-wider uppercase border border-brand-500/30">
            <Sparkles className="w-3.5 h-3.5 fill-current" />
            <span>Islamabad & Rawalpindi Engineering Services</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight uppercase">
            OUR SERVICES
          </h1>

          <p className="text-sm md:text-base text-slate-300 leading-relaxed font-normal">
            Techplus delivers verified on-site engineering, certified solar installations, and doorstep electrical appliance maintenance. Backed by 20+ years of local technical mastery in Islamabad and Rawalpindi.
          </p>

          {/* Key Trust Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3.5">
              <span className="block text-2xl font-black text-brand-400">20+ Years</span>
              <span className="text-xs text-slate-400 font-medium">Electrical Excellence</span>
            </div>
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3.5">
              <span className="block text-2xl font-black text-brand-400">Since 2018</span>
              <span className="text-xs text-slate-400 font-medium">Solar EPC & Net-Metering</span>
            </div>
            <div className="col-span-2 sm:col-span-1 bg-slate-900/90 border border-slate-800 rounded-2xl p-3.5">
              <span className="block text-2xl font-black text-emerald-400">100% Doorstep</span>
              <span className="text-xs text-slate-400 font-medium">Certified Technicians</span>
            </div>
          </div>

          <div className="pt-3 flex flex-wrap items-center gap-3">
            <a
              href={`tel:${settings.helpline_phone}`}
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-brand-500 hover:bg-brand-600 text-slate-950 font-black text-xs md:text-sm rounded-xl shadow-lg transition-all"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Helpline: {settings.helpline_phone}</span>
            </a>
            <a
              href={whatsappInquiryUrl('General Services')}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs md:text-sm rounded-xl shadow-lg transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Instant Dispatch</span>
            </a>
            <Link
              href="/profile"
              className="inline-flex items-center gap-1.5 px-5 py-3.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold text-xs md:text-sm rounded-xl transition-all"
            >
              <span>View Company Profile</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 2. CORE TECHNICAL SERVICES SHOWCASE */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <span className="text-xs font-bold text-brand-600 uppercase tracking-widest block mb-0.5">
              Field Solutions
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              Core Engineering Services
            </h2>
          </div>

          {/* Carousel Arrows matching Home Page */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 hidden md:inline">Swipe or use arrows:</span>
            <button
              type="button"
              onClick={() => scrollTabs('left')}
              className="p-2 bg-white hover:bg-slate-100 text-slate-700 rounded-full border border-slate-200 shadow-2xs transition-colors"
              aria-label="Scroll Services Left"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => scrollTabs('right')}
              className="p-2 bg-white hover:bg-slate-100 text-slate-700 rounded-full border border-slate-200 shadow-2xs transition-colors"
              aria-label="Scroll Services Right"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* CONTINUOUS SMOOTH AUTO-SCROLLING HORIZONTAL TABS CAROUSEL (Touch & drag enabled) */}
        <div
          ref={tabsScrollRef}
          className="flex items-center gap-3 overflow-x-auto scrollbar-none no-scrollbar py-2 -mx-4 px-4 md:mx-0 md:px-0 select-none cursor-grab active:cursor-grabbing"
          style={{ scrollBehavior: 'auto' }}
        >
          {repeatedServices.map((srv, idx) => {
            const originalIdx = idx % coreServices.length;
            const Icon = srv.icon;
            const isSelected = originalIdx === activeServiceIdx;
            return (
              <button
                key={`${srv.id}-${idx}`}
                type="button"
                onClick={() => setActiveServiceIdx(originalIdx)}
                className={`flex items-center gap-2.5 px-4 sm:px-5 py-3 rounded-2xl font-bold text-xs shrink-0 transition-all border ${
                  isSelected
                    ? 'bg-slate-950 text-white border-brand-500 shadow-lg ring-2 ring-brand-500/25 scale-[1.02]'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-brand-500 hover:text-brand-600 hover:shadow-xs'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
                    isSelected ? 'bg-brand-500/20 text-brand-400' : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <span>
                  {srv.number}. {srv.title}
                </span>
              </button>
            );
          })}
        </div>

        {/* ACTIVE SERVICE SHOWCASE CARD WITH PHOTOREALISTIC IMAGES */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12 transition-all">
          {/* Photorealistic High-Definition Work Picture (5 Cols) */}
          <div className="lg:col-span-5 relative bg-slate-950 p-5 sm:p-6 flex flex-col justify-between overflow-hidden">
            {/* Top Badge */}
            <div className="flex items-center justify-between gap-2 mb-4 z-10">
              <span className="px-3 py-1 bg-brand-500 text-slate-950 font-black text-xs rounded-full uppercase tracking-wider shadow-md">
                {currentService.tagline}
              </span>
              <span className="text-xs font-mono font-bold text-slate-400">
                0{activeServiceIdx + 1} / 0{coreServices.length}
              </span>
            </div>

            {/* Premium Photography Container */}
            <div className="relative my-auto w-full aspect-16/10 rounded-2xl overflow-hidden shadow-2xl border border-slate-800 bg-slate-900 group">
              <img
                src={currentService.image}
                alt={currentService.alt}
                width={800}
                height={500}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <span className="text-[11px] font-semibold text-brand-300 drop-shadow-sm flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-brand-400" />
                  Verified On-Site Work | Islamabad & Rawalpindi
                </span>
              </div>
            </div>

            {/* Slider navigation buttons */}
            <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-800 text-xs text-slate-400">
              <span>Service #{currentService.number} Details</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setActiveServiceIdx((prev) => (prev === 0 ? coreServices.length - 1 : prev - 1))
                  }
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white transition-colors"
                  aria-label="Previous Service"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setActiveServiceIdx((prev) => (prev === coreServices.length - 1 ? 0 : prev + 1))
                  }
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white transition-colors"
                  aria-label="Next Service"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Service Details & Solid 2-4 lines text (7 Cols) */}
          <div className="lg:col-span-7 p-6 sm:p-8 md:p-10 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-brand-600">
                <CurrentIcon className="w-5 h-5" />
                <span className="text-xs font-bold uppercase tracking-wider">
                  Service #{currentService.number}
                </span>
              </div>

              <div>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900">
                  {currentService.title}
                </h3>
                <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-1">
                  {currentService.subtitle}
                </p>
              </div>

              {/* STRICT 2-4 LINES OF HUMANIZED SOLID TEXT */}
              <div className="bg-slate-50 border-l-4 border-brand-500 p-4 sm:p-5 rounded-r-2xl space-y-2">
                {currentService.lines.map((line, idx) => (
                  <p key={idx} className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                    {line}
                  </p>
                ))}
              </div>

              {/* Key Technical Bullets */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                {currentService.features.map((feat, fIdx) => (
                  <div key={fIdx} className="flex items-start gap-2 text-xs text-slate-700 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Bar for Active Service */}
            <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => handleBookNow(currentService.title)}
                className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-sm transition-colors flex items-center gap-2"
              >
                <span>Book This Service</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              <a
                href={whatsappInquiryUrl(currentService.title)}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 font-bold text-xs rounded-xl transition-colors flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span>Quick WhatsApp Quote</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 3. AUTHORIZED BRANDS */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-brand-600 uppercase tracking-widest">
            Equipment Standards
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            Trusted Partner Brands
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            We source genuine inverters, tier-1 solar panels, commercial security hardware, and networking gear from global industry leaders.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5">
          {partnerBrands.map((brand, bIdx) => (
            <div
              key={bIdx}
              className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs flex flex-col items-center justify-center text-center space-y-2 hover:border-brand-500 hover:shadow-xs transition-all"
            >
              <div className="h-12 w-full flex items-center justify-center">
                <img
                  src={`/images/partners/${brand.file}`}
                  alt={`${brand.name} partner Techplus`}
                  width={140}
                  height={42}
                  className="max-h-9 max-w-full object-contain"
                />
              </div>
              <span className="text-[10px] font-semibold text-slate-500 block leading-tight">
                {brand.role}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 4. INTERACTIVE APPOINTMENT / INQUIRY BOOKING FORM */}
      <section
        id="book-service"
        className="bg-white rounded-3xl p-6 sm:p-10 md:p-12 border border-slate-200 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
      >
        <div className="lg:col-span-5 space-y-4">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 bg-amber-50 px-3 py-1 rounded-full uppercase">
            <Clock className="w-3.5 h-3.5" /> Doorstep Technician Dispatch
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 leading-tight">
            Schedule an Inspection or Installation
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Fill in your details below. Our field supervisor will call you within 30 minutes to confirm your slot, verify parts requirement, and dispatch our technician.
          </p>

          <div className="space-y-3 pt-2 text-xs text-slate-700">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Full coverage across all sectors of Islamabad & Rawalpindi</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Transparent diagnostic estimation before starting any work</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Testing warranty on all pure copper motor rewinds & PCB repairs</span>
            </div>
            <div className="flex items-start gap-2 pt-2 border-t border-slate-100">
              <MapPin className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
              <span className="text-slate-600">
                <strong>Main Physical Location:</strong> Shop 07-B Chinar Plaza, St-48, G-6/1-1, Islamabad.
              </span>
            </div>
          </div>
        </div>

        {/* Booking Form Card */}
        <div className="lg:col-span-7 bg-slate-50 p-6 sm:p-8 rounded-2xl border border-slate-200">
          {submitted ? (
            <div className="text-center py-10 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Inquiry Received Successfully!</h3>
              <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
                Thank you! Our technical service department has received your request. We will call you at your provided phone number shortly.
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors"
                >
                  Book Another Service
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMsg && (
                <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl font-medium border border-red-200">
                  {errorMsg}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Muhammad Tariq"
                  value={formData.customer_name}
                  onChange={(e) =>
                    setFormData({ ...formData, customer_name: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:outline-hidden focus:border-brand-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Phone / WhatsApp Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="0323XXXXXXX"
                    value={formData.customer_phone}
                    onChange={(e) =>
                      setFormData({ ...formData, customer_phone: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:outline-hidden focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    City / Area *
                  </label>
                  <select
                    value={formData.city}
                    onChange={(e) =>
                      setFormData({ ...formData, city: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:outline-hidden focus:border-brand-500 cursor-pointer"
                  >
                    <option value="Islamabad">Islamabad (All Sectors & Suburbs)</option>
                    <option value="Rawalpindi">Rawalpindi (All Areas & Bahria/DHA)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Select Required Service *
                </label>
                <select
                  value={formData.service_type}
                  onChange={(e) =>
                    setFormData({ ...formData, service_type: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:outline-hidden focus:border-brand-500 cursor-pointer"
                >
                  <optgroup label="Core Technical Services">
                    <option value="Solar System Installation (Since 2018)">
                      1. Solar System Installation (Net-Metering & Hybrid)
                    </option>
                    <option value="Electrical Services (20+ Years Experience)">
                      2. Electrical Services (House Rewiring & DB Box)
                    </option>
                    <option value="Air Conditioning (Wash & Gas Charging)">
                      3. Air Conditioning (Chemical Jet Wash & Gas Charging)
                    </option>
                    <option value="Plumbing Services & Core Cutting">
                      4. Plumbing Services & Diamond Core Cutting
                    </option>
                    <option value="CCTV & Biometric Time Attendance">
                      5. CCTV Cameras & Biometric Attendance
                    </option>
                    <option value="PABX & Computer Networking">
                      6. PABX Intercom & Cat6 Computer Networking
                    </option>
                    <option value="Fire Alarm System Installation">
                      7. Fire Alarm System Installation & Smoke Detectors
                    </option>
                  </optgroup>
                  <optgroup label="Home Appliance Repairs">
                    <option value="Repair: Air Conditioner (Inverter/Split)">
                      Repair: Air Conditioner (Inverter/Split)
                    </option>
                    <option value="Repair: Cloth Iron (Electric & Steam)">
                      Repair: Cloth Iron (Electric & Steam)
                    </option>
                    <option value="Repair: Refrigerator & Deep Freezer">
                      Repair: Refrigerator & Deep Freezer
                    </option>
                    <option value="Repair: Room Cooler">Repair: Room Cooler</option>
                    <option value="Repair: Ceiling & Pedestal Fan">
                      Repair: Ceiling & Pedestal Fan
                    </option>
                    <option value="Repair: Automatic Washing Machine">
                      Repair: Automatic Washing Machine
                    </option>
                    <option value="Repair: Clothes Dryer / Spinner">
                      Repair: Clothes Dryer / Spinner
                    </option>
                    <option value="Repair: Microwave Oven">Repair: Microwave Oven</option>
                    <option value="Repair: Gas & Electric Geyser">
                      Repair: Gas & Electric Geyser
                    </option>
                    <option value="Repair: Vacuum Cleaner">Repair: Vacuum Cleaner</option>
                  </optgroup>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  House / Street / Sector Address
                </label>
                <input
                  type="text"
                  placeholder="e.g. House 14, Street 25, Sector F-8/2, Islamabad"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:outline-hidden focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Issue Details or Requirements
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe your issue or installation requirement..."
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:outline-hidden focus:border-brand-500 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-brand-500 hover:bg-brand-600 text-slate-950 font-black text-xs md:text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? 'Submitting Inquiry...' : 'Confirm Appointment Request'}</span>
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
