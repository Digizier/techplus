'use client';

import React from 'react';
import Link from 'next/link';
import { Phone, Mail, MapPin, Clock, ShieldCheck, Truck, RefreshCw, Wrench } from 'lucide-react';
import { useSettings } from '@/lib/settings-context';

export default function Footer() {
  const { settings } = useSettings();

  return (
    <footer className="bg-slate-950 text-slate-300 pt-8 md:pt-14 pb-20 md:pb-12 border-t border-slate-800">
      {/* 1. Value Proposition Features Bar */}
      <div className="max-w-7xl mx-auto px-4 mb-8 md:mb-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 p-4 md:p-6 bg-slate-900/80 rounded-2xl md:rounded-3xl border border-slate-800/80">
          <div className="flex items-start gap-2.5 md:gap-3.5">
            <div className="p-2 md:p-2.5 bg-brand-500/10 text-brand-400 rounded-xl md:rounded-2xl shrink-0">
              <Truck className="w-4 h-4 md:w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs md:text-sm font-bold text-white mb-0.5">24h Fast Dispatch</h4>
              <p className="text-[11px] md:text-xs text-slate-400 leading-tight">Delivered in 2-5 days</p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 md:gap-3.5">
            <div className="p-2 md:p-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl md:rounded-2xl shrink-0">
              <ShieldCheck className="w-4 h-4 md:w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs md:text-sm font-bold text-white mb-0.5">100% Genuine Tools</h4>
              <p className="text-[11px] md:text-xs text-slate-400 leading-tight">Pure copper winding</p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 md:gap-3.5">
            <div className="p-2 md:p-2.5 bg-blue-500/10 text-blue-400 rounded-xl md:rounded-2xl shrink-0">
              <Wrench className="w-4 h-4 md:w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs md:text-sm font-bold text-white mb-0.5">Repair & Services</h4>
              <p className="text-[11px] md:text-xs text-slate-400 leading-tight">Expert appliance care</p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 md:gap-3.5">
            <div className="p-2 md:p-2.5 bg-purple-500/10 text-purple-400 rounded-xl md:rounded-2xl shrink-0">
              <RefreshCw className="w-4 h-4 md:w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs md:text-sm font-bold text-white mb-0.5">Return & Exchange</h4>
              <p className="text-[11px] md:text-xs text-slate-400 leading-tight">Friendly replacement</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Footer Grid */}
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 md:gap-8 lg:gap-10 mb-8 md:mb-12">
        {/* Column 1: Brand Info */}
        <div className="lg:col-span-2 space-y-3 md:space-y-4">
          <Link href="/" className="inline-block">
            <img
              src="/images/logo.png"
              alt="Techplus.pk - Heavy Duty Power Tools, Chainsaw Converters & Repair Services Pakistan"
              className="h-10 md:h-12 w-auto object-contain brightness-110"
            />
          </Link>
          <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
            Techplus.pk is Pakistan&apos;s trusted destination for heavy-duty power tools, cordless machines, chainsaw adapters, and professional AC & home appliance repair services.
          </p>

          <div className="space-y-1.5 md:space-y-2 pt-1 md:pt-2 text-xs">
            <div className="flex items-start gap-2.5 text-slate-400">
              <MapPin className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
              <span>{settings.address}</span>
            </div>
            <div className="flex items-center gap-2.5 text-slate-400">
              <Phone className="w-4 h-4 text-brand-400 shrink-0" />
              <span>
                {settings.helpline_phone} / {settings.secondary_phone || '03125556944'}
              </span>
            </div>
            <div className="flex items-center gap-2.5 text-slate-400">
              <Mail className="w-4 h-4 text-brand-400 shrink-0" />
              <span>{settings.email}</span>
            </div>
            <div className="flex items-center gap-2.5 text-slate-400">
              <Clock className="w-4 h-4 text-brand-400 shrink-0" />
              <span>{settings.working_hours}</span>
            </div>
          </div>
        </div>

        {/* Column 2: Products */}
        <div>
          <h4 className="text-xs md:text-sm font-bold text-white uppercase tracking-wider mb-2.5 md:mb-4 border-b border-slate-800 pb-1.5 md:pb-2">
            Tool Categories
          </h4>
          <ul className="space-y-2 md:space-y-2.5 text-xs text-slate-400">
            <li>
              <Link href="/shop/power-tools" className="hover:text-brand-400 transition-colors">
                Power Tools & Drills
              </Link>
            </li>
            <li>
              <Link href="/shop/tool-converters" className="hover:text-brand-400 transition-colors">
                Chainsaw & Saw Adapters
              </Link>
            </li>
            <li>
              <Link href="/shop/cordless-power-tools" className="hover:text-brand-400 transition-colors">
                Cordless Battery Tools
              </Link>
            </li>
            <li>
              <Link href="/shop/hand-tools" className="hover:text-brand-400 transition-colors">
                Pliers & Hardware Tools
              </Link>
            </li>
            <li>
              <Link href="/shop/electrical" className="hover:text-brand-400 transition-colors">
                Electrical Products
              </Link>
            </li>
            <li>
              <Link href="/shop/used-branded-tools" className="hover:text-brand-400 transition-colors">
                Used Branded Tools
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Customer Care & Services */}
        <div>
          <h4 className="text-xs md:text-sm font-bold text-white uppercase tracking-wider mb-2.5 md:mb-4 border-b border-slate-800 pb-1.5 md:pb-2">
            Services & Support
          </h4>
          <ul className="space-y-2 md:space-y-2.5 text-xs text-slate-400">
            <li>
              <Link href="/services" className="hover:text-brand-400 transition-colors">
                AC Repair & Cleaning
              </Link>
            </li>
            <li>
              <Link href="/services" className="hover:text-brand-400 transition-colors">
                Solar System Installation
              </Link>
            </li>
            <li>
              <Link href="/services" className="hover:text-brand-400 transition-colors">
                Home Appliance Repair
              </Link>
            </li>
            <li>
              <Link href="/order-tracking" className="hover:text-brand-400 transition-colors">
                Track Your Shipment
              </Link>
            </li>
            <li>
              <Link href="/contact-us" className="hover:text-brand-400 transition-colors">
                Store Location & Inquiries
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 4: Policies */}
        <div>
          <h4 className="text-xs md:text-sm font-bold text-white uppercase tracking-wider mb-2.5 md:mb-4 border-b border-slate-800 pb-1.5 md:pb-2">
            Policies & Legal
          </h4>
          <ul className="space-y-2 md:space-y-2.5 text-xs text-slate-400">
            <li>
              <Link href="/return-and-exchange-policy" className="hover:text-brand-400 transition-colors">
                Return & Exchange Policy
              </Link>
            </li>
            <li>
              <Link href="/warranty-policy" className="hover:text-brand-400 transition-colors">
                Repair & Warranty Policy
              </Link>
            </li>
            <li>
              <Link href="/privacy-policy" className="hover:text-brand-400 transition-colors">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/terms-of-service" className="hover:text-brand-400 transition-colors">
                Terms of Service
              </Link>
            </li>
            <li>
              <Link href="/about-us" className="hover:text-brand-400 transition-colors">
                About Our Company
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* 3. Bottom Bar: Payments & Copyright */}
      <div className="max-w-7xl mx-auto px-4 pt-6 md:pt-8 border-t border-slate-800/80 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <div className="text-center md:text-left">
          © {new Date().getFullYear()} {settings.store_name}. All Rights Reserved. NTN: {settings.ntn_number}.
        </div>

        {/* Payment Badges */}
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-1.5 md:gap-2">
          <span className="text-[11px] text-slate-400 font-medium">We Accept:</span>
          <span className="bg-slate-900 border border-slate-800 px-2 py-1 rounded text-[10px] text-slate-300 font-bold">
            Cash on Delivery
          </span>
          <span className="bg-slate-900 border border-slate-800 px-2 py-1 rounded text-[10px] text-red-400 font-bold">
            JazzCash
          </span>
          <span className="bg-slate-900 border border-slate-800 px-2 py-1 rounded text-[10px] text-emerald-400 font-bold">
            EasyPaisa
          </span>
          <span className="bg-slate-900 border border-slate-800 px-2 py-1 rounded text-[10px] text-blue-400 font-bold">
            Bank Transfer
          </span>
        </div>
      </div>
    </footer>
  );
}
