'use client';

import React from 'react';
import Link from 'next/link';
import { Wrench, Zap, ShieldCheck, Award, MapPin, Phone, Users, CheckCircle2 } from 'lucide-react';
import { useSettings } from '@/lib/settings-context';

export default function AboutUsPage() {
  const { settings } = useSettings();

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Banner */}
      <div className="bg-slate-950 text-white rounded-3xl p-8 md:p-14 border border-slate-800 text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold text-brand-400 bg-brand-500/10 border border-brand-500/20 px-3.5 py-1 rounded-full uppercase tracking-wider">
          About Techplus.pk
        </span>
        <h1 className="text-3xl md:text-5xl font-black text-white leading-tight">
          Powering Pakistan with High-Performance Tools & Appliance Solutions
        </h1>
        <p className="text-xs md:text-sm text-slate-300 leading-relaxed max-w-xl mx-auto">
          From heavy-duty pure copper rotary hammers to ingenious drill-to-chainsaw converter kits, Techplus has been serving craftspeople, contractors, and homeowners with authentic quality.
        </p>
      </div>

      {/* Story & Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-xs space-y-3">
          <div className="w-12 h-12 bg-amber-50 text-brand-600 rounded-2xl flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">100% Genuine Copper Motors</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            We strictly source industrial grade machines with genuine pure copper winding to ensure high torque and long lifespan under rigorous daily usage.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-xs space-y-3">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
            <Wrench className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Ingenious Converter Kits</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Pioneers in multi-functional tool adapters: convert your standard drill into a chainsaw, reciprocating saw, or angle grinder without buying separate expensive tools.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-xs space-y-3">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
            <Zap className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Certified Appliance & Solar Services</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Our certified engineering division handles high-pressure AC servicing, refrigerator diagnostics, and GoodWe solar system turnkey installations in Islamabad & Rawalpindi.
          </p>
        </div>
      </div>

      {/* Store Location Info */}
      <div className="bg-white rounded-3xl p-6 md:p-10 border border-slate-100 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <h2 className="text-xl md:text-2xl font-black text-slate-900">
            Visit Our Physical Store in Islamabad
          </h2>
          <p className="text-xs md:text-sm text-slate-600">
            {settings.address}
          </p>
          <p className="text-xs text-slate-400 font-semibold">
            Working Hours: {settings.working_hours}
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/contact-us"
            className="px-6 py-3 bg-brand-500 hover:bg-brand-600 text-slate-950 font-bold text-xs rounded-xl shadow-xs transition-colors"
          >
            Get Location & Directions
          </Link>
          <a
            href={`tel:${settings.helpline_phone}`}
            className="px-5 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors"
          >
            Call Store Helpline
          </a>
        </div>
      </div>
    </div>
  );
}
