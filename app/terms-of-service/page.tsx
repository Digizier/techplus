'use client';

import React from 'react';
import { FileText, CheckCircle2 } from 'lucide-react';
import { useSettings } from '@/lib/settings-context';

export default function TermsOfServicePage() {
  const { settings } = useSettings();

  return (
    <div className="max-w-3xl mx-auto py-8 space-y-8 pb-16">
      <div className="text-center space-y-2">
        <div className="w-14 h-14 bg-slate-100 text-slate-800 rounded-2xl flex items-center justify-center mx-auto">
          <FileText className="w-7 h-7" />
        </div>
        <h1 className="text-2xl md:text-4xl font-black text-slate-900">
          Terms of Service
        </h1>
        <p className="text-xs md:text-sm text-slate-500">
          Operational terms, pricing guidelines, and conditions of purchase.
        </p>
      </div>

      <div className="bg-white rounded-3xl p-6 md:p-10 border border-slate-100 shadow-xs space-y-6 text-xs md:text-sm text-slate-700 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Order Acceptance & Pricing</span>
          </h2>
          <p>
            All tool orders placed on {settings.store_name} are subject to product availability and phone verification. While we make every attempt to ensure accurate pricing in Pakistani Rupees (PKR), we reserve the right to correct typographical or system pricing errors before parcel dispatch.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Cash on Delivery Guidelines</span>
          </h2>
          <p>
            For Cash on Delivery (COD) orders, full payment must be handed to the courier representative before opening the sealed parcel in accordance with standard Pakistan logistics protocols. Customers enjoy a 7-day checking warranty after delivery.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Technician Appointments</span>
          </h2>
          <p>
            Service appointments in Islamabad and Rawalpindi depend on weather conditions and technician scheduling. Our representative will always confirm visits in advance by phone.
          </p>
        </section>
      </div>
    </div>
  );
}
