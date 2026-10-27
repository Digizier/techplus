'use client';

import React from 'react';
import Link from 'next/link';
import {
  Building2,
  ShieldCheck,
  Zap,
  Sun,
  Wrench,
  Camera,
  CheckCircle2,
  Award,
  Users,
  Clock,
  PhoneCall,
  MessageCircle,
  MapPin,
  ChevronRight,
  Flame,
  FileText,
  BadgeCheck,
  Briefcase,
} from 'lucide-react';
import { useSettings } from '@/lib/settings-context';

export default function ProfileClient() {
  const { settings } = useSettings();

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

  const milestones = [
    {
      year: '2004 - Present',
      title: '20+ Years in Electrical Engineering',
      desc: 'Founded in Islamabad to deliver reliable, code-compliant residential and commercial electrical contracting, distribution panel builds, and emergency troubleshooting.',
    },
    {
      year: '2018',
      title: 'Solar Energy Division Established',
      desc: 'Launched turnkey solar EPC services. Partnered with Tier-1 manufacturers to provide residential net-metering, on-grid, and hybrid solar systems across Islamabad & Rawalpindi.',
    },
    {
      year: '2020',
      title: 'Facility Maintenance & HVAC Jet Cleaning',
      desc: 'Introduced high-pressure chemical wash AC servicing and full appliance repair for split ACs, inverters, refrigerators, and industrial electrical motors.',
    },
    {
      year: 'Present Day',
      title: 'Multi-Discipline Engineering Hub',
      desc: 'Over 15,000+ satisfied customers across Islamabad & Rawalpindi, offering solar, electrical, security surveillance, networking, and precision core cutting under one roof.',
    },
  ];

  const divisions = [
    {
      icon: Sun,
      title: 'Renewable Solar EPC (Since 2018)',
      desc: 'Custom-designed on-grid, off-grid, and hybrid solar energy setups from 3kW residential to 100kW+ commercial projects with IESCO net-metering green meter certification.',
      highlights: ['GoodWe, Huawei & SAJ inverters', 'Tier-1 Jinko bifacial panels', 'Complete net-metering liaison'],
    },
    {
      icon: Zap,
      title: 'Electrical & Power Infrastructure',
      desc: 'Over two decades of experience in heavy house rewiring, distribution boards, 3-phase load calculations, phase changeover switches, and industrial panel wiring.',
      highlights: ['100% Pakistan Cables pure copper', 'Zero voltage drop layouts', '24/7 short-circuit emergency service'],
    },
    {
      icon: Wrench,
      title: 'HVAC & Facility Maintenance',
      desc: 'Comprehensive split and inverter AC installation, chemical high-pressure water jet washes, refrigerant gas recharging, and electronic inverter PCB troubleshooting.',
      highlights: ['On-wall chemical jet cleaning', 'Original R410A / R32 refrigerants', 'PCB micro-soldering repairs'],
    },
    {
      icon: Camera,
      title: 'Surveillance, IT & Fire Safety',
      desc: 'Modern facility security and telecommunication including Hikvision/Dahua 4K CCTV systems, biometric attendance clocks, Cat6 structured cabling, and fire alarms.',
      highlights: ['Mobile app live camera streaming', 'Biometric employee attendance sync', 'Addressable fire alarm detectors'],
    },
  ];

  const whatsappUrl = `https://wa.me/92${settings.whatsapp_number.replace(/^0/, '')}?text=${encodeURIComponent(
    'Assalam-o-Alaikum Techplus.pk, I would like to inquire about your Company Profile and services.'
  )}`;

  return (
    <div className="space-y-16 pb-20">
      {/* 1. HERO HEADER */}
      <section className="bg-slate-950 text-white rounded-3xl p-6 sm:p-10 md:p-14 border border-slate-800 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-brand-500/20 text-brand-400 rounded-full text-xs font-black tracking-wider uppercase border border-brand-500/30">
            <Building2 className="w-3.5 h-3.5" />
            <span>Official Corporate Profile</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
            Company Profile | Techplus.pk
          </h1>

          <p className="text-sm md:text-base text-slate-300 leading-relaxed font-normal">
            Techplus is an established Pakistani engineering and facility services enterprise headquartered in Islamabad. We combine 20+ years of electrical craftsmanship with certified solar installation since 2018, modern HVAC care, and commercial surveillance.
          </p>

          {/* Quick Badges */}
          <div className="pt-2 flex flex-wrap items-center gap-2.5 text-xs">
            <span className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 font-semibold flex items-center gap-1.5">
              <BadgeCheck className="w-4 h-4 text-emerald-400" />
              <span>Registered Engineering Firm</span>
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 font-semibold flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-brand-400" />
              <span>20+ Years in Islamabad</span>
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 font-semibold flex items-center gap-1.5">
              <Sun className="w-4 h-4 text-amber-400" />
              <span>Solar EPC Since 2018</span>
            </span>
          </div>

          <div className="pt-4 flex flex-wrap items-center gap-3">
            <a
              href={`tel:${settings.helpline_phone}`}
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-brand-500 hover:bg-brand-600 text-slate-950 font-black text-xs md:text-sm rounded-xl shadow-lg transition-all"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Call Helpline: {settings.helpline_phone}</span>
            </a>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs md:text-sm rounded-xl shadow-lg transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Direct WhatsApp Contact</span>
            </a>
            <Link
              href="/services"
              className="inline-flex items-center gap-1.5 px-5 py-3.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold text-xs md:text-sm rounded-xl transition-all"
            >
              <span>Explore All Services</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 2. CORPORATE SUMMARY & HIGHLIGHTS */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-brand-600 flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-black text-slate-900">Proven Track Record</h3>
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            Over two decades serving diplomatic enclaves, CDA sectors, Bahria Town, and commercial plazas across the twin cities with certified technical precision.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-black text-slate-900">Safety & Code Compliance</h3>
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            Strict adherence to safe electrical installation codes, pure copper cabling, earthing resistance standards, and non-destructive diamond core cutting.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-black text-slate-900">Trained In-House Staff</h3>
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            No unverified third-party contractors. Every project is executed by full-time Techplus engineers equipped with modern digital multimeters and safety gear.
          </p>
        </div>
      </section>

      {/* 3. FOUR CORE DIVISIONS */}
      <section className="space-y-6">
        <div className="border-b border-slate-200 pb-4">
          <span className="text-xs font-bold text-brand-600 uppercase tracking-widest">
            Capabilities
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            Our Core Technical Divisions
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {divisions.map((div, idx) => {
            const Icon = div.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4 hover:border-brand-500 transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-slate-900 text-brand-400 flex items-center justify-center shrink-0">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-[11px] font-bold text-brand-600 uppercase tracking-wider block">
                        Division 0{idx + 1}
                      </span>
                      <h3 className="text-lg font-black text-slate-900">{div.title}</h3>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {div.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 space-y-2">
                  {div.highlights.map((h, hIdx) => (
                    <div key={hIdx} className="flex items-center gap-2 text-xs font-medium text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. COMPANY JOURNEY / TIMELINE */}
      <section className="bg-slate-900 text-white rounded-3xl p-6 sm:p-10 md:p-12 border border-slate-800 space-y-8">
        <div className="max-w-2xl space-y-2">
          <span className="text-xs font-bold text-brand-400 uppercase tracking-widest">
            Milestones
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white">
            Our Evolution & Legacy
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            From a localized electrical contracting workshop in Islamabad to a full-fledged technical facility solutions enterprise.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {milestones.map((m, mIdx) => (
            <div
              key={mIdx}
              className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 space-y-3 hover:border-brand-500/40 transition-all"
            >
              <span className="inline-block px-3 py-1 bg-brand-500/20 text-brand-400 rounded-lg text-xs font-black tracking-wider">
                {m.year}
              </span>
              <h4 className="text-sm font-black text-white">{m.title}</h4>
              <p className="text-xs text-slate-400 leading-relaxed">{m.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. AUTHORIZED BRAND STANDARDS */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-brand-600 uppercase tracking-widest">
            Hardware Authenticity
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            Authorized Partner Brands
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            We partner with Tier-1 solar, HVAC, surveillance, and networking manufacturers to deliver guaranteed genuine hardware with factory warranty.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5">
          {partnerBrands.map((brand, bIdx) => (
            <div
              key={bIdx}
              className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs flex flex-col items-center justify-center text-center space-y-2 hover:border-brand-500 transition-all"
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

      {/* 6. SERVICE TERRITORY & PHYSICAL LOCATION */}
      <section className="bg-white rounded-3xl p-6 sm:p-10 md:p-12 border border-slate-200 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-7 space-y-4">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 bg-amber-50 px-3 py-1 rounded-full uppercase">
            <MapPin className="w-3.5 h-3.5" /> Service Area & Office
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            Islamabad & Rawalpindi Coverage
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Techplus maintains active mobile technician teams across both Islamabad and Rawalpindi. We provide fast doorstep response times for residential callouts, commercial plaza maintenance contracts, and corporate emergency electrical visits.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs text-slate-700">
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
              <span className="font-bold text-slate-900 block">Islamabad Sectors:</span>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                F-6, F-7, F-8, F-10, F-11, G-6 through G-15, I-8, I-9, I-10, E-7, E-11, Bani Gala, Bahria Enclave, DHA Islamabad & Gulberg Greens.
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
              <span className="font-bold text-slate-900 block">Rawalpindi Areas:</span>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Bahria Town (Phases 1-8), Saddar, Satellite Town, Chaklala Scheme 3, Westridge, Peshawar Road, Morgah, and Adyala Road.
              </p>
            </div>
          </div>

          <div className="pt-2 text-xs text-slate-600">
            <strong>Headquarters Location:</strong> Shop 07-B Chinar Plaza, St-48, G-6/1-1, Islamabad.
          </div>
        </div>

        <div className="lg:col-span-5 bg-slate-900 text-white p-6 sm:p-8 rounded-2xl space-y-4">
          <h3 className="text-lg font-black text-white">Need a Corporate Quotation?</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Contact our project management team for residential solar turnkey proposals, commercial facility maintenance tenders, or bulk electrical material procurement.
          </p>

          <div className="space-y-2 pt-2 text-xs">
            <div className="flex items-center gap-2 text-brand-400 font-bold">
              <PhoneCall className="w-4 h-4" />
              <span>{settings.helpline_phone} / {settings.secondary_phone || '03125556944'}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <span className="font-semibold text-slate-400">Email:</span>
              <a href={`mailto:${settings.email}`} className="hover:text-brand-400 underline">
                {settings.email}
              </a>
            </div>
          </div>

          <div className="pt-3 flex flex-col sm:flex-row gap-2">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full text-center py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
            >
              Chat on WhatsApp
            </a>
            <Link
              href="/services"
              className="w-full text-center py-3 bg-brand-500 hover:bg-brand-600 text-slate-950 font-black text-xs rounded-xl shadow-xs transition-colors"
            >
              Book Service
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
