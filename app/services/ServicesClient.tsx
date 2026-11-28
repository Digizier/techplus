'use client';

import React, { useState } from 'react';
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
  ChevronDown,
  Check,
  Award,
  BadgeCheck,
  FileText,
  CalendarCheck,
  Star,
  AlertCircle,
} from 'lucide-react';
import { createServiceInquiry } from '@/lib/db';
import { useSettings } from '@/lib/settings-context';
import GoogleReviews from '@/components/GoogleReviews';

export default function ServicesClient() {
  const { settings } = useSettings();

  const [highlightedId, setHighlightedId] = useState<string | null>(null);
  const [expandedSpecs, setExpandedSpecs] = useState<Record<string, boolean>>({});

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
      shortTitle: 'Solar Installation',
      bookingValue: 'Solar System Installation (Since 2018)',
      subtitle: 'On-Grid, Hybrid & IESCO Net-Metering Solutions Since 2018',
      image: '/images/services/solar-installation.jpg',
      alt: 'Residential rooftop solar system installation Islamabad Techplus',
      badge: 'Since 2018 • Solar EPC',
      topSummary: 'Tier-1 Jinko panels, GoodWe/Huawei inverters & complete IESCO green meter setup.',
      lines: [
        'Techplus has delivered residential and commercial solar setups across Islamabad and Rawalpindi since 2018.',
        'We engineer customized on-grid, off-grid, and hybrid systems using Tier-1 Jinko solar panels and GoodWe, SAJ, Huawei or Knox inverters.',
        'Our engineers manage end-to-end IESCO net-metering paperwork and green meter installation so you generate clean power and lower your bills.',
      ],
      features: [
        'Hybrid & On-Grid Systems (3kW to 100kW+)',
        'Complete IESCO Green Meter Approval',
        'Tier-1 N-Type TopCon & Bifacial Panels',
        'Heavy-Duty Elevated Wind-Rated Frames',
      ],
      icon: Sun,
    },
    {
      id: 'electrical',
      number: '02',
      title: 'Electrical Services',
      shortTitle: 'Electrical Services',
      bookingValue: 'Electrical Services (20+ Years Experience)',
      subtitle: 'Licensed Electrician • 20+ Years Experience in Islamabad & Rawalpindi',
      image: '/images/services/electrical-services.jpg',
      alt: 'Professional licensed electrician distribution board wiring Islamabad Techplus',
      badge: '20+ Yrs Exp • Licensed',
      topSummary: 'House rewiring, DB load balancing, 3-phase faults & 24/7 short-circuit emergencies.',
      lines: [
        'We offer premier electrical services for homes, corporate offices, and plazas in Islamabad with over 20 years of hands-on experience.',
        'Our certified master electricians handle full house rewiring, DB load balancing, 3-phase changeover switches, and urgent short-circuit emergencies.',
        'We use genuine Pakistan Cables pure copper wiring and Schneider/ABB circuit breakers to protect your valuable appliances from voltage spikes.',
      ],
      features: [
        'Complete House Rewiring & Conduits',
        'DB Box & 3-Phase Load Balancing',
        '24/7 Short Circuit & Fault Visits',
        'Pure Copper Wiring & Safe Earthing',
      ],
      icon: Zap,
    },
    {
      id: 'ac',
      number: '03',
      title: 'Air Conditioning',
      shortTitle: 'Air Conditioning',
      bookingValue: 'Air Conditioning (Wash & Gas Charging)',
      subtitle: 'Master Water-Gun Chemical Wash, Gas Refill & Inverter PCB Repair',
      image: '/images/services/air-conditioning.jpg',
      alt: 'HVAC technician chemical wash split AC cleaning Islamabad Techplus',
      badge: 'Jet Wash & Gas Refill',
      topSummary: 'High-pressure chemical cleaning on wall, original R410A/R32 gas & inverter PCB fixes.',
      lines: [
        'Doorstep AC installation, master chemical jet cleaning, and PCB inverter repair across Islamabad and Rawalpindi.',
        'We perform high-pressure water gun washing of indoor blowers and outdoor condenser coils without taking the units down from the wall.',
        'Accurate pressure diagnostics and authentic R410A / R32 gas refilling ensure optimal chilling during peak summer heat waves.',
      ],
      features: [
        'Water Gun Deep Chemical Cleaning',
        'Original R410A / R32 Gas Charging',
        'Inverter PCB Board Error Fixes',
        'Copper Piping & Nitrogen Testing',
      ],
      icon: Wind,
    },
    {
      id: 'plumbing',
      number: '04',
      title: 'Plumbing & Core Cutting',
      shortTitle: 'Plumbing & Core Cut',
      bookingValue: 'Plumbing Services & Core Cutting',
      subtitle: 'Sanitary Fittings, Leak Detection & Diamond Core Cutting (2" to 8")',
      image: '/images/services/plumbing-core-cutting.jpg',
      alt: 'Diamond core cutting machine and sanitary plumbing pipes Islamabad Techplus',
      badge: 'Zero-Crack Core Cut',
      topSummary: 'PPRC/CPVC heat-fused pipelines, concealed leak checks & precision concrete core cutting.',
      lines: [
        'Complete sanitary plumbing, PPRC and CPVC pipe heat-fusing, and modern bathroom fixture installations for homes and commercial plazas.',
        'We specialize in precision diamond core cutting from 2 to 8 inches for AC piping, exhaust ducts, and plumbing lines without cracking your concrete walls or beams.',
        'Motorized pressure drain cleaning eliminates kitchen sink and sewer line blockages without damaging your tiles or existing infrastructure.',
      ],
      features: [
        'Diamond Core Cutting (2" to 8")',
        'PPRC & CPVC Sanitary Pipelines',
        'Concealed Water Leakage Detection',
        'Tank Cleaning & Pressure Pumps',
      ],
      icon: Wrench,
    },
    {
      id: 'cctv',
      number: '05',
      title: 'CCTV & Biometric Attendance',
      shortTitle: 'CCTV & Biometric',
      bookingValue: 'CCTV & Biometric Time Attendance',
      subtitle: 'Hikvision & Dahua HD/IP Cameras with Live Phone Streaming',
      image: '/images/services/cctv-biometric.jpg',
      alt: 'Commercial 4K CCTV camera and biometric fingerprint time attendance terminal Islamabad Techplus',
      badge: '4K IP & Biometric',
      topSummary: 'Color night-vision IP security cameras with NVR setup & fingerprint/face time clocks.',
      lines: [
        'End-to-end security camera installation for residences, offices, schools, and commercial warehouses in Islamabad and Rawalpindi.',
        'We set up Dahua and Hikvision HD IP cameras with color night vision, motion sensing, remote smartphone streaming, and centralized NVR storage.',
        'We also configure facial recognition and fingerprint biometric attendance systems with automated payroll and punch-in software.',
      ],
      features: [
        'Hikvision & Dahua 2MP/5MP/4K IP',
        'ColorVu Full-Color Night Vision',
        'Live iOS & Android Mobile View',
        'Face & Fingerprint Time Attendance',
      ],
      icon: Camera,
    },
    {
      id: 'networking',
      number: '06',
      title: 'PABX & Computer Networking',
      shortTitle: 'PABX & Networking',
      bookingValue: 'PABX & Computer Networking',
      subtitle: 'Structured Cat6 Cabling, Server Racks & Office Intercoms',
      image: '/images/services/pabx-networking.jpg',
      alt: 'Enterprise server rack Cat6 patch cables and office IP PABX phone Islamabad Techplus',
      badge: 'Enterprise LAN & PABX',
      topSummary: 'Cat6 cable routing, patch panels, multi-floor TP-Link Wi-Fi mesh & office PABX.',
      lines: [
        'Complete corporate IT networking, structured Cat6 cable routing, patch panel punch-downs, and server rack installations.',
        'We eliminate office Wi-Fi dead zones using enterprise TP-Link and Ubiquiti access points with seamless roaming across multiple floors.',
        'We deploy hybrid analog and IP PABX intercom systems for instant department-to-department internal voice calling.',
      ],
      features: [
        'Gigabit Cat6 & Server Rack Setup',
        'Multi-Floor Mesh Wi-Fi Access Points',
        'Panasonic & Grandstream PABX',
        'Fluke-Tested Cable Crimping',
      ],
      icon: Network,
    },
    {
      id: 'firealarm',
      number: '07',
      title: 'Fire Alarm System',
      shortTitle: 'Fire Alarm System',
      bookingValue: 'Fire Alarm System Installation',
      subtitle: 'Addressable & Conventional Smoke, Heat & Siren Panels',
      image: '/images/services/fire-alarm-system.jpg',
      alt: 'Commercial smoke detector and fire alarm control panel Islamabad Techplus',
      badge: 'Life & Asset Safety',
      topSummary: 'Optical smoke detectors, heat sensors, break-glass call points & loop siren panels.',
      lines: [
        'Certified fire safety solutions protecting residential houses, restaurants, corporate offices, and commercial basements in Islamabad.',
        'We install optical smoke detectors, rate-of-rise heat sensors, manual break-glass call points, and high-decibel strobe sirens.',
        'Our micro-controller central panels immediately identify the exact room or loop triggered for rapid evacuation and emergency response.',
      ],
      features: [
        'Optical Smoke & Thermal Heat Sensors',
        'Break-Glass Call Points & Strobes',
        'Addressable & Conventional Panels',
        'Annual Inspection & Loop Testing',
      ],
      icon: BellRing,
    },
  ];

  // 8 Trust Badges (Voice Note 3 & Reference Screenshot 1)
  const trustSignals = [
    { label: 'Emergency Service', sub: '24/7 Urgent Dispatch', icon: AlertCircle },
    { label: 'Verified Technicians', sub: '20+ Yrs Master Team', icon: BadgeCheck },
    { label: 'Fast Response', sub: '15–30 Min Callback', icon: Clock },
    { label: 'Professional Equipment', sub: 'Digital Meters & Tools', icon: Wrench },
    { label: 'Clear Upfront Quotes', sub: 'No Hidden Charges', icon: FileText },
    { label: 'Customer Satisfaction', sub: '4.9★ Google Rated', icon: Star },
    { label: 'Quality Workmanship', sub: 'Testing Warranty', icon: ShieldCheck },
    { label: 'Same-Day Service', sub: 'Islamabad & Rawalpindi', icon: CalendarCheck },
  ];

  // Home Appliance Repair List (Voice Note 1: Banner 3 "Our Repair Services")
  const repairAppliances = [
    {
      name: 'Air Conditioner (Split / Inverter)',
      bookingValue: 'Repair: Air Conditioner (Inverter/Split)',
      detail: 'Cooling loss, PCB error codes, compressor & gas leak repairs.',
    },
    {
      name: 'Automatic & Semi Washing Machine',
      bookingValue: 'Repair: Automatic Washing Machine',
      detail: 'Drain pump, spin motor, PCB timer & drum bearing service.',
    },
    {
      name: 'Electric & Steam Cloth Iron',
      bookingValue: 'Repair: Cloth Iron (Electric & Steam)',
      detail: 'Thermostat calibration, heating element & heavy-duty cord replacement.',
    },
    {
      name: 'Gas & Electric Water Geyser',
      bookingValue: 'Repair: Gas & Electric Geyser',
      detail: 'Thermocouple, pilot assembly, element & tank leak servicing.',
    },
    {
      name: 'Refrigerator & Deep Freezer',
      bookingValue: 'Repair: Refrigerator & Deep Freezer',
      detail: 'Relay overload, thermostat, condenser coil & gas refilling.',
    },
    {
      name: 'Microwave & Baking Oven',
      bookingValue: 'Repair: Microwave Oven',
      detail: 'Magnetron, high-voltage diode, touch panel & turntable fixes.',
    },
    {
      name: 'Juicer, Blender & Grinder',
      bookingValue: 'Repair: Home Appliance (Juicer/Blender)',
      detail: 'Pure copper armature rewinding, coupler & speed switch replacement.',
    },
    {
      name: 'Vacuum Cleaner',
      bookingValue: 'Repair: Vacuum Cleaner',
      detail: 'Suction motor servicing, carbon brushes & power switch repair.',
    },
    {
      name: 'Clothes Dryer / Spinner',
      bookingValue: 'Repair: Clothes Dryer / Spinner',
      detail: 'Brake cable, buffer seal, timer switch & copper motor rewind.',
    },
    {
      name: 'Ceiling, Pedestal & Room Cooler',
      bookingValue: 'Repair: Ceiling & Pedestal Fan',
      detail: 'Pure copper winding, capacitor, bearing & water pump fixes.',
    },
  ];

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

  const jumpToSection = (elementId: string, highlightServiceId?: string) => {
    const el = document.getElementById(elementId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    if (highlightServiceId) {
      setHighlightedId(highlightServiceId);
      setTimeout(() => setHighlightedId(null), 2600);
    }
  };

  const handleBookNow = (serviceName: string) => {
    setFormData((prev) => ({ ...prev, service_type: serviceName }));
    const el = document.getElementById('book-service');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const toggleSpecs = (id: string) => {
    setExpandedSpecs((prev) => ({ ...prev, [id]: !prev[id] }));
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

  return (
    <div className="space-y-8 md:space-y-12 pb-20">
      {/* 1. HERO BANNER + INSTANT CLICKABLE SERVICES OVERVIEW ABOVE THE FOLD (Voice Notes 2 & 3) */}
      <section className="bg-slate-950 text-white rounded-2xl md:rounded-3xl p-4 sm:p-8 md:p-10 border border-slate-800 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4 sm:space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 sm:gap-6">
            <div className="max-w-2xl space-y-2 sm:space-y-3">
              {/* Top Badges: Location + Prominent Response Time */}
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 bg-brand-500/20 text-brand-400 rounded-full text-[10px] sm:text-xs font-black tracking-wider uppercase border border-brand-500/30">
                  <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current" />
                  <span>Islamabad &amp; Rawalpindi Services</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-[10px] sm:text-xs font-black border border-emerald-500/30">
                  <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  <span>Fast Response: 15–30 Min Callback</span>
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight uppercase">
                OUR SERVICES
              </h1>

              <p className="text-xs sm:text-sm md:text-base text-slate-300 leading-relaxed font-normal">
                Licensed electrician visits (20+ years experience), turnkey Solar installations (since 2018), AC chemical wash, plumbing core cutting &amp; doorstep home appliance repairs.
              </p>
            </div>

            {/* Larger Phone & Direct Booking Buttons (Voice Note 3: Larger readable phone/CTAs) */}
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-2 sm:gap-2.5 shrink-0">
              <a
                href={`tel:${settings.helpline_phone}`}
                className="inline-flex items-center justify-center gap-2 px-3 sm:px-6 py-2.5 sm:py-3.5 bg-brand-500 hover:bg-brand-400 text-slate-950 font-black text-xs sm:text-base rounded-xl shadow-lg transition-all"
              >
                <PhoneCall className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                <span>Call: {settings.helpline_phone}</span>
              </a>
              <a
                href={whatsappInquiryUrl('Urgent Engineering / Repair Service')}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-6 py-2.5 sm:py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg transition-all"
              >
                <MessageCircle className="w-4 h-4 shrink-0" />
                <span>WhatsApp Quote</span>
              </a>
            </div>
          </div>

          {/* INSTANT CLICKABLE SERVICES MENU AT THE VERY TOP (Visible BEFORE Scrolling!) */}
          <div className="pt-3 sm:pt-4 border-t border-slate-800/90 space-y-2">
            <div className="flex items-center justify-between text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider">
              <span>All Services We Provide — Tap any service to jump:</span>
              <span className="hidden sm:inline text-brand-400">Same-Day Doorstep Dispatch</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-2">
              {coreServices.map((srv) => {
                const Icon = srv.icon;
                return (
                  <button
                    key={srv.id}
                    type="button"
                    onClick={() => jumpToSection(`service-${srv.id}`, srv.id)}
                    className="flex items-center gap-2 px-2.5 sm:px-3 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-brand-400 text-left transition-all group"
                  >
                    <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-brand-500/15 text-brand-400 flex items-center justify-center shrink-0 group-hover:bg-brand-500 group-hover:text-slate-950 transition-colors">
                      <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </div>
                    <div className="min-w-0">
                      <span className="block text-[11px] sm:text-xs font-extrabold text-white group-hover:text-brand-300 leading-tight">
                        {srv.number}. {srv.shortTitle}
                      </span>
                      <span className="hidden sm:block text-[10px] text-slate-400">
                        View &amp; Book ↓
                      </span>
                    </div>
                  </button>
                );
              })}

              {/* 8th Quick-Jump Tile: Repair Services */}
              <button
                type="button"
                onClick={() => jumpToSection('repair-services')}
                className="flex items-center gap-2 px-2.5 sm:px-3 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-brand-500/40 text-left transition-all group"
              >
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-brand-500 text-slate-950 flex items-center justify-center shrink-0">
                  <Wrench className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
                <div className="min-w-0">
                  <span className="block text-[11px] sm:text-xs font-black text-brand-300 leading-tight">
                    08. Appliance Repairs
                  </span>
                  <span className="hidden sm:block text-[10px] text-amber-200/80">
                    Iron, Washer, AC, Geyser ↓
                  </span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. 8 TRUST SIGNAL BADGES (Voice Note 3 & Screenshot Reference) */}
      <section aria-label="Service Trust Highlights" className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3.5">
        {trustSignals.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              className="bg-white rounded-2xl p-2.5 sm:p-4 border border-slate-200/90 shadow-2xs flex items-start sm:items-center gap-2 sm:gap-3 hover:border-brand-400 transition-colors"
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-amber-50 border border-brand-200 text-brand-700 flex items-center justify-center shrink-0">
                <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0">
                <span className="block text-[11px] sm:text-sm font-black text-slate-900 leading-tight">
                  {item.label}
                </span>
                <span className="block text-[10px] sm:text-[11px] text-slate-500 font-medium leading-tight mt-0.5">
                  {item.sub}
                </span>
              </div>
            </div>
          );
        })}
      </section>

      {/* 3. ALL 7 CORE ENGINEERING SERVICES (Photo Cards with TOP Text Overlay & "Book This Service Now" CTA — Voice Notes 4, 6 & 7) */}
      <section id="core-services" className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-slate-200 pb-4">
          <div>
            <span className="text-xs font-bold text-brand-600 uppercase tracking-widest block mb-0.5">
              Verified Field Installations &amp; Maintenance
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              All Core Technical Services
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 max-w-md">
            Tap <strong>Book This Service Now</strong> on any card below or inspect full technical scope.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {coreServices.map((srv) => {
            const Icon = srv.icon;
            const isHighlighted = highlightedId === srv.id;
            const isExpanded = !!expandedSpecs[srv.id];

            return (
              <article
                key={srv.id}
                id={`service-${srv.id}`}
                className={`bg-white rounded-2xl border overflow-hidden shadow-xs transition-all flex flex-col justify-between scroll-mt-24 ${
                  isHighlighted
                    ? 'border-brand-500 ring-4 ring-brand-500/25 shadow-xl'
                    : 'border-slate-200 hover:border-brand-400 hover:shadow-md'
                }`}
              >
                {/* PHOTO CARD WITH TOP TEXT OVERLAY & BOTTOM BOOK CTA (Compact height on mobile, crisp overlay contrast) */}
                <div className="relative h-72 sm:h-80 w-full bg-slate-950 overflow-hidden group">
                  <img
                    src={srv.image}
                    alt={srv.alt}
                    width={600}
                    height={400}
                    style={{ aspectRatio: '3 / 2' }}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />

                  {/* Dual Top + Bottom Scrim for Sharp Readability */}
                  <div className="absolute inset-0 bg-gradient-to-b from-slate-950/95 via-slate-950/45 to-slate-950/95 pointer-events-none" />

                  {/* TOP OF PICTURE: Badge + Larger Clear Service Title + Short Info (Voice Note 6) */}
                  <div className="absolute top-0 left-0 right-0 p-4 sm:p-5 space-y-1.5 z-10">
                    <div className="flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-brand-500 text-slate-950 font-black text-[10px] sm:text-[11px] rounded-full uppercase tracking-wide shadow">
                        <Icon className="w-3 h-3" />
                        <span>
                          {srv.number}. {srv.badge}
                        </span>
                      </span>
                      <span className="text-[10px] font-bold text-emerald-300 bg-slate-950/75 px-2 py-0.5 rounded-full border border-emerald-500/30">
                        15–30 Min Reply
                      </span>
                    </div>

                    <h3 className="text-lg sm:text-xl font-black text-white leading-tight drop-shadow-sm">
                      {srv.title}
                    </h3>

                    <p className="text-xs text-slate-200 font-medium leading-snug line-clamp-2 drop-shadow-xs">
                      {srv.topSummary}
                    </p>
                  </div>

                  {/* BOTTOM OF PICTURE: "Book This Service Now" + WhatsApp CTA (Voice Note 7) */}
                  <div className="absolute bottom-0 left-0 right-0 p-3.5 sm:p-4 flex items-center justify-between gap-2 z-10">
                    <button
                      type="button"
                      onClick={() => handleBookNow(srv.bookingValue)}
                      className="flex-1 py-2.5 px-3.5 bg-brand-500 hover:bg-brand-400 text-slate-950 font-black text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-1.5"
                    >
                      <span>Book This Service Now</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>

                    <a
                      href={whatsappInquiryUrl(srv.title)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-lg transition-colors shrink-0"
                      aria-label={`WhatsApp quote for ${srv.title}`}
                      title="Quick WhatsApp Quote"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </a>
                  </div>
                </div>

                {/* COMPACT TECHNICAL SCOPE & FULL SEO DETAILS BELOW PHOTO */}
                <div className="p-4 space-y-2.5 bg-slate-50/70 border-t border-slate-100 flex-1 flex flex-col justify-between">
                  <div className="grid grid-cols-1 gap-1.5">
                    {srv.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-center gap-1.5 text-[11px] sm:text-xs text-slate-700 font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="truncate">{feat}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-slate-200/70">
                    <button
                      type="button"
                      onClick={() => toggleSpecs(srv.id)}
                      className="text-[11px] font-bold text-slate-600 hover:text-brand-700 flex items-center gap-1 w-full justify-between"
                    >
                      <span>{isExpanded ? 'Hide Technical Details' : 'Read Service Scope & Details'}</span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                      />
                    </button>

                    {/* Always kept in DOM for SEO static HTML indexing, toggled visibly with CSS */}
                    <div
                      className={`mt-2 space-y-1.5 text-xs text-slate-600 leading-relaxed ${
                        isExpanded ? 'block' : 'sr-only'
                      }`}
                    >
                      {srv.lines.map((line, lIdx) => (
                        <p key={lIdx}>{line}</p>
                      ))}
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* 4. OUR REPAIR SERVICES / WHAT WE REPAIR (Banner 3 Click Target: #repair-services — Voice Note 1) */}
      <section
        id="repair-services"
        className="bg-white rounded-2xl md:rounded-3xl p-5 sm:p-8 border border-slate-200 shadow-xs space-y-5 scroll-mt-24"
      >
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 uppercase tracking-wider">
              <Wrench className="w-3.5 h-3.5" />
              <span>What We Repair • Doorstep &amp; Workshop Care</span>
            </span>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900">
              Our Home Appliance Repair Services
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Tap any appliance below to book an inspection or request pure copper motor rewinding and genuine PCB parts.
            </p>
          </div>
          <a
            href={whatsappInquiryUrl('Home Appliance Repair')}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-bold text-xs rounded-xl transition-colors inline-flex items-center gap-2 shrink-0 self-start"
          >
            <MessageCircle className="w-4 h-4 text-emerald-600" />
            <span>Send Appliance Photo on WhatsApp</span>
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {repairAppliances.map((app) => (
            <button
              key={app.name}
              type="button"
              onClick={() => handleBookNow(app.bookingValue)}
              className="text-left p-3.5 rounded-xl bg-slate-50 hover:bg-amber-50/70 border border-slate-200/80 hover:border-brand-400 transition-all flex flex-col justify-between space-y-2 group"
            >
              <div>
                <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 group-hover:text-brand-700 leading-snug">
                  {app.name}
                </h3>
                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{app.detail}</p>
              </div>
              <span className="text-[11px] font-black text-brand-600 group-hover:underline inline-flex items-center gap-1 pt-1">
                Book Repair <ChevronRight className="w-3 h-3" />
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* 5. AUTHORIZED BRANDS */}
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

      {/* 6. Verified Google Customer Reviews (4.9★) */}
      <GoogleReviews />

      {/* 7. INTERACTIVE APPOINTMENT / INQUIRY BOOKING FORM */}
      <section
        id="book-service"
        className="bg-white rounded-3xl p-6 sm:p-10 md:p-12 border border-slate-200 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-start scroll-mt-24"
      >
        <div className="lg:col-span-5 space-y-4">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 bg-amber-50 px-3 py-1 rounded-full uppercase">
            <Clock className="w-3.5 h-3.5" /> 15–30 Min Callback &amp; Doorstep Dispatch
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 leading-tight">
            Schedule an Inspection or Installation
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Fill in your details below. Our field supervisor will call you within 15–30 minutes to confirm your slot, share a clear upfront estimate, and dispatch our technician.
          </p>

          <div className="space-y-3 pt-2 text-xs text-slate-700">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Full coverage across all sectors of Islamabad &amp; Rawalpindi</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Transparent diagnostic estimation before starting any work</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Testing warranty on all pure copper motor rewinds &amp; PCB repairs</span>
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
                Thank you! Our technical service department has received your request. We will call you within 15–30 minutes at your provided number.
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
                    <option value="Islamabad">Islamabad (All Sectors &amp; Suburbs)</option>
                    <option value="Rawalpindi">Rawalpindi (All Areas &amp; Bahria/DHA)</option>
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
                      1. Solar System Installation (Net-Metering &amp; Hybrid)
                    </option>
                    <option value="Electrical Services (20+ Years Experience)">
                      2. Electrical Services (House Rewiring &amp; DB Box)
                    </option>
                    <option value="Air Conditioning (Wash & Gas Charging)">
                      3. Air Conditioning (Chemical Jet Wash &amp; Gas Charging)
                    </option>
                    <option value="Plumbing Services & Core Cutting">
                      4. Plumbing Services &amp; Diamond Core Cutting
                    </option>
                    <option value="CCTV & Biometric Time Attendance">
                      5. CCTV Cameras &amp; Biometric Attendance
                    </option>
                    <option value="PABX & Computer Networking">
                      6. PABX Intercom &amp; Cat6 Computer Networking
                    </option>
                    <option value="Fire Alarm System Installation">
                      7. Fire Alarm System Installation &amp; Smoke Detectors
                    </option>
                  </optgroup>
                  <optgroup label="Home Appliance Repairs">
                    <option value="Repair: Air Conditioner (Inverter/Split)">
                      Repair: Air Conditioner (Inverter/Split)
                    </option>
                    <option value="Repair: Cloth Iron (Electric & Steam)">
                      Repair: Cloth Iron (Electric &amp; Steam)
                    </option>
                    <option value="Repair: Refrigerator & Deep Freezer">
                      Repair: Refrigerator &amp; Deep Freezer
                    </option>
                    <option value="Repair: Home Appliance (Juicer/Blender)">
                      Repair: Juicer / Blender / Grinder
                    </option>
                    <option value="Repair: Ceiling & Pedestal Fan">
                      Repair: Ceiling, Pedestal Fan &amp; Cooler
                    </option>
                    <option value="Repair: Automatic Washing Machine">
                      Repair: Automatic Washing Machine
                    </option>
                    <option value="Repair: Clothes Dryer / Spinner">
                      Repair: Clothes Dryer / Spinner
                    </option>
                    <option value="Repair: Microwave Oven">Repair: Microwave Oven</option>
                    <option value="Repair: Gas & Electric Geyser">
                      Repair: Gas &amp; Electric Geyser
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 bg-brand-500 hover:bg-brand-600 text-slate-950 font-black text-xs md:text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'Submitting...' : 'Confirm Appointment Request'}</span>
                </button>

                <a
                  href={whatsappInquiryUrl(`${formData.service_type} (${formData.city})`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs md:text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Send Direct via WhatsApp</span>
                </a>
              </div>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
