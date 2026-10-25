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
              width={160}
              height={48}
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
              <a
                href={`tel:${settings.helpline_phone}`}
                className="hover:text-brand-400 transition-colors"
              >
                {settings.helpline_phone} / {settings.secondary_phone || '03125556944'}
              </a>
            </div>
            <div className="flex items-center gap-2.5 text-slate-400">
              <Mail className="w-4 h-4 text-brand-400 shrink-0" />
              <a
                href={`mailto:${settings.email}`}
                className="hover:text-brand-400 transition-colors"
                title="Email Customer Support"
              >
                {settings.email}
              </a>
            </div>
            <div className="flex items-center gap-2.5 text-slate-400">
              <Clock className="w-4 h-4 text-brand-400 shrink-0" />
              <span>{settings.working_hours}</span>
            </div>
          </div>

          {/* Social Profiles for Brand Authority */}
          <div className="pt-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Connect With Us</span>
            <div className="flex items-center gap-2">
              <a
                href="https://facebook.com/techpluspk"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-blue-600 transition-colors"
                aria-label="Facebook Page"
                title="Techplus on Facebook"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a
                href="https://wa.me/923235538700"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-emerald-600 transition-colors"
                aria-label="WhatsApp Direct Support"
                title="WhatsApp Direct Support"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/></svg>
              </a>
              <a
                href="https://youtube.com/@techpluspk"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-red-600 transition-colors"
                aria-label="YouTube Channel"
                title="Techplus YouTube Channel"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
              <a
                href="https://instagram.com/techpluspk"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-pink-600 transition-colors"
                aria-label="Instagram Profile"
                title="Techplus on Instagram"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
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
