'use client';

import React from 'react';
import { Star, ShieldCheck, CheckCircle2, MessageSquare } from 'lucide-react';

export default function GoogleReviews() {
  const reviews = [
    {
      author: 'Tariq Mehmood',
      location: 'Sector F-8/2, Islamabad',
      service: 'Emergency Electrician & DB Box Repair',
      rating: 5,
      date: '2 weeks ago',
      text: 'Our main distribution board had an urgent short circuit on a Saturday evening. The Techplus licensed electrician arrived in 35 minutes, identified the burnt neutral wire, and rebalanced all three phases. Very professional and safe electrical work.',
    },
    {
      author: 'Zeeshan Ali',
      location: 'Bahria Town Phase 4, Rawalpindi',
      service: '13mm Hammer Drill & 10kW Solar EPC',
      rating: 5,
      date: '1 month ago',
      text: 'Purchased their 13mm impact drill and later hired Techplus for our 10kW turnkey solar installation. 100% pure copper motor tools and complete IESCO green meter net-metering paperwork handled smoothly.',
    },
    {
      author: 'Dr. Asad Ullah',
      location: 'Sector G-10/4, Islamabad',
      service: 'AC Master Chemical Jet Wash',
      rating: 5,
      date: '3 weeks ago',
      text: 'The high-pressure chemical wash on our 3 inverter AC units was fantastic. The technician used a protective water catchment bag and left zero mess on the walls. Chilling performance is back to ice-cold.',
    },
    {
      author: 'Capt. Usman R.',
      location: 'Chaklala Scheme 3, Rawalpindi',
      service: '18V Cordless Drill & Chainsaw Adapter',
      rating: 5,
      date: '1 month ago',
      text: 'Authentic tool supplier in Islamabad. Allowed complete open parcel inspection before paying cash on delivery. The 18V cordless drill has genuine high torque and long battery life. Highly recommended.',
    },
  ];

  return (
    <section className="bg-slate-900 text-white rounded-2xl md:rounded-3xl p-5 sm:p-8 md:p-10 border border-slate-800 space-y-6 relative overflow-hidden shadow-xl">
      <div className="absolute top-0 right-0 w-80 h-80 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header with 4.9★ Google Rating Badge */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6 relative z-10">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-400/20 text-brand-400 rounded-full text-xs font-black uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Verified Customer Reviews</span>
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white">
            What Islamabad &amp; Rawalpindi Say About Techplus
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Real customer feedback for our licensed electrician visits, solar EPC projects, and pure copper power tools.
          </p>
        </div>

        {/* 4.9 Star Rating Pill */}
        <div className="flex items-center gap-3.5 bg-slate-950/80 border border-slate-800 px-4 py-3 rounded-2xl shrink-0">
          <div className="flex items-center gap-1.5">
            {/* Google Multi-Color G Icon */}
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span className="text-xl font-black text-white">4.9</span>
          </div>

          <div className="border-l border-slate-700 pl-3 leading-tight">
            <div className="flex items-center gap-0.5 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-current" />
              ))}
            </div>
            <span className="text-[11px] font-bold text-slate-400 block mt-0.5">
              16 Google Reviews
            </span>
          </div>
        </div>
      </div>

      {/* Reviews Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
        {reviews.map((rev, idx) => (
          <div
            key={idx}
            className="bg-slate-950/80 border border-slate-800/90 rounded-2xl p-4 sm:p-5 flex flex-col justify-between space-y-3 hover:border-brand-500/40 transition-colors"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-0.5 text-amber-400">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-current" />
                  ))}
                </div>
                <span className="text-[10px] text-slate-500 font-medium">{rev.date}</span>
              </div>

              <span className="text-[10px] font-bold text-brand-400 bg-brand-500/10 px-2 py-0.5 rounded-md inline-block">
                {rev.service}
              </span>

              <p className="text-xs text-slate-300 leading-relaxed font-normal">
                &ldquo;{rev.text}&rdquo;
              </p>
            </div>

            <div className="pt-3 border-t border-slate-800/70 flex items-center justify-between">
              <div>
                <span className="font-bold text-xs text-white block">{rev.author}</span>
                <span className="text-[11px] text-slate-400 block">{rev.location}</span>
              </div>
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
